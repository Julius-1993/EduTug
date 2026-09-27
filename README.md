# 🎓 Edu Tug of War — Nigerian Schools Quiz Game
> EdTek Interactive · NERDC Curriculum · WAEC Practice · 2,302 Offline Questions

---

## 🗂️ One Folder. One Terminal. All Platforms.

You only ever work inside **this one folder** (`etow-final/`).  
VS Code opens this folder once, and from its built-in terminal you run everything.

```
etow-final/          ← open THIS folder in VS Code. never leave it.
├── src/App.jsx      ← your entire game code
├── electron/        ← desktop app config (already written)
├── capacitor.config.ts  ← mobile app config (already written)
├── package.json     ← all commands live here
└── ...
```

---

## 🛠️ ONE-TIME SETUP

Do this once after downloading the zip:

### 1. Install Node.js (if you haven't)
Download from **https://nodejs.org** — choose the LTS version.  
Install it like any normal Windows program.

### 2. Open the folder in VS Code
- Open VS Code
- File → Open Folder → select the `etow-final` folder

### 3. Open the VS Code terminal
- Press **Ctrl + `** (backtick key, top-left of keyboard)
- A terminal appears at the bottom of VS Code

### 4. Install everything (one command, one time)
```bash
npm install
```
This downloads React, Vite, Electron, Capacitor — everything. Takes 1–2 minutes.  
You never run this again unless you delete the `node_modules` folder.

---

## 🚀 DAILY COMMANDS — all run in the same VS Code terminal

| What you want | Command |
|---------------|---------|
| Run in browser (dev) | `npm run dev` |
| Build Windows .exe | `npm run electron:build` |
| Test as desktop app | `npm run electron:dev` |
| Build + open Android Studio | `npm run cap:android` |
| Build + open Xcode (Mac) | `npm run cap:ios` |
| Sync code changes to mobile | `npm run cap:sync` |

---

## 🌐 BROWSER (fastest, use this for daily development)

```bash
npm run dev
```
- Opens the game at **http://localhost:5173** in your browser
- Changes to `src/App.jsx` appear instantly — no reload needed
- Press `Ctrl + C` to stop

---

## 🖥️ WINDOWS DESKTOP APP

### Test it as a desktop window while coding:
```bash
npm run electron:dev
```
- Vite starts AND Electron opens a window — both from one command
- Change code → window refreshes automatically

### Build the installer (.exe):
```bash
npm run electron:build
```
- Wait 2–3 minutes
- Find the installer at: `dist-electron/Edu Tug of War Setup 1.0.0.exe`
- Send that one `.exe` file to anyone — they install it like any Windows program

> **First time only:** You may need to allow it to install with:  
> `npm install --global windows-build-tools` (run as Administrator)

---

## 📱 ANDROID APP

### First-time setup (do once):
1. Download **Android Studio** from https://developer.android.com/studio
2. Install it. Open it once so it downloads the Android SDK.
3. Back in your VS Code terminal:
```bash
npx cap add android
```

### Build and open Android Studio:
```bash
npm run cap:android
```
VS Code terminal builds the web app, then Android Studio opens automatically.

### Inside Android Studio:
1. Wait for the blue progress bar at the bottom to finish (Gradle sync — takes 2–5 min first time)
2. Click **Build** in the top menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. When done, a popup says "APK(s) generated" → click **locate**
4. Your APK is there: `android/app/build/outputs/apk/debug/app-debug.apk`

### Every time you change code:
```bash
npm run cap:sync
```
Then in Android Studio, run again.

> ✅ You can have VS Code and Android Studio open at the same time — they don't conflict.

---

## 🍎 iOS APP (Mac only)

### First-time setup:
1. Install **Xcode** from the Mac App Store (free, but large — 12GB)
2. Open Xcode once to accept the license
3. In VS Code terminal:
```bash
npx cap add ios
```

### Build and open Xcode:
```bash
npm run cap:ios
```

### Inside Xcode:
1. Select your Apple account: click the project name → **Signing & Capabilities** → **Team** → your Apple ID
2. Select a simulator or plug in your iPhone
3. Press **▶** (or `Cmd + R`) to run

### Every time you change code:
```bash
npm run cap:sync
```
Then re-run in Xcode.

---

## 🔑 Set Your API Key

Open `src/App.jsx` in VS Code. Near the top find:

```js
const _OKEY = "YOUR_OPENAI_API_KEY_HERE";
const _REMOTE_DB = "https://your-db-endpoint.com/api/questions";
```

Replace with your real values. Save the file. Done.

> The game works offline without these — it uses the 2,302 built-in questions.

---

## 📁 What each file does (you only edit App.jsx)

```
etow-final/
│
├── src/
│   ├── App.jsx          ← 🖊️ YOUR GAME — edit this file
│   └── main.jsx         ← React startup (don't touch)
│
├── electron/
│   ├── main.js          ← Desktop window settings (don't touch)
│   └── preload.js       ← Electron security (don't touch)
│
├── android/             ← Created automatically by: npx cap add android
├── ios/                 ← Created automatically by: npx cap add ios
├── dist/                ← Created automatically by: npm run build
├── dist-electron/       ← Created automatically by: npm run electron:build
│
├── EduTugOfWar.html     ← Standalone file — works without Node.js at all
├── capacitor.config.ts  ← Mobile app ID (don't touch unless renaming)
├── vite.config.js       ← Build settings (don't touch)
├── package.json         ← All commands (don't touch)
└── .env.example         ← Copy to .env, add API keys
```

---

## 🆘 Common Issues

### `npm run dev` — "command not found"
→ Node.js is not installed. Go to https://nodejs.org, download and install LTS.

### `npm run dev` — port 5173 in use
→ Another process is using that port. Either stop it, or add `--port 5174` to the command.

### `npm run electron:dev` — blank window
→ Vite hasn't started yet. Wait 5 seconds and the window will load.

### `npx cap add android` — "Android SDK not found"
→ Open Android Studio → SDK Manager → install Android SDK 33.  
→ Set the path: in VS Code terminal run:
```bash
# Windows (replace YourUsername):
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
setx ANDROID_HOME "%ANDROID_HOME%"

# Mac/Linux:
export ANDROID_HOME=$HOME/Library/Android/sdk
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
```

### Android Studio — Gradle sync fails
→ Android Studio → File → **Invalidate Caches** → Restart → try again.

### iOS — "No signing certificate"
→ Xcode → Preferences → Accounts → add your Apple ID.  
→ Then in the project: Signing & Capabilities → Team → select your account.

---

## 📊 Full workflow — what runs where

```
VS Code (one folder, one terminal)
│
├── npm run dev          → browser at localhost:5173
│
├── npm run electron:dev → VS Code terminal + a desktop window opens
├── npm run electron:build → produces the .exe (stays in VS Code)
│
├── npm run cap:android  → VS Code builds, then Android Studio opens
│   └── Android Studio   → you click Build APK (separate app, same folder)
│
└── npm run cap:ios      → VS Code builds, then Xcode opens (Mac)
    └── Xcode            → you click Run (separate app, same folder)
```

Android Studio and Xcode open as separate apps but they read from the **same project folder** — no copying, no duplication.

---

Built by **EdTek Interactive** 🇳🇬
