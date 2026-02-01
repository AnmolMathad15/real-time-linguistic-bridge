// Real-Time Linguistic Bridge - Clean, Minimal Implementation

class UIStateManager {
    constructor() {
        this.currentState = 'idle';
        this.states = {
            idle: document.getElementById('idleState'),
            listening: document.getElementById('listeningState'),
            response: document.getElementById('responseState')
        };
        
        this.initializeElements();
    }
    
    initializeElements() {
        this.micButton = document.getElementById('micButton');
        this.languageSelect = document.getElementById('languageSelect');
        this.newQueryButton = document.getElementById('newQueryButton');
        this.statusMessage = document.getElementById('statusMessage');
        
        // Bind event listeners
        this.micButton.addEventListener('click', () => this.handleMicClick());
        this.newQueryButton.addEventListener('click', () => this.resetToIdle());
        
        // Set initial state
        this.setState('idle');
    }
    
    setState(newState) {
        // Hide all states
        Object.values(this.states).forEach(state => {
            state.classList.remove('active');
        });
        
        // Show new state
        if (this.states[newState]) {
            this.states[newState].classList.add('active');
            this.currentState = newState;
        }
    }
    
    handleMicClick() {
        if (this.currentState === 'idle') {
            this.startListening();
        }
    }
    
    startListening() {
        this.setState('listening');
        
        // Simulate listening for demo (replace with actual voice recognition)
        setTimeout(() => {
            this.showResponse();
        }, 3000);
    }
    
    showResponse() {
        this.setState('response');
        
        // Animate cards sequentially
        const cards = document.querySelectorAll('.response-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 150}ms`;
        });
    }
    
    resetToIdle() {
        this.setState('idle');
        this.hideStatus();
    }
    
    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideStatus();
        }, 5000);
    }
    
    hideStatus() {
        this.statusMessage.classList.add('hidden');
    }
}

class VoiceInterface {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.currentLanguage = 'hi-IN';
        
        this.supportedLanguages = {
            'hi-IN': 'Hindi',
            'ta-IN': 'Tamil',
            'kn-IN': 'Kannada',
            'bn-IN': 'Bengali',
            'te-IN': 'Telugu',
            'mr-IN': 'Marathi',
            'gu-IN': 'Gujarati',
            'ml-IN': 'Malayalam',
            'pa-IN': 'Punjabi',
            'or-IN': 'Odia',
            'as-IN': 'Assamese',
            'ur-IN': 'Urdu',
            'en-US': 'English'
        };
        
        this.initializeRecognition();
    }
    
    static isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    
    initializeRecognition() {
        if (!VoiceInterface.isSupported()) {
            console.warn('Speech recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Voice recognition started');
        };
        
        this.recognition.onresult = (event) => {
            const result = event.results[0];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence || 0.8;
            
            console.log(`Speech result: "${transcript}" (Confidence: ${confidence})`);
            
            // Process the speech result
            this.processSpeechResult({
                text: transcript,
                confidence: confidence,
                language: this.currentLanguage
            });
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.handleError(event.error);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Voice recognition ended');
        };
    }
    
    async startListening(language = 'hi-IN') {
        if (!this.recognition) {
            this.handleError('not-supported');
            return false;
        }
        
        if (this.isListening) {
            return false;
        }
        
        try {
            this.currentLanguage = language;
            this.recognition.lang = language;
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.handleError('start-failed');
            return false;
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    processSpeechResult(result) {
        // Simulate AI processing
        setTimeout(() => {
            // Mock response data
            const mockResponse = {
                priceRange: '₹45 – ₹55 / kg',
                confidence: Math.floor(result.confidence * 100),
                advice: {
                    text: 'थोड़ी बातचीत की गुंजाइश है।',
                    translation: 'There\'s room for some discussion.'
                }
            };
            
            this.displayResponse(mockResponse);
        }, 1000);
    }
    
    displayResponse(response) {
        // Update price info
        const priceInfo = document.getElementById('priceInfo');
        if (priceInfo) {
            priceInfo.querySelector('.price-range').textContent = response.priceRange;
            priceInfo.querySelector('.price-confidence').textContent = `Confidence: ${response.confidence}%`;
        }
        
        // Update advice
        const negotiationTips = document.getElementById('negotiationTips');
        if (negotiationTips) {
            negotiationTips.querySelector('.advice-text').textContent = response.advice.text;
            negotiationTips.querySelector('.advice-translation').textContent = response.advice.translation;
        }
        
        // Update confidence bar
        const confidenceFill = document.querySelector('.confidence-fill');
        const confidencePercentage = document.querySelector('.confidence-percentage');
        if (confidenceFill && confidencePercentage) {
            confidenceFill.style.width = `${response.confidence}%`;
            confidencePercentage.textContent = `${response.confidence}%`;
        }
    }
    
    handleError(errorType) {
        const errorMessages = {
            'not-supported': 'Speech recognition not supported in this browser',
            'not-allowed': 'Microphone access denied. Please allow microphone access.',
            'no-speech': 'No speech detected. Please try again.',
            'network': 'Network error. Please check your connection.',
            'start-failed': 'Failed to start voice recognition. Please try again.'
        };
        
        const message = errorMessages[errorType] || 'An error occurred. Please try again.';
        
        if (window.uiManager) {
            window.uiManager.showStatus(message, 'error');
            window.uiManager.resetToIdle();
        }
    }
}

class LanguageManager {
    constructor() {
        this.currentLanguage = 'hi-IN';
        this.languageSelect = document.getElementById('languageSelect');
        
        this.initializeLanguageSelector();
    }
    
    initializeLanguageSelector() {
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                console.log('Language changed to:', this.currentLanguage);
            });
            
            // Set default language
            this.languageSelect.value = this.currentLanguage;
        }
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getLanguageName(code) {
        const languageNames = {
            'hi-IN': 'Hindi',
            'ta-IN': 'Tamil',
            'kn-IN': 'Kannada',
            'bn-IN': 'Bengali',
            'te-IN': 'Telugu',
            'mr-IN': 'Marathi',
            'gu-IN': 'Gujarati',
            'ml-IN': 'Malayalam',
            'pa-IN': 'Punjabi',
            'or-IN': 'Odia',
            'as-IN': 'Assamese',
            'ur-IN': 'Urdu',
            'en-US': 'English'
        };
        
        return languageNames[code] || 'Unknown';
    }
}

class LinguisticBridge {
    constructor() {
        this.uiManager = new UIStateManager();
        this.voiceInterface = new VoiceInterface();
        this.languageManager = new LanguageManager();
        
        // Make managers globally accessible
        window.uiManager = this.uiManager;
        window.voiceInterface = this.voiceInterface;
        window.languageManager = this.languageManager;
        
        this.initializeApp();
    }
    
    initializeApp() {
        console.log('Real-Time Linguistic Bridge initialized');
        
        // Check browser compatibility
        if (!VoiceInterface.isSupported()) {
            this.uiManager.showStatus(
                'Speech recognition not supported. Please use Chrome, Firefox, or Edge.',
                'error'
            );
        }
        
        // Override mic button click to use voice interface
        this.uiManager.micButton.addEventListener('click', () => {
            this.handleVoiceInput();
        });
    }
    
    async handleVoiceInput() {
        const currentLanguage = this.languageManager.getCurrentLanguage();
        
        // Start listening
        this.uiManager.setState('listening');
        
        const success = await this.voiceInterface.startListening(currentLanguage);
        
        if (!success) {
            this.uiManager.resetToIdle();
        }
    }
    
    // Public methods for external access
    retryVoiceInput() {
        this.uiManager.resetToIdle();
    }
    
    enableOfflineMode() {
        this.uiManager.showStatus('Offline mode enabled with basic features', 'info');
    }
    
    openBrowserSettings() {
        this.uiManager.showStatus('Please check browser settings to allow microphone access', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.linguisticBridge = new LinguisticBridge();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.voiceInterface) {
        window.voiceInterface.stopListening();
    }
});

// Handle beforeunload to cleanup
window.addEventListener('beforeunload', () => {
    if (window.voiceInterface) {
        window.voiceInterface.stopListening();
    }
});