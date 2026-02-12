import { AppState, ScriptMode } from '../types';
import { COMMON_BROWSERS } from '../constants';

export const generatePowerShellScript = (config: AppState, mode: ScriptMode): string => {
    const { system, web, advanced, kiosk } = config;
    const isLock = mode === 'LOCK';

    // Check if any restriction is active for LOCK mode
    if (isLock) {
        const hasActiveRestrictions =
            system.blockUsb ||
            system.blockStore ||
            system.blockExecutables ||
            web.enforceEdge ||
            advanced.blockTaskMgr ||
            advanced.blockCmdPowershell ||
            advanced.blockSettings ||
            advanced.blockControlPanel ||
            advanced.blockRegistryTools ||
            advanced.blockSpecificApps ||
            advanced.preventUacBypass ||
            advanced.isolateUserFolders ||
            kiosk.disableWindowsUpdate ||
            kiosk.disableSleep ||
            kiosk.hideDesktopIcons ||
            kiosk.disableContextMenu ||
            kiosk.disableNotifications ||
            kiosk.disableTelemetry;

        if (!hasActiveRestrictions) {
            return `# [INFO] No configuration selected.
# Please enable at least one restriction in the App to generate a Lockdown script.
#
# (The 'Restore' script is always available to undo previous changes.)`;
        }
    }

    const timestamp = new Date().toISOString();

    return generateRefinedScript(config, mode, timestamp, isLock);
};

const generateRefinedScript = (config: AppState, mode: ScriptMode, timestamp: string, isLock: boolean) => {
    const { system, web, advanced, kiosk } = config;

    // Helper to sanitize input for PowerShell strings (escapes double quotes)
    const sanitize = (str: string) => str.replace(/"/g, '`"');

    // --- EDGE CONFIGURATION ---
    let edgeScript = "";
    // FIX: Removed embedded quotes from definition to allow clean subkey concatenation
    const EdgePol = `$HiveRoot\\Software\\Policies\\Microsoft\\Edge`;

    if (isLock && web.enforceEdge) {
        // Construct allowed URLs list
        const allowedSitesList = [...web.allowedUrls];
        if (web.allowPdfView) {
            allowedSitesList.push("file://*", "blob:*");
        }

        const mapAllowedSites = allowedSitesList.map(url => `"${sanitize(url)}"`).join(',');

        edgeScript += `
    # [Edge] Enforce Kiosk Mode & URL Whitelist
    Write-Host "    -> Configuring Edge Policies..." -ForegroundColor Gray
    
    ${web.whitelistOnly ? `
    # [Strict Mode] Block all URLs by default (Subkey "URLBlocklist", Value "1" = "*")
    Remove-RegValue -Path "${EdgePol}" -Name "URLBlocklist" 
    Set-RegKey -Path "${EdgePol}\\URLBlocklist" -Name "1" -PropertyType "String" -Value "*"
    ` : `
    # [Open Mode] Allow all URLs (Remove Blocklist)
    Remove-RegValue -Path "${EdgePol}" -Name "URLBlocklist"
    Remove-RegKey -Path "${EdgePol}\\URLBlocklist"
    `}

    # Block all Extensions (Subkey "ExtensionInstallBlocklist", Value "1" = "*")
    Remove-RegValue -Path "${EdgePol}" -Name "ExtensionInstallBlocklist"
    Set-RegKey -Path "${EdgePol}\\ExtensionInstallBlocklist" -Name "1" -PropertyType "String" -Value "*"
    
    # Clear old allowlists to prevent accumulation
    Remove-RegKey -Path "${EdgePol}\\URLAllowlist"
    Remove-RegKey -Path "${EdgePol}\\ExtensionInstallAllowlist"
    
    # Add new allowed URLs (Always added, useful even in Open Mode for favorites/exceptions)
    $i = 1
    $AllowedSites = @(${mapAllowedSites})
    foreach ($url in $AllowedSites) {
        Set-RegKey -Path "${EdgePol}\\URLAllowlist" -Name "$i" -PropertyType "String" -Value $url
        $i++
    }

    # Add new allowed Extensions
    $j = 1
    $AllowedExtensions = @(${web.allowedExtensions.map(id => `"${sanitize(id)}"`).join(',')})
    foreach ($ext in $AllowedExtensions) {
        Set-RegKey -Path "${EdgePol}\\ExtensionInstallAllowlist" -Name "$j" -PropertyType "String" -Value $ext
        $j++
    }
    
    ${web.allowPdfView ? `
    # Enable Internal PDF Viewer
    Set-RegKey -Path "${EdgePol}" -Name "AlwaysOpenPdfExternally" -Value 0
    ` : `
    # Reset PDF Viewer Policy
    Remove-RegValue -Path "${EdgePol}" -Name "AlwaysOpenPdfExternally"
    `}

    ${web.blockFileUploads ? `
    # [Security] Block File Uploads
    Set-RegKey -Path "${EdgePol}" -Name "AllowFileSelectionDialogs" -Value 0
    ` : `
    # [Security] Allow File Uploads
    Remove-RegValue -Path "${EdgePol}" -Name "AllowFileSelectionDialogs"
    `}
    
    # Disable Developer Tools & Guest
    Set-RegKey -Path "${EdgePol}" -Name "DeveloperToolsAvailability" -Value 2
    Set-RegKey -Path "${EdgePol}" -Name "InPrivateModeAvailability" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "BrowserGuestModeEnabled" -Value 0
    Set-RegKey -Path "${EdgePol}" -Name "HideFirstRunExperience" -Value 1

    # [Kiosk] Startup Behavior
    # 4 = Open a list of URLs

    ${web.forceStartup ? `
    # [Strict Mode] Force Startup Pages & Home
    Set-RegKey -Path "${EdgePol}" -Name "RestoreOnStartup" -Value 4
    Remove-RegKey -Path "${EdgePol}\\RestoreOnStartupURLs"
    $k = 1
    foreach ($url in $AllowedSites) {
        Set-RegKey -Path "${EdgePol}\\RestoreOnStartupURLs" -Name "$k" -PropertyType "String" -Value $url
        $k++
    }

    Set-RegKey -Path "${EdgePol}" -Name "ShowHomeButton" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "HomepageIsNewTabPage" -Value 0
    Set-RegKey -Path "${EdgePol}" -Name "HomepageLocation" -PropertyType "String" -Value "${allowedSitesList[0]}"
    ` : `
    # [Open Mode] Let user control startup/home
    Remove-RegValue -Path "${EdgePol}" -Name "RestoreOnStartup"
    Remove-RegKey -Path "${EdgePol}\\RestoreOnStartupURLs"
    Remove-RegValue -Path "${EdgePol}" -Name "ShowHomeButton"
    Remove-RegValue -Path "${EdgePol}" -Name "HomepageIsNewTabPage"
    Remove-RegValue -Path "${EdgePol}" -Name "HomepageLocation"
    `}


    # [Kiosk] Privacy & Security
    # Password Manager
    ${web.allowPasswordManager ? `
    Set-RegKey -Path "${EdgePol}" -Name "PasswordManagerEnabled" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "AutofillCreditCardEnabled" -Value 1
    ` : `
    Set-RegKey -Path "${EdgePol}" -Name "PasswordManagerEnabled" -Value 0
    Set-RegKey -Path "${EdgePol}" -Name "AutofillCreditCardEnabled" -Value 0
    `}

    # SmartScreen (Corporate Security)
    ${web.forceSmartScreen ? `
    Write-Host "    -> [Security] Enforcing SmartScreen..." -ForegroundColor Green
    Set-RegKey -Path "${EdgePol}" -Name "SmartScreenEnabled" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "SmartScreenPuaEnabled" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "PreventSmartScreenPromptOverride" -Value 1
    Set-RegKey -Path "${EdgePol}" -Name "PreventSmartScreenPromptOverrideForFiles" -Value 1
    ` : `
    # Remove SmartScreen Enforcement
    Remove-RegValue -Path "${EdgePol}" -Name "SmartScreenEnabled"
    Remove-RegValue -Path "${EdgePol}" -Name "SmartScreenPuaEnabled"
    Remove-RegValue -Path "${EdgePol}" -Name "PreventSmartScreenPromptOverride"
    Remove-RegValue -Path "${EdgePol}" -Name "PreventSmartScreenPromptOverrideForFiles"
    `}
`;
    } else {
        edgeScript += `
    # [Edge] Remove Policies
    Write-Host "    -> Clearing Edge Policies..." -ForegroundColor Gray
    # Remove Blocklist Keys
    Remove-RegKey -Path "${EdgePol}\\URLBlocklist"
    Remove-RegKey -Path "${EdgePol}\\ExtensionInstallBlocklist"
    # Fallback cleanup for legacy values
    Remove-RegValue -Path "${EdgePol}" -Name "URLBlocklist"
    Remove-RegValue -Path "${EdgePol}" -Name "ExtensionInstallBlocklist"
    
    # Remove Allowlist Keys
    Remove-RegKey -Path "${EdgePol}\\URLAllowlist"
    Remove-RegKey -Path "${EdgePol}\\ExtensionInstallAllowlist"
    
    # Remove misc settings
    Remove-RegValue -Path "${EdgePol}" -Name "DeveloperToolsAvailability"
    Remove-RegValue -Path "${EdgePol}" -Name "InPrivateModeAvailability"
    Remove-RegValue -Path "${EdgePol}" -Name "BrowserGuestModeEnabled"
    Remove-RegValue -Path "${EdgePol}" -Name "HideFirstRunExperience"
    Remove-RegValue -Path "${EdgePol}" -Name "AlwaysOpenPdfExternally"
    
    # Remove Kiosk Startup & Privacy settings
    Remove-RegValue -Path "${EdgePol}" -Name "RestoreOnStartup"
    Remove-RegKey -Path "${EdgePol}\\RestoreOnStartupURLs"
    Remove-RegValue -Path "${EdgePol}" -Name "ShowHomeButton"
    Remove-RegValue -Path "${EdgePol}" -Name "HomepageIsNewTabPage"
    Remove-RegValue -Path "${EdgePol}" -Name "HomepageLocation"
    Remove-RegValue -Path "${EdgePol}" -Name "PasswordManagerEnabled"
    Remove-RegValue -Path "${EdgePol}" -Name "AutofillCreditCardEnabled"
    Remove-RegValue -Path "${EdgePol}" -Name "AllowFileSelectionDialogs"
`;
    }

    // --- BASE APP BLOCK LIST ---
    const baseAppsToBlock: string[] = [];
    if (isLock) {
        // ALWAYS Block Bluetooth File Transfer Wizard (fsquirt.exe)
        // This prevents data exfiltration while still allowing Bluetooth Audio pairing if settings are enabled.
        baseAppsToBlock.push("fsquirt.exe");

        if (system.blockStore) {
            // "RemoveWindowsStore" policy only works on Enterprise/Education.
            // For Home/Pro, we explicitly block the Store executable via DisallowRun.
            baseAppsToBlock.push("WinStore.App.exe", "Microsoft.WindowsStore.exe");
        }
        if (advanced.blockSpecificApps) {
            baseAppsToBlock.push(...advanced.blockedAppList);
        }
        if (advanced.blockCmdPowershell) {
            baseAppsToBlock.push("powershell.exe", "powershell_ise.exe", "pwsh.exe");
        }
        if (web.blockOtherBrowsers) {
            baseAppsToBlock.push(...COMMON_BROWSERS);
        }
    }
    const psAppList = `@(${baseAppsToBlock.map(a => `"${sanitize(a)}"`).join(',')})`;

    return `<#
================================================================================
  WINLOCKSMITH - CONFIGURATION SCRIPT
  Generated: ${timestamp}
  Mode: ${isLock ? 'LOCKDOWN' : 'RESTORE'}
  Supported Editions: Home, Pro, Enterprise, Education
================================================================================
#>
$ErrorActionPreference = "SilentlyContinue"

# --- CHECK FOR ADMINISTRATOR PRIVILEGES ---
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Requesting Admin Privileges..." -ForegroundColor Yellow
    Start-Process PowerShell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File \`"$PSCommandPath\`""
    Exit
}

Clear-Host
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   WinLocksmith Configuration Utility" -ForegroundColor Cyan
Write-Host "   Mode: ${isLock ? 'LOCKDOWN' : 'RESTORE'}" -ForegroundColor ${isLock ? 'Red' : 'Green'}
Write-Host "============================================" -ForegroundColor Cyan

# --- AUTOMATIC EDITION DETECTION ---
$EditionID = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name "EditionID" -ErrorAction SilentlyContinue).EditionID
$IsHome = ($EditionID -match "Core")

Write-Host "Detected Windows Edition: $EditionID" -ForegroundColor Gray
if ($IsHome) {
    Write-Host " -> HOME EDITION DETECTED: Using 'ICACLS' Workarounds." -ForegroundColor Magenta
} else {
    Write-Host " -> PRO/ENT DETECTED: Using 'Group Policy' & 'SRP'." -ForegroundColor Green
}
Write-Host ""
Start-Sleep -Seconds 2

# --- HELPER FUNCTIONS ---
function Set-RegKey {
    param ([string]$Path, [string]$Name, [string]$PropertyType="DWord", $Value)
    if (!(Test-Path $Path)) { New-Item -Path $Path -Force | Out-Null }
    New-ItemProperty -Path $Path -Name $Name -Value $Value -PropertyType $PropertyType -Force | Out-Null
}

function Remove-RegValue {
    param ([string]$Path, [string]$Name)
    if (Test-Path $Path) { Remove-ItemProperty -Path $Path -Name $Name -ErrorAction SilentlyContinue | Out-Null }
}

function Remove-RegKey {
    param ([string]$Path)
    if (Test-Path $Path) { Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue | Out-Null }
}

function Create-SrpPathRule {
    param ([string]$RootPath, [string]$RuleGuid, [string]$PathPattern, [string]$Description)
    $RuleKey = "$RootPath\\$RuleGuid"
    if(!(Test-Path $RuleKey)) { New-Item -Path $RuleKey -Force | Out-Null }
    Set-RegKey -Path $RuleKey -Name "ItemData" -PropertyType "String" -Value $PathPattern
    Set-RegKey -Path $RuleKey -Name "SaferFlags" -Value 0
    Set-RegKey -Path $RuleKey -Name "Description" -PropertyType "String" -Value $Description
}

# --- 1. USER SPECIFIC POLICIES (Applies to HKCU of Standard Users) ---
function Apply-UserPolicy {
    param (
        [string]$HiveRoot, 
        [string]$LogName, 
        [string]$AccountName, 
        [string]$ProfilePath
    )
    Write-Host "  > Configuring User Hive: $LogName" -ForegroundColor Cyan
    
    $ExplorerPol = "$HiveRoot\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer"
    $SystemPol   = "$HiveRoot\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System"
    $WinSysPol   = "$HiveRoot\\Software\\Policies\\Microsoft\\Windows\\System"
    $PushNotif   = "$HiveRoot\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications"

    # UI & Kiosk Policies
    ${isLock ? `Write-Host "    -> Applying UI Restrictions..." -ForegroundColor Gray` : `Write-Host "    -> Removing UI Restrictions..." -ForegroundColor Gray`}
    
    ${isLock && kiosk.hideDesktopIcons ? `Set-RegKey -Path $ExplorerPol -Name "NoDesktop" -Value 1` : `Remove-RegValue -Path $ExplorerPol -Name "NoDesktop"`}
    ${isLock && kiosk.disableContextMenu ? `Set-RegKey -Path $ExplorerPol -Name "NoViewContextMenu" -Value 1` : `Remove-RegValue -Path $ExplorerPol -Name "NoViewContextMenu"`}
    ${isLock && kiosk.disableNotifications ? `Set-RegKey -Path $PushNotif -Name "ToastEnabled" -Value 0` : `Remove-RegValue -Path $PushNotif -Name "ToastEnabled"`}
    
    # Advanced System Policies
    ${isLock ? `Write-Host "    -> Applying System Restrictions..." -ForegroundColor Gray` : `Write-Host "    -> Removing System Restrictions..." -ForegroundColor Gray`}

    ${isLock && advanced.blockTaskMgr ? `Set-RegKey -Path $SystemPol -Name "DisableTaskMgr" -Value 1` : `Remove-RegValue -Path $SystemPol -Name "DisableTaskMgr"`}
    ${isLock && advanced.blockRegistryTools ? `Set-RegKey -Path $SystemPol -Name "DisableRegistryTools" -Value 1` : `Remove-RegValue -Path $SystemPol -Name "DisableRegistryTools"`}
    # DisableCMD belongs under Policies\Microsoft\Windows\System (NOT CurrentVersion\Policies\System)
    # Value 2 = Disable CMD prompt but allow batch scripts to run
    ${isLock && advanced.blockCmdPowershell ? `Set-RegKey -Path $WinSysPol -Name "DisableCMD" -Value 2` : `Remove-RegValue -Path $WinSysPol -Name "DisableCMD"`}
    
    # Settings / Control Panel Logic (Handles Peripherals Exception)
    ${isLock && (advanced.blockSettings || advanced.blockControlPanel) ? `
        ${system.allowPeripherals ? `
        # [Peripherals Allowed] Hide all settings EXCEPT Bluetooth & Printers. 
        # Overrides 'Block Control Panel' to ensure pairing is possible.
        Write-Host "    -> Blocking Settings (Except Bluetooth/Printers)..." -ForegroundColor Yellow
        Remove-RegValue -Path $ExplorerPol -Name "NoControlPanel"
        Set-RegKey -Path $ExplorerPol -Name "SettingsPageVisibility" -PropertyType "String" -Value "showonly:bluetooth;connecteddevices;printers"
        ` : `
        # [Strict] Block All Settings & Control Panel
        ${advanced.blockSettings || advanced.blockControlPanel ? `
        Set-RegKey -Path $ExplorerPol -Name "NoControlPanel" -Value 1
        Remove-RegValue -Path $ExplorerPol -Name "SettingsPageVisibility"
        ` : ``}
        `}
    ` : `
        # Restore Settings Access
        Remove-RegValue -Path $ExplorerPol -Name "NoControlPanel"
        Remove-RegValue -Path $ExplorerPol -Name "SettingsPageVisibility"
    `}

    # USB Access Control (User Level - Standard Users Only)
    # This ensures Admins on BYOD devices are not locked out.
    ${isLock && system.blockUsb ? `
    Write-Host "    -> Blocking USB Storage Access (User Policy)..." -ForegroundColor Yellow
    $RemovableStorage = "$HiveRoot\\Software\\Policies\\Microsoft\\Windows\\RemovableStorageDevices"
    if (!(Test-Path $RemovableStorage)) { New-Item -Path $RemovableStorage -Force | Out-Null }
    # Deny All Removable Disks (Reads/Writes)
    Set-RegKey -Path $RemovableStorage -Name "Deny_All" -Value 1
    ` : `
    Write-Host "    -> Restoring USB Storage Access (User Policy)..." -ForegroundColor Green
    Remove-RegKey -Path "$HiveRoot\\Software\\Policies\\Microsoft\\Windows\\RemovableStorageDevices"
    `}

    # --- DYNAMIC DISALLOW RUN (Smart Blocking) ---
    ${isLock ? `
    $AppsToBlock = ${psAppList}
    
    # Smart CMD Blocking:
    ${advanced.blockCmdPowershell ? `
    if ($IsHome) {
        $AppsToBlock += "cmd.exe"
    }
    ` : ``}

    if ($AppsToBlock.Count -gt 0) {
        Write-Host "    -> Applying App Blocks (DisallowRun)..." -ForegroundColor Gray
        Set-RegKey -Path $ExplorerPol -Name "DisallowRun" -Value 1
        if (Test-Path "$ExplorerPol\\DisallowRun") { Remove-Item "$ExplorerPol\\DisallowRun" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null }
        if (!(Test-Path "$ExplorerPol\\DisallowRun")) { New-Item -Path "$ExplorerPol\\DisallowRun" -Force | Out-Null }
        
        $idx = 1
        foreach ($app in $AppsToBlock) {
             Set-RegKey -Path "$ExplorerPol\\DisallowRun" -Name "$idx" -PropertyType "String" -Value $app
             $idx++
        }
    } else {
        Remove-RegValue -Path $ExplorerPol -Name "DisallowRun"
        Remove-RegKey -Path "$ExplorerPol\\DisallowRun"
    }
    ` : `
    Write-Host "    -> Clearing App Blocks..." -ForegroundColor Gray
    Remove-RegValue -Path $ExplorerPol -Name "DisallowRun"
    Remove-RegKey -Path "$ExplorerPol\\DisallowRun"
    `}

    # Edge Policies
    ${edgeScript}

    # --- PRIVACY / USER ISOLATION ---
    ${isLock && advanced.isolateUserFolders ? `
    if ($ProfilePath -and (Test-Path $ProfilePath)) {
        Write-Host "    -> [Privacy] Isolating User Profile from Admins..." -ForegroundColor Red
        
        # 1. Grant Explicit Access to Owner and SYSTEM first (Critical to avoid lockout)
        icacls "$ProfilePath" /grant:r "$($AccountName):(OI)(CI)F" /Q
        icacls "$ProfilePath" /grant:r "*S-1-5-18:(OI)(CI)F" /Q
        
        # 2. Disable Inheritance (copy existing ACEs, but we will remove some)
        icacls "$ProfilePath" /inheritance:d /Q

        # 3. Remove Admin/Public groups (Using SIDs for locale compatibility)
        # S-1-5-32-544 = Administrators
        # S-1-5-32-545 = Users
        # S-1-5-11 = Authenticated Users
        icacls "$ProfilePath" /remove:g "*S-1-5-32-544" /Q
        icacls "$ProfilePath" /remove:g "*S-1-5-32-545" /Q
        icacls "$ProfilePath" /remove:g "*S-1-5-11" /Q
    }
    ` : `
    if ($ProfilePath -and (Test-Path $ProfilePath)) {
        Write-Host "    -> Restoring User Profile Permissions..." -ForegroundColor Green
        # Re-grant Administrators
        icacls "$ProfilePath" /grant "*S-1-5-32-544:(OI)(CI)F" /Q
        # Attempt to reset to inherited defaults
        icacls "$ProfilePath" /reset /Q
    }
    `}

    # --- HOME EDITION WORKAROUND: ICACLS EXECUTE BLOCK ---
    if ($ProfilePath -and (Test-Path $ProfilePath) -and $AccountName -ne "Default User") {
        ${isLock && system.blockExecutables ? `
        if ($IsHome) {
            Write-Host "    -> [Home Workaround] Denying Execute Permissions in User Folders..." -ForegroundColor Magenta
            $RestrictedFolders = @("Downloads", "Desktop", "AppData\\Local\\Temp")
            ${system.strictMode ? `$RestrictedFolders += ("Documents", "Pictures", "Music", "Videos")` : ``}
            
            foreach ($Folder in $RestrictedFolders) {
                $Target = Join-Path $ProfilePath $Folder
                if (Test-Path $Target) {
                    # (IO) = Inherit Only. This ensures the folder ITSELF is still accessible, but files inside inherit the block.
                    icacls "$Target" /deny "$($AccountName):(OI)(CI)(IO)(X)" /Q
                }
            }
            # Block Public Desktop
            $PublicDesktop = "C:\\Users\\Public\\Desktop"
            if (Test-Path $PublicDesktop) { icacls "$PublicDesktop" /deny "$($AccountName):(OI)(CI)(IO)(X)" /Q }
        } else {
            Write-Host "    -> [Pro/Ent] Skipping File Permissions (Using SRP instead)." -ForegroundColor DarkGray
        }
        ` : `
        Write-Host "    -> Restoring File Permissions (ICACLS Cleanup)..." -ForegroundColor Magenta
        $RestrictedFolders = @("Downloads", "Desktop", "AppData\\Local\\Temp", "Documents", "Pictures", "Music", "Videos")
        foreach ($Folder in $RestrictedFolders) {
            $Target = Join-Path $ProfilePath $Folder
            if (Test-Path $Target) { icacls "$Target" /remove:d "$($AccountName)" /Q }
        }
        $PublicDesktop = "C:\\Users\\Public\\Desktop"
        if (Test-Path $PublicDesktop) { icacls "$PublicDesktop" /remove:d "$($AccountName)" /Q }
        `}
    }
}

# --- ITERATE USERS ---
$AdminGroup = Get-LocalGroupMember -SID "S-1-5-32-544"
$AllUsers = Get-LocalUser | Where-Object { $_.Enabled -eq $true }
$TargetUsers = @()
foreach ($User in $AllUsers) {
    $IsAdmin = $false
    foreach ($Admin in $AdminGroup) { if ($Admin.SID -eq $User.SID) { $IsAdmin = $true } }
    if (-not $IsAdmin) { $TargetUsers += $User }
}

Write-Host "[*] Found $($TargetUsers.Count) Standard Users to configure." -ForegroundColor Yellow

# Default User
if (Test-Path "C:\\Users\\Default\\NTUSER.DAT") {
    reg load "HKLM\\WL_Def" "C:\\Users\\Default\\NTUSER.DAT" | Out-Null
    Apply-UserPolicy -HiveRoot "HKLM\\WL_Def" -LogName "Default User" -AccountName "Default User" -ProfilePath ""
    [gc]::Collect()
    reg unload "HKLM\\WL_Def" | Out-Null
}

# Standard Users
foreach ($User in $TargetUsers) {
    $SID = $User.SID.Value
    $ProfilePath = $null
    $ProfileRegPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\$SID"
    if (Test-Path $ProfileRegPath) {
        $ProfilePath = (Get-ItemProperty -Path $ProfileRegPath -Name ProfileImagePath).ProfileImagePath
    }

    if (Test-Path "Registry::HKEY_USERS\\$SID") {
        Apply-UserPolicy -HiveRoot "Registry::HKEY_USERS\\$SID" -LogName "$($User.Name) (Online)" -AccountName $User.Name -ProfilePath $ProfilePath
    } else {
        if ($ProfilePath -and (Test-Path "$ProfilePath\\NTUSER.DAT")) {
            reg load "HKLM\\WL_Temp" "$ProfilePath\\NTUSER.DAT" | Out-Null
            Apply-UserPolicy -HiveRoot "HKLM\\WL_Temp" -LogName "$($User.Name) (Offline)" -AccountName $User.Name -ProfilePath $ProfilePath
            [gc]::Collect()
            reg unload "HKLM\\WL_Temp" | Out-Null
        }
    }
}

# --- 2. MACHINE WIDE POLICIES (HKLM) ---
Write-Host ""
Write-Host "--- Configuring Machine-Wide Policies ---" -ForegroundColor Cyan

# Store Policy (Robust Block for Pro/Ent)
${isLock && system.blockStore ? `
Write-Host "[*] Disabling Windows Store & Consumer Features..." -ForegroundColor Yellow
Set-RegKey -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" -Name "RemoveWindowsStore" -Value 1
# Also block "Consumer Features" (Candy Crush, etc. auto-installs)
Set-RegKey -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" -Name "DisableWindowsConsumerFeatures" -Value 1
` : `
Write-Host "[*] Restoring Windows Store Policy..." -ForegroundColor Green
Remove-RegValue -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" -Name "RemoveWindowsStore"
Remove-RegValue -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" -Name "DisableWindowsConsumerFeatures"
`}

# Anti-Bypass (UAC Hardening)
${isLock && advanced.preventUacBypass ? `
Write-Host "[*] Enabling Anti-Bypass (Disabling UAC Prompts for Standard Users)..." -ForegroundColor Red
# ConsentPromptBehaviorUser: 0 = Automatically deny elevation requests.
Set-RegKey -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "ConsentPromptBehaviorUser" -Value 0
` : `
Write-Host "[*] Restoring UAC Prompt Behavior..." -ForegroundColor Green
# Restore to default behavior if it was set (Removing key usually defaults to 1 or 3 depending on OS, but safe to remove our override)
Remove-RegValue -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "ConsentPromptBehaviorUser"
`}

# Updates
${isLock && kiosk.disableWindowsUpdate ? `
Write-Host "[*] Disabling Windows Auto-Update..." -ForegroundColor Yellow
Set-RegKey -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" -Name "NoAutoUpdate" -Value 1
` : `
Write-Host "[*] Restoring Updates..." -ForegroundColor Green
Remove-RegValue -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" -Name "NoAutoUpdate"
`}

# Telemetry
${isLock && kiosk.disableTelemetry ? `
Write-Host "[*] Disabling Telemetry..." -ForegroundColor Yellow
Set-RegKey -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0
` : `
Write-Host "[*] Restoring Telemetry..." -ForegroundColor Green
Remove-RegValue -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry"
`}

# Power
${isLock && kiosk.disableSleep ? `
Write-Host "[*] Disabling Sleep Mode..." -ForegroundColor Yellow
powercfg -change -monitor-timeout-ac 0; powercfg -h off
` : `
Write-Host "[*] Restoring Sleep Mode..." -ForegroundColor Green
powercfg -change -monitor-timeout-ac 15; powercfg -h on
`}

# --- 3. EXECUTION CONTROL (SRP) ---
$SRP = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Safer\\CodeIdentifiers"

${isLock && system.blockExecutables ? `
if (-not $IsHome) {
    Write-Host "[*] Applying Software Restriction Policies (Pro/Ent Only)..." -ForegroundColor Yellow
    Set-RegKey -Path $SRP -Name "TransparentEnabled" -Value 1
    Set-RegKey -Path $SRP -Name "PolicyScope" -Value 1

    ${system.strictMode ? `
    # [Strict Mode]
    Write-Host "    -> Strict Mode: Block Everything except System Paths." -ForegroundColor Red
    Set-RegKey -Path $SRP -Name "DefaultLevel" -Value 0
    Create-SrpPathRule -RootPath "$SRP\\262144\\Paths" -RuleGuid "{191cd7fa-f240-4a17-8986-94d480a6c8ca}" -PathPattern "%WINDIR%" -Description "Allow Windows System Directory"
    Create-SrpPathRule -RootPath "$SRP\\262144\\Paths" -RuleGuid "{291cd7fa-f240-4a17-8986-94d480a6c8cb}" -PathPattern "%PROGRAMFILES%" -Description "Allow Program Files"
    Create-SrpPathRule -RootPath "$SRP\\262144\\Paths" -RuleGuid "{391cd7fa-f240-4a17-8986-94d480a6c8cc}" -PathPattern "%PROGRAMFILES(X86)%" -Description "Allow Program Files (x86)"
    ` : `
    # [Basic Mode]
    Write-Host "    -> Basic Mode: Block User Profile Execution." -ForegroundColor Yellow
    Set-RegKey -Path $SRP -Name "DefaultLevel" -Value 262144
    Create-SrpPathRule -RootPath "$SRP\\0\\Paths" -RuleGuid "{b21cc481-6e17-4653-8f75-05041e2bd01f}" -PathPattern "%USERPROFILE%" -Description "Block Executables in User Profile"
    `}
} else {
    Write-Host "[*] Windows Home Detected: Skipping SRP Configuration." -ForegroundColor DarkGray
}
` : `
Write-Host "[*] Removing Software Restriction Policies..." -ForegroundColor Green
Set-RegKey -Path $SRP -Name "TransparentEnabled" -Value 0
Remove-RegValue -Path $SRP -Name "PolicyScope"
# Remove ALL path rules (both DisallowRun and AllowedPaths)
if(Test-Path "$SRP\\0\\Paths") { Remove-Item "$SRP\\0\\Paths\\*" -Recurse -Force -ErrorAction SilentlyContinue }
if(Test-Path "$SRP\\262144\\Paths") { Remove-Item "$SRP\\262144\\Paths\\*" -Recurse -Force -ErrorAction SilentlyContinue }
`}

Write-Host "Restarting Explorer..." -ForegroundColor DarkGray
Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# --- VERIFICATION REPORT ---
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      VERIFICATION REPORT (ACTIVE)        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
${isLock ? `
${system.blockUsb ?
                'Write-Host "[+] USB Storage:          BLOCKED (Standard Users)" -ForegroundColor Green' :
                'Write-Host "[-] USB Storage:          ALLOWED" -ForegroundColor Gray'
            }

${system.blockStore ?
                'Write-Host "[+] MS Store & Apps:      BLOCKED" -ForegroundColor Green' :
                'Write-Host "[-] MS Store & Apps:      ALLOWED" -ForegroundColor Gray'
            }

${web.enforceEdge ?
                `Write-Host "[+] Edge Kiosk Mode:      ACTIVE (${web.allowedUrls.length} URLs allowed)" -ForegroundColor Green` :
                'Write-Host "[-] Edge Kiosk Mode:      INACTIVE" -ForegroundColor Gray'
            }

${system.blockExecutables ? `
if ($IsHome) {
    Write-Host "[-] App Execution (SRP):  SKIPPED (Home Edition Not Supported)" -ForegroundColor DarkGray 
} else {
    Write-Host "[+] App Execution (SRP):  BLOCKED" -ForegroundColor Green 
}
` :
                'Write-Host "[-] App Execution (SRP):  ALLOWED" -ForegroundColor Gray'
            }

${advanced.preventUacBypass ?
                'Write-Host "[+] Anti-Bypass (UAC):    ACTIVE" -ForegroundColor Green' :
                ''
            }

if ($IsHome) { Write-Host "[!] Note: Used 'ICACLS' to secure Home Edition user folders." -ForegroundColor Yellow }
` : `
Write-Host "All restrictions have been removed." -ForegroundColor Green
`}
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "DONE." -ForegroundColor Green
Read-Host "Press Enter to exit..."
`;
}