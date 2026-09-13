const { app, BrowserWindow, Menu, shell, dialog, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

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
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'out/index.html')}`;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // For production, load the exported static site or Vercel URL
    mainWindow.loadURL('https://orbitdesk.vercel.app').catch(() => {
      // Fallback to local if offline
      mainWindow.loadFile(path.join(__dirname, 'out/index.html'));
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    // Show notification for P1 calls
    if (Notification.isSupported()) {
      new Notification({
        title: 'OrbitDesk — MSP Operations Lab',
        body: 'Desktop app ready — Real-time tickets, live voice calls, remote PC access',
        icon: path.join(__dirname, 'public/icon-512.png'),
        silent: false,
      }).show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle incoming call notifications
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

// Menu — Professional desktop app
const template = [
  {
    label: 'OrbitDesk',
    submenu: [
      { role: 'about', label: 'About OrbitDesk' },
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
    ],
  },
];

app.whenReady().then(() => {
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
    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'https://orbitdesk.vercel.app' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});

// Security: Prevent new windows
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
