// MaDEX App Manager
// Manages apps, user data, and device functionality

class AppManager {
    constructor() {
        this.apps = {};
        this.currentApp = null;
        this.userData = this.loadUserData();
        this.initializeApps();
    }

    // Initialize available apps
    initializeApps() {
        this.apps = {
            phone: {
                name: 'Phone',
                icon: '☎️',
                id: 'phone',
                version: '1.0.0'
            },
            messages: {
                name: 'Messages',
                icon: '💬',
                id: 'messages',
                version: '1.0.0'
            },
            contacts: {
                name: 'Contacts',
                icon: '👥',
                id: 'contacts',
                version: '1.0.0'
            },
            store: {
                name: 'Play Store',
                icon: '🏪',
                id: 'store',
                version: '1.0.0',
                playStoreUrl: 'https://play.google.com/store/apps?hl=en_US'
            },
            camera: {
                name: 'Camera',
                icon: '📷',
                id: 'camera',
                version: '1.0.0'
            },
            gallery: {
                name: 'Gallery',
                icon: '🖼️',
                id: 'gallery',
                version: '1.0.0'
            },
            music: {
                name: 'Music',
                icon: '🎵',
                id: 'music',
                version: '1.0.0'
            },
            settings: {
                name: 'Settings',
                icon: '⚙️',
                id: 'settings',
                version: '1.0.0'
            }
        };
    }

    // Load user data from localStorage
    loadUserData() {
        const saved = localStorage.getItem('madexUserData');
        return saved ? JSON.parse(saved) : null;
    }

    // Save user data
    saveUserData(userData) {
        this.userData = userData;
        localStorage.setItem('madexUserData', JSON.stringify(userData));
    }

    // Get app by ID
    getApp(appId) {
        return this.apps[appId] || null;
    }

    // Get all apps
    getAllApps() {
        return Object.values(this.apps);
    }

    // Launch app
    launchApp(appId) {
        const app = this.getApp(appId);
        if (app) {
            this.currentApp = appId;
            console.log(`Launched: ${app.name}`);
            return app;
        }
        return null;
    }

    // Close app
    closeApp() {
        console.log(`Closed: ${this.apps[this.currentApp]?.name}`);
        this.currentApp = null;
    }

    // Get Play Store apps
    getPlayStoreApps() {
        return [
            {
                category: 'Games',
                apps: [
                    { name: 'PUBG Mobile', icon: '🎮', url: 'https://play.google.com/store/apps/details?id=com.tencent.ig' },
                    { name: 'Candy Crush', icon: '🍬', url: 'https://play.google.com/store/apps/details?id=com.king.candycrushsaga' },
                    { name: 'Clash Royale', icon: '⚔️', url: 'https://play.google.com/store/apps/details?id=com.supercell.clashroyale' },
                    { name: 'Minecraft', icon: '⛏️', url: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe' },
                    { name: 'Among Us', icon: '👾', url: 'https://play.google.com/store/apps/details?id=com.innersloth.spacemafia' },
                    { name: 'Fortnite', icon: '🎯', url: 'https://play.google.com/store/apps/details?id=com.epicgames.fortnite' }
                ]
            },
            {
                category: 'Productivity',
                apps: [
                    { name: 'Microsoft Word', icon: '📝', url: 'https://play.google.com/store/apps/details?id=com.microsoft.office.word' },
                    { name: 'Google Drive', icon: '☁️', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.docs' },
                    { name: 'Notion', icon: '📔', url: 'https://play.google.com/store/apps/details?id=com.notion' },
                    { name: 'Slack', icon: '💬', url: 'https://play.google.com/store/apps/details?id=com.slack' }
                ]
            },
            {
                category: 'Social',
                apps: [
                    { name: 'Instagram', icon: '📷', url: 'https://play.google.com/store/apps/details?id=com.instagram.android' },
                    { name: 'Facebook', icon: '👍', url: 'https://play.google.com/store/apps/details?id=com.facebook.katana' },
                    { name: 'Twitter', icon: '🐦', url: 'https://play.google.com/store/apps/details?id=com.twitter.android' },
                    { name: 'TikTok', icon: '🎵', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically' }
                ]
            }
        ];
    }

    // Get device info
    getDeviceInfo() {
        return {
            name: 'MaDEX Device',
            osVersion: '14.0',
            manufacturer: 'MaDEX',
            model: 'Simulator',
            buildNumber: 'MADEX.001'
        };
    }

    // Get system status
    getSystemStatus() {
        return {
            battery: 85,
            signal: 4,
            wifi: true,
            time: new Date().toLocaleTimeString()
        };
    }
}

// Initialize global app manager
const appManager = new AppManager();
