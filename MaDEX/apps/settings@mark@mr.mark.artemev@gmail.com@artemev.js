// Settings App - Device and App Configuration
class SettingsApp {
    constructor() {
        this.settings = this.loadSettings();
        this.deviceInfo = this.getDeviceInfo();
        this.dataUsageTaps = this.loadDataUsageTaps();
    }

    // Load data usage tap counter
    loadDataUsageTaps() {
        const saved = localStorage.getItem('settingsAppDataTaps');
        return saved ? parseInt(saved) : 0;
    }

    // Save data usage tap counter
    saveDataUsageTaps() {
        localStorage.setItem('settingsAppDataTaps', this.dataUsageTaps.toString());
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('settingsAppSettings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    // Get default settings
    getDefaultSettings() {
        return {
            display: {
                brightness: 80,
                theme: 'dark',
                autoRotate: true,
                screenTimeout: 60
            },
            sound: {
                volume: 70,
                ringtone: 'default',
                notification: 'on',
                haptic: true
            },
            network: {
                wifi: {
                    enabled: true,
                    ssid: 'MaDEX-WiFi'
                },
                mobile: {
                    enabled: true,
                    dataUsage: '2.5GB',
                    dataLimit: '10GB'
                },
                bluetooth: {
                    enabled: false,
                    connectedDevices: []
                }
            },
            security: {
                lockScreen: true,
                pattern: false,
                fingerprint: false,
                unknownSources: false
            },
            privacy: {
                locationServices: true,
                allowAds: true,
                analytics: true,
                shareData: false
            },
            about: {
                deviceName: 'MaDEX Device',
                osVersion: '14.0',
                buildNumber: 'MADEX.001',
                androidId: 'madex_' + Math.random().toString(36).substr(2, 9).toUpperCase()
            },
            developer: {
                debugMode: false,
                performanceMonitoring: false,
                logLevel: 'info'
            }
        };
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('settingsAppSettings', JSON.stringify(this.settings));
    }

    // Get setting value
    getSetting(path) {
        const keys = path.split('.');
        let value = this.settings;
        for (let key of keys) {
            value = value[key];
            if (value === undefined) return null;
        }
        return value;
    }

    // Set setting value
    setSetting(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let obj = this.settings;
        
        for (let key of keys) {
            if (!obj[key]) obj[key] = {};
            obj = obj[key];
        }
        
        obj[lastKey] = value;
        this.saveSettings();
        return { success: true, setting: path, value: value };
    }

    // Get all settings
    getAllSettings() {
        return this.settings;
    }

    // Reset to defaults
    resetToDefaults() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
        return { success: true, message: 'Settings reset to defaults' };
    }

    // Get device info
    getDeviceInfo() {
        return {
            model: 'MaDEX Simulator',
            manufacturer: 'MaDEX',
            osVersion: this.settings.about?.osVersion || '14.0',
            buildNumber: this.settings.about?.buildNumber || 'MADEX.001',
            androidId: this.settings.about?.androidId || 'unknown',
            resolution: '1080x2220',
            density: '480 dpi',
            cpu: 'Qualcomm Snapdragon',
            ram: '8GB',
            storage: '128GB',
            releaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            uptime: this.getDeviceUptime()
        };
    }

    // Get device uptime
    getDeviceUptime() {
        const uptime = Math.floor(Math.random() * 30) + 1; // 1-30 days
        return uptime + ' days';
    }

    // Get network status
    getNetworkStatus() {
        return {
            wifi: {
                connected: this.settings.network.wifi.enabled,
                ssid: this.settings.network.wifi.ssid,
                signal: Math.floor(Math.random() * 4) + 1,
                speed: Math.floor(Math.random() * 100) + 50 + ' Mbps'
            },
            mobile: {
                connected: this.settings.network.mobile.enabled,
                signal: Math.floor(Math.random() * 4) + 1,
                type: '5G',
                dataUsage: this.settings.network.mobile.dataUsage
            }
        };
    }

    // Get storage info
    getStorageInfo() {
        const total = 128; // GB
        const used = 85; // GB
        const available = total - used;

        return {
            total: total + ' GB',
            used: used + ' GB',
            available: available + ' GB',
            usagePercent: (used / total * 100).toFixed(1)
        };
    }

    // Tap data usage - 7 taps to clear all data (easter egg)
    tapDataUsage() {
        this.dataUsageTaps++;
        this.saveDataUsageTaps();

        if (this.dataUsageTaps === 1) {
            return { message: '6 more taps to clear all data...', taps: this.dataUsageTaps };
        } else if (this.dataUsageTaps < 7) {
            return { message: `${7 - this.dataUsageTaps} more taps...`, taps: this.dataUsageTaps };
        } else if (this.dataUsageTaps === 7) {
            // Clear all data
            this.clearAllData();
            return { 
                success: true, 
                message: '🔥 ALL DATA CLEARED! Device reset.', 
                taps: this.dataUsageTaps 
            };
        }
    }

    // Clear all stored data
    clearAllData() {
        localStorage.removeItem('settingsAppSettings');
        localStorage.removeItem('settingsAppDataTaps');
        localStorage.removeItem('phoneAppCallHistory');
        localStorage.removeItem('messagesAppConversations');
        localStorage.removeItem('contactsAppContacts');
        localStorage.removeItem('contactsAppFavorites');
        localStorage.removeItem('cameraAppPhotos');
        localStorage.removeItem('galleryAppAlbums');
        localStorage.removeItem('galleryAppFavorites');
        localStorage.removeItem('musicAppPlaylists');
        localStorage.removeItem('musicAppSongs');
        localStorage.removeItem('playStoreInstalledApps');
        localStorage.removeItem('playStoreDownloads');
        localStorage.removeItem('userRegistrationData');
        localStorage.removeItem('madexUserData');
        
        this.dataUsageTaps = 0;
        this.saveDataUsageTaps();
        
        // Reload page
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    // Get battery info
    getBatteryInfo() {
        return {
            level: this.settings.display?.brightness || 80,
            status: 'charging',
            health: 'good',
            temperature: '32°C',
            timeToFull: '45 minutes'
        };
    }

    // Get installed apps count
    getInstalledAppsCount() {
        return {
            system: 45,
            user: 28,
            total: 73,
            usedSpace: '4.2GB'
        };
    }

    // Enable developer mode
    enableDeveloperMode() {
        this.settings.developer.debugMode = true;
        this.saveSettings();
        return { success: true, message: 'Developer mode enabled' };
    }

    // Disable developer mode
    disableDeveloperMode() {
        this.settings.developer.debugMode = false;
        this.saveSettings();
        return { success: true, message: 'Developer mode disabled' };
    }

    // Get system logs
    getSystemLogs() {
        return [
            { timestamp: new Date(), level: 'INFO', message: 'System started' },
            { timestamp: new Date(), level: 'DEBUG', message: 'Initialization complete' },
            { timestamp: new Date(), level: 'INFO', message: 'All services running' }
        ];
    }

    // Restart device
    restartDevice() {
        this.saveSettings();
        return { success: true, message: 'Device restarting...' };
    }

    // Shutdown device
    shutdownDevice() {
        return { success: true, message: 'Shutting down...' };
    }

    // Get export data
    exportSettings() {
        return {
            settings: this.settings,
            deviceInfo: this.deviceInfo,
            exportDate: new Date(),
            version: '1.0'
        };
    }

    // Import settings
    importSettings(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (imported.settings) {
                this.settings = { ...this.settings, ...imported.settings };
                this.saveSettings();
                return { success: true, message: 'Settings imported' };
            }
        } catch (e) {
            return { success: false, error: 'Invalid import data' };
        }
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Settings',
            version: '1.0.0',
            icon: '⚙️',
            id: 'settings'
        };
    }
}

// Export for use
const settingsApp = new SettingsApp();
