let currentNumber = '';
const displayEl = document.getElementById('display');
const deleteBtn = document.getElementById('delete-btn');
const addText = document.getElementById('add-text');

const dialerScreen = document.getElementById('dialer-screen');
const callingScreen = document.getElementById('calling-screen');
const callingNumberEl = document.getElementById('calling-number');
const callStatusEl = document.getElementById('call-status');
const pulseRings = document.querySelectorAll('.pulse-ring');
const avatarSvg = document.querySelector('.avatar svg');

let callTimer;
let holdTimer;
let callSeconds = 0;

function updateDisplay() {
    // Format number nicely (simple formatting for look)
    let formatted = currentNumber;
    if (formatted.length > 3 && formatted.length <= 6) {
        formatted = formatted.slice(0,3) + ' ' + formatted.slice(3);
    } else if (formatted.length > 6) {
        formatted = formatted.slice(0,3) + ' ' + formatted.slice(3,6) + ' ' + formatted.slice(6);
    }

    displayEl.textContent = formatted;
    
    if (currentNumber.length > 0) {
        deleteBtn.classList.add('visible');
        addText.classList.add('visible');
    } else {
        deleteBtn.classList.remove('visible');
        addText.classList.remove('visible');
    }
}

function press(char) {
    // If showing a meeting code, clear it when they start typing a new number
    if (displayEl.textContent.startsWith('Code :')) {
        displayEl.style.fontSize = '';
        displayEl.style.color = '';
    }

    if (currentNumber.length < 15) {
        currentNumber += char;
        updateDisplay();
    }
}

function deleteChar() {
    currentNumber = currentNumber.slice(0, -1);
    updateDisplay();
}

function startCall() {
    if (currentNumber.trim() === '') return; // Don't call empty
    
    // Generate meeting password code
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const random6 = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    
    const meetingCode = `${year}-${month}-${day}-${hour}-${minute}-${random6}`;

    // Create a hidden link to open Zoom in a new tab, action=start to create a meeting
    const cleanNumber = currentNumber.replace(/[\s\D]/g, '');
    const zoomUrl = 'zoommtg://zoom.us/start?action=start&confno=' + cleanNumber;
    
    const hiddenLink = document.createElement('a');
    hiddenLink.href = zoomUrl;
    hiddenLink.target = '_blank';
    hiddenLink.style.display = 'none';
    
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    document.body.removeChild(hiddenLink);
    
    // Clear the dialer and show the meeting password
    setTimeout(() => {
        currentNumber = '';
        updateDisplay(); // clears standard UI
        
        // Show the generated code
        displayEl.textContent = `Code : ${meetingCode}`;
        displayEl.style.fontSize = '1.3rem'; // scale down text to fit the long code
        displayEl.style.color = '#10b981'; // Make it stand out in green
    }, 500);
}

function activateBotHold() {
    callStatusEl.innerHTML = "<span style='color: #6366f1; font-weight: 500;'>AI Bot Active:</span> Holding the line for you...";
    
    // Change pulse to bot colors (Indigo)
    pulseRings.forEach(r => r.style.background = 'rgba(99, 102, 241, 0.4)');
    
    // Change avatar to a bot icon
    avatarSvg.innerHTML = `
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8" y2="16"></line>
        <line x1="16" y1="16" x2="16" y2="16"></line>
    `;
    
    callSeconds = 0;
    clearInterval(callTimer);
    callTimer = setInterval(() => {
        callSeconds++;
        const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const secs = String(callSeconds % 60).padStart(2, '0');
        callStatusEl.innerHTML = `<span style='color: #6366f1; font-weight: 500;'>AI Bot Holding</span> • ${mins}:${secs}`;
    }, 1000);
}

function endCall() {
    clearInterval(callTimer);
    clearTimeout(holdTimer);
    callStatusEl.textContent = "Call Ended";
    
    setTimeout(() => {
        callingScreen.classList.remove('active');
        
        setTimeout(() => {
            dialerScreen.style.transform = 'scale(1)';
            dialerScreen.style.opacity = '1';
            currentNumber = '';
            updateDisplay();
            
            // Reset avatar to human for next call
            avatarSvg.innerHTML = `
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            `;
        }, 400);
    }, 1000);
}

function toggleMute(btn) {
    btn.classList.toggle('active-toggle');
}

// Support physical keyboard input
document.addEventListener('keydown', (e) => {
    // Don't register keyboard input if a call is already active
    if (callingScreen.classList.contains('active')) return;

    if (e.key >= '0' && e.key <= '9') {
        press(e.key);
    } else if (e.key === '*' || e.key === '#') {
        press(e.key);
    } else if (e.key === 'Backspace') {
        deleteChar();
    } else if (e.key === 'Enter') {
        startCall();
    }
});
