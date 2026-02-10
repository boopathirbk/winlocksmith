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
  allowedUrls: string[];
  allowedExtensions: string[];
  allowPdfView: boolean;
  whitelistOnly: boolean; // If true, block all sites except allowedUrls. If false, allow all.
  blockFileUploads: boolean; // If true, block file uploads.
  forceStartup: boolean; // If true, force open allowedUrls on startup.
  blockOtherBrowsers: boolean; // If true, block Chrome, Firefox, etc.
  allowPasswordManager: boolean; // If true, allow password saving.
  forceSmartScreen: boolean; // If true, enforce SmartScreen.
}

export type ScriptMode = 'LOCK' | 'UNLOCK';

export interface AppState {
  system: BlockConfig;
  advanced: AdvancedConfig;
  kiosk: KioskConfig;
  web: WebConfig;
}
