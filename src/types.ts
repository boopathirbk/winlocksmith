export interface BlockConfig {
  blockUsb: boolean;
  blockStore: boolean;
  blockExecutables: boolean; // Enforce SRP (Software Restriction Policies)
  strictMode: boolean; // If true, only allow running from Program Files/Windows.
  allowPeripherals: boolean; // Allow Bluetooth/Printers pairing (overrides Block Settings)
}

export interface AdvancedConfig {
  blockTaskMgr: boolean;
  blockCmdPowershell: boolean;
  blockSettings: boolean;
  blockControlPanel: boolean;
  blockRegistryTools: boolean;
  blockSpecificApps: boolean;
  blockedAppList: string[];
  preventUacBypass: boolean; // New: Sets ConsentPromptBehaviorUser to 0
  isolateUserFolders: boolean; // New: Removes Admin access from User Profile
}

export interface KioskConfig {
  disableWindowsUpdate: boolean; // Stop updates/reboots
  disableSleep: boolean; // Set power scheme to never sleep
  hideDesktopIcons: boolean; // Cleaner look
  disableContextMenu: boolean; // No right-click on desktop
  disableNotifications: boolean; // No toasts
  disableTelemetry: boolean; // Privacy
}

export interface WebConfig {
  enforceEdge: boolean;
  urlFilterMode: 'whitelist' | 'blocklist'; // whitelist = allow only listed; blocklist = block only listed
  allowedUrls: string[];   // used in whitelist mode
  blockedUrls: string[];   // used in blocklist mode
  allowedExtensions: string[];
  allowPdfView: boolean;
  blockFileUploads: boolean;
  forceStartup: boolean;
  blockOtherBrowsers: boolean;
  allowPasswordManager: boolean;
  forceSmartScreen: boolean;
  forceDns: boolean; // Force Cloudflare Family DNS (1.1.1.3 / 1.0.0.3) — blocks adult + malware
}

export type ScriptMode = 'LOCK' | 'UNLOCK';

export interface AppState {
  system: BlockConfig;
  advanced: AdvancedConfig;
  kiosk: KioskConfig;
  web: WebConfig;
}
