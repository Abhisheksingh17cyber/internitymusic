const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const { body, query, validationResult } = require('express-validator');
const Music = require('../models/Music');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/music/original');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
});

// Get all music (with search and pagination)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('genre').optional().trim(),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'title'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const genre = req.query.genre;
    const sort = req.query.sort || 'newest';

    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (genre) {
      query.genre = new RegExp(genre, 'i');
    }

    // Build sort
    let sortOptions = {};
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { plays: -1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const music = await Music.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name')
      .select('-originalPath -compressedPath');

    const total = await Music.countDocuments(query);

    res.json({
      music,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Music fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single music track
router.get('/:id', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id)
      .populate('uploadedBy', 'name');
    
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }

    res.json(music);
  } catch (error) {
    console.error('Music fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stream music (increment play count)
router.get('/:id/stream', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    
    if (!music || !music.isActive) {
      return res.status(404).json({ error: 'Music not found' });
    }

    const filePath = music.compressedPath || music.originalPath;
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Increment play count
    await music.incrementPlays();

    // Set appropriate headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Stream the file
    const stat = await fs.stat(filePath);
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
      res.setHeader('Content-Length', chunksize);
      
      const stream = require('fs').createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', stat.size);
      const stream = require('fs').createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Music stream error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload new music (admin only)
router.post('/upload', authenticateToken, upload.single('audio'), [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('artist').notEmpty().trim().withMessage('Artist is required'),
  body('album').optional().trim(),
  body('genre').optional().trim(),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // Get file info using ffprobe
    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(req.file.path, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });

    const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
    if (!audioStream) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid audio file' });
    }

    // Create music record
    const music = new Music({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      genre: req.body.genre,
      year: req.body.year,
      duration: Math.round(parseFloat(metadata.format.duration)),
      filename: req.file.filename,
      originalPath: req.file.path,
      fileSize: req.file.size,
      format: path.extname(req.file.originalname).slice(1).toLowerCase(),
      bitrate: Math.round(parseInt(audioStream.bit_rate) / 1000),
      uploadedBy: req.userId,
      price: req.body.price || 0
    });

    await music.save();

    res.status(201).json({
      success: true,
      message: 'Music uploaded successfully',
      music: {
        id: music._id,
        title: music.title,
        artist: music.artist,
        duration: music.duration
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }
    
    console.error('Music upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get popular music
router.get('/featured/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const music = await Music.getPopular(limit);
    res.json(music);
  } catch (error) {
    console.error('Popular music fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
