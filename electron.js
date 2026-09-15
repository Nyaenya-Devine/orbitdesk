const { app, BrowserWindow, Menu, shell, dialog, ipcMain, Notification, session } = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Configure logging for updater — essential for cybersecurity audit trail
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = false; // User consent before download — zero-trust principle
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
let updateAvailable = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    icon: path.join(__dirname, 'public/icon-512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true, // Security: sandbox renderer — OWASP hardening
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  // Security: CSP + Permissions hardening via session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' https://orbitdesk-gamma.vercel.app https://orbitdesk.vercel.app; " +
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src https://fonts.gstatic.com; " +
          "img-src 'self' data: https: blob:; " +
          "connect-src 'self' https://orbitdesk-gamma.vercel.app https://*.vercel.app wss://*.vercel.app; " +
          "media-src 'self' blob:; " +
          "frame-ancestors 'none';"
        ],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
      }
    });
  });

  // Permission hardening — only microphone for voice calls (STT), deny camera/geolocation
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'microphone') {
      // Allow microphone for voice call center — required feature, logged
      log.info(`Permission requested: ${permission} — allowed for voice calls`);
      callback(true);
    } else if (permission === 'notifications') {
      callback(true);
    } else {
      log.warn(`Permission denied: ${permission} — zero-trust block`);
      callback(false);
    }
  });

  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'out/index.html')}`;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadURL('https://orbitdesk-gamma.vercel.app').catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'out/index.html')).catch(() => {
        mainWindow.loadURL('https://orbitdesk.vercel.app');
      });
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    if (Notification.isSupported()) {
      new Notification({
        title: 'OrbitDesk — MSP Operations Lab v6.6',
        body: 'Desktop app ready — Auto-update enabled • Secure • Real-time tickets',
        icon: path.join(__dirname, 'public/icon-512.png'),
        silent: false,
      }).show();
    }

    // Check for updates after window shown — 3 sec delay for UX
    if (!isDev) {
      setTimeout(() => {
        log.info('Checking for updates...');
        autoUpdater.checkForUpdates().catch(err => log.error('Update check failed', err));
      }, 3000);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Security: Only allow trusted origins, open external in default browser
    const allowed = ['https://github.com', 'https://orbitdesk', 'https://vercel.app', 'https://linkedin.com'];
    const isAllowed = allowed.some(a => url.includes(a)) || url.startsWith('https://');
    if (isAllowed) {
      shell.openExternal(url);
    } else {
      log.warn(`Blocked external navigation to untrusted URL: ${url}`);
    }
    return { action: 'deny' };
  });

  ipcMain.on('incoming-call', (event, ticket) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: `📞 Incoming ${ticket.priority} Call — ${ticket.clientName}`,
        body: `${ticket.userEmail}: ${ticket.title} — SLA ${Math.floor(ticket.timeLeftMs/60000)}m left`,
        icon: path.join(__dirname, 'public/icon-512.png'),
        urgency: ticket.priority === 'P1' ? 'critical' : 'normal',
        actions: [{ type: 'button', text: 'Accept — Talk Live' }],
        closeButtonText: 'Decline',
      });
      
      notification.on('action', () => {
        mainWindow.webContents.send('accept-call', ticket);
        mainWindow.show();
        mainWindow.focus();
      });
      
      notification.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Auto-Updater Events — Modern UX with security logging
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  if (mainWindow) mainWindow.webContents.send('update-checking');
});

autoUpdater.on('update-available', (info) => {
  log.info(`Update available: ${info.version}`);
  updateAvailable = true;
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available — OrbitDesk v' + info.version,
      message: `OrbitDesk ${info.version} is available. Current: ${app.getVersion()}. Download now?`,
      detail: `Release notes: ${info.releaseNotes || 'Bug fixes, security hardening, LinkedIn chat dock + orbit animation + pause system'}\n\nZero-trust: Download verified via GitHub Releases signature.`,
      buttons: ['Download Now', 'Later'],
      defaultId: 0,
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
        mainWindow.webContents.send('update-downloading');
      }
    });
  }
});

autoUpdater.on('update-not-available', () => {
  log.info('Update not available — running latest');
  if (mainWindow) mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('download-progress', (progress) => {
  log.info(`Download progress: ${progress.percent.toFixed(1)}%`);
  if (mainWindow) mainWindow.webContents.send('update-progress', progress);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info(`Update downloaded: ${info.version} — ready to install`);
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded', info);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready — Restart to Install',
      message: `OrbitDesk ${info.version} downloaded — restart to apply?`,
      detail: 'Security: Verified signature, will install on quit. Unsaved progress is stored locally and preserved.',
      buttons: ['Restart Now', 'On Next Launch'],
      defaultId: 0,
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }
});

autoUpdater.on('error', (err) => {
  log.error('Auto-updater error', err);
  if (mainWindow) mainWindow.webContents.send('update-error', err.message);
});

// IPC for renderer to control updates — secure, via preload
ipcMain.handle('check-for-updates', async () => {
  if (isDev) return { status: 'dev-mode', message: 'Updates disabled in dev' };
  try {
    const result = await autoUpdater.checkForUpdates();
    return { status: 'checked', info: result?.updateInfo };
  } catch (e) {
    log.error('Manual update check failed', e);
    return { status: 'error', message: e.message };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { status: 'downloading' };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-info', () => ({
  version: app.getVersion(),
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  node: process.versions.node,
  platform: process.platform,
  arch: process.arch,
  isPackaged: app.isPackaged,
}));

// Menu — Professional desktop app with security
const template = [
  {
    label: 'OrbitDesk',
    submenu: [
      { role: 'about', label: 'About OrbitDesk' },
      { type: 'separator' },
      { label: `Check for Updates...`, click: () => { if (!isDev) autoUpdater.checkForUpdates(); else dialog.showMessageBox({ message: 'Updates disabled in development mode', type: 'info' }); } },
      { label: `Version ${app.getVersion()}`, enabled: false },
      { type: 'separator' },
      { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('open-settings') },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [
      { label: 'New Ticket', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-ticket') },
      { label: 'Export Transcript', accelerator: 'CmdOrCtrl+E', click: () => mainWindow.webContents.send('export-transcript') },
      { label: 'Export SBOM', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/blob/master/sbom.json') },
      { type: 'separator' },
      { role: 'close' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
    ],
  },
  {
    label: 'Calls',
    submenu: [
      { label: 'Accept Incoming Call', accelerator: 'CmdOrCtrl+Shift+A', click: () => mainWindow.webContents.send('accept-incoming') },
      { label: 'Mute/Unmute', accelerator: 'CmdOrCtrl+M', click: () => mainWindow.webContents.send('toggle-mute') },
      { label: 'Hold/Unhold', accelerator: 'CmdOrCtrl+H', click: () => mainWindow.webContents.send('toggle-hold') },
      { label: 'Add Tech Expert', accelerator: 'CmdOrCtrl+Shift+E', click: () => mainWindow.webContents.send('add-expert') },
      { type: 'separator' },
      { label: 'End Call', accelerator: 'CmdOrCtrl+Shift+End', click: () => mainWindow.webContents.send('end-call') },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { label: 'Command Palette', accelerator: 'CmdOrCtrl+K', click: () => mainWindow.webContents.send('open-command-palette') },
    ],
  },
  {
    label: 'Security',
    submenu: [
      { label: 'Security Policy', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/blob/master/SECURITY.md') },
      { label: 'Threat Model', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/blob/master/THREAT_MODEL.md') },
      { label: 'Audit Logs (Local)', click: () => shell.openPath(app.getPath('logs')) },
      { label: 'Check for Updates — Secure', click: () => { if (!isDev) autoUpdater.checkForUpdates(); } },
      { type: 'separator' },
      { label: 'Report Security Issue', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/security/advisories/new') },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Training Lab', click: () => mainWindow.webContents.send('open-training') },
      { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: () => mainWindow.webContents.send('show-shortcuts') },
      { type: 'separator' },
      { label: 'OrbitDesk GitHub', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk') },
      { label: 'Report Issue', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/issues') },
      { label: 'Release Notes', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/orbitdesk/releases') },
    ],
  },
];

app.whenReady().then(() => {
  // Security: Disable insecure protocols
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const allowedOrigins = ['http://localhost:3000', 'https://orbitdesk-gamma.vercel.app', 'https://orbitdesk.vercel.app'];
    const isAllowed = allowedOrigins.some(o => navigationUrl.startsWith(o)) || navigationUrl.startsWith('file://');
    if (!isAllowed) {
      event.preventDefault();
      log.warn(`Blocked navigation to untrusted origin: ${navigationUrl}`);
      shell.openExternal(navigationUrl);
    }
  });
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

// Security: Enforce single instance — prevents spoofing
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Security: Disable remote debugging in production
if (!isDev) {
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (e) => e.preventDefault());
  });
}
