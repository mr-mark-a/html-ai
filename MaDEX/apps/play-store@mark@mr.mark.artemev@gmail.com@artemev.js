// Play Store App - App Installation and Management
class PlayStoreApp {
    constructor() {
        this.installedApps = this.loadInstalledApps();
        this.storeApps = this.getStoreApps();
        this.downloads = this.loadDownloads();
    }

    // Get apps available in store
    getStoreApps() {
        return [
            {
                id: 'pubg_mobile',
                name: 'PUBG Mobile',
                icon: '🎮',
                category: 'Games',
                rating: 4.5,
                reviews: 2500000,
                downloads: '100M+',
                size: '2.4GB',
                description: 'Battle royale shooter game',
                url: 'https://play.google.com/store/apps/details?id=com.tencent.ig',
                price: 'Free'
            },
            {
                id: 'candy_crush',
                name: 'Candy Crush Saga',
                icon: '🍬',
                category: 'Games',
                rating: 4.6,
                reviews: 3000000,
                downloads: '500M+',
                size: '150MB',
                description: 'Match-3 puzzle game',
                url: 'https://play.google.com/store/apps/details?id=com.king.candycrushsaga',
                price: 'Free'
            },
            {
                id: 'clash_royale',
                name: 'Clash Royale',
                icon: '⚔️',
                category: 'Games',
                rating: 4.5,
                reviews: 1500000,
                downloads: '100M+',
                size: '100MB',
                description: 'Real-time strategy game',
                url: 'https://play.google.com/store/apps/details?id=com.supercell.clashroyale',
                price: 'Free'
            },
            {
                id: 'minecraft',
                name: 'Minecraft',
                icon: '⛏️',
                category: 'Games',
                rating: 4.6,
                reviews: 2000000,
                downloads: '50M+',
                size: '800MB',
                description: 'Sandbox survival game',
                url: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe',
                price: '$6.99'
            },
            {
                id: 'among_us',
                name: 'Among Us',
                icon: '👾',
                category: 'Games',
                rating: 4.4,
                reviews: 1000000,
                downloads: '100M+',
                size: '250MB',
                description: 'Social deduction game',
                url: 'https://play.google.com/store/apps/details?id=com.innersloth.spacemafia',
                price: 'Free'
            },
            {
                id: 'fortnite',
                name: 'Fortnite',
                icon: '🎯',
                category: 'Games',
                rating: 4.5,
                reviews: 1200000,
                downloads: '250M+',
                size: '2.5GB',
                description: 'Battle royale shooter',
                url: 'https://play.google.com/store/apps/details?id=com.epicgames.fortnite',
                price: 'Free'
            },
            {
                id: 'word',
                name: 'Microsoft Word',
                icon: '📝',
                category: 'Productivity',
                rating: 4.7,
                reviews: 500000,
                downloads: '100M+',
                size: '300MB',
                description: 'Document editor',
                url: 'https://play.google.com/store/apps/details?id=com.microsoft.office.word',
                price: 'Free'
            },
            {
                id: 'google_drive',
                name: 'Google Drive',
                icon: '☁️',
                category: 'Productivity',
                rating: 4.8,
                reviews: 2000000,
                downloads: '500M+',
                size: '100MB',
                description: 'Cloud storage',
                url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.docs',
                price: 'Free'
            },
            {
                id: 'notion',
                name: 'Notion',
                icon: '📔',
                category: 'Productivity',
                rating: 4.6,
                reviews: 300000,
                downloads: '5M+',
                size: '200MB',
                description: 'Note and task manager',
                url: 'https://play.google.com/store/apps/details?id=com.notion',
                price: 'Free'
            },
            {
                id: 'slack',
                name: 'Slack',
                icon: '💬',
                category: 'Productivity',
                rating: 4.5,
                reviews: 400000,
                downloads: '50M+',
                size: '150MB',
                description: 'Team communication',
                url: 'https://play.google.com/store/apps/details?id=com.slack',
                price: 'Free'
            },
            {
                id: 'instagram',
                name: 'Instagram',
                icon: '📷',
                category: 'Social',
                rating: 4.5,
                reviews: 5000000,
                downloads: '1B+',
                size: '250MB',
                description: 'Photo sharing social media',
                url: 'https://play.google.com/store/apps/details?id=com.instagram.android',
                price: 'Free'
            },
            {
                id: 'facebook',
                name: 'Facebook',
                icon: '👍',
                category: 'Social',
                rating: 4.3,
                reviews: 3000000,
                downloads: '500M+',
                size: '200MB',
                description: 'Social networking',
                url: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
                price: 'Free'
            },
            {
                id: 'twitter',
                name: 'Twitter',
                icon: '🐦',
                category: 'Social',
                rating: 4.4,
                reviews: 1500000,
                downloads: '100M+',
                size: '180MB',
                description: 'Microblogging platform',
                url: 'https://play.google.com/store/apps/details?id=com.twitter.android',
                price: 'Free'
            },
            {
                id: 'tiktok',
                name: 'TikTok',
                icon: '🎵',
                category: 'Social',
                rating: 4.5,
                reviews: 4000000,
                downloads: '1B+',
                size: '300MB',
                description: 'Short video platform',
                url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically',
                price: 'Free'
            }
        ];
    }

    // Get app by ID
    getApp(appId) {
        return this.storeApps.find(a => a.id === appId);
    }

    // Search apps
    searchApps(query) {
        const q = query.toLowerCase();
        return this.storeApps.filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
        );
    }

    // Get apps by category
    getAppsByCategory(category) {
        return this.storeApps.filter(a => a.category === category);
    }

    // Get all categories
    getCategories() {
        const categories = new Set(this.storeApps.map(a => a.category));
        return Array.from(categories);
    }

    // Install app
    installApp(appId) {
        const app = this.getApp(appId);
        if (!app) return { success: false, message: 'App not found' };

        if (this.isInstalled(appId)) {
            return { success: false, message: 'App already installed' };
        }

        const download = {
            id: appId,
            name: app.name,
            progress: 0,
            status: 'downloading',
            startTime: new Date(),
            size: app.size
        };

        this.downloads.push(download);
        this.saveDownloads();

        // Simulate download with progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                this.completeInstallation(appId, download);
            } else {
                download.progress = Math.floor(progress);
                this.saveDownloads();
            }
        }, 300);

        return { 
            success: true, 
            message: `📥 Installing ${app.name}...`, 
            download: download,
            app: app,
            downloadStarted: true
        };
    }

    // Complete installation
    completeInstallation(appId, download) {
        const app = this.getApp(appId);
        if (app) {
            const installedApp = {
                id: appId,
                name: app.name,
                icon: app.icon,
                installDate: new Date(),
                version: '1.0.0',
                size: app.size,
                category: app.category,
                launchable: true
            };
            
            this.installedApps.push(installedApp);
            this.saveInstalledApps();

            const downloadIdx = this.downloads.findIndex(d => d.id === appId);
            if (downloadIdx >= 0) {
                this.downloads[downloadIdx].status = 'installed';
                this.downloads[downloadIdx].progress = 100;
                this.saveDownloads();
            }
            
            return { 
                success: true, 
                message: `✅ ${app.name} installed successfully!`,
                app: installedApp
            };
        }
    }

    // Check if app is installed
    isInstalled(appId) {
        return this.installedApps.some(a => a.id === appId);
    }

    // Get installed apps
    getInstalledApps() {
        return this.installedApps;
    }

    // Launch installed app
    launchApp(appId) {
        const app = this.installedApps.find(a => a.id === appId);
        if (app) {
            return { 
                success: true, 
                message: `🚀 Launching ${app.name}...`,
                app: app
            };
        }
        return { success: false, message: 'App not installed' };
    }

    // Get download history
    getDownloadHistory() {
        return this.downloads;
    }

    // Get top apps
    getTopApps(limit = 10) {
        return this.storeApps.slice(0, limit);
    }

    // Get featured apps
    getFeaturedApps() {
        return this.storeApps.filter(a => ['Games', 'Productivity', 'Social'].includes(a.category));
    }

    // Rate app
    rateApp(appId, rating, review = '') {
        const app = this.getApp(appId);
        if (app) {
            return {
                success: true,
                message: 'Thank you for your rating!',
                rating: rating,
                review: review
            };
        }
        return { success: false, message: 'App not found' };
    }

    // Get app details
    getAppDetails(appId) {
        const app = this.getApp(appId);
        return app ? app : null;
    }

    // Clear downloads
    clearDownloads() {
        this.downloads = this.downloads.filter(d => d.status !== 'installed');
        this.saveDownloads();
    }

    // Save installed apps to localStorage
    saveInstalledApps() {
        localStorage.setItem('playStoreInstalledApps', JSON.stringify(this.installedApps));
    }

    // Load installed apps from localStorage
    loadInstalledApps() {
        const saved = localStorage.getItem('playStoreInstalledApps');
        return saved ? JSON.parse(saved) : [];
    }

    // Save downloads to localStorage
    saveDownloads() {
        localStorage.setItem('playStoreDownloads', JSON.stringify(this.downloads));
    }

    // Load downloads from localStorage
    loadDownloads() {
        const saved = localStorage.getItem('playStoreDownloads');
        return saved ? JSON.parse(saved) : [];
    }

    // Get store statistics
    getStatistics() {
        return {
            totalApps: this.storeApps.length,
            categories: this.getCategories().length,
            installedApps: this.installedApps.length,
            downloads: this.downloads.length
        };
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Play Store',
            version: '1.0.0',
            icon: '🏪',
            id: 'play-store',
            storeUrl: 'https://play.google.com/store/apps?hl=en_US'
        };
    }
}

// Export for use
const playStoreApp = new PlayStoreApp();
