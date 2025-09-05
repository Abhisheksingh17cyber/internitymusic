import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import {
  PlayIcon,
  PauseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

const Music = () => {
  const { user } = useAuth();
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMusic();
  }, [searchTerm, selectedGenre]);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedGenre) params.genre = selectedGenre;

      const response = await musicAPI.getAll(params);
      setMusic(response.data.music);
    } catch (error) {
      console.error('Failed to fetch music:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    if (currentPlaying === track._id) {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        setCurrentPlaying(null);
      } else if (audioElement) {
        audioElement.play();
        setCurrentPlaying(track._id);
      }
    } else {
      if (audioElement) {
        audioElement.pause();
      }

      const newAudio = new Audio(musicAPI.stream(track._id));
      newAudio.play();
      setAudioElement(newAudio);
      setCurrentPlaying(track._id);

      newAudio.addEventListener('ended', () => {
        setCurrentPlaying(null);
      });
    }
  };

  const addToCart = (track) => {
    if (!cart.find(item => item._id === track._id)) {
      setCart([...cart, { ...track, quality: 'high' }]);
    }
  };

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Ambient'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Discover Music
          </h1>
          
          {cart.length > 0 && (
            <div className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>{cart.length} items in cart</span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for music, artists, or albums..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Music Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : music.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No music found</div>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {music.map((track) => (
              <div key={track._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-primary-400 to-primary-600 relative">
                  {track.artwork ? (
                    <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">
                        {track.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handlePlay(track)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {currentPlaying === track._id ? (
                      <PauseIcon className="h-12 w-12 text-white" />
                    ) : (
                      <PlayIcon className="h-12 w-12 text-white" />
                    )}
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 truncate mb-2">{track.artist}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{track.formattedDuration || `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`}</span>
                    <span>{track.genre}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ₹{track.price || 10}
                    </span>
                    <button
                      onClick={() => addToCart(track)}
                      disabled={cart.find(item => item._id === track._id)}
                      className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {cart.find(item => item._id === track._id) ? 'Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Cart ({cart.length})</span>
              <button
                onClick={() => window.location.href = '/payment'}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700"
              >
                Checkout
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Total: ₹{cart.reduce((total, item) => total + (item.price || 10), 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;
