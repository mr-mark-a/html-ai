// Phone App - Dialer and Call Management
class PhoneApp {
    constructor() {
        this.currentNumber = '';
        this.callHistory = this.loadCallHistory();
        this.isCalling = false;
        this.callDuration = 0;
        this.callTimer = null;
    }

    // Add digit to phone number
    addDigit(digit) {
        if (this.currentNumber.length < 15) {
            this.currentNumber += digit;
            this.updateDisplay();
        }
    }

    // Remove last digit
    removeDigit() {
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.updateDisplay();
    }

    // Clear all digits
    clearNumber() {
        this.currentNumber = '';
        this.updateDisplay();
    }

    // Make a call
    makeCall(number) {
        if (!number || number.length < 10) {
            return { success: false, message: 'Invalid phone number' };
        }

        this.isCalling = true;
        this.callDuration = 0;
        this.startCallTimer();
        this.addToCallHistory(number, 'outgoing');

        // Play calling sound
        this.playCallingSound();

        // Simulate call connected after 3 seconds
        setTimeout(() => {
            if (this.isCalling) {
                this.playConnectedSound();
            }
        }, 3000);

        return {
            success: true,
            message: `📞 Calling ${number}...`,
            number: number,
            timestamp: new Date(),
            audioActive: true
        };
    }

    // Play calling sound
    playCallingSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 440; // A4 note
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    // Play connected sound
    playConnectedSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 523.25; // C5 note
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    // Play end call sound
    playEndCallSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 330; // E4 note
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.12, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    // End call
    endCall() {
        this.isCalling = false;
        clearInterval(this.callTimer);
        
        // Play end call sound
        this.playEndCallSound();
        
        const duration = this.callDuration;
        this.currentNumber = '';
        this.updateDisplay();
        
        return { 
            success: true, 
            message: '☎️ Call ended', 
            duration: duration 
        };
    }

    // Start call timer
    startCallTimer() {
        this.callTimer = setInterval(() => {
            this.callDuration++;
        }, 1000);
    }

    // Get formatted call duration
    getFormattedDuration() {
        const mins = Math.floor(this.callDuration / 60);
        const secs = this.callDuration % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Add to call history
    addToCallHistory(number, type) {
        const call = {
            number: number,
            type: type,
            timestamp: new Date().toLocaleString(),
            duration: 0,
            id: Date.now()
        };
        this.callHistory.unshift(call);
        this.saveCallHistory();
        return call;
    }

    // Load call history from localStorage
    loadCallHistory() {
        const saved = localStorage.getItem('phoneAppCallHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // Save call history to localStorage
    saveCallHistory() {
        localStorage.setItem('phoneAppCallHistory', JSON.stringify(this.callHistory));
    }

    // Get call history
    getCallHistory() {
        return this.callHistory;
    }

    // Clear call history
    clearCallHistory() {
        this.callHistory = [];
        this.saveCallHistory();
        return { success: true, message: 'Call history cleared' };
    }

    // Delete specific call from history
    deleteCall(callId) {
        this.callHistory = this.callHistory.filter(call => call.id !== callId);
        this.saveCallHistory();
    }

    // Update display (callback to be overridden)
    updateDisplay() {
        // Override in actual implementation
    }

    // Format phone number for display
    formatPhoneNumber(number) {
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return number;
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Phone',
            version: '1.0.0',
            icon: '☎️',
            id: 'phone'
        };
    }
}

// Export for use
const phoneApp = new PhoneApp();
