// Demo data for GitHub Pages deployment
export const demoUser = {
  id: 1,
  name: 'Demo User',
  email: 'demo@musicstream.com',
  avatar: null,
  isDemo: true
};

export const demoMusic = [
  {
    id: 1,
    title: 'Sample Song 1',
    artist: 'Demo Artist',
    album: 'Demo Album',
    duration: 180,
    price: 29,
    genre: 'Pop',
    releaseDate: '2024-01-15',
    audioUrl: '#',
    coverUrl: '/api/placeholder/300/300',
    isDemo: true
  },
  {
    id: 2,
    title: 'Sample Song 2',
    artist: 'Another Artist',
    album: 'Another Album',
    duration: 240,
    price: 39,
    genre: 'Rock',
    releaseDate: '2024-02-20',
    audioUrl: '#',
    coverUrl: '/api/placeholder/300/300',
    isDemo: true
  },
  {
    id: 3,
    title: 'Sample Song 3',
    artist: 'Indie Artist',
    album: 'Indie Collection',
    duration: 200,
    price: 25,
    genre: 'Indie',
    releaseDate: '2024-03-10',
    audioUrl: '#',
    coverUrl: '/api/placeholder/300/300',
    isDemo: true
  },
  {
    id: 4,
    title: 'Sample Song 4',
    artist: 'Electronic Beats',
    album: 'Digital Dreams',
    duration: 300,
    price: 35,
    genre: 'Electronic',
    releaseDate: '2024-04-05',
    audioUrl: '#',
    coverUrl: '/api/placeholder/300/300',
    isDemo: true
  }
];

export const demoStats = {
  songsAvailable: '10,000+',
  activeUsers: '50,000+',
  artistsSupported: '1,000+',
  totalDownloads: '2M+'
};

// Demo API responses
export const mockApiResponses = {
  // Auth endpoints
  'POST /api/auth/login': (data) => ({
    success: true,
    token: 'demo_token_' + Date.now(),
    user: { ...demoUser, email: data.email }
  }),
  
  'POST /api/auth/register': (data) => ({
    success: true,
    token: 'demo_token_' + Date.now(),
    user: { ...demoUser, name: data.name, email: data.email }
  }),
  
  'GET /api/auth/profile': () => ({
    success: true,
    user: demoUser
  }),
  
  // Music endpoints
  'GET /api/music': () => ({
    success: true,
    music: demoMusic,
    total: demoMusic.length
  }),
  
  'GET /api/music/search': (params) => ({
    success: true,
    music: demoMusic.filter(song => 
      song.title.toLowerCase().includes((params.q || '').toLowerCase()) ||
      song.artist.toLowerCase().includes((params.q || '').toLowerCase())
    ),
    total: demoMusic.length
  }),
  
  // Payment endpoints
  'POST /api/payment/create-upi': (data) => ({
    success: true,
    paymentId: 'demo_payment_' + Date.now(),
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiPkRlbW8gUVI8L3RleHQ+PC9zdmc+',
    amount: data.amount,
    upiId: 'demo@upi'
  }),
  
  'GET /api/payment/status': () => ({
    success: true,
    status: 'completed',
    message: 'Payment completed successfully (Demo)'
  })
};
