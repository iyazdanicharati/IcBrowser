// Preload script for security
// This runs in a context that has access to both DOM APIs and Node.js APIs
// but isolates the renderer process from direct Node.js access

const { contextBridge, ipcRenderer } = require('electron');

// Listen for global shortcuts from main process
ipcRenderer.on('focus-url-bar', () => {
  window.dispatchEvent(new CustomEvent('focus-url-bar'));
});

ipcRenderer.on('reload-page', () => {
  window.dispatchEvent(new CustomEvent('reload-page'));
});

ipcRenderer.on('save-session-before-quit', () => {
  window.dispatchEvent(new CustomEvent('save-session-before-quit'));
});

// Expose protected methods that allow the renderer process to use
// the APIs we need
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration APIs
  getConfig: () => ipcRenderer.invoke('get-config'),
  updateConfig: (updates) => ipcRenderer.invoke('update-config', updates),
  updateDNSConfig: (dnsConfig) => ipcRenderer.invoke('update-dns-config', dnsConfig),
  updateCompanyConfig: (companyConfig) => ipcRenderer.invoke('update-company-config', companyConfig),
  resolveLocalDomain: (hostname) => ipcRenderer.invoke('resolve-local-domain', hostname),
  // Window control APIs
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  // Session APIs
  saveSession: (session) => ipcRenderer.invoke('save-session', session),
  loadSession: () => ipcRenderer.invoke('load-session'),
});

