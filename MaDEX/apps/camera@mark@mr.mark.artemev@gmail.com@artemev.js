// Camera App - Photo and Video Capture
class CameraApp {
    constructor() {
        this.photos = this.loadPhotos();
        this.cameraMode = 'photo'; // 'photo' or 'video'
        this.videoRecording = false;
        this.recordingDuration = 0;
        this.quality = 'high'; // 'low', 'medium', 'high'
        this.currentFilter = 'none';
    }

    // Take photo
    takePhoto(imageData = null) {
        const photo = {
            id: Date.now(),
            type: 'photo',
            data: imageData || this.generateRandomImage(),
            filter: this.currentFilter,
            timestamp: new Date(),
            quality: this.quality,
            size: this.random(2, 8) + 'MB'
        };
        this.photos.unshift(photo);
        this.savePhotos();
        return photo;
    }

    // Start video recording
    startVideoRecording() {
        if (this.videoRecording) return { success: false, message: 'Already recording' };
        
        this.videoRecording = true;
        this.recordingDuration = 0;
        return { success: true, message: 'Recording started' };
    }

    // Stop video recording
    stopVideoRecording() {
        if (!this.videoRecording) return { success: false, message: 'Not recording' };

        const video = {
            id: Date.now(),
            type: 'video',
            data: this.generateRandomImage(),
            filter: this.currentFilter,
            timestamp: new Date(),
            duration: this.recordingDuration,
            quality: this.quality,
            size: this.random(50, 500) + 'MB'
        };
        this.videoRecording = false;
        this.photos.unshift(video);
        this.savePhotos();
        return { success: true, message: 'Video saved', video: video };
    }

    // Set camera mode
    setCameraMode(mode) {
        if (mode === 'photo' || mode === 'video') {
            this.cameraMode = mode;
            return { success: true, mode: mode };
        }
        return { success: false, message: 'Invalid mode' };
    }

    // Apply filter
    applyFilter(filterName) {
        const validFilters = ['none', 'grayscale', 'sepia', 'vintage', 'cool', 'warm'];
        if (validFilters.includes(filterName)) {
            this.currentFilter = filterName;
            return { success: true, filter: filterName };
        }
        return { success: false, message: 'Invalid filter' };
    }

    // Set quality
    setQuality(qualityLevel) {
        if (['low', 'medium', 'high'].includes(qualityLevel)) {
            this.quality = qualityLevel;
            return { success: true, quality: qualityLevel };
        }
        return { success: false, message: 'Invalid quality' };
    }

    // Get all photos and videos
    getMediaLibrary() {
        return this.photos;
    }

    // Get photos only
    getPhotos() {
        return this.photos.filter(m => m.type === 'photo');
    }

    // Get videos only
    getVideos() {
        return this.photos.filter(m => m.type === 'video');
    }

    // Get media by ID
    getMedia(mediaId) {
        return this.photos.find(m => m.id === mediaId);
    }

    // Delete media
    deleteMedia(mediaId) {
        this.photos = this.photos.filter(m => m.id !== mediaId);
        this.savePhotos();
    }

    // Get media statistics
    getStats() {
        const videos = this.getVideos();
        const photos = this.getPhotos();
        const totalSize = this.photos.reduce((sum, m) => {
            const sizeNum = parseInt(m.size);
            return sum + sizeNum;
        }, 0);

        return {
            totalPhotos: photos.length,
            totalVideos: videos.length,
            totalSize: totalSize + 'MB',
            totalMediaItems: this.photos.length
        };
    }

    // Toggle flash
    toggleFlash() {
        this.flashEnabled = !this.flashEnabled;
        return { success: true, flashEnabled: this.flashEnabled };
    }

    // Toggle HDR
    toggleHDR() {
        this.hdrEnabled = !this.hdrEnabled;
        return { success: true, hdrEnabled: this.hdrEnabled };
    }

    // Get available filters
    getAvailableFilters() {
        return ['none', 'grayscale', 'sepia', 'vintage', 'cool', 'warm'];
    }

    // Save photos to localStorage
    savePhotos() {
        localStorage.setItem('cameraAppPhotos', JSON.stringify(this.photos));
    }

    // Load photos from localStorage
    loadPhotos() {
        const saved = localStorage.getItem('cameraAppPhotos');
        return saved ? JSON.parse(saved) : [];
    }

    // Generate random image (placeholder)
    generateRandomImage() {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23${Math.floor(Math.random()*16777215).toString(16)}' width='400' height='300'/%3E%3C/svg%3E`;
    }

    // Helper function for random number
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Camera',
            version: '1.0.0',
            icon: '📷',
            id: 'camera'
        };
    }
}

// Export for use
const cameraApp = new CameraApp();
