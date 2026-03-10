const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#111214',
      symbolColor: '#ffffff'
    },
    backgroundColor: '#0a0a0c',
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handler for text file selection
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// IPC Handler for audio file selection
ipcMain.handle('select-audio-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'm4a', 'flac', 'ogg'] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// IPC Handler for fetching ElevenLabs subscription info
ipcMain.handle('fetch-subscription', async (event, { apiKey }) => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      method: 'GET',
      headers: { 'xi-api-key': apiKey }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return {
      success: true,
      character_count: data.character_count,
      character_limit: data.character_limit,
      next_character_count_reset_unix: data.next_character_count_reset_unix,
      tier: data.tier,
      status: data.status
    };
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handler for reading a file
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error('Could not read file: ' + error.message);
  }
});

// IPC Handler for opening output folder
ipcMain.handle('open-folder', async (event, folderPath) => {
  shell.showItemInFolder(folderPath);
});

// Helper function to pronounce acronyms in Spanish
function phoneticizeAcronyms(text) {
  const pronunciationMap = {
    'A': 'a', 'B': 'be', 'C': 'ce', 'D': 'de', 'E': 'e',
    'F': 'efe', 'G': 'ge', 'H': 'hache', 'I': 'i', 'J': 'jota',
    'K': 'ka', 'L': 'ele', 'M': 'eme', 'N': 'ene', 'O': 'o',
    'P': 'pe', 'Q': 'cu', 'R': 'erre', 'S': 'ese', 'T': 'te',
    'U': 'u', 'V': 'uve', 'W': 'doble ve', 'X': 'equis', 'Y': 'i griega', 'Z': 'zeta'
  };

  // Find uppercase words with length >= 2 and replace with phonetic spelling
  return text.replace(/\b[A-Z]{2,}\b/g, (match) => {
    return match.split('').map(letter => pronunciationMap[letter] || letter).join('');
  });
}

// Helper function to split text
function splitTextIntoSentenceChunks(text, limit) {
  if (text.length <= limit) return [text];

  const chunks = [];
  // Split by keeping the period/question/exclamation
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];

  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk.length + sentence.length) <= limit) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());

      // If a single sentence itself is larger than the limit, forcefully slice it
      if (sentence.length > limit) {
        let remainder = sentence;
        while (remainder.length > limit) {
          chunks.push(remainder.substring(0, limit));
          remainder = remainder.substring(limit);
        }
        currentChunk = remainder;
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  return chunks;
}

// IPC Handler for API Call and Saving Audio
ipcMain.handle('generate-audio', async (event, { filePath, apiKey, options }) => {
  try {
    let textContent = fs.readFileSync(filePath, 'utf8');

    if (!textContent.trim()) {
      throw new Error("El archivo de texto está vacío.");
    }

    // Apply phonetic abbreviation processing before generation if enabled
    if (options.phoneticToggle) {
      textContent = phoneticizeAcronyms(textContent);
    }

    const voiceId = options.voice_id;
    if (!voiceId) {
      throw new Error("No se especificó un ID de voz.");
    }
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    // Split text into chunks <= 5000 chars
    const limit = 5000;
    const textChunks = splitTextIntoSentenceChunks(textContent, limit);

    if (textChunks.length === 0) {
      throw new Error("No text content could be parsed.");
    }

    const savedPaths = [];
    const baseDir = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const requestBody = {
        text: chunk,
        model_id: options.model_id || "eleven_multilingual_v2",
        voice_settings: {
          stability: Number(options.stability) || 0.45,
          similarity_boost: Number(options.similarity_boost) || 0.75,
          style: Number(options.style) || 0.05,
          use_speaker_boost: options.use_speaker_boost === true
        }
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP: ${response.status} en la parte ${i + 1} - ${errorData.detail?.message || JSON.stringify(errorData)}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const suffix = textChunks.length > 1 ? `_part${i + 1}` : "";
      const finalPath = path.join(baseDir, `${fileName}${suffix}.mp3`);
      fs.writeFileSync(finalPath, buffer);
      savedPaths.push(finalPath);
    }

    return { success: true, savedPath: savedPaths[0], savedPaths: savedPaths };

  } catch (error) {
    console.error("Generate error:", error);
    return { success: false, error: error.message };
  }
});

// IPC Handler for STT (Transcribe Audio)
ipcMain.handle('transcribe-audio', async (event, { filePath, apiKey }) => {
  try {
    const API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

    // Since ElevenLabs requires multipart/form-data for Scribe, we construct a standard FormData object
    // Note: Node 18+ has native fetch/FormData. Wait, Node's native FormData has quirks with files.
    // It's safer to use a Blob.
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);

    // Using global FormData
    const formData = new FormData();
    formData.append("file", blob, path.basename(filePath));
    formData.append("model_id", "scribe_v1"); // their STT model defaults to scribe_v1

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey
      },
      body: formData
    });

    if (!response.ok) {
      // It might return JSON error
      const errorText = await response.text();
      let errorMsg = errorText;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.detail?.message || JSON.stringify(json);
      } catch (e) { }
      throw new Error(`Error HTTP: ${response.status} - ${errorMsg}`);
    }

    const resultData = await response.json();
    const transcribedText = resultData.text;

    if (!transcribedText) {
      throw new Error("No se devolvió ningún texto en la transcripción.");
    }

    // Save standard output as .txt
    const baseDir = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const finalPath = path.join(baseDir, `${fileName}_transcription.txt`);

    fs.writeFileSync(finalPath, transcribedText, 'utf8');

    return { success: true, savedPath: finalPath };
  } catch (error) {
    console.error("Transcribe error:", error);
    return { success: false, error: error.message };
  }
});
