// Music API Integration Layer
class MusicAPIService {
    constructor() {
        this.database = null;
        this.apiEndpoints = {
            spotify: {
                search: 'https://api.spotify.com/v1/search',
                tracks: 'https://api.spotify.com/v1/tracks',
                artists: 'https://api.spotify.com/v1/artists'
            },
            lastfm: {
                search: 'https://ws.audioscrobbler.com/2.0/',
                apiKey: 'YOUR_LASTFM_API_KEY' // Users can get their own key
            },
            freeMusicArchive: {
                search: 'https://freemusicarchive.org/api/get/tracks.json'
            },
            jamendo: {
                search: 'https://api.jamendo.com/v3.0/tracks/',
                clientId: 'YOUR_JAMENDO_CLIENT_ID'
            }
        };
        this.loadDatabase();
    }

    async loadDatabase() {
        try {
            const response = await fetch('./database/music_database.json');
            this.database = await response.json();
            console.log('✅ Music database loaded:', this.database.metadata);
            return this.database;
        } catch (error) {
            console.warn('❌ Could not load music database:', error);
            return null;
        }
    }

    // Get all artists from database
    getAllArtists() {
        if (!this.database) return [];
        return Object.values(this.database.artists);
    }

    // Get artist by ID
    getArtist(artistId) {
        if (!this.database) return null;
        return this.database.artists[artistId] || null;
    }

    // Get all tracks from all artists
    getAllTracks() {
        if (!this.database) return [];
        const tracks = [];
        Object.values(this.database.artists).forEach(artist => {
            Object.values(artist.albums).forEach(album => {
                album.tracks.forEach(track => {
                    tracks.push({
                        ...track,
                        artist: artist.name,
                        artistId: artist.id,
                        album: album.title,
                        albumId: album.id,
                        albumCover: album.cover,
                        year: album.year,
                        genre: artist.genre,
                        country: artist.country,
                        artistImage: artist.image
                    });
                });
            });
        });
        return tracks;
    }

    // Search tracks by query
    searchTracks(query, limit = 20) {
        const allTracks = this.getAllTracks();
        const searchQuery = query.toLowerCase();
        
        return allTracks.filter(track =>
            track.title.toLowerCase().includes(searchQuery) ||
            track.artist.toLowerCase().includes(searchQuery) ||
            track.album.toLowerCase().includes(searchQuery)
        ).slice(0, limit);
    }

    // Get tracks by genre
    getTracksByGenre(genre) {
        const allTracks = this.getAllTracks();
        return allTracks.filter(track => track.genre === genre);
    }

    // Get playlist tracks
    getPlaylistTracks(playlistId) {
        if (!this.database || !this.database.playlists[playlistId]) return [];
        
        const playlist = this.database.playlists[playlistId];
        const tracks = [];
        
        playlist.tracks.forEach(trackPath => {
            const [artistId, albumId, trackId] = trackPath.split('/');
            const artist = this.database.artists[artistId];
            if (artist && artist.albums[albumId]) {
                const album = artist.albums[albumId];
                const track = album.tracks.find(t => t.id === trackId);
                if (track) {
                    tracks.push({
                        ...track,
                        artist: artist.name,
                        artistId: artist.id,
                        album: album.title,
                        albumId: album.id,
                        albumCover: album.cover,
                        year: album.year,
                        genre: artist.genre,
                        country: artist.country,
                        artistImage: artist.image
                    });
                }
            }
        });
        
        return tracks;
    }

    // Get trending tracks
    getTrendingTracks() {
        return this.getPlaylistTracks('trending_global');
    }

    // Get chill tracks
    getChillTracks() {
        return this.getPlaylistTracks('chill_vibes');
    }

    // Search external APIs (Spotify Web API - requires authentication)
    async searchSpotify(query, type = 'track', limit = 20) {
        // Note: This requires Spotify Client Credentials
        // For demo purposes, we'll return database results
        console.log('🔍 Spotify search would be called here for:', query);
        return this.searchTracks(query, limit);
    }

    // Search Last.fm API
    async searchLastFM(query, limit = 20) {
        try {
            const url = `${this.apiEndpoints.lastfm.search}?method=track.search&track=${encodeURIComponent(query)}&api_key=${this.apiEndpoints.lastfm.apiKey}&format=json&limit=${limit}`;
            
            // For demo, return database results
            console.log('🔍 Last.fm search would be called here for:', query);
            return this.searchTracks(query, limit);
        } catch (error) {
            console.warn('Last.fm search failed:', error);
            return this.searchTracks(query, limit);
        }
    }

    // Get track streaming URL (with fallback to preview URLs)
    getTrackStreamingUrl(track) {
        // Priority order: preview_url, fallback samples
        if (track.preview_url && track.preview_url.startsWith('http')) {
            return track.preview_url;
        }
        
        // Fallback to sample audio files
        const fallbackUrls = [
            "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-_swing.ogg",
            "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a",
            "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.ogg",
            "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
            "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.ogg"
        ];
        
        // Use track ID to consistently assign fallback URLs
        const trackHash = this.hashCode(track.id + track.artist);
        return fallbackUrls[Math.abs(trackHash) % fallbackUrls.length];
    }

    // Simple hash function for consistent URL assignment
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Format track for UI display
    formatTrackForUI(track) {
        return {
            id: `${track.artistId}_${track.id}`,
            title: track.title,
            artist: track.artist,
            album: track.album,
            duration: track.duration,
            genre: track.genre,
            country: track.country,
            year: track.year,
            stream_url: this.getTrackStreamingUrl(track),
            image: track.albumCover || track.artistImage,
            spotify_id: track.spotify_id,
            artistImage: track.artistImage,
            albumCover: track.albumCover
        };
    }

    // Get recommendations based on current track
    getRecommendations(currentTrack, limit = 10) {
        const allTracks = this.getAllTracks();
        
        // Filter by same genre or artist, exclude current track
        const recommendations = allTracks.filter(track => 
            (track.genre === currentTrack.genre || track.artistId === currentTrack.artistId) &&
            track.id !== currentTrack.id
        );
        
        // Shuffle and limit
        return this.shuffleArray(recommendations).slice(0, limit);
    }

    // Shuffle array utility
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get popular tracks by country
    getTracksByCountry(country) {
        const allTracks = this.getAllTracks();
        return allTracks.filter(track => track.country === country);
    }

    // Get new releases (simulated based on year)
    getNewReleases() {
        const allTracks = this.getAllTracks();
        return allTracks
            .filter(track => track.year >= 2020)
            .sort((a, b) => b.year - a.year)
            .slice(0, 20);
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicAPIService;
} else {
    window.MusicAPIService = MusicAPIService;
}