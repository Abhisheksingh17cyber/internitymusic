import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Gift, Search, User } from 'lucide-react';

const GlobalMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [currentGenre, setCurrentGenre] = useState('all');
  const [likedSongs, setLikedSongs] = useState([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Global Music Library - Same as your HTML version
  const globalTracks = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      duration: "3:20",
      genre: "pop",
      country: "🇺🇸",
      cover: "🎵",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
    },
    {
      id: 2,
      title: "Bohemian Rhapsody", 
      artist: "Queen",
      duration: "5:55",
      genre: "rock",
      country: "🇬🇧",
      cover: "🎸",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3"
    },
    {
      id: 3,
      title: "Tum Hi Ho",
      artist: "Sonu Nigam",
      duration: "4:22",
      genre: "bollywood",
      country: "🇮🇳",
      cover: "🎭",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
    },
    {
      id: 4,
      title: "Dynamite",
      artist: "BTS",
      duration: "3:19",
      genre: "k-pop",
      country: "🇰🇷",
      cover: "💫",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
    },
    {
      id: 5,
      title: "Despacito",
      artist: "Luis Fonsi",
      duration: "3:47",
      genre: "latin",
      country: "🇵🇷",
      cover: "💃",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
    },
    {
      id: 6,
      title: "Jerusalema",
      artist: "Master KG",
      duration: "3:33",
      genre: "afrobeat",
      country: "🇿🇦",
      cover: "🌍",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3"
    },
    {
      id: 7,
      title: "La Vie En Rose",
      artist: "Édith Piaf",
      duration: "3:28",
      genre: "jazz",
      country: "🇫🇷",
      cover: "🌹",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
    },
    {
      id: 8,
      title: "Levitating",
      artist: "Dua Lipa",
      duration: "3:23",
      genre: "pop",
      country: "🇬🇧",
      cover: "✨",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
    },
    {
      id: 9,
      title: "No Woman No Cry",
      artist: "Bob Marley",
      duration: "4:30",
      genre: "reggae",
      country: "🇯🇲",
      cover: "🌿",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3"
    },
    {
      id: 10,
      title: "Avicii - Levels",
      artist: "Avicii",
      duration: "3:18",
      genre: "electronic",
      country: "🇸🇪",
      cover: "🎧",
      src: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
    }
  ];

  const genres = [
    { id: 'all', label: '🌍 All World', active: true },
    { id: 'pop', label: '🎵 Pop' },
    { id: 'rock', label: '🎸 Rock' },
    { id: 'bollywood', label: '🇮🇳 Bollywood' },
    { id: 'k-pop', label: '🇰🇷 K-Pop' },
    { id: 'latin', label: '💃 Latin' },
    { id: 'afrobeat', label: '🌍 Afrobeat' },
    { id: 'reggae', label: '🌿 Reggae' },
    { id: 'electronic', label: '🎧 Electronic' },
    { id: 'jazz', label: '🎺 Jazz' }
  ];

  const filteredTracks = currentGenre === 'all' 
    ? globalTracks 
    : globalTracks.filter(track => track.genre === currentGenre);

  const currentTrackData = filteredTracks[currentTrack] || globalTracks[0];

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setAudioError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setAudioError('Failed to load audio file');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setAudioError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    audio.volume = volume;

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrack, volume]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Play error:', error);
      setAudioError('Playback failed. Please click to enable audio.');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % filteredTracks.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + filteredTracks.length) % filteredTracks.length);
    setIsPlaying(false);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const newTime = (clickX / progressWidth) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleLike = (trackId) => {
    setLikedSongs(prev => {
      const isLiked = prev.includes(trackId);
      if (isLiked) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const DonationModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-xl max-w-md w-full mx-4 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">💝 Support INTERNITY MUSIC</h3>
        <p className="text-gray-300 mb-6">Help us keep music free for everyone worldwide!</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['$5', '$10', '$25'].map(amount => (
            <button 
              key={amount}
              className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors"
              onClick={() => {
                setShowDonationModal(false);
                alert(`Thank you for your ${amount} donation! 💝`);
              }}
            >
              {amount}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="number" 
            placeholder="Custom amount ($)" 
            className="flex-1 bg-black/30 border border-purple-500/50 text-white px-3 py-2 rounded-lg"
          />
          <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors">
            Donate
          </button>
        </div>
        
        <button 
          onClick={() => setShowDonationModal(false)}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={currentTrackData.src}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">♪</span>
          </div>
          <h1 className="text-xl font-bold text-white">INTERNITY MUSIC</h1>
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">FREE FOR ALL</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search global music..."
              className="pl-10 pr-4 py-2 bg-white/10 rounded-full text-white placeholder-gray-300 w-80"
            />
          </div>
          <button 
            onClick={() => setShowDonationModal(true)}
            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-full text-white font-medium transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span>Donate</span>
          </button>
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 p-6 border-r border-white/10">
          <nav className="space-y-4">
            <div className="flex items-center space-x-3 text-purple-400 font-medium">
              <span>🔍</span>
              <span>Discover</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer transition-colors">
              <span>♪</span>
              <span>Your Library</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer transition-colors">
              <span>📋</span>
              <span>Playlists</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer transition-colors">
              <span>❤️</span>
              <span>Liked Songs ({likedSongs.length})</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer transition-colors">
              <span>💝</span>
              <span>Support Us</span>
            </div>
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg border border-purple-500/30">
            <h3 className="text-white font-semibold mb-2">🌍 Global Music</h3>
            <p className="text-gray-300 text-sm mb-3">Music from every culture, free forever!</p>
            <button 
              onClick={() => setShowDonationModal(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Support Our Mission
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setCurrentGenre(genre.id);
                  setCurrentTrack(0);
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  currentGenre === genre.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center">
              <span className="mr-2">🌍</span> 
              {currentGenre === 'all' ? 'World Music Collection' : `${genres.find(g => g.id === currentGenre)?.label} Music`}
              <span className="ml-2 text-sm bg-purple-600/50 px-3 py-1 rounded-full">
                {filteredTracks.length} songs
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTracks.map((track, index) => (
                <div 
                  key={track.id} 
                  className={`bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group ${
                    currentTrack === index && filteredTracks[currentTrack]?.id === track.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => {
                    setCurrentTrack(index);
                    setIsPlaying(false);
                  }}
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-3 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                    <div className="text-4xl">{track.cover}</div>
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold truncate">{track.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <span className="text-lg ml-2">{track.country}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{track.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(track.id);
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        likedSongs.includes(track.id) 
                          ? 'text-red-500 hover:text-red-400' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedSongs.includes(track.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <span className="bg-green-500 px-2 py-1 rounded-full text-xs text-white font-medium">
                      🌍 FREE STREAM
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {audioError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-300">{audioError}</p>
              <p className="text-red-200 text-sm mt-1">
                Click the play button to enable audio playback.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
              {currentTrackData.cover}
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate">{currentTrackData.title}</h4>
              <p className="text-gray-400 text-sm truncate flex items-center">
                <span className="mr-2">{currentTrackData.country}</span>
                {currentTrackData.artist}
              </p>
            </div>
            <button
              onClick={() => handleLike(currentTrackData.id)}
              className={`p-2 rounded-full transition-colors ${
                likedSongs.includes(currentTrackData.id) 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${likedSongs.includes(currentTrackData.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-2">
            <div className="flex items-center space-x-4">
              <Shuffle className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <SkipBack 
                className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" 
                onClick={handlePrevious} 
              />
              
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>
              
              <SkipForward 
                className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" 
                onClick={handleNext} 
              />
              <Repeat className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-96">
              <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
              <div 
                ref={progressRef}
                className="flex-1 h-2 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <button
              onClick={() => setShowDonationModal(true)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <Gift className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && <DonationModal />}
    </div>
  );
};

export default GlobalMusicPlayer;
