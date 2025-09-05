const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Music = require('../models/Music');
const User = require('../models/User');

dotenv.config();

const sampleMusic = [
  {
    title: "Sunset Dreams",
    artist: "Melody Makers",
    album: "Golden Hours",
    genre: "Pop",
    duration: 210,
    year: 2024,
    filename: "sunset_dreams.mp3",
    originalPath: "/uploads/music/original/sunset_dreams.mp3",
    uploadedBy: null // Will be set to admin user
  },
  {
    title: "Ocean Waves",
    artist: "Nature Sounds",
    album: "Peaceful Mind",
    genre: "Ambient",
    duration: 180,
    year: 2024,
    filename: "ocean_waves.mp3",
    originalPath: "/uploads/music/original/ocean_waves.mp3",
    uploadedBy: null
  },
  {
    title: "City Lights",
    artist: "Urban Beat",
    album: "Metropolitan",
    genre: "Electronic",
    duration: 195,
    year: 2024,
    filename: "city_lights.mp3",
    originalPath: "/uploads/music/original/city_lights.mp3",
    uploadedBy: null
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to database');

    // Create admin user
    const adminUser = new User({
      email: 'admin@musicstream.pro',
      name: 'Admin User',
      role: 'admin'
    });
    await adminUser.save();
    console.log('👤 Admin user created');

    // Add music with admin as uploader
    for (const musicData of sampleMusic) {
      musicData.uploadedBy = adminUser._id;
      const music = new Music(musicData);
      await music.save();
    }
    
    console.log(`🎵 ${sampleMusic.length} sample tracks added`);
    console.log('✅ Database seeding completed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
