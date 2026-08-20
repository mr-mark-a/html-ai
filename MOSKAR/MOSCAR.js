// Moskar Browser Interactivity Engine

let tabs = [];
let activeTabId = null;
let tabCounter = 0;
const engines = ["Google", "Bing", "DuckDuckGo"];
let currentEngineIndex = 0;

// Initialize DevTools console logger
function logToConsole(message, type = 'info') {
    const consoleEl = document.getElementById('devtools-console');
    if (!consoleEl) return;
    
    const colors = {
        info: '#8b949e',
        success: '#27c93f',
        warning: '#ffbd2e',
        error: '#ff5f56'
    };
    
    const prefix = {
        info: '&gt; ',
        success: '✓ ',
        warning: '⚠ ',
        error: '✗ '
    };

    const time = new Date().toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.style.color = colors[type];
    logItem.style.marginBottom = '4px';
    logItem.innerHTML = `<span style="color: #6b7280; font-size: 0.75rem;">[${time}]</span> ${prefix[type]}${message}`;
    consoleEl.appendChild(logItem);
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Tab Class
class BrowserTab {
    constructor(id, title = "New Tab", url = "about:newtab") {
        this.id = id;
        this.title = title;
        this.url = url;
        this.history = [url];
        this.historyIndex = 0;
    }
}

// Setup Event Listeners
window.onload = () => {
    logToConsole("Initializing Moskar Web Engine...", "info");
    createNewTab();
    logToConsole("Browser initialized successfully.", "success");
};

// Create a New Tab
function createNewTab(url = "about:newtab", title = "New Tab") {
    tabCounter++;
    const tabId = `tab-${tabCounter}`;
    const newTab = new BrowserTab(tabId, title, url);
    tabs.push(newTab);
    
    // Create DOM Tab
    const tabWrapper = document.getElementById('tabs-wrapper');
    const tabEl = document.createElement('div');
    tabEl.className = 'tab';
    tabEl.id = `dom-tab-${tabId}`;
    tabEl.onclick = (e) => {
        if (e.target.classList.contains('tab-close') || e.target.parentElement.classList.contains('tab-close')) {
            return; // Don't switch if close button is clicked
        }
        switchTab(tabId);
    };
    
    tabEl.innerHTML = `
        <span class="tab-title" id="title-${tabId}">${title}</span>
        <span class="tab-close" onclick="closeTab('${tabId}')">✕</span>
    `;
    tabWrapper.appendChild(tabEl);

    // Create DOM Viewport Content Panel
    const viewport = document.getElementById('viewport');
    const contentEl = document.createElement('div');
    contentEl.className = 'tab-content';
    contentEl.id = `content-${tabId}`;
    viewport.appendChild(contentEl);

    switchTab(tabId);
    logToConsole(`Created new tab: ${tabId}`, "info");
}

// Switch to active tab
function switchTab(tabId) {
    activeTabId = tabId;
    
    // Update Tab Classes
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTabEl = document.getElementById(`dom-tab-${tabId}`);
    if (activeTabEl) activeTabEl.classList.add('active');

    // Update Viewport Panels
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const activeContentEl = document.getElementById(`content-${tabId}`);
    if (activeContentEl) activeContentEl.classList.add('active');

    // Update Address Bar & Nav Buttons
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        updateAddressBar(tab.url);
        updateNavButtons(tab);
        renderTabContent(tab);
    }
}

// Close a tab
function closeTab(tabId) {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    // Remove DOM elements
    document.getElementById(`dom-tab-${tabId}`).remove();
    document.getElementById(`content-${tabId}`).remove();

    tabs.splice(tabIndex, 1);
    logToConsole(`Closed tab: ${tabId}`, "info");

    // If no tabs remain, create a new one
    if (tabs.length === 0) {
        createNewTab();
    } else if (activeTabId === tabId) {
        // Switch to the nearest tab
        const nextActiveIndex = Math.min(tabIndex, tabs.length - 1);
        switchTab(tabs[nextActiveIndex].id);
    }
}

// Render simulation content inside active tab
function renderTabContent(tab) {
    const contentEl = document.getElementById(`content-${tab.id}`);
    if (!contentEl) return;

    if (tab.url === "about:newtab") {
        contentEl.innerHTML = `
            <div class="newtab-container">
                <div class="newtab-logo"><img src="../images on webpage/MOSKAR19473279854676457.JPG" alt="Moskar Logo"></div>
                <div class="newtab-subtitle">Experience a fluid, simulated environment built with precision</div>
                
                <div class="newtab-search">
                    <div class="address-bar-container" style="max-width: 580px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                        <input type="text" class="address-input" placeholder="Search Google or enter a query..." onkeydown="handleNewTabSearch(event, this)">
                        <div class="engine-selector">
                            <span>Google</span>
                        </div>
                    </div>
                </div>

                <div class="newtab-shortcuts">
                    <div class="shortcut-card" onclick="navigateTo('https://www.google.com')">
                        <div class="shortcut-icon">🔍</div>
                        <div class="shortcut-title">Google</div>
                    </div>
                    <div class="shortcut-card" onclick="navigateTo('https://wikipedia.org')">
                        <div class="shortcut-icon">📖</div>
                        <div class="shortcut-title">Wikipedia</div>
                    </div>
                    <div class="shortcut-card" onclick="navigateTo('https://github.com')">
                        <div class="shortcut-icon">🐙</div>
                        <div class="shortcut-title">GitHub</div>
                    </div>
                    <div class="shortcut-card" onclick="navigateTo('https://news.ycombinator.com')">
                        <div class="shortcut-icon">🧡</div>
                        <div class="shortcut-title">Hacker News</div>
                    </div>
                </div>
            </div>
        `;
    } else if (tab.url.startsWith("https://www.google.com/search")) {
        const urlObj = new URL(tab.url);
        const query = urlObj.searchParams.get("q") || "Web Search";
        document.getElementById(`title-${tab.id}`).innerText = `${query} - Google Search`;
        
        contentEl.innerHTML = `
            <div class="simulated-page simulated-google">
                <div class="google-header">
                    <div class="google-logo-small">
                        <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
                    </div>
                    <div class="google-search-container">
                        <input type="text" value="${query}" onkeydown="if(event.key === 'Enter') navigateTo('https://www.google.com/search?q=' + encodeURIComponent(this.value))">
                    </div>
                </div>
                <div class="google-results-body">
                    <div class="google-stat">About 1,820,000 results (0.34 seconds)</div>
                    
                    <div class="google-result-item">
                        <div class="google-result-url">https://github.com › moskar</div>
                        <a class="google-result-title" onclick="navigateTo('https://github.com')">Moskar Web Browser Emulator - GitHub</a>
                        <div class="google-result-snippet">A premium web emulator framework for visualizing browser concepts, custom tab management, address bar query auto-routing, and console utilities.</div>
                    </div>

                    <div class="google-result-item">
                        <div class="google-result-url">https://wikipedia.org › wiki › Perl</div>
                        <a class="google-result-title" onclick="navigateTo('https://wikipedia.org')">Perl - Wikipedia</a>
                        <div class="google-result-snippet">Perl is a family of two high-level, general-purpose, interpreted, dynamic programming languages. Perl was originally developed by Larry Wall in 1987...</div>
                    </div>

                    <div class="google-result-item">
                        <div class="google-result-url">https://ycombinator.com › hackernews</div>
                        <a class="google-result-title" onclick="navigateTo('https://news.ycombinator.com')">Hacker News</a>
                        <div class="google-result-snippet">A social news website focusing on computer science and entrepreneurship. It is run by the investment fund and startup incubator Y Combinator.</div>
                    </div>

                    <div class="google-result-item">
                        <div class="google-result-url">https://google.com</div>
                        <a class="google-result-title" onclick="navigateTo('https://www.google.com')">Google Search Page</a>
                        <div class="google-result-snippet">Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.</div>
                    </div>
                </div>
            </div>
        `;
    } else if (tab.url.includes("wikipedia.org")) {
        document.getElementById(`title-${tab.id}`).innerText = "Wikipedia, the free encyclopedia";
        contentEl.innerHTML = `
            <div class="simulated-page" style="background-color: #ffffff; padding: 40px; font-family: sans-serif;">
                <div style="border-bottom: 1px solid #a2a9b1; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="font-size: 2.2rem; font-family: serif; font-weight: normal;">Wikipedia</h1>
                    <span style="font-size: 0.85rem; color: #54595d;">The Free Encyclopedia</span>
                </div>
                <div style="max-width: 800px; line-height: 1.6; color: #202122;">
                    <p style="font-size: 1.1rem; margin-bottom: 16px;">Welcome to the simulated Wikipedia encyclopedia portal.</p>
                    <p style="margin-bottom: 16px;"><strong>Perl</strong> is a high-level, general-purpose, interpreted, dynamic programming language. It is commonly used for system administration, web development, network programming, and GUI development.</p>
                    <p style="margin-bottom: 16px;">The user-requested Perl backend <span style="font-family: monospace; background: #eaecf0; padding: 2px 4px; border-radius: 4px;">MOSKAR-Web-Managment.pl</span> operates in tandem with this client simulator to orchestrate modern web page retrieval and automated execution of browser tasks.</p>
                </div>
            </div>
        `;
    } else if (tab.url.includes("github.com")) {
        document.getElementById(`title-${tab.id}`).innerText = "GitHub: Let’s build from here";
        contentEl.innerHTML = `
            <div class="simulated-page" style="background-color: #0d1117; color: #c9d1d9; padding: 40px; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #21262d; padding-bottom: 20px; margin-bottom: 20px;">
                    <div style="font-size: 1.5rem; font-weight: 600; color: #f0f6fc; display: flex; align-items: center; gap: 8px;">
                        <span>🐙 GitHub</span>
                    </div>
                    <span style="font-size: 0.85rem; padding: 4px 12px; background: #21262d; border-radius: 12px; color: #8b949e; border: 1px solid #30363d;">Sign In</span>
                </div>
                <div style="max-width: 600px; display: flex; flex-direction: column; gap: 16px;">
                    <h2 style="font-size: 2rem; color: #f0f6fc; font-weight: 500; line-height: 1.25;">Let's build from here</h2>
                    <p style="color: #8b949e; font-size: 1.1rem; line-height: 1.5;">The world's leading AI-powered developer platform. Complete developer automation and premium management dashboards.</p>
                    <div style="padding: 16px; background-color: #161b22; border: 1px solid #30363d; border-radius: 6px;">
                        <span style="color: #58a6ff; font-weight: 600;">html-ai / MOSKAR-Browser</span>
                        <div style="font-size: 0.85rem; color: #8b949e; margin-top: 8px;">Premium web engine emulator and Perl automation console interface. Ready for active prototyping.</div>
                    </div>
                </div>
            </div>
        `;
    } else if (tab.url.includes("google.com")) {
        document.getElementById(`title-${tab.id}`).innerText = "Google";
        contentEl.innerHTML = `
            <div class="simulated-page simulated-google" style="align-items: center; justify-content: center; gap: 24px; padding-bottom: 15%;">
                <div class="google-logo-small" style="font-size: 5rem; letter-spacing: -2px;">
                    <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
                </div>
                <div class="google-search-container" style="max-width: 580px; width: 100%; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    <input type="text" placeholder="Search Google or type a URL" onkeydown="if(event.key === 'Enter') navigateTo('https://www.google.com/search?q=' + encodeURIComponent(this.value))">
                </div>
                <div style="display: flex; gap: 12px;">
                    <button style="padding: 10px 16px; border: 1px solid #f8f9fa; background-color: #f8f9fa; border-radius: 4px; color: #3c4043; font-size: 0.9rem; cursor: pointer;">Google Search</button>
                    <button style="padding: 10px 16px; border: 1px solid #f8f9fa; background-color: #f8f9fa; border-radius: 4px; color: #3c4043; font-size: 0.9rem; cursor: pointer;">I'm Feeling Lucky</button>
                </div>
            </div>
        `;
    } else {
        // Real URL Iframe fallback with message about X-Frame-Options
        document.getElementById(`title-${tab.id}`).innerText = tab.url;
        contentEl.innerHTML = `
            <div style="display: flex; flex-direction: column; width: 100%; height: 100%; background: #1f2430;">
                <div style="padding: 12px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Attempting connection to remote client...</span>
                    <button onclick="navigateTo('https://www.google.com/search?q=${encodeURIComponent(tab.url)}')" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.05); color: white; cursor: pointer;">Search instead</button>
                </div>
                <iframe src="${tab.url}" class="real-iframe"></iframe>
            </div>
        `;
    }
}

// Navigation and URL processing
function handleAddressInput(event) {
    if (event.key === 'Enter') {
        const val = event.target.value.trim();
        if (val) {
            navigateTo(val);
        }
    }
}

function handleNewTabSearch(event, inputEl) {
    if (event.key === 'Enter') {
        const val = inputEl.value.trim();
        if (val) {
            navigateTo(val);
        }
    }
}

function navigateTo(target) {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    // Stay inside the emulator only for the home/newtab page
    if (target === 'about:newtab') {
        tab.url = 'about:newtab';
        tab.history.push('about:newtab');
        tab.historyIndex = tab.history.length - 1;
        updateAddressBar('about:newtab');
        updateNavButtons(tab);
        renderTabContent(tab);
        return;
    }

    let url = target;
    const isUrlPattern = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6})([/\w\.-]*)*\/?$/i.test(target);

    if (!isUrlPattern) {
        // Treat as a search query — build real search engine URL
        const currentEngine = engines[currentEngineIndex];
        if (currentEngine === "Google") {
            url = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
        } else if (currentEngine === "Bing") {
            url = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
        } else {
            url = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
        }
        logToConsole(`🔍 Searching "${target}" on ${currentEngine} (real web)`, "success");
    } else {
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            url = 'https://' + target;
        }
        logToConsole(`🌐 Opening real URL: ${url}`, "success");
    }

    // Render the real URL inside the emulator via iframe
    renderIframePage(tab, url);

}

// Opens the URL in the user's current browser (new tab) and shows a status card inside the emulator.
function renderIframePage(tab, url) {
    const contentEl = document.getElementById(`content-${tab.id}`);
    if (!contentEl) return;

    updateAddressBar(url);
    document.getElementById(`title-${tab.id}`).innerText = url;
    tab.url = url;
    tab.history.push(url);
    tab.historyIndex = tab.history.length - 1;
    updateNavButtons(tab);

    let domain = url;
    try { domain = new URL(url).hostname; } catch(e) {}

    const isSearch = url.includes('/search?q=') || url.includes('bing.com/search') || url.includes('duckduckgo.com/?q=');
    const searchQuery = isSearch ? decodeURIComponent((url.match(/[?&]q=([^&]+)/) || ['',''])[1]) : '';
    const label = isSearch ? `Searching “${searchQuery}”` : domain;
    const icon = isSearch ? '🔍' : '🌐';

    // Open the page in the user's current browser
    window.open(url, '_blank');
    logToConsole(`${icon} Opened in browser: ${url}`, 'success');

    // Show a clean confirmation card inside the emulator viewport
    contentEl.innerHTML = `
        <div style="
            width: 100%; height: 100%;
            background: radial-gradient(ellipse at 25% 25%, #101624 0%, #080b10 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 22px; text-align: center; padding: 40px;
            font-family: var(--font-display);
        ">
            <img src="../images on webpage/MOSKAR19473279854676457.JPG"
                style="width: 64px; height: 64px; border-radius: 12px;
                       box-shadow: 0 0 24px rgba(30,136,229,0.5);
                       animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);">

            <div style="display:flex; flex-direction:column; gap:6px; max-width: 460px;">
                <h2 style="font-size: 1.4rem; font-weight: 700; color: #f0f4fa;">${label}</h2>
                <p style="color: #6b7280; font-size: 0.95rem; line-height: 1.5;">
                    Opened in your browser. Switch to the new tab to view it.
                </p>
            </div>

            <div style="display:flex; align-items:center; gap:8px; padding: 8px 16px;
                border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
                background: rgba(255,255,255,0.03); color: #6b7280;
                font-size: 0.78rem; max-width: 520px; word-break: break-all;">
                <span>🔗</span><span style="color: #60a5fa;">${url}</span>
            </div>

            <div style="display:flex; gap:10px;">
                <button onclick="window.open('${url.replace(/'/g,'\\&apos;')}','_blank')" style="
                    padding: 9px 20px; border-radius: 9px; border: none;
                    background: #1e88e5; color: white; cursor: pointer;
                    font-size: 0.88rem; font-weight: 600; font-family: inherit;
                    box-shadow: 0 4px 14px rgba(30,136,229,0.35);
                ">Open Again ↗</button>
                <button onclick="goHome()" style="
                    padding: 9px 20px; border-radius: 9px;
                    border: 1px solid rgba(255,255,255,0.09);
                    background: rgba(255,255,255,0.04);
                    color: #c9d1d9; cursor: pointer; font-size: 0.88rem; font-family: inherit;
                ">🏠 Home</button>
            </div>

            <style>
                @keyframes popIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
            </style>
        </div>
    `;
}

function goBack() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.historyIndex > 0) {
        tab.historyIndex--;
        tab.url = tab.history[tab.historyIndex];
        updateAddressBar(tab.url);
        updateNavButtons(tab);
        if (tab.url === 'about:newtab') {
            renderTabContent(tab);
        } else {
            renderIframePage(tab, tab.url);
        }
        logToConsole("Navigated back", "info");
    }
}

function goForward() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.historyIndex < tab.history.length - 1) {
        tab.historyIndex++;
        tab.url = tab.history[tab.historyIndex];
        updateAddressBar(tab.url);
        updateNavButtons(tab);
        if (tab.url === 'about:newtab') {
            renderTabContent(tab);
        } else {
            renderIframePage(tab, tab.url);
        }
        logToConsole("Navigated forward", "info");
    }
}

function reloadTab() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        logToConsole(`Reloading: ${tab.url}`, "info");
        if (tab.url === 'about:newtab') {
            renderTabContent(tab);
        } else {
            renderIframePage(tab, tab.url);
        }
    }
}

function goHome() {
    navigateTo("about:newtab");
}

function updateAddressBar(url) {
    const input = document.getElementById('address-input');
    if (input) {
        input.value = url === "about:newtab" ? "" : url;
    }
}

function updateNavButtons(tab) {
    document.getElementById('back-btn').disabled = tab.historyIndex === 0;
    document.getElementById('forward-btn').disabled = tab.historyIndex === tab.history.length - 1;
}

// DevTools
function toggleDevTools() {
    const devtools = document.getElementById('devtools-panel');
    const isVisible = devtools.style.display === 'flex';
    devtools.style.display = isVisible ? 'none' : 'flex';
    logToConsole(isVisible ? "Closed developer tools" : "Opened developer tools", "info");
}

// Cycle search engine
function cycleEngine() {
    currentEngineIndex = (currentEngineIndex + 1) % engines.length;
    document.getElementById('engine-name').innerText = engines[currentEngineIndex];
    logToConsole(`Changed search engine to ${engines[currentEngineIndex]}`, "success");
}

// Toggle Light/Dark Theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    logToConsole(`Switched UI theme to ${newTheme}`, "info");
}
