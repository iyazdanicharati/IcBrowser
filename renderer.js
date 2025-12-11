// Tab Manager
class TabManager {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.tabCounter = 0;
    this.saveSessionTimeout = null;
  }

  createTab(url = null) {
    const tabId = ++this.tabCounter;
    const homepage = config?.company?.homepage || 'https://www.google.com';
    const initialUrl = url || homepage;

    const tab = {
      id: tabId,
      url: initialUrl,
      title: 'New Tab',
      loading: false,
      webview: null,
      tabElement: null,
      containerElement: null
    };

    this.tabs.push(tab);
    this.renderTab(tab);
    this.switchToTab(tabId);
    // Save session when new tab is created
    this.saveSession();
    return tab;
  }

  renderTab(tab) {
    const tabsContainer = document.getElementById('tabsContainer');
    const webviewContainer = document.getElementById('webviewContainer');

    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab';
    tabBtn.dataset.tabId = tab.id;
    tabBtn.innerHTML = `
      <span class="tab-spinner"></span>
      <span class="tab-title">${tab.title}</span>
      <span class="tab-close">×</span>
    `;

    // Tab click handler
    tabBtn.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close')) {
        e.stopPropagation();
        this.closeTab(tab.id);
      } else {
        this.switchToTab(tab.id);
      }
    });

    // Create webview container
    const webviewTab = document.createElement('div');
    webviewTab.className = 'webview-tab';
    webviewTab.dataset.tabId = tab.id;
    webviewTab.innerHTML = '<div class="tab-loading">Loading...</div>';

    // Create webview
    const webview = document.createElement('webview');
    webview.src = tab.url;
    webview.setAttribute('allowpopups', '');
    webview.style.width = '100%';
    webview.style.height = '100%';
    webview.style.display = 'inline-flex';
    webview.style.outline = 'none';
    webview.style.border = 'none';

    webviewTab.appendChild(webview);
    webviewContainer.appendChild(webviewTab);

    // Insert tab button before new tab button
    const newTabBtn = document.getElementById('newTabBtn');
    if (newTabBtn) {
      tabsContainer.insertBefore(tabBtn, newTabBtn);
    } else {
      tabsContainer.appendChild(tabBtn);
    }

    tab.tabElement = tabBtn;
    tab.containerElement = webviewTab;
    tab.webview = webview;

    // Setup webview event listeners
    this.setupWebviewEvents(tab);
  }

  setupWebviewEvents(tab) {
    const { webview, containerElement, tabElement } = tab;
    const loadingIndicator = containerElement.querySelector('.tab-loading');
    const statusBar = document.getElementById('statusBar');

    webview.addEventListener('did-start-loading', () => {
      tab.loading = true;
      tabElement.classList.add('loading');
      loadingIndicator.style.display = 'block';
      
      if (tab.id === this.activeTabId) {
        this.updateNavButtons();
        statusBar.className = 'status-bar loading';
      }
    });

    webview.addEventListener('did-stop-loading', () => {
      tab.loading = false;
      tabElement.classList.remove('loading');
      loadingIndicator.style.display = 'none';
      
      if (tab.id === this.activeTabId) {
        this.updateNavButtons();
        urlBar.value = webview.getURL();
        // Show success state briefly, then reset
        statusBar.className = 'status-bar success';
        setTimeout(() => {
          if (statusBar.className === 'status-bar success') {
            statusBar.className = 'status-bar';
          }
        }, 500);
      }
    });

    webview.addEventListener('did-fail-load', (e) => {
      tab.loading = false;
      tabElement.classList.remove('loading');
      loadingIndicator.style.display = 'none';
      
      if (tab.id === this.activeTabId) {
        statusBar.className = 'status-bar error';
        setTimeout(() => {
          if (statusBar.className === 'status-bar error') {
            statusBar.className = 'status-bar';
          }
        }, 2000);
      }
    });

    webview.addEventListener('did-navigate', (e) => {
      tab.url = e.url;
      if (tab.id === this.activeTabId) {
        urlBar.value = e.url;
        this.updateNavButtons();
      }
      // Save session when URL changes
      this.saveSession();
    });

    webview.addEventListener('did-navigate-in-page', (e) => {
      tab.url = e.url;
      if (tab.id === this.activeTabId) {
        urlBar.value = e.url;
        this.updateNavButtons();
      }
    });

    webview.addEventListener('page-title-updated', (e) => {
      tab.title = e.title || 'New Tab';
      const titleSpan = tabElement.querySelector('.tab-title');
      titleSpan.textContent = tab.title.length > 20 ? tab.title.substring(0, 20) + '...' : tab.title;
      
      if (tab.id === this.activeTabId) {
        const companyName = config?.company?.name || 'IcBrows';
        document.title = tab.title + ' - ' + companyName;
      }
      // Save session when title changes
      this.saveSession();
    });

    webview.addEventListener('dom-ready', () => {
      if (tab.id === this.activeTabId) {
        urlBar.value = webview.getURL();
        this.updateNavButtons();
        webview.focus();
      }
    });
  }

  switchToTab(tabId) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (!tab) return;

    const statusBar = document.getElementById('statusBar');

    // Update active states
    this.tabs.forEach(t => {
      t.tabElement.classList.remove('active');
      t.containerElement.classList.remove('active');
    });

    tab.tabElement.classList.add('active');
    tab.containerElement.classList.add('active');
    this.activeTabId = tabId;

    // Update URL bar and navigation buttons
    urlBar.value = tab.url || '';
    this.updateNavButtons();

    // Update status bar based on tab loading state
    if (tab.loading) {
      statusBar.className = 'status-bar loading';
    } else {
      statusBar.className = 'status-bar';
    }

    // Focus webview and ensure it can receive keyboard input
    setTimeout(() => {
      if (tab.webview) {
        tab.webview.focus();
        // Ensure webview is ready to receive input
        try {
          tab.webview.executeJavaScript(`
            document.addEventListener('click', function() {
              document.body.focus();
            }, true);
          `);
        } catch (e) {
          // Ignore errors
        }
      }
    }, 100);

    // Update document title
    const companyName = config?.company?.name || 'IcBrows';
    document.title = tab.title + ' - ' + companyName;
    
    // Save session when switching tabs
    this.saveSession();
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    // If this is the last tab, create a new one first, then close this one
    if (this.tabs.length === 1) {
      const homepage = config?.company?.homepage || 'https://www.google.com';
      this.createTab(homepage);
      // Small delay to ensure new tab is created before closing
      setTimeout(() => {
        const tab = this.tabs[tabIndex];
        if (tab && tab.tabElement) {
          tab.tabElement.remove();
        }
        if (tab && tab.containerElement) {
          tab.containerElement.remove();
        }
        this.tabs.splice(tabIndex, 1);
        // Ensure we have an active tab
        if (this.tabs.length > 0 && this.activeTabId === tabId) {
          this.switchToTab(this.tabs[0].id);
        }
        this.saveSession();
      }, 50);
      return;
    }

    const tab = this.tabs[tabIndex];
    
    // Remove elements
    if (tab.tabElement) {
      tab.tabElement.remove();
    }
    if (tab.containerElement) {
      tab.containerElement.remove();
    }

    // Remove from array
    this.tabs.splice(tabIndex, 1);

    // Switch to another tab
    if (this.activeTabId === tabId) {
      // Determine which tab to switch to
      let newActiveIndex;
      if (tabIndex >= this.tabs.length) {
        // Closed the last tab, switch to previous
        newActiveIndex = this.tabs.length - 1;
      } else {
        // Switch to tab at same position (which is now the next tab)
        newActiveIndex = tabIndex;
      }
      
      if (newActiveIndex >= 0 && newActiveIndex < this.tabs.length) {
        this.switchToTab(this.tabs[newActiveIndex].id);
      } else if (this.tabs.length > 0) {
        // Fallback to first tab
        this.switchToTab(this.tabs[0].id);
      }
    }

    this.saveSession();
  }

  getActiveTab() {
    return this.tabs.find(t => t.id === this.activeTabId);
  }

  updateNavButtons() {
    const activeTab = this.getActiveTab();
    if (!activeTab || !activeTab.webview) {
      backBtn.disabled = true;
      forwardBtn.disabled = true;
      return;
    }

    backBtn.disabled = !activeTab.webview.canGoBack();
    forwardBtn.disabled = !activeTab.webview.canGoForward();
  }

  // Save session (tabs and active tab) with debouncing
  async saveSession() {
    // Debounce session saving to avoid too many writes
    if (this.saveSessionTimeout) {
      clearTimeout(this.saveSessionTimeout);
    }
    
    this.saveSessionTimeout = setTimeout(async () => {
      try {
        const session = {
          tabs: this.tabs.map(tab => ({
            url: tab.url || tab.webview?.getURL() || '',
            title: tab.title || 'New Tab'
          })),
          activeTabIndex: this.tabs.findIndex(t => t.id === this.activeTabId)
        };
        
        await window.electronAPI.saveSession(session);
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }, 500); // Wait 500ms before saving
  }

  // Restore session
  async restoreSession() {
    try {
      const session = await window.electronAPI.loadSession();
      
      if (session && session.tabs && session.tabs.length > 0) {
        // Clear any existing tabs
        this.tabs.forEach(tab => {
          if (tab.tabElement) tab.tabElement.remove();
          if (tab.containerElement) tab.containerElement.remove();
        });
        this.tabs = [];
        this.activeTabId = null;

        // Restore tabs
        for (let i = 0; i < session.tabs.length; i++) {
          const tabData = session.tabs[i];
          const url = tabData.url && tabData.url.trim() ? tabData.url.trim() : null;
          const tab = this.createTab(url);
          tab.title = tabData.title || 'New Tab';
          
          // Update tab title in UI immediately
          if (tab.tabElement) {
            const titleSpan = tab.tabElement.querySelector('.tab-title');
            if (titleSpan) {
              titleSpan.textContent = tab.title.length > 20 ? tab.title.substring(0, 20) + '...' : tab.title;
            }
          }
        }

        // Switch to active tab after a short delay to ensure webviews are ready
        setTimeout(() => {
          const activeIndex = session.activeTabIndex >= 0 && session.activeTabIndex < this.tabs.length 
            ? session.activeTabIndex 
            : 0;
          
          if (this.tabs.length > 0 && this.tabs[activeIndex]) {
            this.switchToTab(this.tabs[activeIndex].id);
          }
        }, 100);
        
        return true;
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    }
    return false;
  }
}

// Initialize tab manager
const tabManager = new TabManager();

// DOM Elements
const urlBar = document.getElementById('urlBar');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const goBtn = document.getElementById('goBtn');
const settingsBtn = document.getElementById('settingsBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsForm = document.getElementById('settingsForm');
const tabsContainer = document.getElementById('tabsContainer');

let config = null;
let dnsServers = [];
let localDomains = [];

// Create new tab button
const newTabBtn = document.createElement('button');
newTabBtn.className = 'new-tab-btn';
newTabBtn.id = 'newTabBtn';
newTabBtn.textContent = '+';
newTabBtn.title = 'New Tab (Ctrl+T)';
newTabBtn.addEventListener('click', () => {
  tabManager.createTab();
});
tabsContainer.appendChild(newTabBtn);

// Load configuration on startup
async function loadConfig() {
  try {
    config = await window.electronAPI.getConfig();
    applyConfig();
    
    // Try to restore session, if fails create new tab
    const sessionRestored = await tabManager.restoreSession();
    if (!sessionRestored) {
      // Create initial tab after config is loaded
      tabManager.createTab();
    }
  } catch (error) {
    console.error('Error loading config:', error);
    // Apply default font even if config fails
    applyFontFamily();
    // Create initial tab even if config fails
    tabManager.createTab();
  }
}

// Listen for save session before quit
window.addEventListener('save-session-before-quit', () => {
  tabManager.saveSession();
});

// Apply configuration to UI
function applyConfig() {
  if (!config) return;

  // Update title
  if (config.company && config.company.name) {
    document.title = config.company.name;
  }

  // Apply font family
  applyFontFamily();
}

// Apply font family to UI
function applyFontFamily() {
  if (!config) {
    config = { ui: { fontFamily: 'system' } };
  }
  
  const fontFamily = config?.ui?.fontFamily || 'system';
  let fontValue = '';
  
  if (fontFamily === 'system') {
    fontValue = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
  } else {
    fontValue = `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  }
  
  document.body.style.fontFamily = fontValue;
}

// Resolve local domain if configured
async function resolveLocalDomain(hostname) {
  if (!config || !config.dns || !config.dns.localDomains || !config.dns.localDomains.enabled) {
    return null;
  }

  try {
    const ip = await window.electronAPI.resolveLocalDomain(hostname);
    return ip;
  } catch (error) {
    console.error('Error resolving local domain:', error);
    return null;
  }
}

// Navigate to URL
async function navigateToUrl(url) {
  const activeTab = tabManager.getActiveTab();
  if (!activeTab) return;

  let finalUrl = url.trim();
  
  // Check if it's a local domain
  if (!finalUrl.match(/^https?:\/\//i)) {
    const hostname = finalUrl.split('/')[0].split(':')[0];
    const localIp = await resolveLocalDomain(hostname);
    
    if (localIp) {
      finalUrl = finalUrl.replace(hostname, localIp);
      if (!finalUrl.match(/^https?:\/\//i)) {
        finalUrl = 'http://' + finalUrl;
      }
    } else {
      // Add protocol if missing
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // Treat as search query
        finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(finalUrl);
      }
    }
  }
  
  activeTab.webview.src = finalUrl;
}

// Settings Modal Functions
function openSettings() {
  settingsModal.classList.add('active');
  loadSettingsIntoForm();
}

function closeSettings() {
  settingsModal.classList.remove('active');
}

function loadSettingsIntoForm() {
  if (!config) return;

  // DNS Settings
  document.getElementById('dnsEnabled').checked = config.dns?.enabled || false;
  document.getElementById('dohEnabled').checked = config.dns?.doh?.enabled || false;
  
  // DNS Servers
  dnsServers = config.dns?.servers || [];
  renderDnsServers();

  // DoH Provider
  const dohProvider = config.dns?.doh?.provider || 'cloudflare';
  document.getElementById('dohProvider').value = dohProvider;
  if (dohProvider === 'custom' && config.dns?.doh?.url) {
    document.getElementById('dohCustomUrl').value = config.dns.doh.url;
    document.getElementById('dohCustomUrl').style.display = 'block';
  }

  // Local Domains
  document.getElementById('localDomainsEnabled').checked = config.dns?.localDomains?.enabled || false;
  localDomains = config.dns?.localDomains?.domains ? Object.entries(config.dns.localDomains.domains) : [];
  renderLocalDomains();

  // Company Settings
  document.getElementById('companyName').value = config.company?.name || '';
  document.getElementById('homepage').value = config.company?.homepage || '';
  
  // Bookmarks
  if (config.company?.bookmarks && config.company.bookmarks.length > 0) {
    const bookmarksText = config.company.bookmarks.map(b => `${b.name}|${b.url}`).join('\n');
    document.getElementById('bookmarks').value = bookmarksText;
  }

  // UI Settings
  document.getElementById('fontFamily').value = config.ui?.fontFamily || 'system';
}

function renderDnsServers() {
  const container = document.getElementById('dnsServersList');
  container.innerHTML = '';
  
  dnsServers.forEach((server, index) => {
    const item = document.createElement('div');
    item.className = 'dns-server-item';
    item.innerHTML = `
      <input type="text" value="${server}" data-index="${index}" placeholder="DNS Server IP">
      <button type="button" class="remove-btn" onclick="removeDnsServer(${index})">Remove</button>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      dnsServers[index] = e.target.value;
    });
  });
}

function addDnsServer() {
  dnsServers.push('');
  renderDnsServers();
}

function removeDnsServer(index) {
  dnsServers.splice(index, 1);
  renderDnsServers();
}

function renderLocalDomains() {
  const container = document.getElementById('localDomainsList');
  container.innerHTML = '';
  
  localDomains.forEach(([domain, ip], index) => {
    const item = document.createElement('div');
    item.className = 'local-domain-item';
    item.innerHTML = `
      <input type="text" value="${domain}" data-index="${index}" data-field="domain" placeholder="Domain (e.g., server.local)">
      <input type="text" value="${ip}" data-index="${index}" data-field="ip" placeholder="IP Address">
      <button type="button" class="remove-btn" onclick="removeLocalDomain(${index})">Remove</button>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      const field = e.target.dataset.field;
      if (!localDomains[index]) {
        localDomains[index] = ['', ''];
      }
      localDomains[index][field === 'domain' ? 0 : 1] = e.target.value;
    });
  });
}

function addLocalDomain() {
  localDomains.push(['', '']);
  renderLocalDomains();
}

function removeLocalDomain(index) {
  localDomains.splice(index, 1);
  renderLocalDomains();
}

// Make functions globally available for onclick handlers
window.removeDnsServer = removeDnsServer;
window.addDnsServer = addDnsServer;
window.removeLocalDomain = removeLocalDomain;
window.addLocalDomain = addLocalDomain;

// Save settings
async function saveSettings(e) {
  e.preventDefault();

  const dnsEnabled = document.getElementById('dnsEnabled').checked;
  const dohEnabled = document.getElementById('dohEnabled').checked;
  const dohProvider = document.getElementById('dohProvider').value;
  const dohCustomUrl = document.getElementById('dohCustomUrl').value;
  const localDomainsEnabled = document.getElementById('localDomainsEnabled').checked;

  let dohUrl = '';
  if (dohProvider === 'custom') {
    dohUrl = dohCustomUrl;
  } else {
    const dohUrls = {
      cloudflare: 'https://cloudflare-dns.com/dns-query',
      google: 'https://dns.google/dns-query',
      quad9: 'https://dns.quad9.net/dns-query'
    };
    dohUrl = dohUrls[dohProvider] || dohUrls.cloudflare;
  }

  const localDomainsObj = {};
  localDomains.forEach(([domain, ip]) => {
    if (domain && ip) {
      localDomainsObj[domain] = ip;
    }
  });

  const bookmarksText = document.getElementById('bookmarks').value;
  const bookmarks = [];
  if (bookmarksText) {
    bookmarksText.split('\n').forEach(line => {
      const parts = line.split('|');
      if (parts.length === 2) {
        bookmarks.push({
          name: parts[0].trim(),
          url: parts[1].trim()
        });
      }
    });
  }

  const updates = {
    dns: {
      enabled: dnsEnabled,
      servers: dnsServers.filter(s => s.trim()),
      doh: {
        enabled: dohEnabled,
        provider: dohProvider,
        url: dohUrl
      },
      localDomains: {
        enabled: localDomainsEnabled,
        domains: localDomainsObj
      }
    },
    company: {
      name: document.getElementById('companyName').value,
      homepage: document.getElementById('homepage').value,
      bookmarks: bookmarks
    },
    ui: {
      fontFamily: document.getElementById('fontFamily').value
    }
  };

    try {
    await window.electronAPI.updateConfig(updates);
    config = await window.electronAPI.getConfig();
    applyConfig();
    alert('Settings saved! UI changes applied immediately. Restart the browser for DNS changes to take effect.');
    closeSettings();
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings: ' + error.message);
  }
}

// Event listeners
backBtn.addEventListener('click', () => {
  const activeTab = tabManager.getActiveTab();
  if (activeTab && activeTab.webview) {
    activeTab.webview.goBack();
  }
});

forwardBtn.addEventListener('click', () => {
  const activeTab = tabManager.getActiveTab();
  if (activeTab && activeTab.webview) {
    activeTab.webview.goForward();
  }
});

reloadBtn.addEventListener('click', () => {
  const activeTab = tabManager.getActiveTab();
  if (activeTab && activeTab.webview) {
    activeTab.webview.reload();
  }
});

goBtn.addEventListener('click', () => {
  navigateToUrl(urlBar.value);
});

urlBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    navigateToUrl(urlBar.value);
  }
});

urlBar.addEventListener('focus', () => {
  urlBar.select();
});

settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
settingsForm.addEventListener('submit', saveSettings);

// Window control event listeners
minimizeBtn.addEventListener('click', () => {
  window.electronAPI.windowMinimize();
});

maximizeBtn.addEventListener('click', async () => {
  await window.electronAPI.windowMaximize();
  updateMaximizeButton();
});

closeBtn.addEventListener('click', () => {
  window.electronAPI.windowClose();
});

async function updateMaximizeButton() {
  const isMaximized = await window.electronAPI.windowIsMaximized();
  maximizeBtn.textContent = isMaximized ? '❐' : '□';
}

setInterval(updateMaximizeButton, 500);

// Listen for global shortcuts from main process
window.addEventListener('focus-url-bar', () => {
  urlBar.focus();
  urlBar.select();
});

window.addEventListener('reload-page', () => {
  const activeTab = tabManager.getActiveTab();
  if (activeTab && activeTab.webview) {
    activeTab.webview.reload();
  }
});

// Global keyboard shortcuts - only trigger when not typing in inputs
document.addEventListener('keydown', (e) => {
  // Don't interfere if user is typing in an input, textarea, or contenteditable element
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable ||
    activeElement.closest('webview')
  );

  // Allow shortcuts even when URL bar is focused (for navigation)
  const isUrlBar = activeElement === urlBar;

  // Ctrl+T or Cmd+T: New tab (always allow)
  if ((e.ctrlKey || e.metaKey) && e.key === 't' && !isInputFocused) {
    e.preventDefault();
    tabManager.createTab();
    return;
  }

  // Ctrl+W or Cmd+W: Close tab (always allow)
  if ((e.ctrlKey || e.metaKey) && e.key === 'w' && !isInputFocused) {
    e.preventDefault();
    const activeTab = tabManager.getActiveTab();
    if (activeTab) {
      tabManager.closeTab(activeTab.id);
    }
    return;
  }

  // Ctrl+Tab or Ctrl+PageDown: Next tab (always allow)
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'Tab' || e.key === 'PageDown') && !isInputFocused) {
    e.preventDefault();
    const currentIndex = tabManager.tabs.findIndex(t => t.id === tabManager.activeTabId);
    const nextIndex = (currentIndex + 1) % tabManager.tabs.length;
    tabManager.switchToTab(tabManager.tabs[nextIndex].id);
    return;
  }

  // Ctrl+Shift+Tab or Ctrl+PageUp: Previous tab (always allow)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Tab' || e.key === 'PageUp') && !isInputFocused) {
    e.preventDefault();
    const currentIndex = tabManager.tabs.findIndex(t => t.id === tabManager.activeTabId);
    const prevIndex = (currentIndex - 1 + tabManager.tabs.length) % tabManager.tabs.length;
    tabManager.switchToTab(tabManager.tabs[prevIndex].id);
    return;
  }

  // Ctrl+1-9: Switch to tab by number (always allow)
  if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9' && !isInputFocused) {
    e.preventDefault();
    const tabIndex = parseInt(e.key) - 1;
    if (tabIndex < tabManager.tabs.length) {
      tabManager.switchToTab(tabManager.tabs[tabIndex].id);
    }
    return;
  }

  // Ctrl+L or Cmd+L: Focus address bar (always allow)
  if ((e.ctrlKey || e.metaKey) && e.key === 'l' && !isInputFocused) {
    e.preventDefault();
    urlBar.focus();
    urlBar.select();
    return;
  }
  
  // Ctrl+R or Cmd+R: Reload page (only if not in input)
  if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !isInputFocused) {
    e.preventDefault();
    const activeTab = tabManager.getActiveTab();
    if (activeTab && activeTab.webview) {
      activeTab.webview.reload();
    }
    return;
  }
  
  // F5: Reload page (only if not in input)
  if (e.key === 'F5' && !isInputFocused) {
    e.preventDefault();
    const activeTab = tabManager.getActiveTab();
    if (activeTab && activeTab.webview) {
      activeTab.webview.reload();
    }
    return;
  }
  
  // Escape: Clear URL bar focus or close settings (always allow)
  if (e.key === 'Escape') {
    if (settingsModal.classList.contains('active')) {
      e.preventDefault();
      closeSettings();
    } else if (document.activeElement === urlBar) {
      e.preventDefault();
      urlBar.blur();
      const activeTab = tabManager.getActiveTab();
      if (activeTab && activeTab.webview) {
        activeTab.webview.focus();
      }
    }
    return;
  }
  
  // Alt+Left: Go back (only if not in input)
  if (e.altKey && e.key === 'ArrowLeft' && !isInputFocused) {
    e.preventDefault();
    const activeTab = tabManager.getActiveTab();
    if (activeTab && activeTab.webview && activeTab.webview.canGoBack()) {
      activeTab.webview.goBack();
    }
    return;
  }
  
  // Alt+Right: Go forward (only if not in input)
  if (e.altKey && e.key === 'ArrowRight' && !isInputFocused) {
    e.preventDefault();
    const activeTab = tabManager.getActiveTab();
    if (activeTab && activeTab.webview && activeTab.webview.canGoForward()) {
      activeTab.webview.goForward();
    }
    return;
  }
});

// Ensure inputs and textareas can receive focus and keyboard input
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
    target.focus();
    // Ensure the input can receive keyboard events
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      target.setAttribute('contenteditable', 'false');
    }
  }
});

// Ensure webview can receive keyboard input
document.addEventListener('mousedown', (e) => {
  // If clicking on webview container, focus the webview
  if (e.target.closest('.webview-tab')) {
    const tabId = parseInt(e.target.closest('.webview-tab').dataset.tabId);
    const tab = tabManager.tabs.find(t => t.id === tabId);
    if (tab && tab.webview) {
      setTimeout(() => {
        tab.webview.focus();
      }, 10);
    }
  }
});

// DoH provider change handler
document.getElementById('dohProvider').addEventListener('change', (e) => {
  const customUrlInput = document.getElementById('dohCustomUrl');
  if (e.target.value === 'custom') {
    customUrlInput.style.display = 'block';
  } else {
    customUrlInput.style.display = 'none';
  }
});

// Ensure webview receives focus when clicked directly
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'WEBVIEW') {
    e.target.focus();
  } else if (e.target.closest('.webview-tab') && e.target.tagName !== 'WEBVIEW') {
    const tabId = parseInt(e.target.closest('.webview-tab').dataset.tabId);
    const tab = tabManager.tabs.find(t => t.id === tabId);
    if (tab && tab.webview) {
      setTimeout(() => {
        tab.webview.focus();
      }, 10);
    }
  }
});

// Close settings modal when clicking outside
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    closeSettings();
  }
});

// Initialize
loadConfig();
