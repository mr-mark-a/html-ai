// Gallery App - Photo and Media Management
class GalleryApp {
    constructor() {
        this.albums = this.loadAlbums();
        this.currentAlbum = null;
        this.favorites = this.loadFavorites();
    }

    // Create album
    createAlbum(name, description = '') {
        const album = {
            id: Date.now(),
            name: name,
            description: description,
            photos: [],
            created: new Date(),
            cover: null,
            itemCount: 0
        };
        this.albums.push(album);
        this.saveAlbums();
        return album;
    }

    // Get all albums
    getAllAlbums() {
        return this.albums;
    }

    // Get album by ID
    getAlbum(albumId) {
        return this.albums.find(a => a.id === albumId);
    }

    // Add photo to album
    addPhotoToAlbum(albumId, photoData) {
        const album = this.getAlbum(albumId);
        if (album) {
            const photo = {
                id: Date.now(),
                data: photoData,
                timestamp: new Date(),
                favorite: false
            };
            album.photos.push(photo);
            album.itemCount = album.photos.length;
            if (!album.cover) album.cover = photoData;
            this.saveAlbums();
            return photo;
        }
        return null;
    }

    // Remove photo from album
    removePhotoFromAlbum(albumId, photoId) {
        const album = this.getAlbum(albumId);
        if (album) {
            album.photos = album.photos.filter(p => p.id !== photoId);
            album.itemCount = album.photos.length;
            if (album.itemCount === 0) album.cover = null;
            this.saveAlbums();
            return true;
        }
        return false;
    }

    // Get photos in album
    getPhotosInAlbum(albumId) {
        const album = this.getAlbum(albumId);
        return album ? album.photos : [];
    }

    // Delete album
    deleteAlbum(albumId) {
        this.albums = this.albums.filter(a => a.id !== albumId);
        this.saveAlbums();
    }

    // Rename album
    renameAlbum(albumId, newName) {
        const album = this.getAlbum(albumId);
        if (album) {
            album.name = newName;
            this.saveAlbums();
            return album;
        }
        return null;
    }

    // Add to favorites
    addToFavorites(albumId, photoId) {
        const album = this.getAlbum(albumId);
        if (album) {
            const photo = album.photos.find(p => p.id === photoId);
            if (photo) {
                photo.favorite = true;
                this.saveFavorites();
                this.saveAlbums();
                return true;
            }
        }
        return false;
    }

    // Remove from favorites
    removeFromFavorites(albumId, photoId) {
        const album = this.getAlbum(albumId);
        if (album) {
            const photo = album.photos.find(p => p.id === photoId);
            if (photo) {
                photo.favorite = false;
                this.saveFavorites();
                this.saveAlbums();
                return true;
            }
        }
        return false;
    }

    // Get all favorite photos
    getFavoritePhotos() {
        const favorites = [];
        this.albums.forEach(album => {
            favorites.push(...album.photos.filter(p => p.favorite));
        });
        return favorites;
    }

    // Search photos by date
    searchByDate(startDate, endDate) {
        const results = [];
        this.albums.forEach(album => {
            const matches = album.photos.filter(p => {
                const photoDate = new Date(p.timestamp);
                return photoDate >= startDate && photoDate <= endDate;
            });
            results.push(...matches);
        });
        return results;
    }

    // Get statistics
    getStats() {
        let totalPhotos = 0;
        let totalSize = 0;

        this.albums.forEach(album => {
            totalPhotos += album.photos.length;
            totalSize += album.photos.length * (Math.random() * 3);
        });

        return {
            totalAlbums: this.albums.length,
            totalPhotos: totalPhotos,
            favoritePhotos: this.getFavoritePhotos().length,
            totalSize: totalSize.toFixed(2) + 'MB'
        };
    }

    // Create albums from camera app
    createCameraRoll() {
        let cameraRoll = this.albums.find(a => a.name === 'Camera Roll');
        if (!cameraRoll) {
            cameraRoll = this.createAlbum('Camera Roll', 'Photos taken with camera');
        }
        return cameraRoll;
    }

    // Save albums to localStorage
    saveAlbums() {
        localStorage.setItem('galleryAppAlbums', JSON.stringify(this.albums));
    }

    // Load albums from localStorage
    loadAlbums() {
        const saved = localStorage.getItem('galleryAppAlbums');
        if (saved) {
            return JSON.parse(saved);
        }
        // Create default albums
        const defaultAlbums = [
            {
                id: Date.now(),
                name: 'Camera Roll',
                description: 'All photos and videos',
                photos: [],
                created: new Date(),
                cover: null,
                itemCount: 0
            },
            {
                id: Date.now() + 1,
                name: 'Screenshots',
                description: 'Device screenshots',
                photos: [],
                created: new Date(),
                cover: null,
                itemCount: 0
            }
        ];
        localStorage.setItem('galleryAppAlbums', JSON.stringify(defaultAlbums));
        return defaultAlbums;
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('galleryAppFavorites', JSON.stringify(this.favorites));
    }

    // Load favorites from localStorage
    loadFavorites() {
        const saved = localStorage.getItem('galleryAppFavorites');
        return saved ? JSON.parse(saved) : [];
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Gallery',
            version: '1.0.0',
            icon: '🖼️',
            id: 'gallery'
        };
    }
}

// Export for use
const galleryApp = new GalleryApp();
