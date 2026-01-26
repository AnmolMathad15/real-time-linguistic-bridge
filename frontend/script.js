// Real-Time Linguistic Bridge - Main Application
class LinguisticBridge {
    constructor() {
        this.voiceInterface = new VoiceInterface();
        this.intentClassifier = new IntentClassifier();
        this.translationEngine = new TranslationEngine();
        this.priceDiscoveryEngine = new PriceDiscoveryEngine();
        this.negotiationAssistant = new NegotiationAssistant();
        this.responseGenerator = new ResponseGenerator();
        this.privacyManager = new PrivacyManager();
        this.accessibilityManager = new AccessibilityManager();
        this.culturalContextManager = new CulturalContextManager();
        
        this.currentLanguage = 'en-US';
        this.isProcessing = false;
        
        this.initializeUI();
        this.loadPriceData();
        this.initializePrivacyProtection();
        this.initializeAccessibility();
        this.initializeCulturalContext();
    }

    initializeAccessibility() {
        // Initialize accessibility features
        this.accessibilityManager.setupAccessibilityFeatures();
        this.accessibilityManager.detectUserPreferences();
        
        // Set up keyboard navigation
        this.setupKeyboardNavigation();
        
        // Set up screen reader support
        this.setupScreenReaderSupport();
        
        console.log('Accessibility features initialized');
    }

    initializeCulturalContext() {
        // Initialize cultural sensitivity features
        this.culturalContextManager.detectCulturalContext(this.currentLanguage);
        this.culturalContextManager.loadLocalTradingCustoms();
        
        // Set up cultural adaptation
        this.setupCulturalAdaptation();
        
        console.log('Cultural context initialized');
    }

    setupCulturalAdaptation() {
        // Adapt interface based on cultural context
        const culturalSettings = this.culturalContextManager.getCulturalSettings();
        
        // Apply cultural UI adaptations
        this.applyCulturalUIAdaptations(culturalSettings);
        
        // Set up cultural response filtering
        this.setupCulturalResponseFiltering();
    }

    applyCulturalUIAdaptations(settings) {
        // Apply cultural color preferences
        if (settings.colorPreferences) {
            this.applyCulturalColors(settings.colorPreferences);
        }
        
        // Apply cultural layout preferences
        if (settings.layoutPreferences) {
            this.applyCulturalLayout(settings.layoutPreferences);
        }
        
        // Apply cultural interaction patterns
        if (settings.interactionPatterns) {
            this.applyCulturalInteractions(settings.interactionPatterns);
        }
    }

    applyCulturalColors(colorPrefs) {
        if (colorPrefs.respectfulColors) {
            document.body.classList.add('cultural-colors');
            
            const style = document.createElement('style');
            style.id = 'cultural-color-styles';
            style.textContent = `
                .cultural-colors {
                    --primary-color: ${colorPrefs.primary || '#2E7D32'};
                    --accent-color: ${colorPrefs.accent || '#FF9800'};
                    --success-color: ${colorPrefs.success || '#4CAF50'};
                }
            `;
            document.head.appendChild(style);
        }
    }

    applyCulturalLayout(layoutPrefs) {
        if (layoutPrefs.respectfulSpacing) {
            document.body.classList.add('cultural-spacing');
        }
    }

    applyCulturalInteractions(interactionPrefs) {
        if (interactionPrefs.patientInteraction) {
            // Increase timeouts for patient interaction
            this.culturalTimeouts = {
                processingDelay: interactionPrefs.processingDelay || 1000,
                responseDelay: interactionPrefs.responseDelay || 500
            };
        }
    }

    setupCulturalResponseFiltering() {
        // Filter responses through cultural appropriateness
        const originalDisplayResponse = this.displayResponse.bind(this);
        
        this.displayResponse = (response, priceData) => {
            // Apply cultural filtering
            const culturallyFilteredResponse = this.culturalContextManager.filterResponse(response, this.currentLanguage);
            originalDisplayResponse(culturallyFilteredResponse, priceData);
        };
    }

    setupKeyboardNavigation() {
        // Enable keyboard navigation for main controls
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case ' ':
                case 'Enter':
                    if (event.target === this.micButton) {
                        event.preventDefault();
                        this.handleVoiceInput();
                    } else if (event.target === this.speakButton) {
                        event.preventDefault();
                        this.speakResponse();
                    }
                    break;
                    
                case 'Escape':
                    if (this.voiceInterface.isListening) {
                        this.voiceInterface.stopListening();
                        this.announceToScreenReader('Voice input cancelled');
                    }
                    break;
                    
                case 'Tab':
                    // Ensure proper tab order
                    this.accessibilityManager.handleTabNavigation(event);
                    break;
            }
        });
    }

    setupScreenReaderSupport() {
        // Create live region for announcements
        this.createLiveRegion();
        
        // Set up ARIA labels and descriptions
        this.setupAriaLabels();
        
        // Monitor for screen reader usage
        this.accessibilityManager.detectScreenReader();
    }

    createLiveRegion() {
        // Create a live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    setupAriaLabels() {
        // Enhanced ARIA labels for better screen reader support
        this.micButton.setAttribute('aria-describedby', 'mic-description');
        this.speakButton.setAttribute('aria-describedby', 'speak-description');
        this.languageSelect.setAttribute('aria-describedby', 'language-description');
        
        // Create description elements
        this.createAriaDescriptions();
    }

    createAriaDescriptions() {
        const descriptions = [
            {
                id: 'mic-description',
                text: 'Press to start voice input. Speak your pricing question in your selected language.'
            },
            {
                id: 'speak-description', 
                text: 'Press to hear the response read aloud using text-to-speech.'
            },
            {
                id: 'language-description',
                text: 'Select your preferred language for voice input and responses.'
            }
        ];
        
        descriptions.forEach(desc => {
            const element = document.createElement('div');
            element.id = desc.id;
            element.className = 'sr-only';
            element.textContent = desc.text;
            document.body.appendChild(element);
        });
    }

    announceToScreenReader(message, priority = 'polite') {
        if (this.liveRegion) {
            this.liveRegion.setAttribute('aria-live', priority);
            this.liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    initializePrivacyProtection() {
        // Initialize privacy safeguards
        this.privacyManager.validateNoDataPersistence();
        this.privacyManager.clearAnyExistingData();
        
        // Set up automatic data clearing
        this.setupAutomaticDataClearing();
        
        // Monitor for privacy violations
        this.privacyManager.startPrivacyMonitoring();
        
        console.log('Privacy protection initialized');
    }

    setupAutomaticDataClearing() {
        // Clear any temporary data every 30 seconds
        setInterval(() => {
            this.privacyManager.clearTemporaryData();
        }, 30000);
        
        // Clear data when page is about to unload
        window.addEventListener('beforeunload', () => {
            this.privacyManager.clearAllData();
        });
        
        // Clear data when page becomes hidden (mobile app switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.privacyManager.clearSensitiveData();
            }
        });
    }

    initializeUI() {
        // Get DOM elements
        this.micButton = document.getElementById('micButton');
        this.languageSelect = document.getElementById('language');
        this.listeningIndicator = document.getElementById('listeningIndicator');
        this.responseSection = document.getElementById('responseSection');
        this.responseText = document.getElementById('responseText');
        this.priceInfo = document.getElementById('priceInfo');
        this.statusMessage = document.getElementById('statusMessage');
        this.speakButton = document.getElementById('speakButton');
        
        // New enhanced UI elements
        this.tutorialButton = document.getElementById('tutorialButton');
        this.tutorialModal = document.getElementById('tutorialModal');
        this.closeTutorial = document.getElementById('closeTutorial');
        this.confidenceIndicator = document.getElementById('confidenceIndicator');
        this.confidenceLevel = document.getElementById('confidenceLevel');
        this.confidenceText = document.getElementById('confidenceText');
        this.seasonalInfo = document.getElementById('seasonalInfo');
        this.negotiationTips = document.getElementById('negotiationTips');
        this.shareButton = document.getElementById('shareButton');
        this.settingsButton = document.getElementById('settingsButton');

        // Check browser compatibility
        this.checkBrowserCompatibility();

        // Initialize network monitoring
        this.initializeNetworkMonitoring();

        // Event listeners
        this.micButton.addEventListener('click', () => this.handleVoiceInput());
        this.languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updatePageLanguage(e.target.value);
        });
        this.speakButton.addEventListener('click', () => this.speakResponse());
        
        // New enhanced event listeners
        this.tutorialButton.addEventListener('click', () => this.showTutorial());
        this.closeTutorial.addEventListener('click', () => this.hideTutorial());
        this.tutorialModal.addEventListener('click', (e) => {
            if (e.target === this.tutorialModal) this.hideTutorial();
        });
        this.shareButton.addEventListener('click', () => this.shareGuidance());
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', () => this.showSettings());
        }

        // Initialize voice interface
        this.voiceInterface.onSpeechResult((result) => this.processVoiceInput(result));
        this.voiceInterface.onError((error) => this.handleVoiceError(error));

        // Add global error handler
        this.setupGlobalErrorHandling();
        
        // Initialize enhanced features
        this.initializeEnhancedFeatures();
    }

    initializeNetworkMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.handleNetworkStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleNetworkStatusChange(false);
        });

        // Initial network status check
        this.isOnline = navigator.onLine;
        if (!this.isOnline) {
            this.handleNetworkError(new Error('No network connection'));
        }
    }

    handleNetworkStatusChange(isOnline) {
        this.isOnline = isOnline;
        
        if (isOnline) {
            console.log('Network connection restored');
            this.isOfflineMode = false;
            this.showStatus('Connection restored. All features available.', 'success');
            setTimeout(() => this.hideStatus(), 3000);
        } else {
            console.log('Network connection lost');
            this.handleNetworkError(new Error('Network connection lost'));
        }
    }

    setupGlobalErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.logErrorSafely(event.error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString()
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logErrorSafely(event.reason, {
                type: 'unhandled_promise_rejection',
                timestamp: new Date().toISOString()
            });
            
            // Prevent the default browser error handling
            event.preventDefault();
        });
    }

    checkBrowserCompatibility() {
        const issues = [];
        
        // Check Web Speech API support
        if (!VoiceInterface.isSupported()) {
            issues.push('Speech recognition is not supported in this browser.');
        }
        
        // Check Speech Synthesis support
        if (!('speechSynthesis' in window)) {
            issues.push('Text-to-speech is not supported in this browser.');
        }
        
        // Check for HTTPS (required for microphone access in most browsers)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            issues.push('HTTPS is required for microphone access. Please serve over HTTPS or use localhost.');
        }
        
        // Show compatibility warnings
        if (issues.length > 0) {
            const warningMessage = `Browser compatibility issues detected:\n${issues.join('\n')}\n\nFor best experience, use Chrome or Edge with HTTPS.`;
            console.warn(warningMessage);
            
            // Show user-friendly warning
            setTimeout(() => {
                this.showStatus('For best experience, use Chrome or Edge browser with microphone access enabled.', 'info');
            }, 1000);
        }
        
        // Disable microphone button if speech recognition not supported
        if (!VoiceInterface.isSupported()) {
            this.micButton.disabled = true;
            this.micButton.title = 'Speech recognition not supported in this browser';
            this.micButton.style.opacity = '0.5';
            this.micButton.style.cursor = 'not-allowed';
        }
    }

    async loadPriceData() {
        try {
            const response = await fetch('./mock_data/prices.json');
            const priceData = await response.json();
            this.priceDiscoveryEngine.loadPriceData(priceData);
        } catch (error) {
            console.warn('Price data not loaded, using fallback pricing');
        }
    }

    handleVoiceInput() {
        if (this.isProcessing) {
            this.showStatus('Please wait, still processing previous request...', 'info');
            return;
        }

        // Check if speech recognition is supported
        if (!VoiceInterface.isSupported()) {
            this.showStatus('Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'error');
            return;
        }

        if (this.voiceInterface.isListening) {
            this.voiceInterface.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        // Clear previous responses
        this.responseSection.classList.add('hidden');
        this.hideStatus();
        
        this.showStatus('Preparing to listen...', 'info');
        this.micButton.classList.add('listening');
        this.listeningIndicator.classList.remove('hidden');
        
        // Add timeout for listening (30 seconds max)
        this.listeningTimeout = setTimeout(() => {
            if (this.voiceInterface.isListening) {
                this.voiceInterface.stopListening();
                this.showStatus('Listening timeout. Please try again.', 'info');
            }
        }, 30000);
        
        this.voiceInterface.startListening(this.currentLanguage);
    }

    stopListening() {
        this.micButton.classList.remove('listening');
        this.listeningIndicator.classList.add('hidden');
        
        // Clear listening timeout
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
            this.listeningTimeout = null;
        }
        
        this.hideStatus();
    }

    async processVoiceInput(voiceResult) {
        this.stopListening();
        this.isProcessing = true;
        
        try {
            this.showStatus('Processing your request...', 'info', voiceResult.confidence);

            // Clear audio data immediately for privacy
            this.privacyManager.clearAudioData();

            // Step 1: Classify intent with error handling
            let intent;
            try {
                intent = await this.intentClassifier.classifyIntent(
                    voiceResult.text, 
                    this.getLanguageCode(this.currentLanguage)
                );
                console.log('Intent classified:', intent);
            } catch (error) {
                console.error('Intent classification error:', error);
                intent = this.createFallbackIntent(voiceResult.text);
            }

            // Step 2: Translate if needed with error handling
            let processedText = voiceResult.text;
            if (this.currentLanguage !== 'en-US') {
                try {
                    processedText = await this.translationEngine.translate(
                        voiceResult.text,
                        this.getLanguageCode(this.currentLanguage),
                        'english',
                        intent
                    );
                    console.log('Translation result:', processedText);
                } catch (error) {
                    console.error('Translation error:', error);
                    processedText = voiceResult.text; // Fallback to original text
                }
            }

            // Step 3: Get price information with error handling
            let priceData = null;
            if (intent.type === 'bargaining' || intent.type === 'bulk_purchase') {
                try {
                    priceData = await this.priceDiscoveryEngine.getMarketPrice(
                        intent.product,
                        intent.category
                    );
                    console.log('Price data:', priceData);
                } catch (error) {
                    console.error('Price discovery error:', error);
                    priceData = this.createFallbackPriceData(intent.product);
                }
            }

            // Step 4: Get negotiation guidance with error handling
            let negotiationGuidance;
            try {
                negotiationGuidance = await this.negotiationAssistant.generateGuidance(
                    intent,
                    priceData,
                    processedText
                );
                console.log('Negotiation guidance:', negotiationGuidance);
            } catch (error) {
                console.error('Negotiation guidance error:', error);
                negotiationGuidance = this.createFallbackNegotiationGuidance(intent);
            }

            // Step 5: Generate response with error handling
            let response;
            try {
                response = await this.responseGenerator.formatResponse(
                    {
                        intent,
                        priceData,
                        negotiationGuidance,
                        originalText: voiceResult.text,
                        processedText: processedText
                    },
                    this.getLanguageCode(this.currentLanguage)
                );
            } catch (error) {
                console.error('Response generation error:', error);
                response = this.createFallbackResponse(voiceResult.text, this.currentLanguage);
            }

            this.displayResponse(response, priceData);
            this.hideStatus();

        } catch (error) {
            console.error('Critical processing error:', error);
            this.handleCriticalError(error, voiceResult);
        } finally {
            this.isProcessing = false;
            // Ensure privacy protection
            this.privacyManager.clearSensitiveData();
        }
    }

    createFallbackIntent(text) {
        return {
            type: 'casual_inquiry',
            confidence: 0.3,
            keywords: [],
            product: 'unknown',
            category: 'general',
            fallback: true,
            originalText: text
        };
    }

    createFallbackPriceData(product) {
        return {
            product: product || 'unknown',
            category: 'general',
            marketPrice: null,
            minPrice: null,
            maxPrice: null,
            unit: 'kg',
            confidence: 0.1,
            fallback: true,
            warning: 'Price data not available'
        };
    }

    createFallbackNegotiationGuidance(intent) {
        return {
            customerAnalysis: {
                priceAwareness: 'unknown',
                urgency: 'normal',
                flexibility: 'moderate',
                signals: ['fallback_mode']
            },
            counterOffers: [],
            tactics: {
                primary: ['Be transparent about pricing limitations'],
                secondary: ['Offer to check with suppliers'],
                avoid: ['Making commitments without data']
            },
            valuePropositions: [{
                type: 'service',
                message: 'I will help you find the information you need',
                reasoning: 'Service-focused approach when data is limited'
            }],
            decisions: {
                accept: { conditions: [], reasoning: [] },
                counter: { conditions: ['Get accurate information first'], reasoning: ['Cannot provide guidance without reliable data'] },
                decline: { conditions: [], reasoning: [] }
            },
            confidence: 0.2,
            fallback: true
        };
    }

    createFallbackResponse(text, language) {
        const fallbackMessages = {
            'en-US': "I'm having trouble processing your request right now. Please try again, or ask me a simpler question about pricing.",
            'hi-IN': "Mujhe aapka request process karne mein dikkat ho rahi hai. Phir se try kariye ya price ke baare mein simple sawal puchiye.",
            'kn-IN': "Nanage nimma request process maadakke kashta aaguttide. Mathe try maadi athava price bagge simple question keli."
        };

        return {
            text: fallbackMessages[language] || fallbackMessages['en-US'],
            language: this.getLanguageCode(language),
            actionable: false,
            fallback: true,
            timestamp: new Date().toISOString(),
            error: 'Processing failed'
        };
    }

    handleCriticalError(error, voiceResult) {
        console.error('Critical error in voice processing:', error);
        
        // Clear all sensitive data immediately
        this.privacyManager.clearAllData();
        
        // Show user-friendly error message
        const errorMessages = {
            'en-US': "I'm experiencing technical difficulties. Please refresh the page and try again.",
            'hi-IN': "Technical problem ho rahi hai. Page refresh karke phir se try kariye.",
            'kn-IN': "Technical problem aaguttide. Page refresh maadi mathe try maadi."
        };
        
        const errorMessage = errorMessages[this.currentLanguage] || errorMessages['en-US'];
        this.showStatus(errorMessage, 'error');
        
        // Log error for debugging (without sensitive data)
        this.logErrorSafely(error, {
            timestamp: new Date().toISOString(),
            language: this.currentLanguage,
            hasVoiceResult: !!voiceResult,
            voiceResultLength: voiceResult?.text?.length || 0
        });
    }

    logErrorSafely(error, context) {
        // Log error without exposing sensitive information
        const safeError = {
            message: error.message,
            name: error.name,
            stack: error.stack?.split('\n')[0], // Only first line of stack
            context: context
        };
        
        console.error('Safe error log:', safeError);
    }

    // Enhanced error handling for network connectivity
    handleNetworkError(error) {
        console.warn('Network error detected:', error);
        
        const networkMessages = {
            'en-US': "Network connection issue detected. Some features may be limited.",
            'hi-IN': "Network connection mein problem hai. Kuch features limited ho sakte hain.",
            'kn-IN': "Network connection nalli problem ide. Kelalvu features limited aagbaudu."
        };
        
        const message = networkMessages[this.currentLanguage] || networkMessages['en-US'];
        this.showStatus(message, 'info');
        
        // Provide offline guidance
        this.enableOfflineMode();
    }

    enableOfflineMode() {
        console.log('Enabling offline mode with limited functionality');
        
        // Disable features that require network
        this.isOfflineMode = true;
        
        // Show offline indicator
        const offlineMessages = {
            'en-US': "Offline mode: Basic pricing guidance available.",
            'hi-IN': "Offline mode: Basic pricing guidance available hai.",
            'kn-IN': "Offline mode: Basic pricing guidance sigutta."
        };
        
        const message = offlineMessages[this.currentLanguage] || offlineMessages['en-US'];
        this.showStatus(message, 'info');
    }

    // Browser compatibility error handling
    handleBrowserCompatibilityError(feature, error) {
        console.warn(`Browser compatibility issue with ${feature}:`, error);
        
        const compatibilityMessages = {
            'speech_recognition': {
                'en-US': "Speech recognition not supported. Please use Chrome or Edge browser.",
                'hi-IN': "Speech recognition support nahi hai. Chrome ya Edge browser use kariye.",
                'kn-IN': "Speech recognition support illa. Chrome athava Edge browser use maadi."
            },
            'speech_synthesis': {
                'en-US': "Text-to-speech not available in this browser.",
                'hi-IN': "Text-to-speech is browser mein available nahi hai.",
                'kn-IN': "Text-to-speech ee browser nalli available illa."
            }
        };
        
        const messages = compatibilityMessages[feature] || compatibilityMessages['speech_recognition'];
        const message = messages[this.currentLanguage] || messages['en-US'];
        
        this.showStatus(message, 'error');
        
        // Provide alternative guidance
        this.suggestBrowserAlternatives(feature);
    }

    suggestBrowserAlternatives(feature) {
        const suggestions = {
            'speech_recognition': 'You can still type your questions or use the interface manually.',
            'speech_synthesis': 'Responses will be shown as text only.'
        };
        
        const suggestion = suggestions[feature] || 'Some features may be limited.';
        
        setTimeout(() => {
            this.showStatus(suggestion, 'info');
        }, 3000);
    }

    displayResponse(response, priceData) {
        // Use the enhanced display method
        this.displayEnhancedResponse(response, priceData);
    }

    speakResponse() {
        if (this.lastResponse) {
            this.responseGenerator.generateSpeech(
                this.lastResponse.text,
                this.getLanguageCode(this.currentLanguage)
            );
        }
    }

    handleVoiceError(error) {
        this.stopListening();
        this.isProcessing = false;
        
        let errorMessage = 'Voice recognition failed. ';
        let actionableAdvice = '';
        let retryable = true;
        
        switch (error.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. ';
                actionableAdvice = 'Please speak clearly and try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone access failed. ';
                actionableAdvice = 'Please check your microphone connection.';
                retryable = false;
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. ';
                actionableAdvice = 'Please allow microphone access in your browser settings and refresh the page.';
                retryable = false;
                break;
            case 'network':
                errorMessage = 'Network error occurred. ';
                actionableAdvice = 'Please check your internet connection and try again.';
                break;
            case 'not-supported':
                errorMessage = 'Speech recognition not supported. ';
                actionableAdvice = 'Please use Chrome or Edge browser for best experience.';
                retryable = false;
                break;
            case 'language-not-supported':
                errorMessage = 'Selected language not supported. ';
                actionableAdvice = 'Please try switching to English and try again.';
                break;
            case 'aborted':
                errorMessage = 'Speech recognition was interrupted. ';
                actionableAdvice = 'Please try again.';
                break;
            default:
                errorMessage = 'Speech recognition error occurred. ';
                actionableAdvice = 'Please check your microphone and try again.';
        }
        
        // Show error with retry option if applicable
        this.showErrorWithRetry(errorMessage + actionableAdvice, retryable, error);
        
        // Log error for debugging
        console.error('Voice recognition error:', error);
    }

    showErrorWithRetry(message, retryable, originalError) {
        // Clear any existing status
        this.hideStatus();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
            ${retryable ? '<button class="retry-button">Try Again</button>' : ''}
            <button class="dismiss-button">Dismiss</button>
        `;
        
        // Add error-specific styling
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                background: #ffebee;
                border: 1px solid #ffcdd2;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .error-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            .error-icon {
                font-size: 1.5rem;
            }
            .error-text {
                color: #c62828;
                font-weight: 600;
                flex: 1;
                text-align: left;
            }
            .retry-button, .dismiss-button {
                background: #1976d2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin: 0 5px;
                font-weight: 600;
            }
            .retry-button:hover, .dismiss-button:hover {
                background: #1565c0;
            }
            .dismiss-button {
                background: #757575;
            }
            .dismiss-button:hover {
                background: #616161;
            }
        `;
        
        // Insert error message
        if (!document.head.querySelector('style[data-error-styles]')) {
            style.setAttribute('data-error-styles', 'true');
            document.head.appendChild(style);
        }
        
        // Replace status message with error
        this.statusMessage.innerHTML = '';
        this.statusMessage.appendChild(errorDiv);
        this.statusMessage.className = 'status-message error';
        this.statusMessage.classList.remove('hidden');
        
        // Add event listeners
        const retryButton = errorDiv.querySelector('.retry-button');
        const dismissButton = errorDiv.querySelector('.dismiss-button');
        
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.hideStatus();
                // Retry voice input after a short delay
                setTimeout(() => {
                    this.handleVoiceInput();
                }, 500);
            });
        }
        
        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                this.hideStatus();
            });
        }
        
        // Auto-dismiss after 10 seconds for non-critical errors
        if (retryable && originalError.error !== 'not-allowed' && originalError.error !== 'not-supported') {
            setTimeout(() => {
                if (!this.statusMessage.classList.contains('hidden')) {
                    this.hideStatus();
                }
            }, 10000);
        }
    }

    // Enhanced status showing with confidence indicators
    showStatus(message, type, confidence = null) {
        let displayMessage = message;
        
        // Add confidence indicator for speech results
        if (type === 'info' && confidence !== null) {
            const confidencePercent = Math.round(confidence * 100);
            if (confidencePercent < 70) {
                displayMessage += ` (${confidencePercent}% confidence - please speak clearly)`;
            }
        }
        
        this.statusMessage.textContent = displayMessage;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.classList.remove('hidden');
    }

    hideStatus() {
        this.statusMessage.classList.add('hidden');
    }

    updatePageLanguage(browserLang) {
        const langMap = {
            'en-US': 'en',
            'hi-IN': 'hi',
            'kn-IN': 'kn',
            'ta-IN': 'ta',
            'te-IN': 'te',
            'bn-IN': 'bn',
            'mr-IN': 'mr',
            'gu-IN': 'gu',
            'pa-IN': 'pa',
            'or-IN': 'or',
            'ml-IN': 'ml',
            'as-IN': 'as',
            'ur-IN': 'ur',
            'sd-IN': 'sd',
            'ks-IN': 'ks',
            'mai-IN': 'mai',
            'mag-IN': 'mag',
            'bho-IN': 'bho',
            'raj-IN': 'raj',
            'kok-IN': 'kok',
            'sat-IN': 'sat',
            'mni-IN': 'mni',
            'brx-IN': 'brx',
            'doi-IN': 'doi',
            'ne-IN': 'ne',
            'si-LK': 'si',
            'dv-MV': 'dv',
            'es-ES': 'es',
            'fr-FR': 'fr',
            'ar-SA': 'ar',
            'pt-BR': 'pt',
            'zh-CN': 'zh'
        };
        const htmlLang = langMap[browserLang] || 'en';
        document.documentElement.lang = htmlLang;
    }

    getLanguageCode(browserLang) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada',
            'ta-IN': 'tamil',
            'te-IN': 'telugu',
            'bn-IN': 'bengali',
            'mr-IN': 'marathi',
            'gu-IN': 'gujarati',
            'pa-IN': 'punjabi',
            'or-IN': 'odia',
            'ml-IN': 'malayalam',
            'as-IN': 'assamese',
            'ur-IN': 'urdu',
            'sd-IN': 'sindhi',
            'ks-IN': 'kashmiri',
            'mai-IN': 'maithili',
            'mag-IN': 'magahi',
            'bho-IN': 'bhojpuri',
            'raj-IN': 'rajasthani',
            'kok-IN': 'konkani',
            'sat-IN': 'santali',
            'mni-IN': 'manipuri',
            'brx-IN': 'bodo',
            'doi-IN': 'dogri',
            'ne-IN': 'nepali',
            'si-LK': 'sinhala',
            'dv-MV': 'dhivehi',
            'es-ES': 'spanish',
            'fr-FR': 'french',
            'ar-SA': 'arabic',
            'pt-BR': 'portuguese',
            'zh-CN': 'chinese'
        };
        return langMap[browserLang] || 'english';
    }

    // Enhanced Features Methods
    initializeEnhancedFeatures() {
        // Show tutorial on first visit
        if (!localStorage.getItem('tutorialShown')) {
            setTimeout(() => this.showTutorial(), 2000);
            localStorage.setItem('tutorialShown', 'true');
        }
        
        // Initialize seasonal pricing
        this.currentSeason = this.getCurrentSeason();
        
        // Set up confidence monitoring
        this.setupConfidenceMonitoring();
        
        console.log('Enhanced features initialized');
    }

    showTutorial() {
        this.tutorialModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    hideTutorial() {
        this.tutorialModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    getCurrentSeason() {
        const month = new Date().getMonth() + 1; // 1-12
        return {
            month: month,
            isWinter: [12, 1, 2].includes(month),
            isSummer: [4, 5, 6].includes(month),
            isMonsoon: [7, 8, 9].includes(month),
            isPostMonsoon: [10, 11].includes(month)
        };
    }

    setupConfidenceMonitoring() {
        // Monitor speech confidence and provide visual feedback
        this.voiceInterface.onConfidenceUpdate = (confidence) => {
            this.updateConfidenceIndicator(confidence);
        };
    }

    updateConfidenceIndicator(confidence) {
        if (this.confidenceLevel && this.confidenceText) {
            const percentage = Math.round(confidence * 100);
            this.confidenceLevel.style.width = `${percentage}%`;
            
            let qualityText = 'Poor';
            if (confidence > 0.8) qualityText = 'Excellent';
            else if (confidence > 0.6) qualityText = 'Good';
            else if (confidence > 0.4) qualityText = 'Fair';
            
            this.confidenceText.textContent = `Speech clarity: ${qualityText} (${percentage}%)`;
            
            // Show/hide indicator based on confidence
            if (confidence > 0) {
                this.confidenceIndicator.classList.remove('hidden');
            }
        }
    }

    shareGuidance() {
        if (this.lastResponse && navigator.share) {
            navigator.share({
                title: 'Linguistic Bridge - Smart Pricing Guidance',
                text: this.lastResponse.text,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else if (this.lastResponse) {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.lastResponse.text).then(() => {
                this.showStatus('Guidance copied to clipboard!', 'success');
                setTimeout(() => this.hideStatus(), 2000);
            }).catch(() => {
                this.showStatus('Unable to copy. Please select and copy manually.', 'info');
            });
        }
    }

    displayEnhancedResponse(response, priceData) {
        // Enhanced response display with seasonal and negotiation info
        this.responseText.textContent = response.text;
        this.responseSection.classList.remove('hidden');

        // Enhanced price display
        if (priceData) {
            const seasonalPrice = this.calculateSeasonalPrice(priceData);
            const priceContent = this.priceInfo.querySelector('.info-content');
            if (priceContent) {
                priceContent.innerHTML = `
                    <div style="margin-bottom: 12px;">
                        <strong>Current Range:</strong> ₹${seasonalPrice.minPrice} - ₹${seasonalPrice.maxPrice}<br>
                        <strong>Fair Price:</strong> ₹${seasonalPrice.marketPrice}<br>
                        <small style="color: var(--gray-500);">Per ${priceData.unit} • Quality: ${priceData.quality?.[0] || 'Standard'}</small>
                    </div>
                `;
            }
            this.priceInfo.classList.remove('hidden');

            // Show seasonal information
            if (seasonalPrice.seasonal) {
                const seasonalContent = this.seasonalInfo.querySelector('.info-content');
                if (seasonalContent) {
                    seasonalContent.innerHTML = `
                        <div style="margin-bottom: 8px;">
                            <strong>${seasonalPrice.seasonal.explanation}</strong>
                        </div>
                        <small style="color: var(--gray-500);">Current month impact: ${seasonalPrice.seasonal.impact}</small>
                    `;
                }
                this.seasonalInfo.classList.remove('hidden');
            }

            // Show negotiation tips
            if (priceData.category) {
                const tips = this.generateNegotiationTips(priceData);
                const tipsContent = this.negotiationTips.querySelector('.info-content');
                if (tipsContent) {
                    tipsContent.innerHTML = `
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${tips.map(tip => `<li style="margin-bottom: 8px; position: relative; padding-left: 20px;"><span style="position: absolute; left: 0; color: var(--success-600); font-weight: bold;">✓</span>${tip}</li>`).join('')}
                        </ul>
                    `;
                }
                this.negotiationTips.classList.remove('hidden');
            }
        } else {
            this.priceInfo.classList.add('hidden');
            this.seasonalInfo.classList.add('hidden');
            this.negotiationTips.classList.add('hidden');
        }

        // Store response for sharing
        this.lastResponse = response;
    }

    calculateSeasonalPrice(priceData) {
        if (!priceData.seasonal) return priceData;

        const currentMonth = this.currentSeason.month;
        let multiplier = 1.0;
        let explanation = '';
        let impact = 'Normal pricing';

        if (priceData.seasonal.peak && priceData.seasonal.peak.months.includes(currentMonth)) {
            multiplier = priceData.seasonal.peak.priceMultiplier;
            explanation = 'Peak season - prices are lower due to good availability';
            impact = 'Favorable for buyers';
        } else if (priceData.seasonal.low && priceData.seasonal.low.months.includes(currentMonth)) {
            multiplier = priceData.seasonal.low.priceMultiplier;
            explanation = 'Off-season - prices are higher due to limited supply';
            impact = 'Higher prices expected';
        }

        return {
            ...priceData,
            marketPrice: Math.round(priceData.marketPrice * multiplier),
            minPrice: Math.round(priceData.minPrice * multiplier),
            maxPrice: Math.round(priceData.maxPrice * multiplier),
            seasonal: {
                explanation,
                impact,
                multiplier
            }
        };
    }

    generateNegotiationTips(priceData) {
        const tips = [];
        const category = priceData.category;

        // Category-specific tips
        if (category === 'vegetables') {
            tips.push('Emphasize freshness - "Just arrived this morning"');
            tips.push('Offer small free samples to show quality');
            tips.push('Bundle with complementary vegetables for better deals');
        } else if (category === 'fruits') {
            tips.push('Let customers check ripeness and quality');
            tips.push('Offer to select the best pieces personally');
            tips.push('Mention the source - "Fresh from the farm"');
        } else if (category === 'grains') {
            tips.push('Highlight storage quality - "Properly stored, no moisture"');
            tips.push('Offer bulk discounts for regular customers');
            tips.push('Mention nutritional benefits');
        }

        // Seasonal tips
        if (this.currentSeason.isMonsoon) {
            tips.push('Mention extra care taken during monsoon storage');
        }

        // General tips
        tips.push('Be transparent about your costs and margins');
        tips.push('Build relationships - "You are a valued customer"');
        
        return tips.slice(0, 4); // Limit to 4 tips for readability
    }

    showSettings() {
        // Simple settings functionality - could be expanded
        const currentLang = this.currentLanguage;
        const langNames = {
            'en-US': 'English',
            'hi-IN': 'Hindi',
            'kn-IN': 'Kannada',
            'ta-IN': 'Tamil',
            'te-IN': 'Telugu',
            'bn-IN': 'Bengali',
            'mr-IN': 'Marathi',
            'gu-IN': 'Gujarati',
            'pa-IN': 'Punjabi',
            'or-IN': 'Odia',
            'ml-IN': 'Malayalam',
            'as-IN': 'Assamese',
            'ur-IN': 'Urdu',
            'sd-IN': 'Sindhi',
            'ks-IN': 'Kashmiri',
            'mai-IN': 'Maithili',
            'mag-IN': 'Magahi',
            'bho-IN': 'Bhojpuri',
            'raj-IN': 'Rajasthani',
            'kok-IN': 'Konkani',
            'sat-IN': 'Santali',
            'mni-IN': 'Manipuri',
            'brx-IN': 'Bodo',
            'doi-IN': 'Dogri',
            'ne-IN': 'Nepali',
            'si-LK': 'Sinhala',
            'dv-MV': 'Dhivehi',
            'es-ES': 'Spanish',
            'fr-FR': 'French',
            'ar-SA': 'Arabic',
            'pt-BR': 'Portuguese',
            'zh-CN': 'Chinese'
        };
        
        this.showStatus(`Current language: ${langNames[currentLang] || 'English'}. Total languages supported: ${Object.keys(langNames).length}`, 'info');
        setTimeout(() => this.hideStatus(), 4000);
    }
}

// Component Classes
class VoiceInterface {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.speechResultCallback = null;
        this.errorCallback = null;
        this.currentLanguage = 'en-US';
        
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        // Check for Web Speech API support with proper feature detection
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Web Speech API not supported in this browser');
            return;
        }

        // Initialize speech recognition with native API only
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        // Set up event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            const result = event.results[0];
            if (result.isFinal) {
                const transcript = result[0].transcript.trim();
                const confidence = result[0].confidence || 0.8;
                
                console.log('Speech result:', transcript, 'Confidence:', confidence);
                
                if (this.speechResultCallback) {
                    this.speechResultCallback({
                        text: transcript,
                        confidence: confidence,
                        language: this.currentLanguage,
                        timestamp: new Date(),
                        duration: Date.now() - this.startTime
                    });
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            if (this.errorCallback) {
                this.errorCallback({
                    error: event.error,
                    message: this.getErrorMessage(event.error),
                    timestamp: new Date()
                });
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Voice recognition ended');
        };
    }

    startListening(language) {
        if (!this.recognition) {
            if (this.errorCallback) {
                this.errorCallback({
                    error: 'not-supported',
                    message: 'Speech recognition not supported in this browser',
                    timestamp: new Date()
                });
            }
            return;
        }

        if (this.isListening) {
            console.warn('Already listening');
            return;
        }

        // Set language for recognition
        this.currentLanguage = language;
        this.recognition.lang = language;
        
        try {
            this.startTime = Date.now();
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            if (this.errorCallback) {
                this.errorCallback({
                    error: 'start-failed',
                    message: 'Failed to start speech recognition',
                    timestamp: new Date()
                });
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
        this.isListening = false;
    }

    onSpeechResult(callback) {
        this.speechResultCallback = callback;
    }

    onError(callback) {
        this.errorCallback = callback;
    }

    getErrorMessage(error) {
        const errorMessages = {
            'no-speech': 'No speech was detected. Please try speaking again.',
            'audio-capture': 'Audio capture failed. Please check your microphone.',
            'not-allowed': 'Microphone access was denied. Please allow microphone access and try again.',
            'network': 'Network error occurred. Please check your internet connection.',
            'not-supported': 'Speech recognition is not supported in this browser.',
            'start-failed': 'Failed to start speech recognition. Please try again.',
            'aborted': 'Speech recognition was aborted.',
            'bad-grammar': 'Grammar error in speech recognition.',
            'language-not-supported': 'The selected language is not supported.'
        };
        
        return errorMessages[error] || 'An unknown error occurred during speech recognition.';
    }

    // Check if speech recognition is supported (native browser API only)
    static isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    // Get supported languages (basic implementation)
    getSupportedLanguages() {
        return [
            { code: 'en-US', name: 'English' },
            { code: 'hi-IN', name: 'Hindi' },
            { code: 'kn-IN', name: 'Kannada' }
        ];
    }
}

class IntentClassifier {
    constructor() {
        // Deterministic keyword patterns for intent classification
        this.intentPatterns = {
            bargaining: {
                keywords: [
                    // English
                    'price', 'cost', 'expensive', 'cheap', 'discount', 'reduce', 'lower', 'negotiate', 'deal', 'offer',
                    'bargain', 'less', 'more', 'final', 'best', 'last', 'counter',
                    // Hindi (transliterated and common phrases)
                    'daam', 'kimat', 'sasta', 'mehenga', 'kam', 'zyada', 'chhoot', 'discount',
                    'bhav', 'rate', 'paisa', 'rupaya', 'mahanga', 'saste', 'kam karo', 'ghatao',
                    'achha daam', 'theek hai', 'nahi chalega', 'zyada hai', 'kam kijiye',
                    // Kannada (transliterated and common phrases)
                    'bele', 'duddu', 'kammi', 'jaasti', 'olleya', 'chennagide', 'bekagilla',
                    'rate', 'paisa', 'rupai', 'jaasti ide', 'kammi maadi', 'bere bele',
                    'olleya bele', 'last bele', 'kam maadi',
                    // Tamil (transliterated and common phrases)
                    'vilai', 'panam', 'kammiya', 'jaastiya', 'nalla vilai', 'kammi pannunga',
                    'rate', 'paisa', 'jaasti', 'kammi', 'discount kudunga', 'vilai kammi',
                    // Telugu (transliterated and common phrases)
                    'rate', 'dabbu', 'takkuva', 'ekkuva', 'manchidi', 'takkuva cheyyandi',
                    'discount', 'paisa', 'rate ekkuva', 'takkuva rate', 'manchiga ivvandi',
                    // Bengali (transliterated and common phrases)
                    'dam', 'taka', 'kom', 'beshi', 'bhalo dam', 'kom koren', 'discount',
                    'rate', 'paisa', 'beshi hoyeche', 'kom korte hobe', 'bhalo rate',
                    // Marathi (transliterated and common phrases)
                    'bhav', 'paisa', 'kami', 'jasta', 'changle bhav', 'kami kara', 'discount',
                    'rate', 'jasta ahe', 'kami karaycha', 'changla rate dya',
                    // Gujarati (transliterated and common phrases)
                    'bhav', 'paisa', 'ochhu', 'vadhare', 'saras bhav', 'ochhu karo', 'discount',
                    'rate', 'vadhare che', 'ochhu karvo', 'saras rate apo',
                    // Punjabi (transliterated and common phrases)
                    'rate', 'paisa', 'ghat', 'vadh', 'changa rate', 'ghat karo', 'discount',
                    'bhav', 'vadh hai', 'ghat karni', 'changa bhav deo',
                    // Odia (transliterated and common phrases)
                    'dam', 'paisa', 'kam', 'besi', 'bhala dam', 'kam kara', 'discount',
                    'rate', 'besi hei gala', 'kam kariba', 'bhala rate dia',
                    // Malayalam (transliterated and common phrases)
                    'vila', 'paisa', 'kurav', 'kooduthal', 'nalla vila', 'kurav aakku', 'discount',
                    'rate', 'kooduthal aanu', 'kurav aakkam', 'nalla rate tharumo',
                    // Assamese (transliterated and common phrases)
                    'dam', 'taka', 'kom', 'besi', 'bhal dam', 'kom kora', 'discount',
                    'rate', 'besi hoise', 'kom koribo', 'bhal rate diba',
                    // Urdu (transliterated and common phrases)
                    'qeemat', 'paisa', 'kam', 'zyada', 'achhi qeemat', 'kam karo', 'discount',
                    'rate', 'zyada hai', 'kam karna', 'achha rate do',
                    // Sindhi (transliterated and common phrases)
                    'qeemat', 'paisa', 'ghat', 'vadh', 'sahi qeemat', 'ghat karo', 'discount',
                    'rate', 'vadh ahe', 'ghat karyo', 'sahi rate dyo',
                    // Kashmiri (transliterated and common phrases)
                    'qeemat', 'paisa', 'kam', 'zyada', 'achhi qeemat', 'kam kar', 'discount',
                    'rate', 'zyada chu', 'kam karin', 'achha rate diyiv',
                    // Maithili (transliterated and common phrases)
                    'dam', 'paisa', 'kam', 'besi', 'nik dam', 'kam karu', 'discount',
                    'rate', 'besi achi', 'kam karna', 'nik rate diyau',
                    // Magahi (transliterated and common phrases)
                    'dam', 'paisa', 'kam', 'jyada', 'achha dam', 'kam kara', 'discount',
                    'rate', 'jyada ba', 'kam kara', 'achha rate da',
                    // Bhojpuri (transliterated and common phrases)
                    'dam', 'paisa', 'kam', 'jyada', 'achha dam', 'kam kara', 'discount',
                    'rate', 'jyada ba', 'kam kara', 'achha rate da',
                    // Rajasthani (transliterated and common phrases)
                    'bhav', 'paisa', 'ghat', 'vadh', 'achho bhav', 'ghat karo', 'discount',
                    'rate', 'vadh hai', 'ghat karyo', 'achho rate dyo',
                    // Konkani (transliterated and common phrases)
                    'bhav', 'paisa', 'kam', 'jast', 'borem bhav', 'kam kar', 'discount',
                    'rate', 'jast asa', 'kam kara', 'borem rate di',
                    // Santali (transliterated and common phrases)
                    'dam', 'taka', 'huru', 'besi', 'bhal dam', 'huru em', 'discount',
                    'rate', 'besi menakata', 'huru kora', 'bhal rate em',
                    // Manipuri (transliterated and common phrases)
                    'sel', 'sel', 'machak', 'yamna', 'phaba sel', 'machak touba', 'discount',
                    'rate', 'yamna chaoba', 'machak toukho', 'phaba rate piba',
                    // Bodo (transliterated and common phrases)
                    'mwi', 'taka', 'nwngkha', 'gab', 'gizang mwi', 'nwngkha hwnay', 'discount',
                    'rate', 'gab dong', 'nwngkha hwnay', 'gizang rate bi',
                    // Dogri (transliterated and common phrases)
                    'bhav', 'paisa', 'ghat', 'jyada', 'achha bhav', 'ghat karo', 'discount',
                    'rate', 'jyada hai', 'ghat karna', 'achha rate dao',
                    // Nepali (Indian variant - transliterated and common phrases)
                    'mulya', 'paisa', 'kam', 'dherai', 'ramro mulya', 'kam gara', 'discount',
                    'rate', 'dherai cha', 'kam garnu', 'ramro rate dinu',
                    // Spanish (common trading phrases)
                    'precio', 'dinero', 'barato', 'caro', 'buen precio', 'reducir', 'descuento',
                    'rate', 'muy caro', 'hacer descuento', 'mejor precio',
                    // French (common trading phrases)
                    'prix', 'argent', 'pas cher', 'cher', 'bon prix', 'reduire', 'remise',
                    'rate', 'trop cher', 'faire remise', 'meilleur prix',
                    // Arabic (transliterated trading phrases)
                    'si'r', 'maal', 'rakhees', 'ghaali', 'si'r jayyid', 'qallil', 'takhfeed',
                    'rate', 'ghaali jiddan', 'a'ti takhfeed', 'ahsan si'r',
                    // Portuguese (common trading phrases)
                    'preco', 'dinheiro', 'barato', 'caro', 'bom preco', 'reduzir', 'desconto',
                    'rate', 'muito caro', 'dar desconto', 'melhor preco',
                    // Chinese (pinyin trading phrases)
                    'jiage', 'qian', 'pianyi', 'gui', 'hao jiage', 'jianshao', 'zhekou',
                    'rate', 'tai gui', 'gei zhekou', 'geng hao jiage'
                ],
                phrases: [
                    'how much', 'what price', 'too expensive', 'too much', 'can you reduce',
                    'best price', 'final price', 'last price', 'give discount', 'make it cheaper'
                ]
            },
            bulk_purchase: {
                keywords: [
                    // English
                    'bulk', 'wholesale', 'quantity', 'kg', 'liter', 'dozen', 'box', 'sack', 'bag',
                    'many', 'lot', 'tons', 'kilos', 'pieces', 'units', 'carton',
                    // Hindi (transliterated and common phrases)
                    'thok', 'saara', 'bahut', 'kilo', 'litre', 'bori', 'thaila',
                    'wholesale', 'jyada', 'poora', 'sabka', 'kitna kilo', 'kitne kg',
                    'bada order', 'bulk mein', 'saath mein', 'ek saath',
                    // Kannada (transliterated and common phrases)
                    'thumba', 'sarva', 'kilo', 'litre', 'gunny', 'bere', 'jaasti',
                    'wholesale', 'ella', 'total', 'eshtu kilo', 'dodda order',
                    // Tamil (transliterated and common phrases)
                    'neraya', 'ellam', 'kilo', 'litre', 'wholesale', 'periya order',
                    'evvalavu kilo', 'total', 'bulk', 'jaasti quantity',
                    // Telugu (transliterated and common phrases)
                    'ekkuva', 'antha', 'kilo', 'litre', 'wholesale', 'pedda order',
                    'entha kilo', 'total', 'bulk', 'ekkuva quantity',
                    // Bengali (transliterated and common phrases)
                    'beshi', 'shob', 'kilo', 'litre', 'wholesale', 'boro order',
                    'koto kilo', 'total', 'bulk', 'beshi quantity',
                    // Marathi (transliterated and common phrases)
                    'jasta', 'sarva', 'kilo', 'litre', 'wholesale', 'motha order',
                    'kiti kilo', 'total', 'bulk', 'jasta quantity',
                    // Gujarati (transliterated and common phrases)
                    'vadhare', 'badhu', 'kilo', 'litre', 'wholesale', 'motu order',
                    'ketla kilo', 'total', 'bulk', 'vadhare quantity',
                    // Punjabi (transliterated and common phrases)
                    'vadh', 'sara', 'kilo', 'litre', 'wholesale', 'vadda order',
                    'kinna kilo', 'total', 'bulk', 'vadh quantity',
                    // Odia (transliterated and common phrases)
                    'besi', 'saba', 'kilo', 'litre', 'wholesale', 'bada order',
                    'kete kilo', 'total', 'bulk', 'besi quantity',
                    // Malayalam (transliterated and common phrases)
                    'kooduthal', 'ellam', 'kilo', 'litre', 'wholesale', 'valiya order',
                    'ethra kilo', 'total', 'bulk', 'kooduthal quantity',
                    // Assamese (transliterated and common phrases)
                    'besi', 'xokolo', 'kilo', 'litre', 'wholesale', 'boro order',
                    'kiman kilo', 'total', 'bulk', 'besi quantity',
                    // Urdu (transliterated and common phrases)
                    'zyada', 'sab', 'kilo', 'litre', 'wholesale', 'bara order',
                    'kitna kilo', 'total', 'bulk', 'zyada quantity',
                    // Sindhi (transliterated and common phrases)
                    'vadh', 'sab', 'kilo', 'litre', 'wholesale', 'vaddo order',
                    'ketro kilo', 'total', 'bulk', 'vadh quantity',
                    // Kashmiri (transliterated and common phrases)
                    'zyada', 'sab', 'kilo', 'litre', 'wholesale', 'bado order',
                    'kati kilo', 'total', 'bulk', 'zyada quantity',
                    // Maithili (transliterated and common phrases)
                    'besi', 'sab', 'kilo', 'litre', 'wholesale', 'bara order',
                    'kete kilo', 'total', 'bulk', 'besi quantity',
                    // Magahi (transliterated and common phrases)
                    'jyada', 'sab', 'kilo', 'litre', 'wholesale', 'bara order',
                    'ketna kilo', 'total', 'bulk', 'jyada quantity',
                    // Bhojpuri (transliterated and common phrases)
                    'jyada', 'sab', 'kilo', 'litre', 'wholesale', 'bara order',
                    'ketna kilo', 'total', 'bulk', 'jyada quantity',
                    // Rajasthani (transliterated and common phrases)
                    'vadh', 'sab', 'kilo', 'litre', 'wholesale', 'moto order',
                    'ketlo kilo', 'total', 'bulk', 'vadh quantity',
                    // Konkani (transliterated and common phrases)
                    'jast', 'soglim', 'kilo', 'litre', 'wholesale', 'vhodd order',
                    'kitlem kilo', 'total', 'bulk', 'jast quantity',
                    // Santali (transliterated and common phrases)
                    'besi', 'sanam', 'kilo', 'litre', 'wholesale', 'maran order',
                    'chetan kilo', 'total', 'bulk', 'besi quantity',
                    // Manipuri (transliterated and common phrases)
                    'yamna', 'pumnamak', 'kilo', 'litre', 'wholesale', 'achouba order',
                    'kaya kilo', 'total', 'bulk', 'yamna quantity',
                    // Bodo (transliterated and common phrases)
                    'gohom', 'mwi', 'kilo', 'litre', 'wholesale', 'gidang order',
                    'mansi kilo', 'total', 'bulk', 'gohom quantity',
                    // Dogri (transliterated and common phrases)
                    'mota', 'sara', 'kilo', 'litre', 'wholesale', 'wadda order',
                    'kinna kilo', 'total', 'bulk', 'mota quantity',
                    // Spanish (bulk purchase terms)
                    'mucho', 'todo', 'kilo', 'litro', 'mayoreo', 'gran pedido',
                    'cuanto kilo', 'total', 'bulk', 'mucha cantidad',
                    // French (bulk purchase terms)
                    'beaucoup', 'tout', 'kilo', 'litre', 'gros', 'grande commande',
                    'combien kilo', 'total', 'bulk', 'grande quantite',
                    // Arabic (bulk purchase terms)
                    'katheer', 'kull', 'kilo', 'litr', 'jumla', 'talab kabeer',
                    'kam kilo', 'majmoo', 'bulk', 'kammiya kabeera',
                    // Portuguese (bulk purchase terms)
                    'muito', 'tudo', 'kilo', 'litro', 'atacado', 'grande pedido',
                    'quanto kilo', 'total', 'bulk', 'muita quantidade'
                ],
                phrases: [
                    'buy in bulk', 'large quantity', 'wholesale price', 'bulk discount',
                    'how much for', 'rate per kg', 'per kilo', 'per liter'
                ]
            },
            casual_inquiry: {
                keywords: [
                    // English
                    'what', 'which', 'where', 'when', 'how', 'available', 'have', 'sell', 'fresh',
                    'quality', 'good', 'best', 'type', 'variety', 'kind',
                    // Hindi (transliterated and common phrases)
                    'kya', 'kaun', 'kahan', 'kab', 'kaise', 'hai', 'milta', 'accha', 'taaza',
                    'quality', 'fresh', 'available', 'kya hai', 'kya milta', 'accha hai',
                    'taaza hai', 'fresh hai', 'quality kaisi', 'kahan se', 'kab aaya',
                    // Kannada (transliterated and common phrases)
                    'yaava', 'elli', 'yaavaga', 'hegge', 'ide', 'chennaagide', 'hosa',
                    'quality', 'fresh', 'sigutta', 'yaav quality', 'hosa ide', 'fresh ide',
                    'chennaag ide', 'elli sigutta', 'yaavaga banthu',
                    // Tamil (transliterated and common phrases)
                    'enna', 'enga', 'eppo', 'eppadi', 'irukku', 'nalla', 'fresh',
                    'quality', 'kidaikuma', 'nalla quality', 'fresh ah irukka', 'enga kedaikum',
                    // Telugu (transliterated and common phrases)
                    'enti', 'ekkada', 'eppudu', 'ela', 'undi', 'manchidi', 'fresh',
                    'quality', 'dorukutunda', 'manchi quality', 'fresh ga unda', 'ekkada dorukutundi',
                    // Bengali (transliterated and common phrases)
                    'ki', 'kothay', 'kokhon', 'kemne', 'ache', 'bhalo', 'fresh',
                    'quality', 'pawa jay', 'bhalo quality', 'fresh ache', 'kothay pabo',
                    // Marathi (transliterated and common phrases)
                    'kay', 'kuthe', 'kevha', 'kase', 'ahe', 'changla', 'fresh',
                    'quality', 'milte', 'changla quality', 'fresh ahe', 'kuthe milte',
                    // Gujarati (transliterated and common phrases)
                    'shu', 'kya', 'kyare', 'kem', 'che', 'saras', 'fresh',
                    'quality', 'male', 'saras quality', 'fresh che', 'kya male',
                    // Punjabi (transliterated and common phrases)
                    'ki', 'kithe', 'kado', 'kive', 'hai', 'changa', 'fresh',
                    'quality', 'milda', 'changa quality', 'fresh hai', 'kithe milda',
                    // Odia (transliterated and common phrases)
                    'kana', 'kouthi', 'kebe', 'kemiti', 'achi', 'bhala', 'fresh',
                    'quality', 'miliba', 'bhala quality', 'fresh achi', 'kouthi miliba',
                    // Malayalam (transliterated and common phrases)
                    'enthu', 'evide', 'eppol', 'engane', 'undu', 'nalla', 'fresh',
                    'quality', 'kittum', 'nalla quality', 'fresh aanu', 'evide kittum',
                    // Assamese (transliterated and common phrases)
                    'ki', 'kot', 'keti', 'kene', 'ase', 'bhal', 'fresh',
                    'quality', 'pam', 'bhal quality', 'fresh ase', 'kot pam',
                    // Urdu (transliterated and common phrases)
                    'kya', 'kahan', 'kab', 'kaise', 'hai', 'achha', 'taaza',
                    'quality', 'milta', 'achhi quality', 'taaza hai', 'kahan milta',
                    // Sindhi (transliterated and common phrases)
                    'kya', 'kithe', 'kado', 'kiven', 'ahe', 'sahi', 'taajo',
                    'quality', 'milando', 'sahi quality', 'taajo ahe', 'kithe milando',
                    // Kashmiri (transliterated and common phrases)
                    'kya', 'kati', 'kus', 'kathan', 'chu', 'zanaan', 'taaza',
                    'quality', 'milaan', 'zanaan quality', 'taaza chu', 'kati milaan',
                    // Maithili (transliterated and common phrases)
                    'ki', 'kahan', 'kakhon', 'kona', 'achi', 'nik', 'taaja',
                    'quality', 'bhetait', 'nik quality', 'taaja achi', 'kahan bhetait',
                    // Magahi (transliterated and common phrases)
                    'ka', 'kahan', 'kab', 'kaise', 'ba', 'achha', 'taaja',
                    'quality', 'milela', 'achha quality', 'taaja ba', 'kahan milela',
                    // Bhojpuri (transliterated and common phrases)
                    'ka', 'kahan', 'kab', 'kaise', 'ba', 'achha', 'taaja',
                    'quality', 'milela', 'achha quality', 'taaja ba', 'kahan milela',
                    // Rajasthani (transliterated and common phrases)
                    'kya', 'kyan', 'kado', 'kaise', 'hai', 'achho', 'taajo',
                    'quality', 'mile', 'achho quality', 'taajo hai', 'kyan mile',
                    // Konkani (transliterated and common phrases)
                    'kitem', 'khoim', 'kedna', 'koxem', 'asa', 'borem', 'fresh',
                    'quality', 'mellta', 'borem quality', 'fresh asa', 'khoim mellta',
                    // Santali (transliterated and common phrases)
                    'china', 'okare', 'okte', 'chinate', 'menakata', 'bhal', 'noa',
                    'quality', 'namaka', 'bhal quality', 'noa menakata', 'okare namaka',
                    // Manipuri (transliterated and common phrases)
                    'kari', 'kadaida', 'karamda', 'karamna', 'lei', 'phaba', 'anaba',
                    'quality', 'phangani', 'phaba quality', 'anaba lei', 'kadaida phangani',
                    // Bodo (transliterated and common phrases)
                    'ma', 'mobai', 'mwjang', 'maobai', 'dong', 'gober', 'gidang',
                    'quality', 'mwn', 'gober quality', 'gidang dong', 'mobai mwn',
                    // Dogri (transliterated and common phrases)
                    'kya', 'kithe', 'kado', 'kive', 'hai', 'changa', 'taaja',
                    'quality', 'milda', 'changa quality', 'taaja hai', 'kithe milda',
                    // Spanish (inquiry phrases)
                    'que', 'donde', 'cuando', 'como', 'esta', 'bueno', 'fresco',
                    'calidad', 'hay', 'buena calidad', 'esta fresco', 'donde hay',
                    // French (inquiry phrases)
                    'quoi', 'ou', 'quand', 'comment', 'est', 'bon', 'frais',
                    'qualite', 'il y a', 'bonne qualite', 'est frais', 'ou il y a',
                    // Arabic (inquiry phrases)
                    'matha', 'ayn', 'mata', 'kayf', 'huwa', 'jayyid', 'taazaj',
                    'jawda', 'yujad', 'jawda jayyida', 'taazaj huwa', 'ayn yujad',
                    // Portuguese (inquiry phrases)
                    'que', 'onde', 'quando', 'como', 'esta', 'bom', 'fresco',
                    'qualidade', 'tem', 'boa qualidade', 'esta fresco', 'onde tem'
                ],
                phrases: [
                    'do you have', 'is it fresh', 'what varieties', 'which type',
                    'how is quality', 'what do you sell', 'what is available'
                ]
            }
        };

        // Product extraction patterns
        this.productPatterns = {
            grains: [
                'rice', 'wheat', 'dal', 'lentil',
                // Hindi
                'chawal', 'gehun', 'daal', 'masoor',
                // Kannada
                'akki', 'godhi', 'bele', 'hesaru',
                // Tamil
                'arisi', 'godhumai', 'paruppu', 'thuvarai',
                // Telugu
                'biyyam', 'godhuma', 'pappu', 'pesalu',
                // Bengali
                'chal', 'gom', 'dal', 'masur',
                // Marathi
                'tandul', 'gahu', 'dal', 'masur',
                // Gujarati
                'chaval', 'ghau', 'dal', 'masur',
                // Punjabi
                'chawal', 'kanak', 'dal', 'masur',
                // Odia
                'chaula', 'gahama', 'dal', 'masura',
                // Malayalam
                'ari', 'gothambu', 'parippu', 'cherupayar',
                // Assamese
                'bhat', 'ghom', 'dal', 'masur',
                // Urdu
                'chawal', 'gehun', 'dal', 'masoor',
                // Sindhi
                'chawar', 'kani', 'dal', 'masur',
                // Kashmiri
                'batta', 'kanak', 'dal', 'masur',
                // Maithili
                'chaur', 'gahum', 'dal', 'masur',
                // Magahi
                'chaur', 'gahum', 'dal', 'masur',
                // Bhojpuri
                'chaur', 'gahum', 'dal', 'masur',
                // Rajasthani
                'chawal', 'gehun', 'dal', 'masur',
                // Konkani
                'tandul', 'gavu', 'dal', 'masur',
                // Santali
                'baha', 'gahum', 'dal', 'masur',
                // Manipuri
                'cheng', 'sam', 'dal', 'masur',
                // Bodo
                'bai', 'gahum', 'dal', 'masur',
                // Dogri
                'chawal', 'kanak', 'dal', 'masur'
            ],
            vegetables: [
                'onion', 'tomato', 'potato', 'carrot',
                // Hindi
                'pyaaz', 'tamatar', 'aloo', 'gajar',
                // Kannada
                'eerulli', 'tamata', 'aalugadde', 'gajjari',
                // Tamil
                'vengayam', 'thakkali', 'urulaikizhangu', 'carrot',
                // Telugu
                'ullipaya', 'tamata', 'bangaladumpa', 'carrot',
                // Bengali
                'peyaj', 'tomato', 'aloo', 'gajor',
                // Marathi
                'kanda', 'tamatar', 'batata', 'gajar',
                // Gujarati
                'dungri', 'tameta', 'bataka', 'gajar',
                // Punjabi
                'piyaz', 'tamatar', 'aloo', 'gajar',
                // Odia
                'piyaja', 'tamata', 'aloo', 'gajara',
                // Malayalam
                'ulli', 'thakkali', 'urulakizhangu', 'carrot',
                // Assamese
                'piyaj', 'bilahi', 'aloo', 'gajor',
                // Urdu
                'pyaz', 'tamatar', 'aloo', 'gajar',
                // Sindhi
                'piyazu', 'tamatar', 'aloo', 'gajar',
                // Kashmiri
                'pyaz', 'tamatar', 'aloo', 'gajar',
                // Maithili
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Magahi
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Bhojpuri
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Rajasthani
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Konkani
                'kando', 'tamatar', 'batata', 'gajar',
                // Santali
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Manipuri
                'tilhou', 'tamatar', 'aloo', 'gajar',
                // Bodo
                'piyaj', 'tamatar', 'aloo', 'gajar',
                // Dogri
                'piyaz', 'tamatar', 'aloo', 'gajar'
            ],
            fruits: [
                'apple', 'banana', 'mango', 'orange',
                // Hindi
                'seb', 'kela', 'aam', 'santra',
                // Kannada
                'sebu', 'balehannu', 'mavina', 'kittale',
                // Tamil
                'apple', 'vazhaipazham', 'maanga', 'orange',
                // Telugu
                'apple', 'arati', 'mamidi', 'orange',
                // Bengali
                'apple', 'kola', 'aam', 'komla',
                // Marathi
                'safarchand', 'kela', 'amba', 'santra',
                // Gujarati
                'apple', 'kela', 'keri', 'santra',
                // Punjabi
                'seb', 'kela', 'aam', 'santra',
                // Odia
                'apple', 'kadali', 'amba', 'komala',
                // Malayalam
                'apple', 'vazha', 'manga', 'orange',
                // Assamese
                'apple', 'kol', 'aam', 'komola',
                // Urdu
                'seb', 'kela', 'aam', 'santra',
                // Sindhi
                'seb', 'kela', 'aam', 'santra',
                // Kashmiri
                'seb', 'kela', 'aam', 'santra',
                // Maithili
                'seb', 'kera', 'aam', 'santra',
                // Magahi
                'seb', 'kera', 'aam', 'santra',
                // Bhojpuri
                'seb', 'kera', 'aam', 'santra',
                // Rajasthani
                'seb', 'kela', 'aam', 'santra',
                // Konkani
                'apple', 'kela', 'mango', 'santra',
                // Santali
                'apple', 'kela', 'aam', 'orange',
                // Manipuri
                'apple', 'laphu', 'heinou', 'orange',
                // Bodo
                'apple', 'kela', 'thaigri', 'orange',
                // Dogri
                'seb', 'kela', 'aam', 'santra'
            ],
            dairy: [
                'milk', 'egg', 'cheese',
                // Hindi
                'doodh', 'anda', 'paneer',
                // Kannada
                'haalu', 'motte', 'paneer',
                // Tamil
                'paal', 'muttai', 'paneer',
                // Telugu
                'palu', 'guddu', 'paneer',
                // Bengali
                'dudh', 'dim', 'paneer',
                // Marathi
                'dudh', 'ande', 'paneer',
                // Gujarati
                'dudh', 'anda', 'paneer',
                // Punjabi
                'dudh', 'anda', 'paneer',
                // Odia
                'dudha', 'anda', 'paneer',
                // Malayalam
                'paal', 'mutta', 'paneer',
                // Assamese
                'gakhir', 'koni', 'paneer',
                // Urdu
                'doodh', 'anda', 'paneer',
                // Sindhi
                'kheeru', 'ando', 'paneer',
                // Kashmiri
                'doodh', 'anda', 'paneer',
                // Maithili
                'dudh', 'anda', 'paneer',
                // Magahi
                'dudh', 'anda', 'paneer',
                // Bhojpuri
                'dudh', 'anda', 'paneer',
                // Rajasthani
                'dudh', 'ando', 'paneer',
                // Konkani
                'dudh', 'ande', 'paneer',
                // Santali
                'dudh', 'sim', 'paneer',
                // Manipuri
                'singju', 'ankukpa', 'paneer',
                // Bodo
                'dudh', 'dao', 'paneer',
                // Dogri
                'dudh', 'anda', 'paneer'
            ],
            meat: [
                'chicken', 'fish', 'mutton',
                // Hindi
                'murgi', 'machli', 'bakra',
                // Kannada
                'koli', 'meenu', 'kuri',
                // Tamil
                'kozhi', 'meen', 'aadu',
                // Telugu
                'kodi', 'chepa', 'meka',
                // Bengali
                'murgi', 'mach', 'khashi',
                // Marathi
                'kombdi', 'masa', 'mutton',
                // Gujarati
                'murgi', 'machhi', 'mutton',
                // Punjabi
                'murga', 'machhi', 'bakra',
                // Odia
                'kukkuta', 'machha', 'chhaaga',
                // Malayalam
                'kozhi', 'meen', 'aadu',
                // Assamese
                'kukura', 'mas', 'sagoli',
                // Urdu
                'murgi', 'machli', 'bakra',
                // Sindhi
                'murgi', 'machhi', 'bakro',
                // Kashmiri
                'kokur', 'gaad', 'mesh',
                // Maithili
                'murgi', 'machh', 'bakra',
                // Magahi
                'murgi', 'machh', 'bakra',
                // Bhojpuri
                'murgi', 'machh', 'bakra',
                // Rajasthani
                'murgi', 'machli', 'bakro',
                // Konkani
                'kombdi', 'nustem', 'rend',
                // Santali
                'sim', 'hako', 'merom',
                // Manipuri
                'yen', 'nga', 'shan',
                // Bodo
                'dao', 'na', 'mosou',
                // Dogri
                'murga', 'machhi', 'bakra'
            ],
            cooking: [
                'oil', 'sugar', 'salt',
                // Hindi
                'tel', 'cheeni', 'namak',
                // Kannada
                'enne', 'sakkare', 'uppu',
                // Tamil
                'ennai', 'sakkarai', 'uppu',
                // Telugu
                'nune', 'bellam', 'uppu',
                // Bengali
                'tel', 'chini', 'noon',
                // Marathi
                'tel', 'sakhar', 'mith',
                // Gujarati
                'tel', 'khand', 'mithu',
                // Punjabi
                'tel', 'cheeni', 'namak',
                // Odia
                'tela', 'chini', 'laban',
                // Malayalam
                'enna', 'sarkara', 'uppu',
                // Assamese
                'tel', 'cheni', 'noon',
                // Urdu
                'tel', 'cheeni', 'namak',
                // Sindhi
                'tel', 'khando', 'mitho',
                // Kashmiri
                'tel', 'khand', 'noon',
                // Maithili
                'tel', 'chini', 'noon',
                // Magahi
                'tel', 'chini', 'noon',
                // Bhojpuri
                'tel', 'chini', 'noon',
                // Rajasthani
                'tel', 'khand', 'noon',
                // Konkani
                'tel', 'sakhar', 'mith',
                // Santali
                'tel', 'chini', 'noon',
                // Manipuri
                'thao', 'chini', 'thum',
                // Bodo
                'tel', 'chini', 'khaar',
                // Dogri
                'tel', 'cheeni', 'namak'
            ]
        };

        // Quantity extraction patterns
        this.quantityPatterns = [
            /(\d+)\s*(kg|kilo|kilogram)/i,
            /(\d+)\s*(g|gram|grams)/i,
            /(\d+)\s*(l|liter|litre)/i,
            /(\d+)\s*(piece|pieces|pc)/i,
            /(\d+)\s*(dozen|doz)/i,
            /(\d+)\s*(box|boxes)/i,
            /(\d+)\s*(bag|bags|sack)/i
        ];
    }

    async classifyIntent(text, language) {
        try {
            // Normalize text for processing
            const normalizedText = this.normalizeText(text);
            
            // Extract product and quantity information
            const product = this.extractProduct(normalizedText);
            const quantity = this.extractQuantity(normalizedText);
            const category = this.getProductCategory(product);
            
            // Classify intent using deterministic rules
            const intentScores = this.calculateIntentScores(normalizedText);
            const primaryIntent = this.selectPrimaryIntent(intentScores);
            
            // Extract relevant keywords
            const keywords = this.extractKeywords(normalizedText, primaryIntent);
            
            // Calculate confidence based on keyword matches and patterns
            const confidence = this.calculateConfidence(intentScores, keywords, product);
            
            return {
                type: primaryIntent,
                confidence: confidence,
                keywords: keywords,
                product: product || 'unknown',
                category: category || 'general',
                quantity: quantity,
                language: language,
                originalText: text,
                normalizedText: normalizedText,
                scores: intentScores
            };
            
        } catch (error) {
            console.error('Intent classification error:', error);
            
            // Fallback to basic classification
            return {
                type: 'casual_inquiry',
                confidence: 0.3,
                keywords: [],
                product: 'unknown',
                category: 'general',
                quantity: null,
                language: language,
                originalText: text,
                error: error.message
            };
        }
    }

    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')  // Remove punctuation
            .replace(/\s+/g, ' ')      // Normalize whitespace
            .trim();
    }

    calculateIntentScores(text) {
        const scores = {
            bargaining: 0,
            bulk_purchase: 0,
            casual_inquiry: 0
        };

        // Score based on keyword matches
        Object.keys(this.intentPatterns).forEach(intent => {
            const pattern = this.intentPatterns[intent];
            
            // Check keywords
            pattern.keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    scores[intent] += 1;
                }
            });
            
            // Check phrases (higher weight)
            pattern.phrases.forEach(phrase => {
                if (text.includes(phrase)) {
                    scores[intent] += 2;
                }
            });
        });

        // Apply contextual rules
        this.applyContextualRules(text, scores);
        
        return scores;
    }

    applyContextualRules(text, scores) {
        // Rule 1: Numbers + units suggest bulk purchase
        if (/\d+\s*(kg|kilo|liter|piece|dozen|box|bag)/i.test(text)) {
            scores.bulk_purchase += 3;
        }
        
        // Rule 2: Price-related words suggest bargaining
        if (/\b(price|cost|rate|rupee|rs|₹)\b/i.test(text)) {
            scores.bargaining += 2;
        }
        
        // Rule 3: Question words suggest casual inquiry
        if (/\b(what|which|where|when|how|do you|is it|are you)\b/i.test(text)) {
            scores.casual_inquiry += 1;
        }
        
        // Rule 4: Comparison words suggest bargaining
        if (/\b(expensive|cheap|more|less|better|worse|compare)\b/i.test(text)) {
            scores.bargaining += 2;
        }
        
        // Rule 5: Availability questions suggest casual inquiry
        if (/\b(available|have|sell|stock|fresh|quality)\b/i.test(text)) {
            scores.casual_inquiry += 2;
        }
    }

    selectPrimaryIntent(scores) {
        const maxScore = Math.max(...Object.values(scores));
        
        if (maxScore === 0) {
            return 'casual_inquiry'; // Default fallback
        }
        
        // Return intent with highest score
        return Object.keys(scores).find(intent => scores[intent] === maxScore);
    }

    extractProduct(text) {
        // Check each product category
        for (const [category, products] of Object.entries(this.productPatterns)) {
            for (const product of products) {
                if (text.includes(product)) {
                    return product;
                }
            }
        }
        
        // Try to extract unknown product using common patterns
        const productMatch = text.match(/\b(buy|sell|price of|cost of|rate of)\s+(\w+)/i);
        if (productMatch) {
            return productMatch[2];
        }
        
        return null;
    }

    getProductCategory(product) {
        if (!product) return null;
        
        for (const [category, products] of Object.entries(this.productPatterns)) {
            if (products.includes(product)) {
                return category;
            }
        }
        
        return 'general';
    }

    extractQuantity(text) {
        for (const pattern of this.quantityPatterns) {
            const match = text.match(pattern);
            if (match) {
                return {
                    amount: parseInt(match[1]),
                    unit: match[2].toLowerCase()
                };
            }
        }
        
        return null;
    }

    extractKeywords(text, intent) {
        const keywords = [];
        const pattern = this.intentPatterns[intent];
        
        if (pattern) {
            // Extract matching keywords
            pattern.keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    keywords.push(keyword);
                }
            });
            
            // Extract matching phrases
            pattern.phrases.forEach(phrase => {
                if (text.includes(phrase)) {
                    keywords.push(phrase);
                }
            });
        }
        
        return keywords.slice(0, 5); // Limit to top 5 keywords
    }

    calculateConfidence(scores, keywords, product) {
        const maxScore = Math.max(...Object.values(scores));
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        
        let confidence = 0.3; // Base confidence
        
        if (maxScore > 0) {
            // Score-based confidence
            confidence += (maxScore / Math.max(totalScore, 1)) * 0.4;
            
            // Keyword-based confidence
            confidence += Math.min(keywords.length * 0.1, 0.2);
            
            // Product identification bonus
            if (product && product !== 'unknown') {
                confidence += 0.1;
            }
        }
        
        return Math.min(confidence, 0.95); // Cap at 95%
    }

    // Get confidence threshold for intent reliability
    getConfidenceThreshold() {
        return 0.6; // Minimum confidence for reliable classification
    }

    // Check if classification is reliable enough
    isReliable(result) {
        return result.confidence >= this.getConfidenceThreshold();
    }
}

class TranslationEngine {
    constructor() {
        // Predefined phrase templates for common trade terms
        this.tradePhrasesTemplates = {
            english: {
                price_inquiry: [
                    "What is the price of {product}?",
                    "How much does {product} cost?",
                    "What is the rate for {product}?"
                ],
                bargaining: [
                    "Can you reduce the price of {product}?",
                    "This is too expensive for {product}.",
                    "What is your best price for {product}?",
                    "Can you give a discount on {product}?"
                ],
                bulk_purchase: [
                    "What is the wholesale price for {product}?",
                    "I want to buy {quantity} {product}.",
                    "Do you give bulk discount for {product}?"
                ],
                acceptance: [
                    "I will take {product} at this price.",
                    "This price is acceptable for {product}.",
                    "Okay, I agree to buy {product}."
                ],
                rejection: [
                    "This price is too high for {product}.",
                    "I cannot afford {product} at this rate.",
                    "Sorry, this is beyond my budget for {product}."
                ]
            },
            hindi: {
                price_inquiry: [
                    "{product} ka daam kya hai?",
                    "{product} kitne mein milega?",
                    "{product} ka rate kya hai?"
                ],
                bargaining: [
                    "{product} ka daam kam kar sakte hain?",
                    "Yeh {product} bahut mehenga hai.",
                    "{product} ka best price kya hai?",
                    "{product} mein discount mil sakta hai?"
                ],
                bulk_purchase: [
                    "{product} ka wholesale rate kya hai?",
                    "Mujhe {quantity} {product} chahiye.",
                    "{product} mein bulk discount milega?"
                ],
                acceptance: [
                    "Main {product} is daam mein le lunga.",
                    "{product} ka yeh daam theek hai.",
                    "Accha, main {product} kharid lunga."
                ],
                rejection: [
                    "{product} ka daam bahut zyada hai.",
                    "Main {product} itne mein nahi le sakta.",
                    "Maaf kijiye, {product} mere budget se zyada hai."
                ]
            },
            kannada: {
                price_inquiry: [
                    "{product} bele eshtu?",
                    "{product} eshtu duddu?",
                    "{product} rate enu?"
                ],
                bargaining: [
                    "{product} bele kammi maadtira?",
                    "Ee {product} tumba jaasti.",
                    "{product} best price enu?",
                    "{product} nalli discount sigutta?"
                ],
                bulk_purchase: [
                    "{product} wholesale rate enu?",
                    "Nanage {quantity} {product} beku.",
                    "{product} nalli bulk discount sigutta?"
                ],
                acceptance: [
                    "Naanu {product} ee bele nalli tagoltini.",
                    "{product} ee bele olledu.",
                    "Sari, naanu {product} kondukolteeni."
                ],
                rejection: [
                    "{product} bele tumba jaasti.",
                    "Naanu {product} eshtu duddu nalli tagolla sakilla.",
                    "Kshamissi, {product} nanna budget gintha jaasti."
                ]
            }
        };

        // Common word translations
        this.commonTranslations = {
            'english_to_hindi': {
                'price': 'daam', 'cost': 'kimat', 'expensive': 'mehenga', 'cheap': 'sasta',
                'discount': 'chhoot', 'quality': 'gunvatta', 'fresh': 'taaza', 'good': 'accha',
                'kg': 'kilo', 'liter': 'litre', 'piece': 'tukda', 'dozen': 'darjan'
            },
            'english_to_kannada': {
                'price': 'bele', 'cost': 'duddu', 'expensive': 'jaasti', 'cheap': 'kammi',
                'discount': 'discount', 'quality': 'gunvatta', 'fresh': 'hosa', 'good': 'chennaagide',
                'kg': 'kilo', 'liter': 'litre', 'piece': 'piece', 'dozen': 'dozen'
            },
            'hindi_to_english': {
                'daam': 'price', 'kimat': 'cost', 'mehenga': 'expensive', 'sasta': 'cheap',
                'chhoot': 'discount', 'accha': 'good', 'taaza': 'fresh', 'kilo': 'kg'
            },
            'kannada_to_english': {
                'bele': 'price', 'duddu': 'cost', 'jaasti': 'expensive', 'kammi': 'cheap',
                'chennaagide': 'good', 'hosa': 'fresh', 'kilo': 'kg'
            }
        };

        // Negotiation tone preservation patterns
        this.tonePatterns = {
            polite: ['please', 'kindly', 'if possible', 'kripaya', 'dayavittu'],
            urgent: ['quickly', 'fast', 'immediately', 'jaldi', 'bega'],
            respectful: ['sir', 'madam', 'sahab', 'amma', 'ayya'],
            friendly: ['brother', 'sister', 'bhai', 'didi', 'anna', 'akka']
        };
    }

    async translate(text, fromLanguage, toLanguage, intent = null) {
        try {
            // If same language, return original text
            if (fromLanguage === toLanguage) {
                return text;
            }

            // Normalize language codes
            const fromLang = this.normalizeLanguageCode(fromLanguage);
            const toLang = this.normalizeLanguageCode(toLanguage);

            // Try template-based translation first (for common trade phrases)
            const templateTranslation = this.translateUsingTemplates(text, fromLang, toLang, intent);
            if (templateTranslation) {
                return templateTranslation;
            }

            // Use word-by-word translation with tone preservation
            const wordTranslation = this.translateWords(text, fromLang, toLang);
            
            // Preserve negotiation tone
            const tonePreservedTranslation = this.preserveNegotiationTone(wordTranslation, text, toLang);
            
            return tonePreservedTranslation || text; // Fallback to original if translation fails

        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text on error
        }
    }

    translateUsingTemplates(text, fromLang, toLang, intent) {
        if (!intent) return null;

        const normalizedText = text.toLowerCase().trim();
        
        // Check if text matches any template pattern
        const templates = this.tradePhrasesTemplates[fromLang];
        if (!templates) return null;

        // Look for matching patterns in the intent category
        const intentTemplates = templates[intent.type] || templates['price_inquiry']; // Default fallback
        
        for (const template of intentTemplates) {
            const pattern = this.createPatternFromTemplate(template);
            const match = normalizedText.match(pattern);
            
            if (match) {
                // Found a matching template, translate it
                const targetTemplates = this.tradePhrasesTemplates[toLang];
                if (targetTemplates && targetTemplates[intent.type]) {
                    const targetTemplate = targetTemplates[intent.type][0]; // Use first template
                    return this.fillTemplate(targetTemplate, intent);
                }
            }
        }

        return null;
    }

    createPatternFromTemplate(template) {
        // Convert template to regex pattern
        const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = escaped.replace(/\\\{[^}]+\\\}/g, '\\w+');
        return new RegExp(pattern, 'i');
    }

    fillTemplate(template, intent) {
        let filled = template;
        
        // Replace placeholders with actual values
        if (intent.product && intent.product !== 'unknown') {
            filled = filled.replace(/\{product\}/g, intent.product);
        }
        
        if (intent.quantity) {
            const quantityStr = `${intent.quantity.amount} ${intent.quantity.unit}`;
            filled = filled.replace(/\{quantity\}/g, quantityStr);
        }
        
        // Remove unfilled placeholders
        filled = filled.replace(/\{[^}]+\}/g, '');
        
        return filled.trim();
    }

    translateWords(text, fromLang, toLang) {
        const translationKey = `${fromLang}_to_${toLang}`;
        const translations = this.commonTranslations[translationKey];
        
        if (!translations) {
            return text; // No translation available
        }

        let translatedText = text.toLowerCase();
        
        // Replace known words
        Object.entries(translations).forEach(([from, to]) => {
            const regex = new RegExp(`\\b${from}\\b`, 'gi');
            translatedText = translatedText.replace(regex, to);
        });

        return translatedText;
    }

    preserveNegotiationTone(translatedText, originalText, targetLanguage) {
        let tonePreservedText = translatedText;
        const originalLower = originalText.toLowerCase();

        // Detect and preserve tone
        Object.entries(this.tonePatterns).forEach(([tone, patterns]) => {
            patterns.forEach(pattern => {
                if (originalLower.includes(pattern)) {
                    tonePreservedText = this.addToneMarkers(tonePreservedText, tone, targetLanguage);
                }
            });
        });

        return tonePreservedText;
    }

    addToneMarkers(text, tone, language) {
        const toneMarkers = {
            english: {
                polite: 'please ',
                urgent: 'quickly ',
                respectful: 'sir/madam ',
                friendly: 'friend '
            },
            hindi: {
                polite: 'kripaya ',
                urgent: 'jaldi ',
                respectful: 'sahab ',
                friendly: 'bhai '
            },
            kannada: {
                polite: 'dayavittu ',
                urgent: 'bega ',
                respectful: 'ayya ',
                friendly: 'anna '
            }
        };

        const marker = toneMarkers[language]?.[tone];
        if (marker && !text.includes(marker.trim())) {
            return marker + text;
        }

        return text;
    }

    normalizeLanguageCode(language) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada',
            'english': 'english',
            'hindi': 'hindi',
            'kannada': 'kannada'
        };
        
        return langMap[language] || 'english';
    }

    // Get common phrases for a specific language and category
    getCommonPhrases(language, category) {
        const normalizedLang = this.normalizeLanguageCode(language);
        const phrases = this.tradePhrasesTemplates[normalizedLang];
        
        if (phrases && phrases[category]) {
            return phrases[category];
        }
        
        return phrases?.price_inquiry || []; // Default fallback
    }

    // Check if translation is needed
    isTranslationNeeded(fromLanguage, toLanguage) {
        return this.normalizeLanguageCode(fromLanguage) !== this.normalizeLanguageCode(toLanguage);
    }

    // Get supported language pairs
    getSupportedLanguages() {
        return ['english', 'hindi', 'kannada'];
    }

    // Detect if text contains mixed languages (basic heuristic)
    detectMixedLanguage(text) {
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        const devanagariChars = (text.match(/[\u0900-\u097F]+/g) || []).length;
        const kannadaChars = (text.match(/[\u0C80-\u0CFF]+/g) || []).length;
        
        const total = englishWords + devanagariChars + kannadaChars;
        
        if (total === 0) return 'unknown';
        
        if (englishWords / total > 0.7) return 'english';
        if (devanagariChars / total > 0.7) return 'hindi';
        if (kannadaChars / total > 0.7) return 'kannada';
        
        return 'mixed';
    }
}

class PriceDiscoveryEngine {
    constructor() {
        this.priceData = {};
        this.categories = {};
        this.negotiationRules = {};
        this.isDataLoaded = false;
    }

    loadPriceData(data) {
        try {
            this.priceData = data.products || {};
            this.categories = data.categories || {};
            this.negotiationRules = data.negotiationRules || {};
            this.isDataLoaded = true;
            
            console.log(`Price data loaded: ${Object.keys(this.priceData).length} products, ${Object.keys(this.categories).length} categories`);
        } catch (error) {
            console.error('Error loading price data:', error);
            this.isDataLoaded = false;
        }
    }

    async getMarketPrice(product, category) {
        try {
            // Normalize product name for lookup
            const normalizedProduct = this.normalizeProductName(product);
            
            // Try direct product lookup first
            let productData = this.priceData[normalizedProduct];
            
            // If not found, try fuzzy matching
            if (!productData) {
                productData = this.findProductByFuzzyMatch(normalizedProduct);
            }
            
            // If still not found, use category defaults
            if (!productData && category && category !== 'general') {
                productData = this.getCategoryDefaults(category);
            }
            
            // If no data available, return null
            if (!productData) {
                return null;
            }
            
            // Calculate negotiation range
            const negotiationRange = this.calculateNegotiationRange(productData.marketPrice, category);
            
            // Apply any seasonal or market variations
            const adjustedPrices = this.applyMarketVariations(productData, category);
            
            return {
                product: normalizedProduct,
                category: category || productData.category || 'general',
                marketPrice: adjustedPrices.marketPrice,
                minPrice: adjustedPrices.minPrice,
                maxPrice: adjustedPrices.maxPrice,
                unit: productData.unit || 'kg',
                bulkThreshold: productData.bulkThreshold || 5,
                bulkDiscount: productData.bulkDiscount || 0.05,
                negotiationRange: negotiationRange,
                confidence: productData.confidence || 0.8,
                lastUpdated: new Date().toISOString(),
                source: productData.source || 'static_data'
            };
            
        } catch (error) {
            console.error('Error getting market price:', error);
            return null;
        }
    }

    calculateNegotiationRange(basePrice, intent) {
        try {
            const maxDiscount = this.negotiationRules.maxDiscount || 0.15;
            const minMargin = 0.05; // Minimum 5% margin
            
            // Calculate price boundaries
            const absoluteMin = Math.round(basePrice * (1 - maxDiscount));
            const safeMin = Math.round(basePrice * (1 - maxDiscount + minMargin));
            const market = Math.round(basePrice);
            const premium = Math.round(basePrice * 1.1);
            
            return {
                absoluteMinimum: absoluteMin,
                safeMinimum: safeMin,
                marketPrice: market,
                premiumPrice: premium,
                recommendedStart: premium, // Start negotiations higher
                acceptableRange: [safeMin, premium],
                maxDiscount: maxDiscount
            };
            
        } catch (error) {
            console.error('Error calculating negotiation range:', error);
            return {
                absoluteMinimum: Math.round(basePrice * 0.85),
                safeMinimum: Math.round(basePrice * 0.9),
                marketPrice: Math.round(basePrice),
                premiumPrice: Math.round(basePrice * 1.1),
                recommendedStart: Math.round(basePrice * 1.1),
                acceptableRange: [Math.round(basePrice * 0.9), Math.round(basePrice * 1.1)],
                maxDiscount: 0.15
            };
        }
    }

    applyBulkDiscount(price, quantity, productData) {
        try {
            if (!productData || !quantity) {
                return price;
            }
            
            const bulkThreshold = productData.bulkThreshold || 5;
            const bulkDiscount = productData.bulkDiscount || 0.05;
            
            // Check if quantity qualifies for bulk discount
            if (quantity.amount >= bulkThreshold) {
                const discountedPrice = price * (1 - bulkDiscount);
                
                return {
                    originalPrice: price,
                    discountedPrice: Math.round(discountedPrice),
                    discount: bulkDiscount,
                    savings: Math.round(price - discountedPrice),
                    qualifiesForBulk: true,
                    threshold: bulkThreshold,
                    unit: quantity.unit
                };
            }
            
            return {
                originalPrice: price,
                discountedPrice: price,
                discount: 0,
                savings: 0,
                qualifiesForBulk: false,
                threshold: bulkThreshold,
                unit: quantity.unit,
                quantityNeeded: bulkThreshold - quantity.amount
            };
            
        } catch (error) {
            console.error('Error applying bulk discount:', error);
            return price;
        }
    }

    getPriceConfidence(product) {
        const normalizedProduct = this.normalizeProductName(product);
        const productData = this.priceData[normalizedProduct];
        
        if (!productData) {
            return 0.3; // Low confidence for unknown products
        }
        
        // Base confidence on data freshness and source
        let confidence = 0.8;
        
        // Reduce confidence for estimated or derived prices
        if (productData.source === 'estimated') {
            confidence -= 0.2;
        }
        
        // Increase confidence for frequently traded items
        if (productData.category === 'grains' || productData.category === 'vegetables') {
            confidence += 0.1;
        }
        
        return Math.min(confidence, 0.95);
    }

    normalizeProductName(product) {
        if (!product || product === 'unknown') {
            return null;
        }
        
        return product.toLowerCase()
            .replace(/s$/, '') // Remove plural 's'
            .replace(/[^a-z]/g, '') // Remove non-alphabetic characters
            .trim();
    }

    findProductByFuzzyMatch(searchProduct) {
        if (!searchProduct) return null;
        
        const productNames = Object.keys(this.priceData);
        
        // Try exact match first
        if (productNames.includes(searchProduct)) {
            return this.priceData[searchProduct];
        }
        
        // Try partial matches
        for (const productName of productNames) {
            if (productName.includes(searchProduct) || searchProduct.includes(productName)) {
                return this.priceData[productName];
            }
        }
        
        // Try category-based matching
        for (const [productName, data] of Object.entries(this.priceData)) {
            if (data.category && this.categories[data.category]) {
                const categoryKeywords = this.categories[data.category].keywords || [];
                if (categoryKeywords.includes(searchProduct)) {
                    return data;
                }
            }
        }
        
        return null;
    }

    getCategoryDefaults(category) {
        const categoryData = this.categories[category];
        if (!categoryData) return null;
        
        // Generate default pricing based on category
        const basePrice = categoryData.averagePrice || 50;
        const margin = categoryData.defaultMargin || 0.15;
        
        return {
            category: category,
            marketPrice: basePrice,
            minPrice: Math.round(basePrice * (1 - margin)),
            maxPrice: Math.round(basePrice * (1 + margin)),
            unit: 'kg',
            bulkThreshold: 5,
            bulkDiscount: 0.05,
            source: 'category_default',
            confidence: 0.5
        };
    }

    applyMarketVariations(productData, category) {
        try {
            const categoryInfo = this.categories[category] || {};
            const seasonalVariation = categoryInfo.seasonalVariation || 0.1;
            
            // Apply small random variation to simulate market conditions
            const variation = (Math.random() - 0.5) * seasonalVariation;
            
            return {
                marketPrice: Math.round(productData.marketPrice * (1 + variation)),
                minPrice: Math.round(productData.minPrice * (1 + variation)),
                maxPrice: Math.round(productData.maxPrice * (1 + variation))
            };
            
        } catch (error) {
            console.error('Error applying market variations:', error);
            return {
                marketPrice: productData.marketPrice,
                minPrice: productData.minPrice,
                maxPrice: productData.maxPrice
            };
        }
    }

    // Get pricing strategy recommendations
    getPricingStrategy(intent, productData, customerBehavior = null) {
        try {
            const strategy = {
                approach: 'standard',
                startingPrice: productData.marketPrice,
                minimumPrice: productData.minPrice,
                recommendations: []
            };
            
            switch (intent.type) {
                case 'bargaining':
                    strategy.approach = 'negotiation_ready';
                    strategy.startingPrice = productData.negotiationRange.recommendedStart;
                    strategy.recommendations.push('Start with premium price, expect negotiation');
                    strategy.recommendations.push('Be prepared to come down to market price');
                    break;
                    
                case 'bulk_purchase':
                    strategy.approach = 'volume_discount';
                    if (intent.quantity && intent.quantity.amount >= productData.bulkThreshold) {
                        const bulkPrice = this.applyBulkDiscount(productData.marketPrice, intent.quantity, productData);
                        strategy.startingPrice = bulkPrice.discountedPrice;
                        strategy.recommendations.push(`Offer bulk discount: ${(bulkPrice.discount * 100).toFixed(1)}%`);
                    }
                    break;
                    
                case 'casual_inquiry':
                    strategy.approach = 'informational';
                    strategy.recommendations.push('Provide clear pricing information');
                    strategy.recommendations.push('Highlight quality and freshness');
                    break;
            }
            
            return strategy;
            
        } catch (error) {
            console.error('Error getting pricing strategy:', error);
            return {
                approach: 'standard',
                startingPrice: productData.marketPrice,
                minimumPrice: productData.minPrice,
                recommendations: ['Use standard market pricing']
            };
        }
    }

    // Check if price data is available and fresh
    isDataAvailable() {
        return this.isDataLoaded && Object.keys(this.priceData).length > 0;
    }

    // Get all available products
    getAvailableProducts() {
        return Object.keys(this.priceData);
    }

    // Get products by category
    getProductsByCategory(category) {
        return Object.entries(this.priceData)
            .filter(([_, data]) => data.category === category)
            .map(([product, _]) => product);
    }

    // Generate comprehensive price ranges with fallback strategies
    generatePriceRange(product, category, intent = null, quantity = null) {
        try {
            // Get base market price
            const marketData = this.getMarketPrice(product, category);
            
            if (!marketData) {
                return this.generateFallbackPriceRange(product, category);
            }
            
            // Calculate negotiation ranges
            const negotiationRange = this.calculateNegotiationRange(marketData.marketPrice, intent);
            
            // Apply bulk discounts if applicable
            let bulkPricing = null;
            if (quantity && quantity.amount) {
                bulkPricing = this.applyBulkDiscount(marketData.marketPrice, quantity, marketData);
            }
            
            // Generate comprehensive range
            const priceRange = {
                product: marketData.product,
                category: marketData.category,
                basePrice: marketData.marketPrice,
                unit: marketData.unit,
                
                // Price boundaries
                ranges: {
                    minimum: negotiationRange.absoluteMinimum,
                    safe: negotiationRange.safeMinimum,
                    market: negotiationRange.marketPrice,
                    premium: negotiationRange.premiumPrice,
                    recommended: negotiationRange.recommendedStart
                },
                
                // Negotiation guidance
                negotiation: {
                    startAt: negotiationRange.recommendedStart,
                    acceptableRange: negotiationRange.acceptableRange,
                    maxDiscount: negotiationRange.maxDiscount,
                    flexibility: this.calculateFlexibility(marketData.category)
                },
                
                // Bulk pricing (if applicable)
                bulk: bulkPricing,
                
                // Confidence and metadata
                confidence: this.getPriceConfidence(product),
                lastUpdated: new Date().toISOString(),
                source: marketData.source || 'static_data'
            };
            
            return priceRange;
            
        } catch (error) {
            console.error('Error generating price range:', error);
            return this.generateFallbackPriceRange(product, category);
        }
    }

    generateFallbackPriceRange(product, category) {
        // Generate reasonable fallback pricing when no data available
        const categoryDefaults = {
            'grains': { base: 40, min: 35, max: 50 },
            'vegetables': { base: 30, min: 25, max: 40 },
            'fruits': { base: 80, min: 60, max: 100 },
            'dairy': { base: 55, min: 45, max: 65 },
            'meat': { base: 200, min: 180, max: 250 },
            'cooking': { base: 100, min: 90, max: 120 },
            'general': { base: 50, min: 40, max: 60 }
        };
        
        const defaults = categoryDefaults[category] || categoryDefaults['general'];
        
        return {
            product: product || 'unknown',
            category: category || 'general',
            basePrice: defaults.base,
            unit: 'kg',
            
            ranges: {
                minimum: defaults.min,
                safe: Math.round(defaults.base * 0.9),
                market: defaults.base,
                premium: Math.round(defaults.base * 1.1),
                recommended: Math.round(defaults.base * 1.1)
            },
            
            negotiation: {
                startAt: Math.round(defaults.base * 1.1),
                acceptableRange: [Math.round(defaults.base * 0.9), Math.round(defaults.base * 1.1)],
                maxDiscount: 0.15,
                flexibility: 'moderate'
            },
            
            bulk: null,
            confidence: 0.3,
            lastUpdated: new Date().toISOString(),
            source: 'fallback_estimate',
            warning: 'Price data not available - using category estimates'
        };
    }

    calculateFlexibility(category) {
        // Determine negotiation flexibility based on product category
        const flexibilityMap = {
            'vegetables': 'high',      // Perishable, more flexible
            'fruits': 'high',          // Perishable, more flexible
            'grains': 'moderate',      // Stable, moderate flexibility
            'dairy': 'low',            // Fixed costs, less flexible
            'meat': 'moderate',        // Some flexibility
            'cooking': 'low'           // Branded items, less flexible
        };
        
        return flexibilityMap[category] || 'moderate';
    }

    // Handle missing price data with intelligent fallbacks
    handleMissingPriceData(product, category, intent) {
        const fallbackStrategies = [
            'category_average',
            'similar_product',
            'market_estimate',
            'user_guidance'
        ];
        
        const strategy = {
            product: product,
            category: category,
            dataAvailable: false,
            fallbackUsed: 'category_average',
            suggestions: [],
            confidence: 0.3
        };
        
        // Strategy 1: Use category averages
        if (category && this.categories[category]) {
            const categoryData = this.getCategoryDefaults(category);
            if (categoryData) {
                strategy.priceRange = this.generatePriceRange(product, category);
                strategy.suggestions.push(`Using ${category} category average pricing`);
                strategy.confidence = 0.5;
                return strategy;
            }
        }
        
        // Strategy 2: Find similar products
        const similarProduct = this.findSimilarProduct(product);
        if (similarProduct) {
            strategy.fallbackUsed = 'similar_product';
            strategy.suggestions.push(`Pricing based on similar product: ${similarProduct}`);
            strategy.confidence = 0.4;
        }
        
        // Strategy 3: General market estimate
        strategy.priceRange = this.generateFallbackPriceRange(product, category);
        strategy.suggestions.push('Using general market estimates');
        strategy.suggestions.push('Consider updating price data for better accuracy');
        
        return strategy;
    }

    findSimilarProduct(searchProduct) {
        if (!searchProduct) return null;
        
        const productNames = Object.keys(this.priceData);
        
        // Find products with similar names
        for (const productName of productNames) {
            const similarity = this.calculateStringSimilarity(searchProduct, productName);
            if (similarity > 0.6) {
                return productName;
            }
        }
        
        return null;
    }

    calculateStringSimilarity(str1, str2) {
        // Simple similarity calculation
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

class NegotiationAssistant {
    constructor() {
        // Negotiation strategies based on intent and market conditions
        this.negotiationStrategies = {
            bargaining: {
                approach: 'flexible',
                startHigh: true,
                maxConcessions: 3,
                minMargin: 0.05
            },
            bulk_purchase: {
                approach: 'volume_focused',
                startHigh: false,
                maxConcessions: 2,
                minMargin: 0.03
            },
            casual_inquiry: {
                approach: 'informational',
                startHigh: false,
                maxConcessions: 1,
                minMargin: 0.1
            }
        };

        // Cultural negotiation patterns
        this.culturalPatterns = {
            respectful: {
                tone: 'polite',
                phrases: ['I appreciate your interest', 'Thank you for considering', 'I understand your position'],
                declineStyle: 'gentle'
            },
            friendly: {
                tone: 'warm',
                phrases: ['Let me help you', 'We can work something out', 'I want to find a good deal for you'],
                declineStyle: 'understanding'
            },
            professional: {
                tone: 'business',
                phrases: ['This is a fair price', 'Based on market rates', 'Quality justifies the cost'],
                declineStyle: 'firm_but_polite'
            }
        };

        // Counter-offer calculation rules
        this.counterOfferRules = {
            first_offer: {
                reduction: 0.05,  // 5% reduction from starting price
                message: 'Let me see what I can do for you'
            },
            second_offer: {
                reduction: 0.08,  // 8% total reduction
                message: 'This is getting close to my best price'
            },
            final_offer: {
                reduction: 0.12,  // 12% total reduction (within 15% max)
                message: 'This is my final offer'
            }
        };
    }

    async generateGuidance(intent, priceData, originalText) {
        try {
            if (!priceData) {
                return this.generateFallbackGuidance(intent, originalText);
            }

            // Analyze customer intent and behavior
            const customerAnalysis = this.analyzeCustomerBehavior(originalText, intent);
            
            // Generate counter-offer suggestions
            const counterOffers = this.generateCounterOffers(priceData, intent, customerAnalysis);
            
            // Determine negotiation tactics
            const tactics = this.selectNegotiationTactics(priceData, intent, customerAnalysis);
            
            // Generate value propositions
            const valueProps = this.generateValuePropositions(priceData, intent);
            
            // Assess decision recommendations
            const decisions = this.generateDecisionGuidance(priceData, intent, customerAnalysis);
            
            return {
                customerAnalysis: customerAnalysis,
                counterOffers: counterOffers,
                tactics: tactics,
                valuePropositions: valueProps,
                decisions: decisions,
                confidence: this.calculateGuidanceConfidence(priceData, intent),
                culturalContext: this.getCulturalContext(intent),
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error generating negotiation guidance:', error);
            return this.generateFallbackGuidance(intent, originalText);
        }
    }

    analyzeCustomerBehavior(text, intent) {
        const analysis = {
            priceAwareness: 'unknown',
            urgency: 'normal',
            flexibility: 'moderate',
            signals: []
        };

        const lowerText = text.toLowerCase();

        // Detect price awareness
        if (lowerText.includes('expensive') || lowerText.includes('costly') || lowerText.includes('mehenga')) {
            analysis.priceAwareness = 'high';
            analysis.signals.push('price_sensitive');
        } else if (lowerText.includes('fair') || lowerText.includes('reasonable') || lowerText.includes('accha')) {
            analysis.priceAwareness = 'moderate';
            analysis.signals.push('price_conscious');
        }

        // Detect urgency
        if (lowerText.includes('quickly') || lowerText.includes('urgent') || lowerText.includes('jaldi')) {
            analysis.urgency = 'high';
            analysis.signals.push('time_pressure');
        } else if (lowerText.includes('thinking') || lowerText.includes('consider') || lowerText.includes('sochna')) {
            analysis.urgency = 'low';
            analysis.signals.push('deliberating');
        }

        // Detect flexibility indicators
        if (lowerText.includes('budget') || lowerText.includes('afford') || lowerText.includes('paisa')) {
            analysis.flexibility = 'low';
            analysis.signals.push('budget_constrained');
        } else if (lowerText.includes('quality') || lowerText.includes('best') || lowerText.includes('accha')) {
            analysis.flexibility = 'high';
            analysis.signals.push('quality_focused');
        }

        // Detect bulk purchase signals
        if (intent.quantity && intent.quantity.amount > 5) {
            analysis.signals.push('bulk_buyer');
            analysis.flexibility = 'high';
        }

        return analysis;
    }

    generateCounterOffers(priceData, intent, customerAnalysis) {
        const offers = [];
        const basePrice = priceData.ranges.market;
        const flexibility = priceData.negotiation.flexibility;

        // Determine starting position based on flexibility and customer analysis
        let startingPrice = priceData.ranges.recommended;
        
        if (customerAnalysis.priceAwareness === 'high') {
            startingPrice = priceData.ranges.market; // Start closer to market price
        }

        // Generate progressive counter-offers
        const offerLevels = ['first_offer', 'second_offer', 'final_offer'];
        
        offerLevels.forEach((level, index) => {
            const rule = this.counterOfferRules[level];
            const discountedPrice = Math.round(startingPrice * (1 - rule.reduction));
            
            // Ensure we don't go below safe minimum
            const finalPrice = Math.max(discountedPrice, priceData.ranges.safe);
            
            offers.push({
                level: level,
                price: finalPrice,
                discount: Math.round(((startingPrice - finalPrice) / startingPrice) * 100),
                message: rule.message,
                reasoning: this.generateOfferReasoning(level, finalPrice, priceData),
                recommended: index === 0 // First offer is recommended
            });
        });

        return offers;
    }

    generateOfferReasoning(level, price, priceData) {
        const reasons = [];
        
        switch (level) {
            case 'first_offer':
                reasons.push('Good starting point for negotiation');
                reasons.push('Shows willingness to work with customer');
                break;
            case 'second_offer':
                reasons.push('Demonstrates flexibility while maintaining margin');
                reasons.push('Builds customer confidence in the deal');
                break;
            case 'final_offer':
                reasons.push('Near minimum acceptable price');
                reasons.push('Clear signal that negotiation is ending');
                break;
        }

        if (price > priceData.ranges.market) {
            reasons.push('Still above market average');
        } else if (price === priceData.ranges.market) {
            reasons.push('At fair market price');
        } else {
            reasons.push('Below market price - good customer deal');
        }

        return reasons;
    }

    selectNegotiationTactics(priceData, intent, customerAnalysis) {
        const tactics = {
            primary: [],
            secondary: [],
            avoid: []
        };

        const flexibility = priceData.negotiation.flexibility;
        
        // Primary tactics based on flexibility
        switch (flexibility) {
            case 'high':
                tactics.primary.push('Start with premium pricing');
                tactics.primary.push('Offer multiple price points');
                tactics.primary.push('Emphasize freshness and quality');
                break;
            case 'moderate':
                tactics.primary.push('Start near market price');
                tactics.primary.push('Offer reasonable discounts');
                tactics.primary.push('Focus on fair value');
                break;
            case 'low':
                tactics.primary.push('Stick close to market price');
                tactics.primary.push('Emphasize fixed costs');
                tactics.primary.push('Offer non-price value');
                break;
        }

        // Adjust tactics based on customer analysis
        if (customerAnalysis.signals.includes('price_sensitive')) {
            tactics.secondary.push('Offer bulk discounts');
            tactics.secondary.push('Suggest alternative products');
            tactics.avoid.push('Premium positioning');
        }

        if (customerAnalysis.signals.includes('quality_focused')) {
            tactics.secondary.push('Highlight quality benefits');
            tactics.secondary.push('Compare with competitors');
            tactics.avoid.push('Aggressive discounting');
        }

        if (customerAnalysis.signals.includes('time_pressure')) {
            tactics.secondary.push('Quick decision incentives');
            tactics.primary.push('Streamline the negotiation');
        }

        return tactics;
    }

    generateValuePropositions(priceData, intent) {
        const valueProps = [];

        // Quality-based value propositions
        valueProps.push({
            type: 'quality',
            message: 'Fresh, high-quality products',
            reasoning: 'Quality justifies the price difference'
        });

        // Service-based value propositions
        valueProps.push({
            type: 'service',
            message: 'Reliable supply and good service',
            reasoning: 'Long-term relationship value'
        });

        // Bulk purchase value propositions
        if (intent.type === 'bulk_purchase' || (intent.quantity && intent.quantity.amount > 5)) {
            valueProps.push({
                type: 'bulk',
                message: `Special bulk pricing for ${intent.quantity?.amount || 'large'} quantities`,
                reasoning: 'Volume discount reflects economies of scale'
            });
        }

        // Market positioning value propositions
        if (priceData.confidence > 0.7) {
            valueProps.push({
                type: 'market',
                message: 'Competitive market pricing',
                reasoning: 'Price reflects current market conditions'
            });
        }

        return valueProps;
    }

    generateDecisionGuidance(priceData, intent, customerAnalysis) {
        const guidance = {
            accept: {
                conditions: [],
                reasoning: []
            },
            counter: {
                conditions: [],
                reasoning: []
            },
            decline: {
                conditions: [],
                reasoning: []
            }
        };

        const customerOffer = this.extractCustomerOffer(customerAnalysis);
        
        if (customerOffer) {
            // Accept conditions
            if (customerOffer >= priceData.ranges.market) {
                guidance.accept.conditions.push('Customer offer at or above market price');
                guidance.accept.reasoning.push('Good profit margin maintained');
            }

            // Counter conditions
            if (customerOffer >= priceData.ranges.safe && customerOffer < priceData.ranges.market) {
                guidance.counter.conditions.push('Customer offer in acceptable range');
                guidance.counter.reasoning.push('Room for negotiation while maintaining minimum margin');
            }

            // Decline conditions
            if (customerOffer < priceData.ranges.safe) {
                guidance.decline.conditions.push('Customer offer below minimum acceptable price');
                guidance.decline.reasoning.push('Would result in loss or insufficient margin');
            }
        } else {
            // General guidance when no specific offer detected
            guidance.counter.conditions.push('Customer showing price sensitivity');
            guidance.counter.reasoning.push('Opportunity to find mutually acceptable price');
        }

        return guidance;
    }

    extractCustomerOffer(customerAnalysis) {
        // This would extract numerical offers from customer text
        // For MVP, return null (no specific offer detected)
        return null;
    }

    generateCompromiseSolutions(priceData, intent, impasse) {
        const solutions = [];

        // Quantity-based compromises
        if (intent.quantity) {
            solutions.push({
                type: 'quantity_adjustment',
                suggestion: 'Offer slight quantity increase at same total price',
                benefit: 'Customer gets more value, you maintain revenue'
            });
        }

        // Payment terms compromises
        solutions.push({
            type: 'payment_terms',
            suggestion: 'Offer immediate payment discount',
            benefit: 'Cash flow improvement for small discount'
        });

        // Bundle compromises
        solutions.push({
            type: 'bundle',
            suggestion: 'Add complementary low-cost item',
            benefit: 'Increased perceived value without major cost'
        });

        // Future business compromises
        solutions.push({
            type: 'relationship',
            suggestion: 'Special price for repeat customer commitment',
            benefit: 'Long-term customer relationship value'
        });

        return solutions;
    }

    calculateGuidanceConfidence(priceData, intent) {
        let confidence = 0.7; // Base confidence

        // Increase confidence based on price data quality
        if (priceData.confidence > 0.8) {
            confidence += 0.1;
        }

        // Increase confidence for clear intent
        if (intent.confidence > 0.8) {
            confidence += 0.1;
        }

        // Decrease confidence for unknown products
        if (priceData.product === 'unknown') {
            confidence -= 0.2;
        }

        return Math.min(confidence, 0.95);
    }

    getCulturalContext(intent) {
        // Enhanced cultural sensitivity based on local trading customs
        const culturalContext = {
            approach: 'respectful',
            tone: 'polite',
            phrases: this.culturalPatterns.respectful.phrases,
            declineStyle: this.culturalPatterns.respectful.declineStyle,
            customary: [
                'Allow time for customer consideration',
                'Maintain respectful dialogue',
                'Avoid aggressive pressure tactics'
            ]
        };

        // Adjust cultural approach based on intent type
        switch (intent.type) {
            case 'bargaining':
                culturalContext.customary.push('Bargaining is expected and normal');
                culturalContext.customary.push('Start higher to allow negotiation room');
                culturalContext.phrases.push('This is a fair starting price');
                break;
                
            case 'bulk_purchase':
                culturalContext.approach = 'business_friendly';
                culturalContext.customary.push('Volume buyers deserve special consideration');
                culturalContext.customary.push('Build long-term business relationships');
                culturalContext.phrases.push('For bulk orders, I can offer better rates');
                break;
                
            case 'casual_inquiry':
                culturalContext.approach = 'informational';
                culturalContext.customary.push('Provide clear, honest information');
                culturalContext.customary.push('No pressure to buy immediately');
                culturalContext.phrases.push('Let me explain our pricing clearly');
                break;
        }

        return culturalContext;
    }

    // Enhanced compromise solutions with cultural sensitivity
    generateCompromiseSolutions(priceData, intent, customerAnalysis) {
        const solutions = [];

        // Cultural compromise: Face-saving solutions
        solutions.push({
            type: 'face_saving',
            suggestion: 'Offer "special customer" pricing',
            benefit: 'Customer feels valued, you maintain dignity',
            culturalNote: 'Preserves respect for both parties'
        });

        // Quantity-based compromises with cultural framing
        if (intent.quantity) {
            solutions.push({
                type: 'quantity_adjustment',
                suggestion: 'Offer slight quantity increase: "I\'ll add a little extra for you"',
                benefit: 'Customer gets more value, you maintain revenue',
                culturalNote: 'Shows generosity and goodwill'
            });
        }

        // Relationship-building compromises
        solutions.push({
            type: 'relationship_building',
            suggestion: 'Offer first-time customer discount with future commitment',
            benefit: 'Builds long-term customer base',
            culturalNote: 'Emphasizes mutual benefit and trust'
        });

        // Payment flexibility with cultural respect
        solutions.push({
            type: 'payment_flexibility',
            suggestion: 'Offer immediate payment discount: "Cash price is better"',
            benefit: 'Improved cash flow for small discount',
            culturalNote: 'Respects customer\'s financial situation'
        });

        // Bundle solutions with added value perception
        solutions.push({
            type: 'value_bundle',
            suggestion: 'Add complementary item: "I\'ll include this for you"',
            benefit: 'Increased perceived value without major cost',
            culturalNote: 'Demonstrates care for customer satisfaction'
        });

        // Time-based compromises
        if (customerAnalysis.urgency === 'high') {
            solutions.push({
                type: 'urgency_accommodation',
                suggestion: 'Priority service at standard price',
                benefit: 'Customer gets speed, you maintain margin',
                culturalNote: 'Shows understanding of customer needs'
            });
        }

        // Quality assurance compromises
        solutions.push({
            type: 'quality_assurance',
            suggestion: 'Offer quality guarantee: "If not satisfied, bring it back"',
            benefit: 'Builds trust and confidence',
            culturalNote: 'Demonstrates confidence in product quality'
        });

        return solutions;
    }

    // Cultural negotiation guidance for uncertain contexts
    generateCulturalGuidance(situation, customerAnalysis) {
        const guidance = {
            respectfulApproach: [],
            neutralStrategies: [],
            avoidancePatterns: []
        };

        // Always respectful approaches
        guidance.respectfulApproach.push('Listen actively to customer concerns');
        guidance.respectfulApproach.push('Acknowledge their budget constraints');
        guidance.respectfulApproach.push('Explain pricing rationale clearly');
        guidance.respectfulApproach.push('Thank them for their interest');

        // Neutral strategies when cultural context is uncertain
        guidance.neutralStrategies.push('Use simple, clear language');
        guidance.neutralStrategies.push('Avoid complex negotiations');
        guidance.neutralStrategies.push('Focus on product value');
        guidance.neutralStrategies.push('Be patient with decision-making');

        // Patterns to avoid
        guidance.avoidancePatterns.push('Aggressive pressure tactics');
        guidance.avoidancePatterns.push('Dismissing price concerns');
        guidance.avoidancePatterns.push('Rushing the customer');
        guidance.avoidancePatterns.push('Making assumptions about budget');

        // Adjust based on customer signals
        if (customerAnalysis.signals.includes('budget_constrained')) {
            guidance.respectfulApproach.push('Show understanding of budget limitations');
            guidance.neutralStrategies.push('Suggest alternative products if available');
            guidance.avoidancePatterns.push('Emphasizing premium features');
        }

        if (customerAnalysis.signals.includes('quality_focused')) {
            guidance.respectfulApproach.push('Highlight quality benefits clearly');
            guidance.neutralStrategies.push('Compare value rather than just price');
        }

        return guidance;
    }

    // Compromise decision framework
    evaluateCompromiseOptions(priceData, customerAnalysis, proposedSolutions) {
        const evaluation = {
            recommended: [],
            acceptable: [],
            avoid: []
        };

        proposedSolutions.forEach(solution => {
            const score = this.scoreCompromiseSolution(solution, priceData, customerAnalysis);
            
            if (score >= 0.8) {
                evaluation.recommended.push({
                    ...solution,
                    score: score,
                    reasoning: 'High benefit, low risk'
                });
            } else if (score >= 0.6) {
                evaluation.acceptable.push({
                    ...solution,
                    score: score,
                    reasoning: 'Moderate benefit, acceptable risk'
                });
            } else {
                evaluation.avoid.push({
                    ...solution,
                    score: score,
                    reasoning: 'Low benefit or high risk'
                });
            }
        });

        return evaluation;
    }

    scoreCompromiseSolution(solution, priceData, customerAnalysis) {
        let score = 0.5; // Base score

        // Score based on solution type
        switch (solution.type) {
            case 'face_saving':
                score += 0.3; // High cultural value
                break;
            case 'relationship_building':
                score += 0.2; // Good long-term value
                break;
            case 'quantity_adjustment':
                score += 0.15; // Moderate value
                break;
            case 'payment_flexibility':
                score += 0.1; // Some value
                break;
        }

        // Adjust based on customer analysis
        if (customerAnalysis.signals.includes('price_sensitive') && 
            ['payment_flexibility', 'quantity_adjustment'].includes(solution.type)) {
            score += 0.1;
        }

        if (customerAnalysis.signals.includes('quality_focused') && 
            solution.type === 'quality_assurance') {
            score += 0.15;
        }

        // Ensure score stays within bounds
        return Math.min(Math.max(score, 0), 1);
    }

    // Generate respectful decline messages
    generateRespectfulDecline(priceData, customerAnalysis, reason) {
        const declineMessages = {
            below_minimum: {
                primary: "I appreciate your interest, but I cannot go below this price.",
                explanation: "This price ensures I can maintain quality and service.",
                alternative: "Perhaps we can find another product that fits your budget?"
            },
            quality_standards: {
                primary: "I understand price is important, but I cannot compromise on quality.",
                explanation: "This pricing reflects the quality and freshness I guarantee.",
                alternative: "Would you like to see our value options?"
            },
            market_conditions: {
                primary: "I wish I could offer a lower price, but current market rates don't allow it.",
                explanation: "Prices have been affected by supply and demand conditions.",
                alternative: "I can let you know if prices change in the future."
            }
        };

        const message = declineMessages[reason] || declineMessages.below_minimum;
        
        return {
            ...message,
            tone: 'respectful',
            culturalNotes: [
                'Maintain dignity for both parties',
                'Leave door open for future business',
                'Show appreciation for their interest'
            ]
        };
    }

    generateFallbackGuidance(intent, originalText) {
        return {
            customerAnalysis: {
                priceAwareness: 'unknown',
                urgency: 'normal',
                flexibility: 'moderate',
                signals: ['insufficient_data']
            },
            counterOffers: [{
                level: 'standard',
                price: null,
                message: 'Let me check the current market price for you',
                reasoning: ['Price data not available'],
                recommended: true
            }],
            tactics: {
                primary: ['Be transparent about pricing'],
                secondary: ['Offer to check with suppliers'],
                avoid: ['Making price commitments without data']
            },
            valuePropositions: [{
                type: 'service',
                message: 'I will provide you with accurate pricing information',
                reasoning: 'Transparency builds trust'
            }],
            decisions: {
                accept: { conditions: [], reasoning: [] },
                counter: { conditions: ['Get accurate price data first'], reasoning: ['Cannot negotiate without reliable pricing'] },
                decline: { conditions: [], reasoning: [] }
            },
            confidence: 0.3,
            culturalContext: this.getCulturalContext(intent),
            timestamp: new Date().toISOString(),
            fallback: true
        };
    }
}

class ResponseGenerator {
    constructor() {
        // Response templates for different scenarios
        this.responseTemplates = {
            english: {
                price_guidance: {
                    with_price: "Based on current market conditions, {product} is priced at ₹{price} per {unit}. {guidance}",
                    price_range: "For {product}, the market range is ₹{minPrice} to ₹{maxPrice} per {unit}. {guidance}",
                    no_price: "I don't have current pricing for {product}, but I can help you with general guidance. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "Consider offering ₹{price} per {unit}. {reasoning}",
                    accept_offer: "This is a good offer at ₹{price} per {unit}. {reasoning}",
                    decline_offer: "This price is below your minimum. {reasoning}"
                },
                bulk_pricing: {
                    eligible: "For {quantity} {unit}, you can offer bulk pricing at ₹{bulkPrice} per {unit} (₹{savings} savings).",
                    not_eligible: "Bulk pricing starts at {threshold} {unit}. Current quantity is {quantity} {unit}."
                },
                cultural_guidance: {
                    respectful: "Remember to be respectful and patient during negotiations.",
                    flexible: "You have room for negotiation with this product.",
                    firm: "Maintain your price - this is already a fair deal."
                }
            },
            hindi: {
                price_guidance: {
                    with_price: "Bazaar ke hisaab se, {product} ka daam ₹{price} per {unit} hai. {guidance}",
                    price_range: "{product} ke liye bazaar mein ₹{minPrice} se ₹{maxPrice} per {unit} tak milta hai. {guidance}",
                    no_price: "Mujhe {product} ka current rate nahi pata, lekin main aapko general guidance de sakta hun. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} per {unit} offer kar sakte hain. {reasoning}",
                    accept_offer: "₹{price} per {unit} mein accha deal hai. {reasoning}",
                    decline_offer: "Yeh price aapke minimum se kam hai. {reasoning}"
                },
                bulk_pricing: {
                    eligible: "{quantity} {unit} ke liye bulk rate ₹{bulkPrice} per {unit} de sakte hain (₹{savings} ki bachat).",
                    not_eligible: "Bulk pricing {threshold} {unit} se shuru hoti hai. Abhi {quantity} {unit} hai."
                },
                cultural_guidance: {
                    respectful: "Negotiation mein respect aur patience rakhiye.",
                    flexible: "Is product mein negotiation ki gunjaish hai.",
                    firm: "Apna price maintain kariye - yeh already fair deal hai."
                }
            },
            kannada: {
                price_guidance: {
                    with_price: "Market nalli, {product} bele ₹{price} per {unit} ide. {guidance}",
                    price_range: "{product} ge market nalli ₹{minPrice} to ₹{maxPrice} per {unit} sigutta. {guidance}",
                    no_price: "Nanage {product} current rate gottilla, aadre general guidance kodabaudu. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} per {unit} offer maadabaudu. {reasoning}",
                    accept_offer: "₹{price} per {unit} nalli chennaagide. {reasoning}",
                    decline_offer: "Ee price nimma minimum gintha kammi. {reasoning}"
                },
                bulk_pricing: {
                    eligible: "{quantity} {unit} ge bulk rate ₹{bulkPrice} per {unit} kodabaudu (₹{savings} save aagutta).",
                    not_eligible: "Bulk pricing {threshold} {unit} ninda start aagutta. Eeega {quantity} {unit} ide."
                },
                cultural_guidance: {
                    respectful: "Negotiation nalli respect mattu patience iddkoli.",
                    flexible: "Ee product nalli negotiation maadabaudu.",
                    firm: "Nimma price maintain maadi - idu already fair deal."
                }
            }
        };
    }

    async formatResponse(data, language) {
        try {
            const { intent, priceData, negotiationGuidance, originalText, processedText } = data;
            
            // Determine response language
            const responseLanguage = this.normalizeLanguage(language);
            
            // Generate primary response based on intent
            const primaryResponse = this.generatePrimaryResponse(intent, priceData, negotiationGuidance, responseLanguage);
            
            // Add negotiation guidance
            const negotiationResponse = this.generateNegotiationResponse(negotiationGuidance, responseLanguage);
            
            // Add cultural context
            const culturalResponse = this.generateCulturalResponse(negotiationGuidance.culturalContext, responseLanguage);
            
            // Combine and prioritize responses
            const combinedResponse = this.combineResponses([
                primaryResponse,
                negotiationResponse,
                culturalResponse
            ], responseLanguage);
            
            // Format for display
            const formattedResponse = this.formatForDisplay(combinedResponse, intent, priceData);
            
            return {
                text: formattedResponse.text,
                language: responseLanguage,
                actionable: true,
                fallback: false,
                timestamp: new Date().toISOString(),
                components: {
                    primary: primaryResponse,
                    negotiation: negotiationResponse,
                    cultural: culturalResponse
                },
                metadata: {
                    intent: intent.type,
                    confidence: negotiationGuidance.confidence,
                    hasPrice: !!priceData,
                    wordCount: formattedResponse.text.split(' ').length
                }
            };

        } catch (error) {
            console.error('Error formatting response:', error);
            return this.createFallbackResponse(data, language, error);
        }
    }

    generatePrimaryResponse(intent, priceData, negotiationGuidance, language) {
        const templates = this.responseTemplates[language];
        
        if (!priceData) {
            return this.fillTemplate(
                templates.price_guidance.no_price,
                { 
                    product: intent.product || 'this item',
                    guidance: 'Let me help you with what I can.'
                }
            );
        }

        // Generate price-based response
        if (priceData.ranges) {
            const template = templates.price_guidance.price_range;
            return this.fillTemplate(template, {
                product: priceData.product,
                minPrice: priceData.ranges.minimum,
                maxPrice: priceData.ranges.premium,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, negotiationGuidance, language)
            });
        } else {
            const template = templates.price_guidance.with_price;
            return this.fillTemplate(template, {
                product: priceData.product,
                price: priceData.marketPrice,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, negotiationGuidance, language)
            });
        }
    }

    generatePriceGuidance(priceData, negotiationGuidance, language) {
        const flexibility = priceData.negotiation?.flexibility || 'moderate';
        const templates = this.responseTemplates[language].cultural_guidance;
        
        switch (flexibility) {
            case 'high':
                return templates.flexible;
            case 'low':
                return templates.firm;
            default:
                return templates.respectful;
        }
    }

    generateNegotiationResponse(negotiationGuidance, language) {
        if (!negotiationGuidance.counterOffers || negotiationGuidance.counterOffers.length === 0) {
            return '';
        }

        const templates = this.responseTemplates[language].negotiation_advice;
        const recommendedOffer = negotiationGuidance.counterOffers.find(offer => offer.recommended);
        
        if (recommendedOffer && recommendedOffer.price) {
            return this.fillTemplate(templates.counter_offer, {
                price: recommendedOffer.price,
                unit: 'kg', // Default unit
                reasoning: recommendedOffer.message
            });
        }

        return '';
    }

    generateCulturalResponse(culturalContext, language) {
        if (!culturalContext || !culturalContext.customary) {
            return '';
        }

        // Select most relevant cultural guidance
        const guidance = culturalContext.customary[0] || 'Be respectful in your negotiations.';
        
        // Translate cultural guidance to appropriate language
        return this.translateCulturalGuidance(guidance, language);
    }

    translateCulturalGuidance(guidance, language) {
        const culturalTranslations = {
            english: {
                'Allow time for customer consideration': 'Give the customer time to think.',
                'Maintain respectful dialogue': 'Keep the conversation respectful.',
                'Avoid aggressive pressure tactics': 'Don\'t pressure the customer too much.'
            },
            hindi: {
                'Allow time for customer consideration': 'Customer ko sochne ka time dijiye.',
                'Maintain respectful dialogue': 'Baat-cheet mein respect rakhiye.',
                'Avoid aggressive pressure tactics': 'Customer par zyada pressure na daliye.'
            },
            kannada: {
                'Allow time for customer consideration': 'Customer ge aalochane maadakke time kodi.',
                'Maintain respectful dialogue': 'Maatanaaduvaga respect iddkoli.',
                'Avoid aggressive pressure tactics': 'Customer mele jaasti pressure haakbeda.'
            }
        };

        const translations = culturalTranslations[language] || culturalTranslations.english;
        return translations[guidance] || guidance;
    }

    combineResponses(responses, language) {
        // Filter out empty responses
        const validResponses = responses.filter(response => response && response.trim().length > 0);
        
        // Join responses with appropriate connectors
        const connectors = {
            english: '. ',
            hindi: '. ',
            kannada: '. '
        };
        
        const connector = connectors[language] || '. ';
        return validResponses.join(connector);
    }

    formatForDisplay(text, intent, priceData) {
        // Ensure appropriate length for display
        const maxLength = 300; // Maximum characters for mobile display
        
        let displayText = text;
        
        if (displayText.length > maxLength) {
            // Truncate at sentence boundary if possible
            const sentences = displayText.split('. ');
            let truncated = '';
            
            for (const sentence of sentences) {
                if ((truncated + sentence + '. ').length <= maxLength) {
                    truncated += sentence + '. ';
                } else {
                    break;
                }
            }
            
            displayText = truncated.trim() || displayText.substring(0, maxLength - 3) + '...';
        }

        return {
            text: displayText,
            originalLength: text.length,
            truncated: displayText.length < text.length
        };
    }

    fillTemplate(template, variables) {
        let filled = template;
        
        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            filled = filled.replace(new RegExp(placeholder, 'g'), value || '');
        });
        
        // Clean up any remaining placeholders
        filled = filled.replace(/\{[^}]+\}/g, '');
        
        // Clean up extra spaces
        filled = filled.replace(/\s+/g, ' ').trim();
        
        return filled;
    }

    generateSpeech(text, language) {
        try {
            // Use native Speech Synthesis API only
            if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
                // Cancel any ongoing speech
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = this.getBrowserLanguage(language);
                utterance.rate = 0.9; // Slightly slower for clarity
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                
                // Add event handlers
                utterance.onstart = () => {
                    console.log('Speech synthesis started');
                };
                
                utterance.onend = () => {
                    console.log('Speech synthesis completed');
                };
                
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event.error);
                };
                
                speechSynthesis.speak(utterance);
                return true;
            } else {
                console.warn('Text-to-speech not supported in this browser');
                return false;
            }
        } catch (error) {
            console.error('Error generating speech:', error);
            return false;
        }
    }

    createFallbackResponse(data, language, error) {
        const fallbackMessages = {
            english: "I'm here to help with your pricing questions. Please try asking again.",
            hindi: "Main aapke price ke sawal mein madad kar sakta hun. Phir se puchiye.",
            kannada: "Naanu nimma price questions nalli help maadabaudu. Mathe keli."
        };
        
        const responseLanguage = this.normalizeLanguage(language);
        const fallbackText = fallbackMessages[responseLanguage] || fallbackMessages.english;
        
        return {
            text: fallbackText,
            language: responseLanguage,
            actionable: false,
            fallback: true,
            timestamp: new Date().toISOString(),
            error: error?.message,
            metadata: {
                intent: data?.intent?.type || 'unknown',
                confidence: 0.3,
                hasPrice: false,
                wordCount: fallbackText.split(' ').length
            }
        };
    }

    normalizeLanguage(language) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada',
            'english': 'english',
            'hindi': 'hindi',
            'kannada': 'kannada'
        };
        
        return langMap[language] || 'english';
    }

    getBrowserLanguage(language) {
        const langMap = {
            'english': 'en-US',
            'hindi': 'hi-IN',
            'kannada': 'kn-IN'
        };
        return langMap[language] || 'en-US';
    }

    // Check if text-to-speech is available
    isSpeechSynthesisAvailable() {
        return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }

    // Get available voices for language
    getAvailableVoices(language) {
        if (!this.isSpeechSynthesisAvailable()) {
            return [];
        }
        
        const browserLang = this.getBrowserLanguage(language);
        const voices = speechSynthesis.getVoices();
        
        return voices.filter(voice => voice.lang.startsWith(browserLang.split('-')[0]));
    }

    // Advanced response prioritization system
    prioritizeResponses(responseComponents, intent, priceData, negotiationGuidance) {
        const prioritizedResponses = [];
        
        // Define priority levels based on context
        const priorities = this.calculateResponsePriorities(intent, priceData, negotiationGuidance);
        
        // Sort response components by priority
        const sortedComponents = Object.entries(responseComponents)
            .map(([type, content]) => ({
                type,
                content,
                priority: priorities[type] || 0,
                relevance: this.calculateRelevance(type, intent, priceData)
            }))
            .sort((a, b) => b.priority - a.priority || b.relevance - a.relevance);
        
        // Build prioritized response
        sortedComponents.forEach(component => {
            if (component.content && component.content.trim().length > 0) {
                prioritizedResponses.push({
                    type: component.type,
                    content: component.content,
                    priority: component.priority,
                    relevance: component.relevance
                });
            }
        });
        
        return prioritizedResponses;
    }

    calculateResponsePriorities(intent, priceData, negotiationGuidance) {
        const priorities = {
            primary: 10,      // Always highest priority
            negotiation: 8,   // High priority for actionable advice
            cultural: 6,      // Medium priority for context
            bulk: 7,          // High priority if bulk purchase
            error: 15         // Critical priority for errors
        };
        
        // Adjust priorities based on context
        if (intent.type === 'bulk_purchase') {
            priorities.bulk = 9; // Increase bulk pricing priority
        }
        
        if (intent.type === 'casual_inquiry') {
            priorities.cultural = 8; // Increase cultural guidance for inquiries
            priorities.negotiation = 5; // Reduce negotiation priority
        }
        
        if (!priceData || priceData.confidence < 0.5) {
            priorities.primary = 12; // Increase primary response priority for clarity
            priorities.negotiation = 4; // Reduce negotiation priority when data is poor
        }
        
        if (negotiationGuidance.confidence < 0.6) {
            priorities.cultural = 9; // Increase cultural guidance when negotiation confidence is low
        }
        
        return priorities;
    }

    calculateRelevance(responseType, intent, priceData) {
        let relevance = 0.5; // Base relevance
        
        switch (responseType) {
            case 'primary':
                relevance = 1.0; // Always most relevant
                break;
                
            case 'negotiation':
                if (intent.type === 'bargaining') {
                    relevance = 0.9;
                } else if (intent.type === 'bulk_purchase') {
                    relevance = 0.8;
                } else {
                    relevance = 0.4;
                }
                break;
                
            case 'bulk':
                if (intent.type === 'bulk_purchase' || (intent.quantity && intent.quantity.amount > 5)) {
                    relevance = 0.9;
                } else {
                    relevance = 0.2;
                }
                break;
                
            case 'cultural':
                relevance = 0.6; // Always moderately relevant
                break;
        }
        
        // Adjust based on data quality
        if (priceData && priceData.confidence > 0.8) {
            if (responseType === 'negotiation' || responseType === 'primary') {
                relevance += 0.1;
            }
        }
        
        return Math.min(relevance, 1.0);
    }

    // Generate multiple response options with different priorities
    generateResponseOptions(data, language) {
        const { intent, priceData, negotiationGuidance } = data;
        const responseLanguage = this.normalizeLanguage(language);
        
        const options = [];
        
        // Option 1: Comprehensive response (all components)
        const comprehensive = this.formatResponse(data, language);
        options.push({
            type: 'comprehensive',
            priority: 'high',
            response: comprehensive,
            description: 'Complete guidance with all available information'
        });
        
        // Option 2: Essential only (primary + negotiation)
        const essential = this.generateEssentialResponse(intent, priceData, negotiationGuidance, responseLanguage);
        options.push({
            type: 'essential',
            priority: 'medium',
            response: essential,
            description: 'Key pricing and negotiation guidance only'
        });
        
        // Option 3: Simple response (primary only)
        const simple = this.generateSimpleResponse(intent, priceData, responseLanguage);
        options.push({
            type: 'simple',
            priority: 'low',
            response: simple,
            description: 'Basic pricing information only'
        });
        
        return options;
    }

    generateEssentialResponse(intent, priceData, negotiationGuidance, language) {
        const primaryResponse = this.generatePrimaryResponse(intent, priceData, negotiationGuidance, language);
        const negotiationResponse = this.generateNegotiationResponse(negotiationGuidance, language);
        
        const combinedResponse = this.combineResponses([primaryResponse, negotiationResponse], language);
        const formattedResponse = this.formatForDisplay(combinedResponse, intent, priceData);
        
        return {
            text: formattedResponse.text,
            language: language,
            actionable: true,
            fallback: false,
            timestamp: new Date().toISOString(),
            type: 'essential'
        };
    }

    generateSimpleResponse(intent, priceData, language) {
        const primaryResponse = this.generatePrimaryResponse(intent, priceData, null, language);
        const formattedResponse = this.formatForDisplay(primaryResponse, intent, priceData);
        
        return {
            text: formattedResponse.text,
            language: language,
            actionable: true,
            fallback: false,
            timestamp: new Date().toISOString(),
            type: 'simple'
        };
    }

    // Select best response based on context and user preferences
    selectOptimalResponse(responseOptions, context) {
        const { userPreference, timeConstraint, literacyLevel, deviceType } = context;
        
        let selectedOption = responseOptions[0]; // Default to first option
        
        // Adjust selection based on context
        if (timeConstraint === 'urgent' || deviceType === 'low_end') {
            // Prefer simpler responses for urgent situations or low-end devices
            selectedOption = responseOptions.find(option => option.type === 'simple') || selectedOption;
        } else if (literacyLevel === 'high' && userPreference === 'detailed') {
            // Prefer comprehensive responses for high literacy users who want details
            selectedOption = responseOptions.find(option => option.type === 'comprehensive') || selectedOption;
        } else {
            // Default to essential response for most users
            selectedOption = responseOptions.find(option => option.type === 'essential') || selectedOption;
        }
        
        return selectedOption;
    }

    // Ensure responses are appropriate for literacy levels
    adaptForLiteracyLevel(response, literacyLevel) {
        if (literacyLevel === 'low') {
            // Simplify language and structure
            return this.simplifyLanguage(response);
        } else if (literacyLevel === 'high') {
            // Can include more detailed explanations
            return this.enhanceWithDetails(response);
        }
        
        return response; // Medium literacy - use as is
    }

    simplifyLanguage(response) {
        // Simplify complex sentences and use basic vocabulary
        let simplified = response.text;
        
        // Replace complex terms with simpler ones
        const simplifications = {
            'market conditions': 'market price',
            'negotiation': 'bargaining',
            'consideration': 'thinking',
            'approximately': 'about',
            'currently': 'now'
        };
        
        Object.entries(simplifications).forEach(([complex, simple]) => {
            simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
        });
        
        // Break long sentences
        simplified = simplified.replace(/\. /g, '. ');
        
        return {
            ...response,
            text: simplified,
            adaptedFor: 'low_literacy'
        };
    }

    enhanceWithDetails(response) {
        // Add more context and explanations for high literacy users
        return {
            ...response,
            text: response.text,
            adaptedFor: 'high_literacy',
            additionalContext: 'Detailed market analysis and negotiation strategies available upon request.'
        };
    }

    // Order multiple response elements by relevance and practicality
    orderResponseElements(elements, intent, priceData) {
        return elements
            .map(element => ({
                ...element,
                practicalityScore: this.calculatePracticalityScore(element, intent, priceData),
                relevanceScore: this.calculateElementRelevance(element, intent)
            }))
            .sort((a, b) => {
                // Primary sort by relevance, secondary by practicality
                const relevanceDiff = b.relevanceScore - a.relevanceScore;
                if (Math.abs(relevanceDiff) > 0.1) {
                    return relevanceDiff;
                }
                return b.practicalityScore - a.practicalityScore;
            });
    }

    calculatePracticalityScore(element, intent, priceData) {
        let score = 0.5;
        
        // Practical elements get higher scores
        if (element.type === 'price_range' && priceData) {
            score += 0.3;
        }
        
        if (element.type === 'counter_offer' && intent.type === 'bargaining') {
            score += 0.4;
        }
        
        if (element.type === 'bulk_discount' && intent.type === 'bulk_purchase') {
            score += 0.4;
        }
        
        // Actionable elements get bonus points
        if (element.actionable) {
            score += 0.2;
        }
        
        return Math.min(score, 1.0);
    }

    calculateElementRelevance(element, intent) {
        let relevance = 0.5;
        
        // Match element type to intent
        if (element.type === 'negotiation_advice' && intent.type === 'bargaining') {
            relevance = 0.9;
        } else if (element.type === 'bulk_pricing' && intent.type === 'bulk_purchase') {
            relevance = 0.9;
        } else if (element.type === 'price_info') {
            relevance = 0.8; // Always relevant
        }
        
        return relevance;
    }
}

// Privacy Manager - Ensures no data persistence and PII protection
class PrivacyManager {
    constructor() {
        this.temporaryData = new Map();
        this.dataRetentionTime = 300000; // 5 minutes max retention
        this.privacyViolations = [];
        this.isMonitoring = false;
    }

    // Validate that no data persistence mechanisms are being used
    validateNoDataPersistence() {
        const violations = [];
        
        // Check for localStorage usage
        if (this.hasLocalStorageData()) {
            violations.push('localStorage contains data');
            this.clearLocalStorage();
        }
        
        // Check for sessionStorage usage
        if (this.hasSessionStorageData()) {
            violations.push('sessionStorage contains data');
            this.clearSessionStorage();
        }
        
        // Check for cookies
        if (this.hasCookies()) {
            violations.push('Cookies detected');
            this.clearCookies();
        }
        
        if (violations.length > 0) {
            console.warn('Privacy violations detected and cleared:', violations);
            this.privacyViolations.push(...violations);
        }
        
        return violations.length === 0;
    }

    hasLocalStorageData() {
        try {
            return localStorage.length > 0;
        } catch (error) {
            return false;
        }
    }

    hasSessionStorageData() {
        try {
            return sessionStorage.length > 0;
        } catch (error) {
            return false;
        }
    }

    hasCookies() {
        return document.cookie && document.cookie.trim().length > 0;
    }

    clearLocalStorage() {
        try {
            localStorage.clear();
            console.log('localStorage cleared for privacy protection');
        } catch (error) {
            console.warn('Could not clear localStorage:', error);
        }
    }

    clearSessionStorage() {
        try {
            sessionStorage.clear();
            console.log('sessionStorage cleared for privacy protection');
        } catch (error) {
            console.warn('Could not clear sessionStorage:', error);
        }
    }

    clearCookies() {
        try {
            // Clear all cookies by setting them to expire
            document.cookie.split(";").forEach(cookie => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
            console.log('Cookies cleared for privacy protection');
        } catch (error) {
            console.warn('Could not clear cookies:', error);
        }
    }

    // Clear any existing data from previous sessions
    clearAnyExistingData() {
        this.clearLocalStorage();
        this.clearSessionStorage();
        this.clearCookies();
        this.temporaryData.clear();
        
        // Clear any global variables that might contain user data
        this.clearGlobalVariables();
    }

    clearGlobalVariables() {
        // Clear any potentially sensitive global variables
        if (window.userVoiceData) {
            delete window.userVoiceData;
        }
        if (window.conversationHistory) {
            delete window.conversationHistory;
        }
        if (window.userPreferences) {
            delete window.userPreferences;
        }
    }

    clearTemporaryData() {
        const now = Date.now();
        const keysToRemove = [];
        
        // Find expired data
        for (const [key, item] of this.temporaryData.entries()) {
            if (now > item.expires) {
                keysToRemove.push(key);
            }
        }
        
        // Remove expired data
        keysToRemove.forEach(key => {
            this.temporaryData.delete(key);
        });
        
        if (keysToRemove.length > 0) {
            console.log(`Cleared ${keysToRemove.length} expired temporary data items`);
        }
    }

    clearSensitiveData() {
        // Clear any data that might contain PII
        this.temporaryData.clear();
        
        // Clear any audio data that might be lingering
        this.clearAudioData();
        
        console.log('Sensitive data cleared for privacy protection');
    }

    clearAllData() {
        this.clearAnyExistingData();
        this.temporaryData.clear();
        console.log('All data cleared for privacy protection');
    }

    clearAudioData() {
        // Clear any audio recordings or buffers
        try {
            // Stop any ongoing speech recognition
            if (window.speechRecognition && window.speechRecognition.stop) {
                window.speechRecognition.stop();
            }
            
            // Cancel any ongoing speech synthesis
            if (window.speechSynthesis && window.speechSynthesis.cancel) {
                window.speechSynthesis.cancel();
            }
            
            console.log('Audio data cleared');
        } catch (error) {
            console.warn('Error clearing audio data:', error);
        }
    }

    // Validate that no PII is being transmitted
    validateNoPIITransmission(data) {
        const violations = [];
        
        if (typeof data === 'string') {
            if (this.containsPII(data)) {
                violations.push('Text contains potential PII');
            }
        } else if (typeof data === 'object' && data !== null) {
            for (const [key, value] of Object.entries(data)) {
                if (this.isSensitiveKey(key)) {
                    violations.push(`Sensitive key detected: ${key}`);
                }
                if (typeof value === 'string' && this.containsPII(value)) {
                    violations.push(`Value for ${key} contains potential PII`);
                }
            }
        }
        
        if (violations.length > 0) {
            console.warn('PII transmission violations detected:', violations);
            this.privacyViolations.push(...violations);
        }
        
        return violations.length === 0;
    }

    containsPII(text) {
        // Basic PII detection patterns
        const piiPatterns = [
            /\b\d{10,}\b/, // Phone numbers
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
            /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card numbers
            /\b\d{3}-\d{2}-\d{4}\b/ // SSN pattern
        ];
        
        return piiPatterns.some(pattern => pattern.test(text));
    }

    isSensitiveKey(key) {
        const sensitiveKeys = [
            'name', 'email', 'phone', 'address', 'location',
            'personalInfo', 'userInfo', 'contact', 'identity'
        ];
        
        return sensitiveKeys.some(sensitive => 
            key.toLowerCase().includes(sensitive.toLowerCase())
        );
    }

    // Start monitoring for privacy violations
    startPrivacyMonitoring() {
        if (this.isMonitoring) {
            return;
        }
        
        this.isMonitoring = true;
        
        // Monitor storage usage every 30 seconds
        setInterval(() => {
            if (!this.validateNoDataPersistence()) {
                console.warn('Privacy violation detected: Data persistence found');
            }
        }, 30000);
        
        console.log('Privacy monitoring started');
    }

    // Get privacy compliance report
    getPrivacyReport() {
        return {
            dataRetentionTime: this.dataRetentionTime,
            temporaryDataCount: this.temporaryData.size,
            privacyViolations: this.privacyViolations,
            isMonitoring: this.isMonitoring,
            lastValidation: new Date().toISOString(),
            compliance: {
                noLocalStorage: !this.hasLocalStorageData(),
                noSessionStorage: !this.hasSessionStorageData(),
                noCookies: !this.hasCookies()
            }
        };
    }
}

// Accessibility Manager - Ensures interface works for varying technical literacy levels
class AccessibilityManager {
    constructor() {
        this.userPreferences = {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false,
            keyboardOnly: false
        };
        this.literacyLevel = 'medium'; // low, medium, high
        this.technicalLevel = 'medium'; // low, medium, high
    }

    setupAccessibilityFeatures() {
        // Detect system preferences
        this.detectSystemPreferences();
        
        // Apply accessibility enhancements
        this.applyAccessibilityEnhancements();
        
        // Set up focus management
        this.setupFocusManagement();
        
        // Set up visual feedback
        this.setupVisualFeedback();
        
        console.log('Accessibility features configured:', this.userPreferences);
    }

    detectSystemPreferences() {
        // Detect high contrast preference
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.userPreferences.highContrast = true;
        }
        
        // Detect reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.userPreferences.reducedMotion = true;
        }
        
        // Detect large text preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches) {
            this.userPreferences.largeText = true;
        }
        
        // Listen for preference changes
        this.setupPreferenceListeners();
    }

    setupPreferenceListeners() {
        // Listen for contrast changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
                this.userPreferences.highContrast = e.matches;
                this.applyContrastSettings();
            });
            
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                this.userPreferences.reducedMotion = e.matches;
                this.applyMotionSettings();
            });
        }
    }

    applyAccessibilityEnhancements() {
        // Apply high contrast if needed
        if (this.userPreferences.highContrast) {
            this.applyContrastSettings();
        }
        
        // Apply reduced motion if needed
        if (this.userPreferences.reducedMotion) {
            this.applyMotionSettings();
        }
        
        // Apply large text if needed
        if (this.userPreferences.largeText) {
            this.applyLargeTextSettings();
        }
    }

    applyContrastSettings() {
        document.body.classList.toggle('high-contrast', this.userPreferences.highContrast);
        
        if (this.userPreferences.highContrast) {
            // Add high contrast styles
            const style = document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                .high-contrast {
                    --primary-color: #000000;
                    --secondary-color: #ffffff;
                    --accent-color: #ffff00;
                    --error-color: #ff0000;
                    --success-color: #00ff00;
                }
                .high-contrast .mic-button {
                    background: #000000 !important;
                    color: #ffffff !important;
                    border: 3px solid #ffffff !important;
                }
                .high-contrast .status-message {
                    border: 2px solid #000000 !important;
                }
            `;
            
            // Remove existing high contrast styles
            const existing = document.getElementById('high-contrast-styles');
            if (existing) {
                existing.remove();
            }
            
            document.head.appendChild(style);
        }
    }

    applyMotionSettings() {
        document.body.classList.toggle('reduced-motion', this.userPreferences.reducedMotion);
        
        if (this.userPreferences.reducedMotion) {
            // Add reduced motion styles
            const style = document.createElement('style');
            style.id = 'reduced-motion-styles';
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                .reduced-motion .pulse {
                    animation: none !important;
                }
                .reduced-motion .mic-button {
                    transition: none !important;
                }
            `;
            
            // Remove existing reduced motion styles
            const existing = document.getElementById('reduced-motion-styles');
            if (existing) {
                existing.remove();
            }
            
            document.head.appendChild(style);
        }
    }

    applyLargeTextSettings() {
        document.body.classList.toggle('large-text', this.userPreferences.largeText);
        
        if (this.userPreferences.largeText) {
            // Add large text styles
            const style = document.createElement('style');
            style.id = 'large-text-styles';
            style.textContent = `
                .large-text {
                    font-size: 1.2em;
                }
                .large-text .mic-button {
                    width: 140px;
                    height: 140px;
                    font-size: 1.1rem;
                }
                .large-text .response-text {
                    font-size: 1.3rem;
                    line-height: 1.8;
                }
            `;
            
            // Remove existing large text styles
            const existing = document.getElementById('large-text-styles');
            if (existing) {
                existing.remove();
            }
            
            document.head.appendChild(style);
        }
    }

    setupFocusManagement() {
        // Ensure proper focus management for keyboard users
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.userPreferences.keyboardOnly = true;
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove keyboard-only class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add keyboard navigation styles
        this.addKeyboardNavigationStyles();
    }

    addKeyboardNavigationStyles() {
        const style = document.createElement('style');
        style.id = 'keyboard-navigation-styles';
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid #4A90E2 !important;
                outline-offset: 2px !important;
            }
            .keyboard-navigation .mic-button:focus {
                outline: 4px solid #4A90E2 !important;
                outline-offset: 4px !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupVisualFeedback() {
        // Enhanced visual feedback for all user actions
        this.setupButtonFeedback();
        this.setupStatusFeedback();
        this.setupProgressFeedback();
    }

    setupButtonFeedback() {
        // Add visual feedback for button interactions
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.provideButtonFeedback(button);
            });
            
            button.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    this.provideButtonFeedback(button);
                }
            });
        });
    }

    provideButtonFeedback(button) {
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Audio feedback (if available)
        this.provideAudioFeedback('button_click');
    }

    provideAudioFeedback(type) {
        // Simple audio feedback using Web Audio API or system sounds
        try {
            // Create a simple beep for feedback
            if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = type === 'button_click' ? 800 : 600;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (error) {
            // Audio feedback not available
            console.log('Audio feedback not available');
        }
    }

    setupStatusFeedback() {
        // Enhanced status feedback with multiple modalities
        const statusObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const statusElement = mutation.target.closest('.status-message');
                    if (statusElement && !statusElement.classList.contains('hidden')) {
                        this.announceStatusChange(statusElement.textContent);
                    }
                }
            });
        });
        
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusObserver.observe(statusMessage, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    announceStatusChange(message) {
        // Announce status changes to screen readers
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
        
        // Provide visual emphasis for status changes
        this.emphasizeStatusChange();
    }

    emphasizeStatusChange() {
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage && !this.userPreferences.reducedMotion) {
            statusMessage.style.animation = 'statusPulse 0.5s ease-in-out';
            setTimeout(() => {
                statusMessage.style.animation = '';
            }, 500);
        }
    }

    setupProgressFeedback() {
        // Add progress feedback for processing states
        const style = document.createElement('style');
        style.id = 'progress-feedback-styles';
        style.textContent = `
            @keyframes statusPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            .processing-indicator {
                position: relative;
            }
            
            .processing-indicator::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border: 2px solid #4A90E2;
                border-radius: inherit;
                animation: processingPulse 1s infinite;
            }
            
            @keyframes processingPulse {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.1); }
            }
            
            .reduced-motion .processing-indicator::after {
                animation: none;
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    }

    detectUserPreferences() {
        // Detect user's technical literacy level based on interaction patterns
        this.detectTechnicalLiteracy();
        
        // Detect language literacy level
        this.detectLanguageLiteracy();
    }

    detectTechnicalLiteracy() {
        // Simple heuristics for technical literacy
        const hasTouch = 'ontouchstart' in window;
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (hasTouch && (userAgent.includes('mobile') || userAgent.includes('tablet'))) {
            this.technicalLevel = 'medium'; // Mobile users generally have medium tech literacy
        }
        
        // Adjust interface based on technical level
        this.adjustForTechnicalLevel();
    }

    detectLanguageLiteracy() {
        // This would be enhanced with actual usage patterns
        // For now, assume medium literacy
        this.literacyLevel = 'medium';
    }

    adjustForTechnicalLevel() {
        if (this.technicalLevel === 'low') {
            // Simplify interface for low technical literacy
            document.body.classList.add('simple-interface');
            this.addSimpleInterfaceStyles();
        }
    }

    addSimpleInterfaceStyles() {
        const style = document.createElement('style');
        style.id = 'simple-interface-styles';
        style.textContent = `
            .simple-interface .mic-button {
                font-size: 1.2rem;
                padding: 20px;
            }
            
            .simple-interface .response-text {
                font-size: 1.2rem;
                line-height: 1.8;
            }
            
            .simple-interface .language-selector select {
                font-size: 1.1rem;
                padding: 15px;
            }
        `;
        document.head.appendChild(style);
    }

    detectScreenReader() {
        // Detect if user is likely using a screen reader
        const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                               window.navigator.userAgent.includes('JAWS') ||
                               window.speechSynthesis?.getVoices().length > 10;
        
        if (hasScreenReader) {
            this.userPreferences.screenReader = true;
            document.body.classList.add('screen-reader-user');
            this.enhanceForScreenReader();
        }
    }

    enhanceForScreenReader() {
        // Add additional screen reader enhancements
        const style = document.createElement('style');
        style.id = 'screen-reader-styles';
        style.textContent = `
            .screen-reader-user .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .screen-reader-user .sr-only:focus {
                position: static;
                width: auto;
                height: auto;
                padding: 0.5rem;
                margin: 0;
                overflow: visible;
                clip: auto;
                white-space: normal;
                background: #000;
                color: #fff;
            }
        `;
        document.head.appendChild(style);
    }

    handleTabNavigation(event) {
        // Ensure proper tab order and focus management
        const focusableElements = document.querySelectorAll(
            'button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    // Get accessibility report
    getAccessibilityReport() {
        return {
            userPreferences: this.userPreferences,
            literacyLevel: this.literacyLevel,
            technicalLevel: this.technicalLevel,
            featuresEnabled: {
                keyboardNavigation: document.body.classList.contains('keyboard-navigation'),
                highContrast: document.body.classList.contains('high-contrast'),
                reducedMotion: document.body.classList.contains('reduced-motion'),
                largeText: document.body.classList.contains('large-text'),
                simpleInterface: document.body.classList.contains('simple-interface'),
                screenReaderOptimized: document.body.classList.contains('screen-reader-user')
            }
        };
    }
}

// Cultural Context Manager - Handles local trading customs and cultural sensitivity
class CulturalContextManager {
    constructor() {
        this.culturalContext = {
            region: 'general',
            language: 'english',
            tradingCustoms: {},
            communicationStyle: 'respectful',
            marketContext: {}
        };
        
        this.tradingCustoms = {
            general: {
                bargainingExpected: true,
                respectfulApproach: true,
                patientNegotiation: true,
                relationshipFocus: true
            },
            indian: {
                bargainingExpected: true,
                respectfulApproach: true,
                patientNegotiation: true,
                relationshipFocus: true,
                familyOriented: true,
                seasonalAwareness: true,
                festivalPricing: true
            }
        };
        
        this.communicationPatterns = {
            english: {
                directness: 'moderate',
                politeness: 'high',
                formality: 'medium',
                patience: 'medium'
            },
            hindi: {
                directness: 'low',
                politeness: 'very_high',
                formality: 'high',
                patience: 'high',
                respectForElders: true
            },
            kannada: {
                directness: 'low',
                politeness: 'very_high',
                formality: 'high',
                patience: 'high',
                localPride: true
            }
        };
        
        this.marketContexts = {
            vegetables: {
                seasonalSensitivity: 'high',
                qualityFocus: 'high',
                freshnessImportance: 'critical',
                bargainingFlexibility: 'high'
            },
            grains: {
                seasonalSensitivity: 'medium',
                qualityFocus: 'high',
                storageAwareness: 'high',
                bargainingFlexibility: 'medium'
            },
            dairy: {
                seasonalSensitivity: 'low',
                qualityFocus: 'critical',
                freshnessImportance: 'critical',
                bargainingFlexibility: 'low'
            }
        };
    }

    detectCulturalContext(language) {
        // Detect cultural context based on language selection
        const langCode = this.normalizeLanguageCode(language);
        
        this.culturalContext.language = langCode;
        
        // Set regional context based on language
        if (langCode === 'hindi' || langCode === 'kannada') {
            this.culturalContext.region = 'indian';
        } else {
            this.culturalContext.region = 'general';
        }
        
        // Load appropriate communication patterns
        this.culturalContext.communicationStyle = this.communicationPatterns[langCode] || this.communicationPatterns.english;
        
        console.log('Cultural context detected:', this.culturalContext);
    }

    loadLocalTradingCustoms() {
        // Load trading customs for the detected region
        const regionCustoms = this.tradingCustoms[this.culturalContext.region] || this.tradingCustoms.general;
        this.culturalContext.tradingCustoms = regionCustoms;
        
        console.log('Trading customs loaded:', regionCustoms);
    }

    getCulturalSettings() {
        return {
            colorPreferences: this.getCulturalColorPreferences(),
            layoutPreferences: this.getCulturalLayoutPreferences(),
            interactionPatterns: this.getCulturalInteractionPatterns(),
            communicationStyle: this.culturalContext.communicationStyle
        };
    }

    getCulturalColorPreferences() {
        // Return culturally appropriate color schemes
        const preferences = {
            respectfulColors: true
        };
        
        if (this.culturalContext.region === 'indian') {
            preferences.primary = '#2E7D32'; // Respectful green
            preferences.accent = '#FF9800';  // Warm orange
            preferences.success = '#4CAF50'; // Positive green
        }
        
        return preferences;
    }

    getCulturalLayoutPreferences() {
        return {
            respectfulSpacing: this.culturalContext.communicationStyle.formality === 'high',
            patientLayout: this.culturalContext.communicationStyle.patience === 'high'
        };
    }

    getCulturalInteractionPatterns() {
        const patterns = {
            patientInteraction: this.culturalContext.communicationStyle.patience === 'high'
        };
        
        if (patterns.patientInteraction) {
            patterns.processingDelay = 1000; // Extra time for processing
            patterns.responseDelay = 500;    // Pause before responses
        }
        
        return patterns;
    }

    // Filter responses for cultural appropriateness
    filterResponse(response, language) {
        if (!response || !response.text) {
            return response;
        }
        
        const langCode = this.normalizeLanguageCode(language);
        const commStyle = this.communicationPatterns[langCode];
        
        if (!commStyle) {
            return response;
        }
        
        let filteredText = response.text;
        
        // Apply cultural filtering based on communication style
        if (commStyle.politeness === 'very_high') {
            filteredText = this.enhancePoliteness(filteredText, langCode);
        }
        
        if (commStyle.directness === 'low') {
            filteredText = this.softenDirectness(filteredText, langCode);
        }
        
        if (commStyle.formality === 'high') {
            filteredText = this.increaseFormality(filteredText, langCode);
        }
        
        return {
            ...response,
            text: filteredText,
            culturallyFiltered: true
        };
    }

    enhancePoliteness(text, language) {
        // Add polite prefixes and suffixes based on language
        const politeEnhancements = {
            english: {
                prefix: 'Please consider that ',
                suffix: '. Thank you for your understanding.'
            },
            hindi: {
                prefix: 'Kripaya dhyan dijiye ki ',
                suffix: '. Aapki samajh ke liye dhanyawad.'
            },
            kannada: {
                prefix: 'Dayavittu tilkoli ',
                suffix: '. Nimma tiluvlike dhanyavaadagalu.'
            }
        };
        
        const enhancements = politeEnhancements[language];
        if (enhancements && !text.includes('Please') && !text.includes('Kripaya') && !text.includes('Dayavittu')) {
            return enhancements.prefix + text.toLowerCase() + enhancements.suffix;
        }
        
        return text;
    }

    softenDirectness(text, language) {
        // Soften direct statements
        const softeningPhrases = {
            english: {
                'You should': 'You might consider',
                'You must': 'It would be good if you',
                'Do this': 'Perhaps you could'
            },
            hindi: {
                'Aapko chahiye': 'Aap soch sakte hain',
                'Aapko karna chahiye': 'Accha hoga agar aap'
            },
            kannada: {
                'Neevu maadabeku': 'Neevu maadbahudu',
                'Neevu maadi': 'Neevu maadbahudu'
            }
        };
        
        const phrases = softeningPhrases[language] || {};
        let softenedText = text;
        
        Object.entries(phrases).forEach(([direct, soft]) => {
            softenedText = softenedText.replace(new RegExp(direct, 'gi'), soft);
        });
        
        return softenedText;
    }

    increaseFormality(text, language) {
        // Increase formality of language
        const formalEnhancements = {
            english: {
                'Hi': 'Good day',
                'Thanks': 'Thank you',
                'OK': 'Very well'
            },
            hindi: {
                'Accha': 'Bahut accha',
                'Theek hai': 'Bilkul theek hai'
            },
            kannada: {
                'Sari': 'Tumba chennaagide',
                'Olledu': 'Tumba olledu'
            }
        };
        
        const enhancements = formalEnhancements[language] || {};
        let formalText = text;
        
        Object.entries(enhancements).forEach(([informal, formal]) => {
            formalText = formalText.replace(new RegExp(`\\b${informal}\\b`, 'gi'), formal);
        });
        
        return formalText;
    }

    // Get market context awareness for pricing
    getMarketContextAwareness(product, category) {
        const marketContext = this.marketContexts[category] || {};
        const tradingCustoms = this.culturalContext.tradingCustoms;
        
        return {
            seasonalAwareness: marketContext.seasonalSensitivity === 'high' && tradingCustoms.seasonalAwareness,
            qualityFocus: marketContext.qualityFocus,
            freshnessImportance: marketContext.freshnessImportance,
            bargainingExpected: tradingCustoms.bargainingExpected && marketContext.bargainingFlexibility !== 'low',
            relationshipBuilding: tradingCustoms.relationshipFocus,
            culturalEvents: tradingCustoms.festivalPricing
        };
    }

    // Generate culturally appropriate negotiation guidance
    generateCulturalNegotiationGuidance(intent, priceData, customerAnalysis) {
        const guidance = {
            approach: 'respectful',
            timing: 'patient',
            language: 'polite',
            strategies: []
        };
        
        const customs = this.culturalContext.tradingCustoms;
        const commStyle = this.culturalContext.communicationStyle;
        
        // Adjust approach based on cultural context
        if (customs.bargainingExpected) {
            guidance.strategies.push('Expect and welcome bargaining as normal practice');
        }
        
        if (customs.relationshipFocus) {
            guidance.strategies.push('Focus on building long-term customer relationships');
        }
        
        if (customs.patientNegotiation) {
            guidance.strategies.push('Allow time for customer consideration and discussion');
        }
        
        if (commStyle.respectForElders) {
            guidance.strategies.push('Show extra respect if customer appears to be an elder');
        }
        
        if (commStyle.localPride && this.culturalContext.language === 'kannada') {
            guidance.strategies.push('Acknowledge local products and suppliers when relevant');
        }
        
        return guidance;
    }

    // Get culturally appropriate decline messages
    getCulturalDeclineMessages(reason, language) {
        const declineMessages = {
            english: {
                below_minimum: "I truly appreciate your interest, but I cannot go below this price while maintaining quality.",
                quality_standards: "I understand price is important, but I must ensure the quality you deserve.",
                market_conditions: "I wish I could offer a lower price, but current market conditions don't allow it."
            },
            hindi: {
                below_minimum: "Aapka interest ke liye bahut dhanyawad, lekin quality maintain karte hue main is se kam nahi de sakta.",
                quality_standards: "Main samajh sakta hun ki price important hai, lekin mujhe aapke liye quality ensure karni hai.",
                market_conditions: "Main chahta hun ki kam price de sakun, lekin market conditions allow nahi kar rahi."
            },
            kannada: {
                below_minimum: "Nimma interest ge tumba dhanyavaadagalu, aadre quality maintain maaduttaa ee price gintha kammi kodalla.",
                quality_standards: "Price important antha tiliyuttade, aadre nimge beku quality ensure maadabeku.",
                market_conditions: "Kammi price kodabeku ansutte, aadre market conditions allow maadalla."
            }
        };
        
        const messages = declineMessages[language] || declineMessages.english;
        return messages[reason] || messages.below_minimum;
    }

    normalizeLanguageCode(language) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada',
            'english': 'english',
            'hindi': 'hindi',
            'kannada': 'kannada'
        };
        
        return langMap[language] || 'english';
    }

    // Get cultural context report
    getCulturalReport() {
        return {
            culturalContext: this.culturalContext,
            tradingCustoms: this.culturalContext.tradingCustoms,
            communicationStyle: this.culturalContext.communicationStyle,
            marketContexts: this.marketContexts
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.linguisticBridge = new LinguisticBridge();
});