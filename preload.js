// OrbitDesk Preload — Secure IPC Bridge + Auto-Update + Security Hardening
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('orbitdesk', {
  // Incoming call from main to renderer
  onAcceptCall: (callback) => ipcRenderer.on('accept-call', (event, ticket) => callback(ticket)),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  onNewTicket: (callback) => ipcRenderer.on('new-ticket', callback),
  onExportTranscript: (callback) => ipcRenderer.on('export-transcript', callback),
  onAcceptIncoming: (callback) => ipcRenderer.on('accept-incoming', callback),
  onToggleMute: (callback) => ipcRenderer.on('toggle-mute', callback),
  onToggleHold: (callback) => ipcRenderer.on('toggle-hold', callback),
  onAddExpert: (callback) => ipcRenderer.on('add-expert', callback),
  onEndCall: (callback) => ipcRenderer.on('end-call', callback),
  onOpenCommandPalette: (callback) => ipcRenderer.on('open-command-palette', callback),
  onOpenTraining: (callback) => ipcRenderer.on('open-training', callback),
  onShowShortcuts: (callback) => ipcRenderer.on('show-shortcuts', callback),
  
  // Renderer to main
  incomingCall: (ticket) => ipcRenderer.send('incoming-call', ticket),
  
  // Auto-Update — Secure IPC with validation
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Update events — for UI toast modern
  onUpdateChecking: (cb) => ipcRenderer.on('update-checking', () => cb()),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (e, info) => cb(info)),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update-not-available', () => cb()),
  onUpdateDownloading: (cb) => ipcRenderer.on('update-downloading', () => cb()),
  onUpdateProgress: (cb) => ipcRenderer.on('update-progress', (e, p) => cb(p)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (e, info) => cb(info)),
  onUpdateError: (cb) => ipcRenderer.on('update-error', (e, err) => cb(err)),
  
  // Security: sanitized info only, no node access
  isDesktop: true,
  platform: process.platform,
  isSecureContext: true,
  sandbox: true,
});

console.log('OrbitDesk Desktop Bridge v6.6 loaded — Secure IPC, Auto-Update, Voice calls, Remote PC, Audit Log');
