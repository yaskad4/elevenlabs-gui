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
const inputCard = document.getElementById('inputCard'); // Added for drag and drop

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

// Quota Dashboard Elements
const quotaDashboard = document.getElementById('quotaDashboard');
const quotaUsed = document.getElementById('quotaUsed');
const quotaLimit = document.getElementById('quotaLimit');
const quotaRenewal = document.getElementById('quotaRenewal');
const quotaBarFill = document.getElementById('quotaBarFill');
const quotaTier = document.getElementById('quotaTier');
const costBadge = document.getElementById('costBadge');

// State
let currentFilePath = null; // for TTS
let currentAudioPath = null; // for STT
let lastGeneratedDir = null;
let currentTab = 'tts';

// i18n Dictionary
const translations = {
    es: {
        title: "Síntesis Neuronal",
        subtitle: "Convierte texto a audio de alta fidelidad con ElevenLabs.",
        subtitle_tts: "Convierte texto a audio de alta fidelidad con ElevenLabs.",
        subtitle_stt: "Convierte de audio a texto usando ElevenLabs.",
        auth_title: "Autenticación",
        api_key_label: "Clave API ElevenLabs",
        api_key_helper: "Tu clave API se almacena localmente para esta sesión.",
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
        err_gen: "Error inesperado"
    },
    en: {
        title: "Neural Synthesis",
        subtitle: "Convert text to high-fidelity speech powered by ElevenLabs.",
        subtitle_tts: "Convert text to high-fidelity speech powered by ElevenLabs.",
        subtitle_stt: "Convert audio to text using ElevenLabs.",
        auth_title: "Authentication",
        api_key_label: "ElevenLabs API Key",
        api_key_helper: "Your API key is stored locally for this session.",
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
        err_gen: "Unexpected error"
    }
};

let currentLang = 'es';

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
        // Remove active class from all
        tabsNav.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });

        // Add active to clicked
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        currentTab = tabId;
        const targetContent = document.getElementById(`${tabId}Tab`);
        targetContent.classList.add('active');
        targetContent.style.display = 'flex';

        // Update subtitle based on active tab
        const subtitle = document.querySelector('.subtitle');
        subtitle.textContent = translations[currentLang][tabId === 'stt' ? 'subtitle_stt' : 'subtitle_tts'];

        // Disable Settings panel if we are in STT (Scribe has no settings currently)
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

        // Update UI with file path (truncate for display if too long)
        const fileName = filePath.split('\\').pop().split('/').pop();
        filePathDisplay.textContent = fileName;
        filePathDisplay.title = filePath; // Show full path on hover

        // Read and show preview
        const content = await window.electronAPI.readFile(filePath);
        filePreview.value = content;

        const charCount = document.getElementById('charCount');
        charCount.textContent = `${content.length} caracteres`;
        if (content.length > 5000) {
            charCount.classList.add('warning');
            charCount.textContent += ' (Se dividirá en varias partes)';
        } else {
            charCount.classList.remove('warning');
        }

        previewArea.style.display = 'block';

        // Update cost estimate badge
        updateCostBadge(content.length);

        // Enable generation if we have a file and API key
        updateGenerateButtonStatus();
    } catch (error) {
        showToast(`${translations[currentLang].err_open}: ${error.message}`, 'error');
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
            // Electron provides the absolute path on the File object
            await loadFile(file.path);
        } else {
            showToast(translations[currentLang].err_drop, "error");
        }
    }
});

apiKeyInput.addEventListener('input', updateGenerateButtonStatus);

generateBtn.addEventListener('click', async () => {
    if (!currentFilePath) return;
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        showToast(translations[currentLang].err_key, "error");
        return;
    }

    // Set loading state
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    selectFileBtn.disabled = true;
    apiKeyInput.disabled = true;
    toastActions.classList.add('hidden'); // hide folder button when starting a new generation

    // Get active Voice ID
    let voiceId = voiceSelect.value;
    if (voiceId === 'custom') {
        voiceId = customVoiceInput.value.trim();
        if (!voiceId) {
            showToast("Por favor ingresa un ID de voz personalizado.", "error"); // Generic fallback error
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
            apiKey: apiKey,
            options: options
        });

        if (result.success) {
            lastGeneratedDir = result.savedPath; // save path to open later
            toastActions.classList.remove('hidden');

            if (result.savedPaths && result.savedPaths.length > 1) {
                showToast(translations[currentLang].success_multi.replace('{count}', result.savedPaths.length), 'success');
            } else {
                showToast(translations[currentLang].success_single.replace('{path}', result.savedPath), 'success');
            }
        } else {
            showToast(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast(`${translations[currentLang].err_gen}: ${error.message}`, 'error');
    } finally {
        // Reset loading state
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
        selectFileBtn.disabled = false;
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

    // Estimate cost from file size
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
            apiKey: apiKey
        });

        if (result.success) {
            lastGeneratedDir = result.savedPath; // save path to open later
            toastActions.classList.remove('hidden');
            showToast(translations[currentLang].success_stt.replace('{path}', result.savedPath), 'success');
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

    // Check if TTS voice is selected
    const voiceSelected = voiceSelect.value !== "" && (voiceSelect.value !== "custom" || customVoiceInput.value.trim().length > 0);

    generateBtn.disabled = !(currentFilePath && hasKey && voiceSelected);
    transcribeBtn.disabled = !(currentAudioPath && hasKey);
}

// Re-evaluate button status when voice selection changes
voiceSelect.addEventListener('change', updateGenerateButtonStatus);
customVoiceInput.addEventListener('input', updateGenerateButtonStatus);

// Options Saving logic
function saveSettings() {
    localStorage.setItem('elevenlabs_api_key', apiKeyInput.value.trim());
    localStorage.setItem('elevenlabs_voice_id', voiceSelect.value);
    if (voiceSelect.value === 'custom') {
        localStorage.setItem('elevenlabs_custom_voice', customVoiceInput.value.trim());
    }
}

apiKeyInput.addEventListener('input', () => {
    saveSettings();
    updateGenerateButtonStatus();
    // Trigger quota fetch when key changes with a small debounce
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
    const savedKey = localStorage.getItem('elevenlabs_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        // Fetch quota on load if key exists
        fetchAndUpdateQuota();
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
        quotaDashboard.style.display = 'none';
        return;
    }

    // Show panel immediately (loading state)
    quotaDashboard.style.display = 'block';
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

            // Color bar based on usage
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

            // Auto-collapse auth card on successful authentication
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

function updateSttCostBadge(sizeBytes) {
    // Estimate duration: assume 128 kbps MP3 as a general baseline
    // 128 kbps = 16000 bytes/s → seconds ≈ size / 16000
    const estimatedSeconds = sizeBytes / 16000;
    const estimatedMins = estimatedSeconds / 60;
    // ElevenLabs Scribe: 1000 credits per minute
    const estimatedCredits = Math.ceil(estimatedMins * 1000);
    const minsDisplay = estimatedMins < 1
        ? `< 1`
        : estimatedMins.toFixed(1);

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

    // clear any existing timeout so we don't prematurely hide
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Hide after 7 seconds, give time to click 'open folder'
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 7000);
}

// Initialize
loadSettings();
updateLanguage('es'); // default
