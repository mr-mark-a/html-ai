// MaDEX Apps Index - Central app management and initialization
class AppsManager {
    constructor() {
        this.apps = {};
        this.initializeApps();
    }

    // Initialize all apps
    initializeApps() {
        // These apps are loaded from individual app files
        this.apps = {
            phone: typeof phoneApp !== 'undefined' ? phoneApp : null,
            messages: typeof messagesApp !== 'undefined' ? messagesApp : null,
            contacts: typeof contactsApp !== 'undefined' ? contactsApp : null,
            camera: typeof cameraApp !== 'undefined' ? cameraApp : null,
            gallery: typeof galleryApp !== 'undefined' ? galleryApp : null,
            music: typeof musicApp !== 'undefined' ? musicApp : null,
            settings: typeof settingsApp !== 'undefined' ? settingsApp : null,
            playStore: typeof playStoreApp !== 'undefined' ? playStoreApp : null
        };
    }

    // Get app by ID
    getApp(appId) {
        return this.apps[appId] || null;
    }

    // Get all apps
    getAllApps() {
        return Object.values(this.apps).filter(app => app !== null);
    }

    // Get app launch shortcuts
    getAppShortcuts() {
        return [
            { id: 'phone', name: 'Phone', icon: '☎️' },
            { id: 'messages', name: 'Messages', icon: '💬' },
            { id: 'contacts', name: 'Contacts', icon: '👥' },
            { id: 'camera', name: 'Camera', icon: '📷' },
            { id: 'gallery', name: 'Gallery', icon: '🖼️' },
            { id: 'music', name: 'Music', icon: '🎵' },
            { id: 'playStore', name: 'Play Store', icon: '🏪' },
            { id: 'settings', name: 'Settings', icon: '⚙️' }
        ];
    }

    // Get app info
    getAppInfo(appId) {
        const app = this.getApp(appId);
        return app && app.getAppInfo ? app.getAppInfo() : null;
    }

    // Launch app with logging
    launchApp(appId) {
        const app = this.getApp(appId);
        if (app) {
            console.log(`🚀 Launching ${app.getAppInfo?.().name || appId}`);
            return { success: true, app: appId };
        }
        return { success: false, message: `App ${appId} not found` };
    }

    // Close app with logging
    closeApp(appId) {
        console.log(`❌ Closing ${appId}`);
        return { success: true };
    }

    // Get system status
    getSystemStatus() {
        return {
            timestamp: new Date(),
            runningApps: this.getAllApps().length,
            availableMemory: Math.random() * 50 + 50 + 'MB',
            systemUptime: Math.floor(Math.random() * 100) + ' hours'
        };
    }

    // Get app statistics
    getAppStatistics() {
        const stats = {};
        Object.entries(this.apps).forEach(([key, app]) => {
            if (app && app.getAppInfo && app.getStats) {
                stats[key] = {
                    info: app.getAppInfo(),
                    stats: app.getStats()
                };
            }
        });
        return stats;
    }

    // Sync data across apps
    syncAppData() {
        // Sync phone contacts with messages app
        if (this.apps.contacts && this.apps.messages) {
            console.log('📱 Syncing Contacts with Messages...');
        }

        // Sync camera photos with gallery
        if (this.apps.camera && this.apps.gallery) {
            const cameraRoll = this.apps.gallery.createCameraRoll();
            console.log('📷 Syncing Camera with Gallery...');
        }

        return { success: true, message: 'App data synced' };
    }

    // Clear all app data
    clearAllData() {
        if (confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
            Object.values(this.apps).forEach(app => {
                if (app && app.clearCallHistory) app.clearCallHistory();
                if (app && app.resetToDefaults) app.resetToDefaults();
            });
            return { success: true, message: 'All app data cleared' };
        }
        return { success: false, message: 'Operation cancelled' };
    }

    // Export all app data
    exportAllData() {
        const exportData = {
            exportDate: new Date(),
            version: '1.0',
            apps: {}
        };

        Object.entries(this.apps).forEach(([key, app]) => {
            if (app) {
                exportData.apps[key] = {
                    info: app.getAppInfo ? app.getAppInfo() : null,
                    data: app.exportSettings ? app.exportSettings() : null
                };
            }
        });

        return exportData;
    }

    // Get app usage report
    getUsageReport() {
        return {
            phone: {
                callsMade: this.apps.phone?.getCallHistory ? this.apps.phone.getCallHistory().length : 0,
                messagesSent: this.apps.messages?.getConversations ? this.apps.messages.getConversations().length : 0
            },
            photos: {
                photosTotal: this.apps.camera?.getMediaLibrary ? this.apps.camera.getMediaLibrary().length : 0,
                videosTotal: this.apps.camera?.getVideos ? this.apps.camera.getVideos().length : 0
            },
            contacts: {
                totalContacts: this.apps.contacts?.getAllContacts ? this.apps.contacts.getAllContacts().length : 0,
                favorites: this.apps.contacts?.getFavorites ? this.apps.contacts.getFavorites().length : 0
            },
            music: {
                playlists: this.apps.music?.getAllPlaylists ? this.apps.music.getAllPlaylists().length : 0,
                songs: this.apps.music?.getAllSongs ? this.apps.music.getAllSongs().length : 0
            },
            storage: this.apps.settings?.getStorageInfo ? this.apps.settings.getStorageInfo() : null
        };
    }

    // Check app availability
    checkAppAvailability() {
        return {
            phone: !!this.apps.phone,
            messages: !!this.apps.messages,
            contacts: !!this.apps.contacts,
            camera: !!this.apps.camera,
            gallery: !!this.apps.gallery,
            music: !!this.apps.music,
            settings: !!this.apps.settings,
            playStore: !!this.apps.playStore
        };
    }

    // Get app compatibility info
    getCompatibilityInfo() {
        return {
            osVersion: '14.0',
            requiredApps: ['phone', 'messages', 'contacts', 'settings'],
            optionalApps: ['camera', 'gallery', 'music', 'playStore'],
            systemRequirements: {
                minRAM: '4GB',
                minStorage: '128GB',
                minAndroidVersion: '10.0'
            }
        };
    }
}

// Initialize global apps manager
const appsManager = new AppsManager();

// Log initialization
console.log('✅ MaDEX Apps Manager initialized');
console.log('🎯 Available apps:', appsManager.getAppShortcuts().map(a => a.name).join(', '));
