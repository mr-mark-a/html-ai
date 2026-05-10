// Music App - Audio Player and Playlist Management
class MusicApp {
    constructor() {
        this.playlists = this.loadPlaylists();
        this.songs = this.loadSongs();
        this.currentPlaylist = null;
        this.currentSong = null;
        this.isPlaying = false;
        this.volume = 70;
        this.currentTime = 0;
        this.playbackRate = 1;
    }

    // Add song
    addSong(title, artist, duration, url = '') {
        const song = {
            id: Date.now(),
            title: title,
            artist: artist,
            duration: duration,
            url: url,
            playCount: 0,
            lastPlayed: null,
            favorite: false,
            addedDate: new Date()
        };
        this.songs.push(song);
        this.saveSongs();
        return song;
    }

    // Create playlist
    createPlaylist(name, description = '') {
        const playlist = {
            id: Date.now(),
            name: name,
            description: description,
            songs: [],
            created: new Date(),
            itemCount: 0,
            duration: 0
        };
        this.playlists.push(playlist);
        this.savePlaylists();
        return playlist;
    }

    // Get all playlists
    getAllPlaylists() {
        return this.playlists;
    }

    // Get playlist by ID
    getPlaylist(playlistId) {
        return this.playlists.find(p => p.id === playlistId);
    }

    // Add song to playlist
    addSongToPlaylist(playlistId, songId) {
        const playlist = this.getPlaylist(playlistId);
        const song = this.getSong(songId);

        if (playlist && song) {
            if (!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                playlist.itemCount = playlist.songs.length;
                playlist.duration += song.duration;
                this.savePlaylists();
                return true;
            }
        }
        return false;
    }

    // Remove song from playlist
    removeSongFromPlaylist(playlistId, songId) {
        const playlist = this.getPlaylist(playlistId);
        const song = this.getSong(songId);

        if (playlist && song) {
            playlist.songs = playlist.songs.filter(id => id !== songId);
            playlist.itemCount = playlist.songs.length;
            playlist.duration -= song.duration;
            this.savePlaylists();
            return true;
        }
        return false;
    }

    // Get songs in playlist
    getSongsInPlaylist(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            return playlist.songs.map(songId => this.getSong(songId)).filter(s => s);
        }
        return [];
    }

    // Get song by ID
    getSong(songId) {
        return this.songs.find(s => s.id === songId);
    }

    // Get all songs
    getAllSongs() {
        return this.songs;
    }

    // Play song
    playSong(songId) {
        const song = this.getSong(songId);
        if (song) {
            this.currentSong = songId;
            this.isPlaying = true;
            song.playCount++;
            song.lastPlayed = new Date();
            this.saveSongs();
            return { success: true, song: song };
        }
        return { success: false, message: 'Song not found' };
    }

    // Play playlist
    playPlaylist(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist && playlist.songs.length > 0) {
            this.currentPlaylist = playlistId;
            return this.playSong(playlist.songs[0]);
        }
        return { success: false, message: 'Playlist is empty' };
    }

    // Pause playback
    pause() {
        this.isPlaying = false;
        return { success: true, message: 'Paused' };
    }

    // Resume playback
    resume() {
        this.isPlaying = true;
        return { success: true, message: 'Resumed' };
    }

    // Stop playback
    stop() {
        this.isPlaying = false;
        this.currentSong = null;
        this.currentTime = 0;
        return { success: true, message: 'Stopped' };
    }

    // Seek to time
    seekTo(time) {
        this.currentTime = Math.max(0, time);
        return { success: true, currentTime: this.currentTime };
    }

    // Set volume
    setVolume(level) {
        this.volume = Math.max(0, Math.min(100, level));
        return { success: true, volume: this.volume };
    }

    // Set playback rate
    setPlaybackRate(rate) {
        if ([0.5, 0.75, 1, 1.25, 1.5, 2].includes(rate)) {
            this.playbackRate = rate;
            return { success: true, rate: rate };
        }
        return { success: false, message: 'Invalid playback rate' };
    }

    // Add to favorites
    addToFavorites(songId) {
        const song = this.getSong(songId);
        if (song) {
            song.favorite = true;
            this.saveSongs();
            return true;
        }
        return false;
    }

    // Get favorite songs
    getFavoriteSongs() {
        return this.songs.filter(s => s.favorite);
    }

    // Search songs
    searchSongs(query) {
        const q = query.toLowerCase();
        return this.songs.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q)
        );
    }

    // Get stats
    getStats() {
        const totalDuration = this.songs.reduce((sum, s) => sum + s.duration, 0);
        const totalPlaybacks = this.songs.reduce((sum, s) => sum + s.playCount, 0);

        return {
            totalSongs: this.songs.length,
            totalPlaylists: this.playlists.length,
            totalDuration: totalDuration,
            totalPlaybacks: totalPlaybacks,
            favoriteSongs: this.getFavoriteSongs().length
        };
    }

    // Delete playlist
    deletePlaylist(playlistId) {
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
    }

    // Save playlists to localStorage
    savePlaylists() {
        localStorage.setItem('musicAppPlaylists', JSON.stringify(this.playlists));
    }

    // Load playlists from localStorage
    loadPlaylists() {
        const saved = localStorage.getItem('musicAppPlaylists');
        return saved ? JSON.parse(saved) : [];
    }

    // Save songs to localStorage
    saveSongs() {
        localStorage.setItem('musicAppSongs', JSON.stringify(this.songs));
    }

    // Load songs from localStorage
    loadSongs() {
        const saved = localStorage.getItem('musicAppSongs');
        if (saved) {
            return JSON.parse(saved);
        }
        // Add default songs
        const defaultSongs = [
            this.createDefaultSong('Midnight Dreams', 'Luna Artist', 3.45),
            this.createDefaultSong('Digital Horizon', 'Neon Waves', 4.12),
            this.createDefaultSong('Electric Vibes', 'Synth Master', 3.58)
        ];
        this.songs = defaultSongs;
        this.saveSongs();
        return defaultSongs;
    }

    // Helper for default songs
    createDefaultSong(title, artist, duration) {
        return {
            id: Date.now() + Math.random(),
            title: title,
            artist: artist,
            duration: duration * 60,
            url: '',
            playCount: 0,
            lastPlayed: null,
            favorite: false,
            addedDate: new Date()
        };
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Music',
            version: '1.0.0',
            icon: '🎵',
            id: 'music'
        };
    }
}

// Export for use
const musicApp = new MusicApp();
