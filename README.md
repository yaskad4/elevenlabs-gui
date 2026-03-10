# ElevenLabs GUI

A cross-platform desktop application for ElevenLabs Text-to-Speech (TTS) and Speech-to-Text (STT) — built with Electron.

![GitHub release](https://img.shields.io/github/v/release/YasKad/elevenlabs-gui)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Features

- 🎙️ **Text to Speech (TTS)** — Convert `.txt` files to high-quality audio using ElevenLabs
- 🎧 **Speech to Text (STT)** — Transcribe audio files (MP3, WAV, M4A, FLAC) using ElevenLabs Scribe
- 🎛️ **Voice & Model Selection** — Choose from popular voices or paste a custom Voice ID
- ⚙️ **Fine-tuned Settings** — Adjust stability, similarity boost, style, and speaker boost
- 📊 **Credit Dashboard** — See remaining credits, plan limit, and billing renewal date in real time
- 💡 **Cost Estimation** — See the estimated credit cost before generating
- 🌐 **Bilingual UI** — Full English / Spanish interface support
- 🔒 **Secure** — API Key and Voice ID are masked and saved locally (localStorage), never hardcoded
- 🗂️ **Smart Chunking** — Long texts are automatically split at sentence boundaries (5,000 char limit per chunk)
- 🔤 **Phonetic Translation** — Optional conversion of acronyms to phonetic Spanish (e.g. MCP → emecepe)
- 📁 **Drag & Drop** — Drag text or audio files directly onto the app window

---

## Screenshots

> *(Add screenshots here)*

---

## Installation

### Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- An [ElevenLabs](https://elevenlabs.io) account and API Key

### Download pre-built release (recommended)

Pre-built installers for Windows and Linux are available on the [Releases page](https://github.com/YasKad/elevenlabs-gui/releases):

| Platform | File |
|---|---|
| **Windows** | `ElevenLabs GUI Setup x.x.x.exe` |
| **Linux** | `ElevenLabs GUI-x.x.x.AppImage` |

No build tools required — just download and run.

### Run locally (from source)

```bash
git clone https://github.com/YasKad/elevenlabs-gui.git
cd elevenlabs-gui
npm install
npm start
```

---

## API Key Permissions

When creating your ElevenLabs API Key, enable only these permissions:

| Permission | Level |
|---|---|
| Text to Speech | Access |
| Speech to Text | Access |
| User | Read |

---

## Building Distributable Installers

### Build locally (from Windows)

```bash
# Windows installer (.exe)
npm run build:win

# Linux AppImage + .deb
npm run build:linux

# Both at once
npm run build:all
```

Output files will be in the `dist/` folder.

### Automated builds via GitHub Actions

Push a version tag to trigger automatic builds for Windows and Linux:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically:
1. Build a Windows `.exe` installer
2. Build a Linux `.AppImage`
3. Create a GitHub Release with both files attached

---

## Project Structure

```
eleven-gui/
├── main.js          # Electron main process (IPC handlers, API calls)
├── preload.js       # Context bridge (secure renderer ↔ main communication)
├── renderer.js      # Frontend logic
├── index.html       # Application layout
├── styles.css       # Styling
└── .github/
    └── workflows/
        └── build.yml  # GitHub Actions CI/CD pipeline
```

---

## License

MIT © [YasKad](https://github.com/YasKad)
