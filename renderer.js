// DOM Elements
const selectFileBtn = document.getElementById('selectFileBtn');
const filePathDisplay = document.getElementById('filePathDisplay');
const filePreview = document.getElementById('filePreview');
const previewArea = document.getElementById('previewArea');
const generateBtn = document.getElementById('generateBtn');
const apiKeyInput = document.getElementById('apiKey');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastActions = document.getElementById('toastActions');
const openFolderBtn = document.getElementById('openFolderBtn');
const inputCard = document.getElementById('inputCard');
const pasteClipboardBtn = document.getElementById('pasteClipboardBtn');

// STT Elements
const sttInputCard = document.getElementById('sttInputCard');
const selectAudioBtn = document.getElementById('selectAudioBtn');
const audioPathDisplay = document.getElementById('audioPathDisplay');
const transcribeBtn = document.getElementById('transcribeBtn');
const sttSpinner = document.getElementById('sttSpinner');
const sttCostBadge = document.getElementById('sttCostBadge');
const tabsNav = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// UI Settings Elements
const stabilitySlider = document.getElementById('stabilitySlider');
const stabilityVal = document.getElementById('stabilityVal');
const similaritySlider = document.getElementById('similaritySlider');
const similarityVal = document.getElementById('similarityVal');
const styleSlider = document.getElementById('styleSlider');
const styleVal = document.getElementById('styleVal');
const speakerBoostToggle = document.getElementById('speakerBoostToggle');
const phoneticToggle = document.getElementById('phoneticToggle');
const modelSelect = document.getElementById('modelSelect');
const voiceSelect = document.getElementById('voiceSelect');
const customVoiceInput = document.getElementById('customVoiceInput');

const langSwitch = document.getElementById('langSwitch');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const fetchVoicesBtn = document.getElementById('fetchVoicesBtn');
const voicesStatus = document.getElementById('voicesStatus');

// Output folder elements
const ttsOutputDirEl = document.getElementById('ttsOutputDir');
const selectTtsOutputBtn = document.getElementById('selectTtsOutputBtn');
const clearTtsOutputBtn = document.getElementById('clearTtsOutputBtn');
const sttOutputDirEl = document.getElementById('sttOutputDir');
const selectSttOutputBtn = document.getElementById('selectSttOutputBtn');
const clearSttOutputBtn = document.getElementById('clearSttOutputBtn');

// Quota Dashboard Elements
const quotaDashboard = document.getElementById('quotaDashboard');
const quotaUsed = document.getElementById('quotaUsed');
const quotaLimit = document.getElementById('quotaLimit');
const quotaRenewal = document.getElementById('quotaRenewal');
const quotaBarFill = document.getElementById('quotaBarFill');
const quotaTier = document.getElementById('quotaTier');
const costBadge = document.getElementById('costBadge');

// History Elements
const ttsHistoryCard = document.getElementById('ttsHistoryCard');
const ttsHistoryList = document.getElementById('ttsHistoryList');
const ttsAudioPlayer = document.getElementById('ttsAudioPlayer');
const clearTtsHistoryBtn = document.getElementById('clearTtsHistoryBtn');

const sttHistoryCard = document.getElementById('sttHistoryCard');
const sttHistoryList = document.getElementById('sttHistoryList');
const sttAudioPlayer = document.getElementById('sttAudioPlayer');
const clearSttHistoryBtn = document.getElementById('clearSttHistoryBtn');

// State
let currentFilePath = null; // for TTS
let currentAudioPath = null; // for STT
let lastGeneratedDir = null;
let currentTab = 'tts';

// History arrays (session-only)
let ttsHistory = [];  // { filename, paths, timestamp, voiceName }
let sttHistory = [];  // { audioFilename, audioPath, transcriptionPath, text, timestamp }

// Currently playing tracker
let currentlyPlayingTtsBtn = null;
let currentlyPlayingSttBtn = null;

// i18n Dictionary
const translations = {
    es: {
        title: "Síntesis Neuronal",
        subtitle: "Convierte texto a audio de alta fidelidad con ElevenLabs.",
        subtitle_tts: "Convierte texto a audio de alta fidelidad con ElevenLabs.",
        subtitle_stt: "Convierte de audio a texto usando ElevenLabs.",
        auth_title: "Autenticación",
        api_key_label: "Clave API ElevenLabs",
        api_key_helper: "Solo para esta sesión si no guardas.",
        save_api_key: "Guardar clave localmente",
        settings_title: "Ajustes de Voz",
        model_label: "Modelo",
        voice_label: "Voz",
        stability: "Estabilidad",
        similarity: "Similitud",
        style_exagg: "Estilo",
        speaker_boost: "Mejora de altavoz",
        phonetic_toggle: "Traducir siglas a fonética (Ej: MCP -> emecepe)",
        input_title: "Entrada de Texto",
        choose_file: "Elegir archivo .txt",
        paste_clipboard: "Pegar Portapapeles",
        no_file: "Ningún archivo seleccionado",
        preview_label: "Vista Previa:",
        generate_btn: "Generar Audio",
        open_folder: "Abrir Carpeta",
        tab_tts: "Texto a Audio (TTS)",
        tab_stt: "Audio a Texto (STT)",
        stt_input_title: "Entrada de Audio",
        choose_audio: "Elegir archivo (MP3, WAV, M4A)",
        transcribe_btn: "Transcribir Audio",
        quota_remaining: "Restantes",
        quota_limit: "Límite",
        quota_renewal: "Renovación",
        cost_label: "Costo estimado de esta operación: {chars} créditos",
        stt_cost_label: "Costo estimado de transcripción: ~{credits} créditos ({mins} min)",
        err_open: "Error al abrir archivo",
        err_drop: "Por favor suelta solo archivos .txt",
        err_drop_audio: "Por favor suelta un archivo de audio (.mp3, .wav, .m4a)",
        err_key: "Por favor ingresa tu API Key de ElevenLabs.",
        success_multi: "¡Hecho! Texto dividido en {count} partes de audio.",
        success_single: "¡Hecho! Audio guardado en:\n{path}",
        success_stt: "¡Hecho! Transcripción guardada en:\n{path}",
        err_gen: "Error inesperado",
        update_available: "Nueva versión disponible",
        history_tts_title: "Historial TTS",
        history_stt_title: "Historial STT",
        err_clipboard: "No se pudo leer el portapapeles.",
        err_clipboard_empty: "El portapapeles está vacío.",
        clipboard_loaded: "Texto del portapapeles cargado.",
        play: "Reproducir",
        stop: "Detener",
        history_parts: "parte(s)",
        history_audio: "Audio fuente",
        history_transcription: "Transcripción",
        voice_placeholder: "-- Sincroniza tus voces --",
        voice_custom: "-- Pegar ID Personalizado --",
        voices_loading: "Cargando voces...",
        voices_loaded: "{count} voces cargadas",
        voices_cached: "{count} voces guardadas localmente",
        voices_error: "Error al cargar voces",
        voices_fetch_title: "Sincronizar mis voces de ElevenLabs",
        output_folder_label: "Carpeta de salida",
        output_folder_btn: "Cambiar",
        output_folder_default: "Misma carpeta del archivo fuente",
        open_in_explorer: "Abrir en explorador"
    },
    en: {
        title: "Neural Synthesis",
        subtitle: "Convert text to high-fidelity speech powered by ElevenLabs.",
        subtitle_tts: "Convert text to high-fidelity speech powered by ElevenLabs.",
        subtitle_stt: "Convert audio to text using ElevenLabs.",
        auth_title: "Authentication",
        api_key_label: "ElevenLabs API Key",
        api_key_helper: "Only for this session if not saved.",
        save_api_key: "Save key locally",
        settings_title: "Voice Settings",
        model_label: "Model",
        voice_label: "Voice",
        stability: "Stability",
        similarity: "Similarity",
        style_exagg: "Style Exaggeration",
        speaker_boost: "Speaker Boost",
        phonetic_toggle: "Translate acronyms to Spanish phonetics (e.g. MCP -> emecepe)",
        input_title: "Script Input",
        choose_file: "Choose .txt File",
        paste_clipboard: "Paste Clipboard",
        no_file: "No file selected",
        preview_label: "Content Preview:",
        generate_btn: "Generate Audio",
        open_folder: "Open Folder",
        tab_tts: "Text to Speech (TTS)",
        tab_stt: "Speech to Text (STT)",
        stt_input_title: "Audio Input",
        choose_audio: "Choose file (MP3, WAV, M4A)",
        transcribe_btn: "Transcribe Audio",
        quota_remaining: "Remaining",
        quota_limit: "Limit",
        quota_renewal: "Renewal",
        cost_label: "Estimated cost for this operation: {chars} credits",
        stt_cost_label: "Estimated transcription cost: ~{credits} credits ({mins} min)",
        err_open: "Error opening file",
        err_drop: "Please drop only .txt files",
        err_drop_audio: "Please drop an audio file (.mp3, .wav, .m4a)",
        err_key: "Please enter your ElevenLabs API Key.",
        success_multi: "Done! Text split into {count} audio parts.",
        success_single: "Done! Audio saved to:\n{path}",
        success_stt: "Done! Transcription saved to:\n{path}",
        err_gen: "Unexpected error",
        update_available: "New version available",
        history_tts_title: "TTS History",
        history_stt_title: "STT History",
        err_clipboard: "Could not read clipboard.",
        err_clipboard_empty: "Clipboard is empty.",
        clipboard_loaded: "Clipboard text loaded.",
        play: "Play",
        stop: "Stop",
        history_parts: "part(s)",
        history_audio: "Source audio",
        history_transcription: "Transcription",
        voice_placeholder: "-- Sync your voices --",
        voice_custom: "-- Paste Custom ID --",
        voices_loading: "Loading voices...",
        voices_loaded: "{count} voices loaded",
        voices_cached: "{count} voices saved locally",
        voices_error: "Error loading voices",
        voices_fetch_title: "Sync my ElevenLabs voices",
        output_folder_label: "Output folder",
        output_folder_btn: "Change",
        output_folder_default: "Same folder as source file",
        open_in_explorer: "Open in explorer"
    }
};

let currentLang = 'es';

// ── Theme toggle ──
const MOON_ICON = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const SUN_ICON = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;

let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
        document.body.classList.add('light');
        themeIcon.innerHTML = MOON_ICON;
        themeToggleBtn.title = 'Switch to dark theme';
    } else {
        document.body.classList.remove('light');
        themeIcon.innerHTML = SUN_ICON;
        themeToggleBtn.title = 'Switch to light theme';
    }
    localStorage.setItem('theme', theme);
}

applyTheme(currentTheme);

themeToggleBtn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ── Voice management ──
const VOICES_CACHE_KEY = 'cachedVoices';

function populateVoiceSelect(voices) {
    const currentVal = voiceSelect.value;
    voiceSelect.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.textContent = translations[currentLang].voice_placeholder;
    voiceSelect.appendChild(placeholder);

    voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.voice_id;
        opt.textContent = v.name;
        voiceSelect.appendChild(opt);
    });

    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = translations[currentLang].voice_custom;
    voiceSelect.appendChild(customOpt);

    // Restore previous selection if still valid
    if (currentVal && [...voiceSelect.options].some(o => o.value === currentVal)) {
        voiceSelect.value = currentVal;
    } else {
        voiceSelect.value = '';
    }
}

// Load cached voices on startup
const cachedVoices = JSON.parse(localStorage.getItem(VOICES_CACHE_KEY) || '[]');
if (cachedVoices.length) {
    populateVoiceSelect(cachedVoices);
    voicesStatus.textContent = translations['es'].voices_cached.replace('{count}', cachedVoices.length);
}

fetchVoicesBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        showToast(translations[currentLang].err_key, 'error');
        return;
    }

    fetchVoicesBtn.disabled = true;
    fetchVoicesBtn.classList.add('spinning');
    voicesStatus.textContent = translations[currentLang].voices_loading;

    const result = await window.electronAPI.fetchVoices({ apiKey });

    fetchVoicesBtn.disabled = false;
    fetchVoicesBtn.classList.remove('spinning');

    if (result.success) {
        localStorage.setItem(VOICES_CACHE_KEY, JSON.stringify(result.voices));
        populateVoiceSelect(result.voices);
        voicesStatus.textContent = translations[currentLang].voices_loaded.replace('{count}', result.voices.length);
        updateGenerateButtonStatus();
    } else {
        voicesStatus.textContent = translations[currentLang].voices_error;
        showToast(`${translations[currentLang].voices_error}: ${result.error}`, 'error');
    }
});

// ── Output folder logic ──
let ttsOutputDir = localStorage.getItem('tts_output_dir') || null;
let sttOutputDir = localStorage.getItem('stt_output_dir') || null;

function applyOutputDir(el, clearBtn, dir, lang) {
    if (dir) {
        el.textContent = dir;
        el.classList.add('custom');
        clearBtn.classList.remove('hidden');
    } else {
        el.textContent = translations[lang].output_folder_default;
        el.classList.remove('custom');
        clearBtn.classList.add('hidden');
    }
}

// Apply saved dirs on startup
applyOutputDir(ttsOutputDirEl, clearTtsOutputBtn, ttsOutputDir, 'es');
applyOutputDir(sttOutputDirEl, clearSttOutputBtn, sttOutputDir, 'es');

selectTtsOutputBtn.addEventListener('click', async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
        ttsOutputDir = folder;
        localStorage.setItem('tts_output_dir', folder);
        applyOutputDir(ttsOutputDirEl, clearTtsOutputBtn, folder, currentLang);
    }
});

clearTtsOutputBtn.addEventListener('click', () => {
    ttsOutputDir = null;
    localStorage.removeItem('tts_output_dir');
    applyOutputDir(ttsOutputDirEl, clearTtsOutputBtn, null, currentLang);
});

selectSttOutputBtn.addEventListener('click', async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
        sttOutputDir = folder;
        localStorage.setItem('stt_output_dir', folder);
        applyOutputDir(sttOutputDirEl, clearSttOutputBtn, folder, currentLang);
    }
});

clearSttOutputBtn.addEventListener('click', () => {
    sttOutputDir = null;
    localStorage.removeItem('stt_output_dir');
    applyOutputDir(sttOutputDirEl, clearSttOutputBtn, null, currentLang);
});

function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    if (!currentFilePath) {
        document.getElementById('filePathDisplay').textContent = translations[lang]['no_file'];
    }

    // Update voice select texts (dynamically created options)
    const placeholderOpt = voiceSelect.querySelector('option[value=""]');
    if (placeholderOpt) placeholderOpt.textContent = translations[lang].voice_placeholder;
    const customOpt = voiceSelect.querySelector('option[value="custom"]');
    if (customOpt) customOpt.textContent = translations[lang].voice_custom;

    // Update voices status if showing a count
    const cached = JSON.parse(localStorage.getItem(VOICES_CACHE_KEY) || '[]');
    if (cached.length && voicesStatus.textContent) {
        voicesStatus.textContent = translations[lang].voices_cached.replace('{count}', cached.length);
    }

    // Update output folder default text if no custom dir set
    if (!ttsOutputDir) ttsOutputDirEl.textContent = translations[lang].output_folder_default;
    if (!sttOutputDir) sttOutputDirEl.textContent = translations[lang].output_folder_default;
}

langSwitch.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Update slider values dynamically
[
    { slider: stabilitySlider, val: stabilityVal },
    { slider: similaritySlider, val: similarityVal },
    { slider: styleSlider, val: styleVal }
].forEach(item => {
    item.slider.addEventListener('input', (e) => {
        item.val.textContent = e.target.value;
    });
});

// Custom Voice ID Input Logic
voiceSelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
        customVoiceInput.style.display = 'block';
    } else {
        customVoiceInput.style.display = 'none';
        customVoiceInput.value = '';
    }
});


// Handle Tab Switching
tabsNav.forEach(btn => {
    btn.addEventListener('click', () => {
        tabsNav.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        currentTab = tabId;
        const targetContent = document.getElementById(`${tabId}Tab`);
        targetContent.classList.add('active');
        targetContent.style.display = 'flex';

        const subtitle = document.querySelector('.subtitle');
        subtitle.textContent = translations[currentLang][tabId === 'stt' ? 'subtitle_stt' : 'subtitle_tts'];

        const settingsPanel = document.querySelector('.settings-panel');
        if (tabId === 'stt') {
            settingsPanel.style.display = 'none';
        } else {
            settingsPanel.style.display = 'block';
        }
    });
});

// Helper to load file into UI
async function loadFile(filePath) {
    try {
        currentFilePath = filePath;

        const fileName = filePath.split('\\').pop().split('/').pop();
        filePathDisplay.textContent = fileName;
        filePathDisplay.title = filePath;

        const content = await window.electronAPI.readFile(filePath);
        filePreview.value = content;

        refreshCharCount();
        previewArea.style.display = 'block';
        updateCostBadge(content.length);
        updateGenerateButtonStatus();
    } catch (error) {
        showToast(`${translations[currentLang].err_open}: ${error.message}`, 'error');
    }
}

// Feature 4: live char count on textarea edit
filePreview.addEventListener('input', () => {
    refreshCharCount();
    updateCostBadge(filePreview.value.length);
    updateGenerateButtonStatus();
});

function refreshCharCount() {
    const charCount = document.getElementById('charCount');
    const len = filePreview.value.length;
    charCount.textContent = `${len} caracteres`;
    if (len > 5000) {
        charCount.classList.add('warning');
        charCount.textContent += ' (Se dividirá en varias partes)';
    } else {
        charCount.classList.remove('warning');
    }
}

// Event Listeners
selectFileBtn.addEventListener('click', async () => {
    try {
        const filePath = await window.electronAPI.selectFile();
        if (filePath) {
            await loadFile(filePath);
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_open}: ${error.message}`, 'error');
    }
});

// Feature 3: Paste from clipboard
pasteClipboardBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (!text || !text.trim()) {
            showToast(translations[currentLang].err_clipboard_empty, 'error');
            return;
        }

        // Save to temp file and load via existing flow
        const result = await window.electronAPI.saveTempText(text);
        if (result.success) {
            await loadFile(result.filePath);
            showToast(translations[currentLang].clipboard_loaded, 'success');
        } else {
            showToast(`${translations[currentLang].err_clipboard}: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_clipboard}: ${error.message}`, 'error');
    }
});

// Drag and Drop Listeners
inputCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputCard.classList.add('drag-over');
});

inputCard.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputCard.classList.remove('drag-over');
});

inputCard.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputCard.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.txt')) {
            await loadFile(file.path);
        } else {
            showToast(translations[currentLang].err_drop, "error");
        }
    }
});

apiKeyInput.addEventListener('input', updateGenerateButtonStatus);

generateBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        showToast(translations[currentLang].err_key, "error");
        return;
    }

    // Feature 4: use current textarea content instead of always re-reading from disk
    const textContent = filePreview.value;
    if (!textContent || !textContent.trim()) {
        showToast("El texto está vacío.", "error");
        return;
    }

    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    selectFileBtn.disabled = true;
    pasteClipboardBtn.disabled = true;
    apiKeyInput.disabled = true;
    toastActions.classList.add('hidden');

    let voiceId = voiceSelect.value;
    if (voiceId === 'custom') {
        voiceId = customVoiceInput.value.trim();
        if (!voiceId) {
            showToast("Por favor ingresa un ID de voz personalizado.", "error");
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            selectFileBtn.disabled = false;
            pasteClipboardBtn.disabled = false;
            apiKeyInput.disabled = false;
            return;
        }
    }

    const options = {
        model_id: modelSelect.value,
        voice_id: voiceId,
        stability: stabilitySlider.value,
        similarity_boost: similaritySlider.value,
        style: styleSlider.value,
        use_speaker_boost: speakerBoostToggle.checked,
        phoneticToggle: phoneticToggle.checked
    };

    try {
        const result = await window.electronAPI.generateAudio({
            filePath: currentFilePath,
            textContent: textContent,
            apiKey: apiKey,
            options: options,
            outputDir: ttsOutputDir || null
        });

        if (result.success) {
            lastGeneratedDir = result.savedPath;
            toastActions.classList.remove('hidden');

            if (result.savedPaths && result.savedPaths.length > 1) {
                showToast(translations[currentLang].success_multi.replace('{count}', result.savedPaths.length), 'success');
            } else {
                showToast(translations[currentLang].success_single.replace('{path}', result.savedPath), 'success');
            }

            // Feature 5: add to TTS history
            const voiceName = voiceSelect.options[voiceSelect.selectedIndex]?.text || voiceId;
            addTtsHistoryEntry({
                filename: result.savedPath.split('\\').pop().split('/').pop(),
                paths: result.savedPaths,
                timestamp: new Date().toLocaleTimeString(),
                voiceName
            });
        } else {
            showToast(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_gen}: ${error.message}`, 'error');
    } finally {
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
        selectFileBtn.disabled = false;
        pasteClipboardBtn.disabled = false;
        apiKeyInput.disabled = false;
    }
});

// STT File logic
async function loadAudioFile(filePath) {
    currentAudioPath = filePath;
    const fileName = filePath.split('\\').pop().split('/').pop();
    audioPathDisplay.textContent = fileName;
    audioPathDisplay.title = filePath;
    updateGenerateButtonStatus();

    try {
        const info = await window.electronAPI.getFileInfo(filePath);
        if (info && info.success) {
            updateSttCostBadge(info.sizeBytes);
        }
    } catch (_) { /* ignore */ }
}

selectAudioBtn.addEventListener('click', async () => {
    try {
        const filePath = await window.electronAPI.selectAudioFile();
        if (filePath) {
            await loadAudioFile(filePath);
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_open}: ${error.message}`, 'error');
    }
});

sttInputCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sttInputCard.classList.add('drag-over');
});

sttInputCard.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sttInputCard.classList.remove('drag-over');
});

sttInputCard.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    sttInputCard.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const validExts = ['.mp3', '.wav', '.m4a', '.flac', '.ogg'];
        if (validExts.some(ext => file.name.toLowerCase().endsWith(ext))) {
            await loadAudioFile(file.path);
        } else {
            showToast(translations[currentLang].err_drop_audio, "error");
        }
    }
});

// STT Generation Logic
transcribeBtn.addEventListener('click', async () => {
    if (!currentAudioPath) return;
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        showToast(translations[currentLang].err_key, "error");
        return;
    }

    transcribeBtn.classList.add('loading');
    transcribeBtn.disabled = true;
    selectAudioBtn.disabled = true;
    apiKeyInput.disabled = true;
    toastActions.classList.add('hidden');

    try {
        const result = await window.electronAPI.transcribeAudio({
            filePath: currentAudioPath,
            apiKey: apiKey,
            outputDir: sttOutputDir || null
        });

        if (result.success) {
            lastGeneratedDir = result.savedPath;
            toastActions.classList.remove('hidden');
            showToast(translations[currentLang].success_stt.replace('{path}', result.savedPath), 'success');

            // Feature 6: read transcript text and add to STT history
            let transcriptText = '';
            try {
                transcriptText = await window.electronAPI.readFile(result.savedPath);
            } catch (_) {}

            addSttHistoryEntry({
                audioFilename: currentAudioPath.split('\\').pop().split('/').pop(),
                audioPath: currentAudioPath,
                transcriptionPath: result.savedPath,
                text: transcriptText,
                timestamp: new Date().toLocaleTimeString()
            });
        } else {
            showToast(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_gen}: ${error.message}`, 'error');
    } finally {
        transcribeBtn.classList.remove('loading');
        transcribeBtn.disabled = false;
        selectAudioBtn.disabled = false;
        apiKeyInput.disabled = false;
    }
});

// Open folder listener
openFolderBtn.addEventListener('click', () => {
    if (lastGeneratedDir) {
        window.electronAPI.openFolder(lastGeneratedDir);
    }
});

// Helpers
function updateGenerateButtonStatus() {
    const hasKey = apiKeyInput.value.trim().length > 0;
    const hasText = filePreview.value.trim().length > 0;
    const voiceSelected = voiceSelect.value !== "" && (voiceSelect.value !== "custom" || customVoiceInput.value.trim().length > 0);

    generateBtn.disabled = !(hasText && hasKey && voiceSelected);
    transcribeBtn.disabled = !(currentAudioPath && hasKey);
}

voiceSelect.addEventListener('change', updateGenerateButtonStatus);
customVoiceInput.addEventListener('input', updateGenerateButtonStatus);

// Options Saving logic
const saveApiKeyToggle = document.getElementById('saveApiKeyToggle');

// Load toggle preference
saveApiKeyToggle.checked = localStorage.getItem('save_api_key_pref') === 'true';

saveApiKeyToggle.addEventListener('change', () => {
    localStorage.setItem('save_api_key_pref', saveApiKeyToggle.checked);
    if (!saveApiKeyToggle.checked) {
        localStorage.removeItem('elevenlabs_api_key');
    } else if (apiKeyInput.value.trim()) {
        localStorage.setItem('elevenlabs_api_key', apiKeyInput.value.trim());
    }
});

function saveSettings() {
    if (saveApiKeyToggle.checked) {
        localStorage.setItem('elevenlabs_api_key', apiKeyInput.value.trim());
    }
    localStorage.setItem('elevenlabs_voice_id', voiceSelect.value);
    if (voiceSelect.value === 'custom') {
        localStorage.setItem('elevenlabs_custom_voice', customVoiceInput.value.trim());
    }
}

apiKeyInput.addEventListener('input', () => {
    saveSettings();
    updateGenerateButtonStatus();
    clearTimeout(window.subscriptionDebounce);
    window.subscriptionDebounce = setTimeout(fetchAndUpdateQuota, 800);
});

voiceSelect.addEventListener('change', () => {
    saveSettings();
    updateGenerateButtonStatus();
});

customVoiceInput.addEventListener('input', () => {
    saveSettings();
    updateGenerateButtonStatus();
});

function loadSettings() {
    if (saveApiKeyToggle.checked) {
        const savedKey = localStorage.getItem('elevenlabs_api_key');
        if (savedKey) {
            apiKeyInput.value = savedKey;
            fetchAndUpdateQuota();
        }
    }

    const savedVoice = localStorage.getItem('elevenlabs_voice_id');
    if (savedVoice) {
        voiceSelect.value = savedVoice;
        if (savedVoice === 'custom') {
            customVoiceInput.style.display = 'block';
            const savedCustom = localStorage.getItem('elevenlabs_custom_voice');
            if (savedCustom) customVoiceInput.value = savedCustom;
        }
    }
    updateGenerateButtonStatus();
}

// Quota Dashboard Logic
const quotaError = document.getElementById('quotaError');
const quotaContent = document.getElementById('quotaContent');
const refreshQuotaBtn = document.getElementById('refreshQuotaBtn');

refreshQuotaBtn.addEventListener('click', fetchAndUpdateQuota);

async function fetchAndUpdateQuota() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        return;
    }

    quotaError.style.display = 'none';
    quotaContent.style.display = 'block';
    quotaUsed.textContent = '…';
    quotaLimit.textContent = '…';
    quotaRenewal.textContent = '…';
    quotaBarFill.style.width = '0%';

    try {
        const result = await window.electronAPI.fetchSubscription({ apiKey });

        if (result.success) {
            const used = result.character_count ?? 0;
            const limit = result.character_limit ?? 0;
            const remaining = limit - used;
            const pct = limit > 0 ? Math.min((used / limit) * 100, 100).toFixed(1) : 0;
            const resetDate = result.next_character_count_reset_unix
                ? new Date(result.next_character_count_reset_unix * 1000).toLocaleDateString()
                : '—';

            quotaUsed.textContent = remaining.toLocaleString();
            quotaLimit.textContent = limit.toLocaleString();
            quotaRenewal.textContent = resetDate;
            quotaBarFill.style.width = `${pct}%`;
            quotaBarFill.title = `Usados: ${used.toLocaleString()} créditos`;

            if (pct > 90) {
                quotaBarFill.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            } else if (pct > 70) {
                quotaBarFill.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            } else {
                quotaBarFill.style.background = 'var(--accent-gradient)';
            }

            const tierStr = result.tier
                ? result.tier.charAt(0).toUpperCase() + result.tier.slice(1)
                : '';
            quotaTier.textContent = tierStr ? `Plan: ${tierStr}` : '';

            quotaError.style.display = 'none';
            quotaContent.style.display = 'block';

            collapseAuthCard();
        } else {
            quotaContent.style.display = 'none';
            quotaError.style.display = 'block';
            quotaError.textContent = result.error || 'Error al obtener saldo.';
        }
    } catch (e) {
        quotaContent.style.display = 'none';
        quotaError.style.display = 'block';
        quotaError.textContent = `Error: ${e.message}`;
    }
}

// Auth Card Collapse/Expand
const authBody = document.getElementById('authBody');
const authToggleBtn = document.getElementById('authToggleBtn');
let authCollapsed = false;

function collapseAuthCard() {
    if (authCollapsed) return;
    authCollapsed = true;
    authBody.style.display = 'none';
    authToggleBtn.classList.add('collapsed');
}

function expandAuthCard() {
    authCollapsed = false;
    authBody.style.display = 'block';
    authToggleBtn.classList.remove('collapsed');
}

authToggleBtn.addEventListener('click', () => {
    if (authCollapsed) {
        expandAuthCard();
    } else {
        collapseAuthCard();
    }
});

// Settings Panel Collapse/Expand
const settingsBody = document.getElementById('settingsBody');
const settingsToggleBtn = document.getElementById('settingsToggleBtn');
let settingsCollapsed = false;
collapseSettingsCard();

function collapseSettingsCard() {
    if (settingsCollapsed) return;
    settingsCollapsed = true;
    settingsBody.style.display = 'none';
    settingsToggleBtn.classList.add('collapsed');
}

function expandSettingsCard() {
    settingsCollapsed = false;
    settingsBody.style.display = 'block';
    settingsToggleBtn.classList.remove('collapsed');
}

settingsToggleBtn.addEventListener('click', () => {
    if (settingsCollapsed) {
        expandSettingsCard();
    } else {
        collapseSettingsCard();
    }
});

function updateSttCostBadge(sizeBytes) {
    const estimatedSeconds = sizeBytes / 16000;
    const estimatedMins = estimatedSeconds / 60;
    const estimatedCredits = Math.ceil(estimatedMins * 1000);
    const minsDisplay = estimatedMins < 1 ? `< 1` : estimatedMins.toFixed(1);

    const label = translations[currentLang].stt_cost_label
        .replace('{credits}', estimatedCredits.toLocaleString())
        .replace('{mins}', minsDisplay);
    sttCostBadge.textContent = label;
    sttCostBadge.classList.remove('hidden');
}

function updateCostBadge(charCount) {
    if (!charCount || charCount <= 0) {
        costBadge.classList.add('hidden');
        return;
    }
    const label = translations[currentLang].cost_label.replace('{chars}', charCount.toLocaleString());
    costBadge.textContent = label;
    costBadge.classList.remove('hidden');
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast show';
    toast.classList.add(type);

    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 7000);
}

// ─── Feature 2: Version badge & update check ───────────────────────────────
async function initVersionCheck() {
    try {
        const version = await window.electronAPI.getAppVersion();
        document.getElementById('versionBadge').textContent = `v${version}`;

        const updateResult = await window.electronAPI.checkForUpdates();
        if (updateResult.success && updateResult.latestTag) {
            const latest = updateResult.latestTag.replace(/^v/, '');
            const current = version.replace(/^v/, '');
            if (latest !== current) {
                const badge = document.getElementById('updateBadge');
                badge.classList.remove('hidden');
                badge.href = updateResult.htmlUrl || 'https://github.com/yaskad4/elevenlabs-gui/releases';
            }
        }
    } catch (e) {
        // silently fail
    }
}

// ─── Feature 5: TTS History ────────────────────────────────────────────────
function addTtsHistoryEntry(entry) {
    ttsHistory.unshift(entry);
    renderTtsHistory();
    ttsHistoryCard.style.display = 'block';
}

function renderTtsHistory() {
    ttsHistoryList.innerHTML = '';
    ttsHistory.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = 'history-entry';

        const info = document.createElement('div');
        info.className = 'history-info';

        const name = document.createElement('span');
        name.className = 'history-filename';
        name.textContent = entry.filename;
        name.title = entry.paths ? entry.paths.join('\n') : entry.filename;

        const meta = document.createElement('span');
        meta.className = 'history-meta';
        const partsText = entry.paths && entry.paths.length > 1
            ? ` · ${entry.paths.length} ${translations[currentLang].history_parts}`
            : '';
        meta.textContent = `${entry.timestamp} · ${entry.voiceName}${partsText}`;

        info.appendChild(name);
        info.appendChild(meta);

        // Play buttons (one per audio part)
        const controls = document.createElement('div');
        controls.className = 'history-controls';

        const paths = entry.paths || [];
        paths.forEach((audioPath, partIdx) => {
            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn';
            const partLabel = paths.length > 1 ? ` ${partIdx + 1}` : '';
            playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}${partLabel}</span>`;
            playBtn.setAttribute('data-path', audioPath);

            playBtn.addEventListener('click', async () => {
                // Stop if currently playing this button
                if (playBtn.classList.contains('playing')) {
                    ttsAudioPlayer.pause();
                    ttsAudioPlayer.src = '';
                    playBtn.classList.remove('playing');
                    playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}${partLabel}</span>`;
                    currentlyPlayingTtsBtn = null;
                    return;
                }

                // Stop any other playing button
                if (currentlyPlayingTtsBtn) {
                    ttsAudioPlayer.pause();
                    ttsAudioPlayer.src = '';
                    currentlyPlayingTtsBtn.classList.remove('playing');
                    const prevPartLabel = currentlyPlayingTtsBtn.querySelector('span').textContent.replace(translations[currentLang].stop, translations[currentLang].play);
                    currentlyPlayingTtsBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${prevPartLabel}</span>`;
                }

                // Load and play
                playBtn.disabled = true;
                const result = await window.electronAPI.getAudioBase64(audioPath);
                playBtn.disabled = false;
                if (!result.success) {
                    showToast('Error al reproducir audio.', 'error');
                    return;
                }

                ttsAudioPlayer.src = result.dataUrl;
                ttsAudioPlayer.play();
                playBtn.classList.add('playing');
                playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>${translations[currentLang].stop}${partLabel}</span>`;
                currentlyPlayingTtsBtn = playBtn;

                ttsAudioPlayer.onended = () => {
                    playBtn.classList.remove('playing');
                    playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}${partLabel}</span>`;
                    currentlyPlayingTtsBtn = null;
                };
            });

            controls.appendChild(playBtn);
        });

        // Open folder button
        const folderBtn = document.createElement('button');
        folderBtn.className = 'folder-btn';
        folderBtn.title = translations[currentLang].open_in_explorer;
        folderBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
        folderBtn.addEventListener('click', () => {
            const targetPath = entry.paths && entry.paths[0] ? entry.paths[0] : entry.filename;
            window.electronAPI.openFolder(targetPath);
        });
        controls.appendChild(folderBtn);

        row.appendChild(info);
        row.appendChild(controls);
        ttsHistoryList.appendChild(row);
    });
}

clearTtsHistoryBtn.addEventListener('click', () => {
    ttsAudioPlayer.pause();
    ttsAudioPlayer.src = '';
    currentlyPlayingTtsBtn = null;
    ttsHistory = [];
    ttsHistoryList.innerHTML = '';
    ttsHistoryCard.style.display = 'none';
});

// ─── Feature 6: STT History ────────────────────────────────────────────────
function addSttHistoryEntry(entry) {
    sttHistory.unshift(entry);
    renderSttHistory();
    sttHistoryCard.style.display = 'block';
}

function renderSttHistory() {
    sttHistoryList.innerHTML = '';
    sttHistory.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = 'history-entry stt-entry';

        // Header row: audio filename + play button
        const audioRow = document.createElement('div');
        audioRow.className = 'stt-audio-row';

        const audioInfo = document.createElement('span');
        audioInfo.className = 'history-filename';
        audioInfo.textContent = `🎵 ${entry.audioFilename}`;
        audioInfo.title = entry.audioPath;

        const ts = document.createElement('span');
        ts.className = 'history-meta';
        ts.textContent = entry.timestamp;

        const playBtn = document.createElement('button');
        playBtn.className = 'play-btn';
        playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}</span>`;

        playBtn.addEventListener('click', async () => {
            if (playBtn.classList.contains('playing')) {
                sttAudioPlayer.pause();
                sttAudioPlayer.src = '';
                playBtn.classList.remove('playing');
                playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}</span>`;
                currentlyPlayingSttBtn = null;
                return;
            }

            if (currentlyPlayingSttBtn) {
                sttAudioPlayer.pause();
                sttAudioPlayer.src = '';
                currentlyPlayingSttBtn.classList.remove('playing');
                currentlyPlayingSttBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}</span>`;
            }

            playBtn.disabled = true;
            const result = await window.electronAPI.getAudioBase64(entry.audioPath);
            playBtn.disabled = false;
            if (!result.success) {
                showToast('Error al reproducir audio.', 'error');
                return;
            }

            sttAudioPlayer.src = result.dataUrl;
            sttAudioPlayer.play();
            playBtn.classList.add('playing');
            playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>${translations[currentLang].stop}</span>`;
            currentlyPlayingSttBtn = playBtn;

            sttAudioPlayer.onended = () => {
                playBtn.classList.remove('playing');
                playBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${translations[currentLang].play}</span>`;
                currentlyPlayingSttBtn = null;
            };
        });

        const sttFolderBtn = document.createElement('button');
        sttFolderBtn.className = 'folder-btn';
        sttFolderBtn.title = translations[currentLang].open_in_explorer;
        sttFolderBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
        sttFolderBtn.addEventListener('click', () => {
            window.electronAPI.openFolder(entry.transcriptionPath || entry.audioPath);
        });

        audioRow.appendChild(audioInfo);
        audioRow.appendChild(ts);
        audioRow.appendChild(playBtn);
        audioRow.appendChild(sttFolderBtn);

        // Transcription text preview
        const textPreview = document.createElement('div');
        textPreview.className = 'stt-text-preview';
        const preview = entry.text ? entry.text.substring(0, 200) + (entry.text.length > 200 ? '…' : '') : '';
        textPreview.textContent = preview;

        row.appendChild(audioRow);
        row.appendChild(textPreview);
        sttHistoryList.appendChild(row);
    });
}

clearSttHistoryBtn.addEventListener('click', () => {
    sttAudioPlayer.pause();
    sttAudioPlayer.src = '';
    currentlyPlayingSttBtn = null;
    sttHistory = [];
    sttHistoryList.innerHTML = '';
    sttHistoryCard.style.display = 'none';
});

// ─── Initialize ─────────────────────────────────────────────────────────────
loadSettings();
updateLanguage('es');
initVersionCheck();
