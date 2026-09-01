/**
 * alertshow.js - Custom Alert Flow System for NovaStream iOS App Setup
 */

function injectAlertStyles() {
    if (document.getElementById('custom-alert-styles')) return;
    const style = document.createElement('style');
    style.id = 'custom-alert-styles';
    style.textContent = `
        .custom-alert-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 1.5rem;
            animation: alertFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes alertFadeIn {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
        }

        .custom-alert-card {
            background: linear-gradient(145deg, #1e293b, #0f172a);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 20px;
            max-width: 440px;
            width: 100%;
            padding: 2rem 1.75rem 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.2);
            color: #f1f5f9;
            text-align: center;
            position: relative;
        }

        .custom-alert-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2));
            border: 1px solid rgba(56, 189, 248, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
            font-size: 1.6rem;
        }

        .custom-alert-msg {
            font-size: 1.05rem;
            line-height: 1.55;
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 1.75rem;
            word-break: break-word;
        }

        .custom-alert-msg .highlight-url {
            color: #38bdf8;
            font-weight: 700;
            background: rgba(56, 189, 248, 0.12);
            padding: 0.15rem 0.4rem;
            border-radius: 6px;
            border: 1px dashed rgba(56, 189, 248, 0.4);
            display: inline-block;
            margin-top: 0.4rem;
            user-select: all;
        }

        .notice-yellow {
            color: #facc15;
            font-weight: 900;
            font-size: 1.15rem;
            margin-top: 1rem;
            display: block;
            letter-spacing: 0.03em;
            text-shadow: 0 0 12px rgba(250, 204, 21, 0.4);
            line-height: 1.4;
        }

        .custom-alert-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
        }

        .custom-alert-btn {
            flex: 1;
            padding: 0.75rem 1.25rem;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            letter-spacing: 0.02em;
        }

        .custom-alert-btn-secondary {
            background: #334155;
            color: #cbd5e1;
        }

        .custom-alert-btn-secondary:hover {
            background: #475569;
            color: #ffffff;
        }

        .custom-alert-btn-primary {
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .custom-alert-btn-primary:hover {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
        }

        .custom-alert-btn-copy {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .custom-alert-btn-copy:hover {
            opacity: 0.95;
            transform: translateY(-1px);
        }

        .toast-notification {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: white;
            padding: 0.6rem 1.2rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.85rem;
            z-index: 100000;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            animation: toastUp 0.3s ease;
        }

        @keyframes toastUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
    `;
    document.head.appendChild(style);
}

function showToastMessage(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2500);
}

function copyToClipboard(text, btnElement) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (btnElement) btnElement.textContent = 'Copied! ✓';
            showToastMessage('Link copied to clipboard!');
            setTimeout(() => {
                if (btnElement) btnElement.textContent = 'Copy';
            }, 2000);
        }).catch(() => {
            fallbackCopy(text, btnElement);
        });
    } else {
        fallbackCopy(text, btnElement);
    }
}

function fallbackCopy(text, btnElement) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        if (btnElement) btnElement.textContent = 'Copied! ✓';
        showToastMessage('Link copied to clipboard!');
        setTimeout(() => {
            if (btnElement) btnElement.textContent = 'Copy';
        }, 2000);
    } catch (e) {
        alert('Copy failed. Manual copy: ' + text);
    }
    document.body.removeChild(input);
}

// Step 1: "Are you downloading the app ?" -> Answers: "No" (opens Mmusic.html) & "Yes" (goes to Step 2)
function showStep1() {
    injectAlertStyles();
    
    const existing = document.getElementById('custom-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.className = 'custom-alert-overlay';

    overlay.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-icon">📲</div>
            <div class="custom-alert-msg">Are you downloading the app ?</div>
            <div class="custom-alert-actions">
                <button class="custom-alert-btn custom-alert-btn-secondary" id="btn-no">No</button>
                <button class="custom-alert-btn custom-alert-btn-primary" id="btn-yes">Yes</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('btn-no').addEventListener('click', () => {
        overlay.remove();
        window.location.href = 'Mmusic.html';
    });

    document.getElementById('btn-yes').addEventListener('click', () => {
        overlay.remove();
        showStep2();
    });
}

// Step 2: "Are you in Safari ? If not , open Safari and type https://tinyurl.com/Novaappsetup in to the address bar. NOTICE : THE LINK LEADS TO THIS PAGE YOU ARE ON NOW"
// Only buttons: Copy and Continue
function showStep2() {
    injectAlertStyles();

    const existing = document.getElementById('custom-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.className = 'custom-alert-overlay';

    const setupUrl = 'https://tinyurl.com/Novaappsetup';

    overlay.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-icon">🧭</div>
            <div class="custom-alert-msg">
                Are you in Safari ? If not , open Safari and type <span class="highlight-url">${setupUrl}</span> in to the address bar.
                <span class="notice-yellow">NOTICE : THE LINK LEADS TO THIS PAGE YOU ARE ON NOW</span>
            </div>
            <div class="custom-alert-actions">
                <button class="custom-alert-btn custom-alert-btn-copy" id="btn-copy">Copy</button>
                <button class="custom-alert-btn custom-alert-btn-primary" id="btn-continue">Continue</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const copyBtn = document.getElementById('btn-copy');
    copyBtn.addEventListener('click', () => {
        copyToClipboard(setupUrl, copyBtn);
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
        overlay.remove();
        showStep3();
    });
}

// Step 3: "Press share in the top right corner of Safari , then press more on the bottom of the popup, then Add To Home Screen then Add. It should kick you out of the browser if you have done everything right."
function showStep3() {
    injectAlertStyles();

    const existing = document.getElementById('custom-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.className = 'custom-alert-overlay';

    overlay.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-icon">📤</div>
            <div class="custom-alert-msg">
                Press share in the top right corner of Safari , then press more on the bottom of the popup, then Add To Home Screen then Add. It should kick you out of the browser if you have done everything right.
            </div>
            <div class="custom-alert-actions">
                <button class="custom-alert-btn custom-alert-btn-primary" id="btn-finish">Got It</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('btn-finish').addEventListener('click', () => {
        overlay.remove();
    });
}

// Entry point function
function startAppSetupFlow() {
    showStep1();
}

// Auto-run when document is ready if loaded on Appsetup.html
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.toLowerCase().includes('appsetup')) {
            startAppSetupFlow();
        }
    });
} else {
    if (window.location.pathname.toLowerCase().includes('appsetup')) {
        startAppSetupFlow();
    }
}
