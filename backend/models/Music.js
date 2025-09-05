const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalPath: {
    type: String,
    required: true
  },
  compressedPath: {
    type: String
  },
  previewPath: {
    type: String
  },
  artwork: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  format: {
    type: String,
    enum: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
    default: 'mp3'
  },
  bitrate: {
    type: Number // in kbps
  },
  plays: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    bpm: Number,
    key: String,
    mood: String,
    energy: Number,
    danceability: Number
  },
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0 // Price in INR
  }
}, {
  timestamps: true
});

// Indexes for search and performance
musicSchema.index({ title: 'text', artist: 'text', album: 'text' });
musicSchema.index({ genre: 1 });
musicSchema.index({ artist: 1 });
musicSchema.index({ isActive: 1 });
musicSchema.index({ createdAt: -1 });
musicSchema.index({ plays: -1 });

// Virtual for formatted duration
musicSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Method to increment plays
musicSchema.methods.incrementPlays = function() {
  this.plays += 1;
  return this.save();
};

// Method to increment downloads
musicSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

// Static method to get popular music
musicSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ plays: -1 })
    .limit(limit)
    .populate('uploadedBy', 'name');
};

// Transform output
musicSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Music', musicSchema);
