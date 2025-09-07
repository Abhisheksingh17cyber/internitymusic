const express = require('express');
const router = express.Router();

// Ad serving endpoint for free users
router.get('/serve', (req, res) => {
  try {
    const ads = [
      {
        id: 1,
        title: '🎵 Upgrade to Premium!',
        message: 'Enjoy ad-free streaming and exclusive downloads. Get Premium for just ₹99/month!',
        duration: 5,
        type: 'premium_upgrade',
        action: 'upgrade',
        bgColor: '#ff6b6b'
      },
      {
        id: 2,
        title: '📱 Download Our Mobile App!',
        message: 'Get the INTERNITY MUSIC mobile app for better streaming experience!',
        duration: 4,
        type: 'app_download',
        action: 'download_app',
        bgColor: '#4ecdc4'
      },
      {
        id: 3,
        title: '🎧 New Releases This Week!',
        message: 'Check out the latest hits from your favorite artists. Stream now!',
        duration: 5,
        type: 'content_promotion',
        action: 'discover',
        bgColor: '#45b7d1'
      },
      {
        id: 4,
        title: '🔥 Trending Playlists!',
        message: 'Discover curated playlists for every mood. Start listening now!',
        duration: 4,
        type: 'playlist_promotion',
        action: 'playlists',
        bgColor: '#f39c12'
      },
      {
        id: 5,
        title: '🎸 Rock Music Festival!',
        message: 'Join the biggest rock music festival of the year. Get your tickets!',
        duration: 6,
        type: 'event_promotion',
        action: 'external_link',
        bgColor: '#e74c3c'
      }
    ];

    // Return random ad
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    
    res.json({
      success: true,
      ad: randomAd,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ad serving error:', error);
    res.status(500).json({ error: 'Failed to serve ad' });
  }
});

// Track ad interactions
router.post('/track', (req, res) => {
  try {
    const { adId, action, userId, sessionId } = req.body;
    
    // In production, this would log to analytics database
    console.log('Ad interaction tracked:', {
      adId,
      action, // 'viewed', 'skipped', 'clicked'
      userId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, message: 'Ad interaction tracked' });

  } catch (error) {
    console.error('Ad tracking error:', error);
    res.status(500).json({ error: 'Failed to track ad interaction' });
  }
});

// Get ad frequency settings for user
router.get('/frequency/:userId?', (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Default ad frequency for free users
    const adFrequency = {
      freeUser: true,
      adFreePlays: 3, // Songs user can play before showing ad
      adDuration: 5, // Default ad duration in seconds
      skipAfter: 3, // Seconds after which skip button appears
      adTypes: ['premium_upgrade', 'content_promotion', 'app_download']
    };

    // In production, fetch user-specific settings from database
    if (userId) {
      // Check if user is premium, adjust settings accordingly
      // Premium users would have freeUser: false
    }

    res.json({
      success: true,
      settings: adFrequency
    });

  } catch (error) {
    console.error('Ad frequency error:', error);
    res.status(500).json({ error: 'Failed to get ad frequency settings' });
  }
});

module.exports = router;
