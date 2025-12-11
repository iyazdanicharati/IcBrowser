const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const DNSManager = require('./dns-manager');

// Initialize DNS Manager and apply DNS settings BEFORE app is ready
const dnsManager = new DNSManager();
dnsManager.applyDNSSettings();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

// IPC handlers for configuration
ipcMain.handle('get-config', () => {
  return dnsManager.getConfig();
});

ipcMain.handle('update-config', (event, updates) => {
  dnsManager.updateConfig(updates);
  return { success: true };
});

ipcMain.handle('update-dns-config', (event, dnsConfig) => {
  dnsManager.updateDNSConfig(dnsConfig);
  return { success: true };
});

ipcMain.handle('update-company-config', (event, companyConfig) => {
  dnsManager.updateCompanyConfig(companyConfig);
  return { success: true };
});

ipcMain.handle('resolve-local-domain', (event, hostname) => {
  return dnsManager.resolveLocalDomain(hostname);
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Session management handlers
ipcMain.handle('save-session', (event, session) => {
  try {
    const sessionPath = path.join(app.getPath('userData'), 'session.json');
    fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving session:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-session', () => {
  try {
    const sessionPath = path.join(app.getPath('userData'), 'session.json');
    if (fs.existsSync(sessionPath)) {
      const data = fs.readFileSync(sessionPath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
});

app.whenReady().then(() => {
  createWindow();

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+L', () => {
    if (mainWindow) {
      mainWindow.webContents.send('focus-url-bar');
    }
  });

  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow) {
      mainWindow.webContents.send('reload-page');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
  
  // Request session save before quitting
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('save-session-before-quit');
  }
});

// Save session when window is about to close
app.on('before-quit', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('save-session-before-quit');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

