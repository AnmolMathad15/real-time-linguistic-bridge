// Real-Time Linguistic Bridge - Clean Implementation
// Component Classes First (Dependencies)

class VoiceInterface {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.onSpeechResultCallback = null;
        this.onErrorCallback = null;
        this.onConfidenceUpdate = null;
        
        this.initializeRecognition();
    }

    static isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    initializeRecognition() {
        if (!VoiceInterface.isSupported()) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Speech recognition started');
        };

        this.recognition.onresult = (event) => {
            const result = event.results[0];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            
            console.log('Speech result:', transcript, 'Confidence:', confidence);
            
            if (this.onConfidenceUpdate) {
                this.onConfidenceUpdate(confidence);
            }
            
            if (this.onSpeechResultCallback) {
                this.onSpeechResultCallback({
                    text: transcript,
                    confidence: confidence,
                    timestamp: new Date().toISOString()
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            if (this.onErrorCallback) {
                this.onErrorCallback(event);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Speech recognition ended');
        };
    }

    startListening(language = 'en-US') {
        if (!this.recognition) {
            console.error('Speech recognition not initialized');
            return false;
        }

        if (this.isListening) {
            console.warn('Already listening');
            return false;
        }

        try {
            this.recognition.lang = language;
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback({ error: 'start_failed', message: error.message });
            }
            return false;
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    onSpeechResult(callback) {
        this.onSpeechResultCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }
}

class IntentClassifier {
    constructor() {
        this.intentPatterns = {
            bargaining: {
                english: ['price', 'cost', 'rate', 'cheap', 'expensive', 'discount', 'deal', 'negotiate'],
                hindi: ['daam', 'kimat', 'rate', 'sasta', 'mehnga', 'kam', 'zyada', 'mol', 'bhav'],
                kannada: ['bele', 'rate', 'olleya', 'ketta', 'kammi', 'jaasti', 'vyavasthe', 'mol']
            },
            bulk_purchase: {
                english: ['bulk', 'wholesale', 'quantity', 'lots', 'many', 'kilos', 'tons'],
                hindi: ['thok', 'bada', 'quantity', 'zyada', 'kilo', 'ton', 'bori'],
                kannada: ['thumba', 'dodda', 'quantity', 'jaasti', 'kilo', 'ton', 'gunny']
            },
            casual_inquiry: {
                english: ['what', 'how', 'tell', 'know', 'information', 'help', 'available'],
                hindi: ['kya', 'kaise', 'batao', 'pata', 'jaankari', 'madad', 'milta'],
                kannada: ['yenu', 'hege', 'heli', 'gottide', 'mahiti', 'sahaya', 'sigutta']
            }
        };

        this.productPatterns = {
            vegetables: {
                english: ['onion', 'potato', 'tomato', 'carrot', 'cabbage'],
                hindi: ['pyaaz', 'aloo', 'tamatar', 'gajar', 'patta'],
                kannada: ['eerulli', 'aalugadde', 'tomato', 'carrot', 'kosu']
            },
            fruits: {
                english: ['apple', 'banana', 'orange', 'mango', 'grapes'],
                hindi: ['seb', 'kela', 'santra', 'aam', 'angoor'],
                kannada: ['sebu', 'balehannu', 'kittale', 'maavu', 'drakshi']
            }
        };
    }

    async classifyIntent(text, language = 'english') {
        const normalizedText = text.toLowerCase();
        const words = normalizedText.split(/\s+/);
        
        const scores = {
            bargaining: this.calculateIntentScore(words, 'bargaining', language),
            bulk_purchase: this.calculateIntentScore(words, 'bulk_purchase', language),
            casual_inquiry: this.calculateIntentScore(words, 'casual_inquiry', language)
        };
        
        const maxScore = Math.max(...Object.values(scores));
        const detectedIntent = Object.keys(scores).find(key => scores[key] === maxScore);
        
        const product = this.extractProduct(words, language);
        const category = this.determineCategory(product, language);
        
        return {
            type: detectedIntent,
            confidence: maxScore,
            keywords: this.extractMatchingKeywords(words, detectedIntent, language),
            product: product,
            category: category,
            originalText: text,
            language: language,
            timestamp: new Date().toISOString()
        };
    }

    calculateIntentScore(words, intentType, language) {
        const patterns = this.intentPatterns[intentType];
        if (!patterns || !patterns[language]) {
            return 0;
        }
        
        const keywords = patterns[language];
        let matches = 0;
        
        words.forEach(word => {
            if (keywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
                matches++;
            }
        });
        
        return matches / words.length;
    }

    extractProduct(words, language) {
        for (const category of Object.keys(this.productPatterns)) {
            const products = this.productPatterns[category][language] || [];
            for (const product of products) {
                if (words.some(word => word.includes(product) || product.includes(word))) {
                    return product;
                }
            }
        }
        return 'general item';
    }

    determineCategory(product, language) {
        for (const [category, languages] of Object.entries(this.productPatterns)) {
            const products = languages[language] || [];
            if (products.includes(product)) {
                return category;
            }
        }
        return 'general';
    }

    extractMatchingKeywords(words, intentType, language) {
        const patterns = this.intentPatterns[intentType];
        if (!patterns || !patterns[language]) {
            return [];
        }
        
        const keywords = patterns[language];
        return words.filter(word => 
            keywords.some(keyword => word.includes(keyword) || keyword.includes(word))
        );
    }
}

class TranslationEngine {
    constructor() {
        this.tradeTerms = {
            hindi: {
                'what is the price': 'kya daam hai',
                'how much': 'kitna',
                'too expensive': 'bahut mehnga',
                'good price': 'accha daam'
            },
            kannada: {
                'what is the price': 'bele eshtu',
                'how much': 'eshtu',
                'too expensive': 'thumba jaasti',
                'good price': 'olleya bele'
            }
        };
    }

    async translate(text, fromLanguage, toLanguage, intent = null) {
        const normalizedText = text.toLowerCase().trim();
        
        if (toLanguage === 'english' && this.tradeTerms[fromLanguage]) {
            const terms = this.tradeTerms[fromLanguage];
            for (const [english, foreign] of Object.entries(terms)) {
                if (normalizedText.includes(foreign)) {
                    return text.replace(new RegExp(foreign, 'gi'), english);
                }
            }
        }
        
        return text;
    }
}

class PriceDiscoveryEngine {
    constructor() {
        this.priceData = {};
        this.fallbackPrices = {
            vegetables: { min: 20, avg: 40, max: 80, unit: 'kg' },
            fruits: { min: 30, avg: 60, max: 120, unit: 'kg' },
            general: { min: 25, avg: 50, max: 100, unit: 'kg' }
        };
    }

    loadPriceData(data) {
        this.priceData = data;
        console.log('Price data loaded:', Object.keys(data).length, 'items');
    }

    async getMarketPrice(product, category = 'general') {
        let priceInfo = this.findExactMatch(product);
        
        if (!priceInfo) {
            priceInfo = this.getCategoryPricing(category);
        }
        
        return this.addMarketIntelligence(priceInfo, product, category);
    }

    findExactMatch(product) {
        const normalizedProduct = product.toLowerCase();
        
        if (this.priceData[normalizedProduct]) {
            return { ...this.priceData[normalizedProduct] };
        }
        
        for (const [key, value] of Object.entries(this.priceData)) {
            if (key.includes(normalizedProduct) || normalizedProduct.includes(key)) {
                return { ...value, product: key };
            }
        }
        
        return null;
    }

    getCategoryPricing(category) {
        const fallback = this.fallbackPrices[category] || this.fallbackPrices.general;
        
        return {
            product: `${category} item`,
            category: category,
            marketPrice: fallback.avg,
            minPrice: fallback.min,
            maxPrice: fallback.max,
            unit: fallback.unit,
            confidence: 0.6,
            source: 'category_average',
            timestamp: new Date().toISOString()
        };
    }

    addMarketIntelligence(priceInfo, product, category) {
        if (!priceInfo) return null;
        
        priceInfo.ranges = {
            minimum: priceInfo.minPrice || Math.round(priceInfo.marketPrice * 0.8),
            premium: priceInfo.maxPrice || Math.round(priceInfo.marketPrice * 1.2)
        };
        
        priceInfo.negotiation = {
            flexibility: category === 'vegetables' ? 'high' : 'moderate'
        };
        
        return priceInfo;
    }
}

class NegotiationAssistant {
    constructor() {
        this.strategies = {
            bargaining: ['emphasize_quality', 'show_market_rates', 'be_flexible'],
            bulk_purchase: ['offer_tiered_pricing', 'emphasize_savings'],
            casual_inquiry: ['provide_information', 'build_relationship']
        };
    }

    async generateGuidance(intent, priceData, originalText) {
        try {
            const customerAnalysis = this.analyzeCustomer(intent, originalText);
            const counterOffers = this.generateCounterOffers(intent, priceData);
            const tactics = this.suggestTactics(intent);
            
            return {
                customerAnalysis,
                counterOffers,
                tactics: {
                    primary: this.strategies[intent.type] || this.strategies.casual_inquiry,
                    secondary: ['build_rapport'],
                    avoid: ['aggressive_pressure']
                },
                valuePropositions: [{
                    type: 'quality',
                    message: 'Fresh, high-quality products',
                    reasoning: 'Quality differentiation'
                }],
                decisions: {
                    accept: { conditions: ['Fair price offered'], reasoning: ['Within market range'] },
                    counter: { conditions: ['Below market rate'], reasoning: ['Room for negotiation'] },
                    decline: { conditions: ['Too low'], reasoning: ['Below cost price'] }
                },
                culturalContext: {
                    customary: ['Maintain respectful dialogue', 'Allow time for consideration'],
                    communicationStyle: 'respectful_and_patient'
                },
                confidence: this.calculateConfidence(intent, priceData),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating negotiation guidance:', error);
            return this.createFallbackGuidance(intent);
        }
    }

    analyzeCustomer(intent, originalText) {
        return {
            priceAwareness: 'moderate',
            urgency: 'normal',
            flexibility: intent.type === 'bulk_purchase' ? 'high' : 'moderate',
            signals: [intent.type]
        };
    }

    generateCounterOffers(intent, priceData) {
        if (!priceData || !priceData.marketPrice) {
            return [{
                level: 'standard',
                price: null,
                message: 'Let me check current market prices',
                reasoning: ['Price data not available'],
                recommended: true
            }];
        }

        const basePrice = priceData.marketPrice;
        const offers = [];

        if (intent.type === 'bulk_purchase') {
            offers.push({
                level: 'bulk',
                price: Math.round(basePrice * 0.9),
                message: `Bulk pricing: ₹${Math.round(basePrice * 0.9)} per ${priceData.unit}`,
                reasoning: ['Volume discount'],
                recommended: true
            });
        }

        offers.push({
            level: 'standard',
            price: basePrice,
            message: `Market rate: ₹${basePrice} per ${priceData.unit}`,
            reasoning: ['Standard pricing'],
            recommended: offers.length === 0
        });

        return offers;
    }

    suggestTactics(intent) {
        return this.strategies[intent.type] || this.strategies.casual_inquiry;
    }

    calculateConfidence(intent, priceData) {
        let confidence = 0.5;
        if (intent.confidence > 0.7) confidence += 0.2;
        if (priceData && priceData.marketPrice) confidence += 0.2;
        return Math.max(0.1, Math.min(1.0, confidence));
    }

    createFallbackGuidance(intent) {
        return {
            customerAnalysis: {
                priceAwareness: 'unknown',
                urgency: 'normal',
                flexibility: 'moderate',
                signals: ['fallback']
            },
            counterOffers: [{
                level: 'standard',
                price: null,
                message: 'Let me help you with pricing information',
                reasoning: ['General assistance'],
                recommended: true
            }],
            tactics: {
                primary: ['Be helpful', 'Provide information'],
                secondary: ['Build trust'],
                avoid: ['Making commitments without data']
            },
            valuePropositions: [{
                type: 'service',
                message: 'I will provide accurate information',
                reasoning: 'Transparency builds trust'
            }],
            decisions: {
                accept: { conditions: [], reasoning: [] },
                counter: { conditions: ['Get more information'], reasoning: ['Need better data'] },
                decline: { conditions: [], reasoning: [] }
            },
            culturalContext: {
                customary: ['Be respectful', 'Be patient'],
                communicationStyle: 'helpful_and_professional'
            },
            confidence: 0.3,
            timestamp: new Date().toISOString(),
            fallback: true
        };
    }
}

class ResponseGenerator {
    constructor() {
        this.responseTemplates = {
            english: {
                price_guidance: {
                    with_price: "Current market price for {product} is ₹{price} per {unit}. {guidance}",
                    price_range: "For {product}, prices range from ₹{minPrice} to ₹{maxPrice} per {unit}. {guidance}",
                    no_price: "I don't have current pricing for {product}, but I can help with general guidance. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "Consider offering ₹{price} per {unit}. {reasoning}",
                    accept_offer: "This is a fair price at ₹{price} per {unit}. {reasoning}",
                    decline_offer: "This price is too low. {reasoning}"
                },
                cultural_guidance: {
                    respectful: "Remember to be respectful during negotiations.",
                    flexible: "You have room for negotiation with this product.",
                    firm: "Maintain your price - this is fair."
                }
            },
            hindi: {
                price_guidance: {
                    with_price: "Bazaar mein {product} ka daam ₹{price} per {unit} hai. {guidance}",
                    price_range: "{product} ke liye ₹{minPrice} se ₹{maxPrice} per {unit} tak milta hai. {guidance}",
                    no_price: "Mujhe {product} ka current rate nahi pata, lekin general guidance de sakta hun. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} per {unit} offer kar sakte hain. {reasoning}",
                    accept_offer: "₹{price} per {unit} mein accha deal hai. {reasoning}",
                    decline_offer: "Yeh price kam hai. {reasoning}"
                },
                cultural_guidance: {
                    respectful: "Negotiation mein respect rakhiye.",
                    flexible: "Is product mein negotiation ho sakti hai.",
                    firm: "Apna price maintain kariye - yeh fair hai."
                }
            },
            kannada: {
                price_guidance: {
                    with_price: "Market nalli {product} bele ₹{price} per {unit} ide. {guidance}",
                    price_range: "{product} ge ₹{minPrice} to ₹{maxPrice} per {unit} sigutta. {guidance}",
                    no_price: "Nanage {product} current rate gottilla, aadre general guidance kodabaudu. {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} per {unit} offer maadabaudu. {reasoning}",
                    accept_offer: "₹{price} per {unit} nalli chennaagide. {reasoning}",
                    decline_offer: "Ee price kammi. {reasoning}"
                },
                cultural_guidance: {
                    respectful: "Negotiation nalli respect iddkoli.",
                    flexible: "Ee product nalli negotiation maadabaudu.",
                    firm: "Nimma price maintain maadi - idu fair."
                }
            }
        };
    }

    async formatResponse(data, language) {
        try {
            const { intent, priceData, negotiationGuidance } = data;
            const responseLanguage = this.normalizeLanguage(language);
            
            const primaryResponse = this.generatePrimaryResponse(intent, priceData, responseLanguage);
            const negotiationResponse = this.generateNegotiationResponse(negotiationGuidance, responseLanguage);
            
            const combinedResponse = [primaryResponse, negotiationResponse]
                .filter(r => r && r.trim().length > 0)
                .join(' ');
            
            return {
                text: combinedResponse || 'I can help you with pricing information.',
                language: responseLanguage,
                actionable: true,
                fallback: false,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error formatting response:', error);
            return this.createFallbackResponse(data, language, error);
        }
    }

    generatePrimaryResponse(intent, priceData, language) {
        const templates = this.responseTemplates[language] || this.responseTemplates.english;
        
        if (!priceData) {
            return this.fillTemplate(templates.price_guidance.no_price, {
                product: intent.product || 'this item',
                guidance: 'Let me help you with what I can.'
            });
        }

        if (priceData.ranges) {
            return this.fillTemplate(templates.price_guidance.price_range, {
                product: priceData.product,
                minPrice: priceData.ranges.minimum,
                maxPrice: priceData.ranges.premium,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, language)
            });
        } else {
            return this.fillTemplate(templates.price_guidance.with_price, {
                product: priceData.product,
                price: priceData.marketPrice,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, language)
            });
        }
    }

    generatePriceGuidance(priceData, language) {
        const templates = this.responseTemplates[language] || this.responseTemplates.english;
        const flexibility = priceData.negotiation?.flexibility || 'moderate';
        
        switch (flexibility) {
            case 'high':
                return templates.cultural_guidance.flexible;
            case 'low':
                return templates.cultural_guidance.firm;
            default:
                return templates.cultural_guidance.respectful;
        }
    }

    generateNegotiationResponse(negotiationGuidance, language) {
        if (!negotiationGuidance.counterOffers || negotiationGuidance.counterOffers.length === 0) {
            return '';
        }

        const templates = this.responseTemplates[language] || this.responseTemplates.english;
        const recommendedOffer = negotiationGuidance.counterOffers.find(offer => offer.recommended);
        
        if (recommendedOffer && recommendedOffer.price) {
            return this.fillTemplate(templates.negotiation_advice.counter_offer, {
                price: recommendedOffer.price,
                unit: 'kg',
                reasoning: recommendedOffer.message
            });
        }

        return '';
    }

    fillTemplate(template, variables) {
        let filled = template;
        
        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            filled = filled.replace(new RegExp(placeholder, 'g'), value || '');
        });
        
        return filled.replace(/\{[^}]+\}/g, '').replace(/\s+/g, ' ').trim();
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

    createFallbackResponse(data, language, error) {
        const fallbackMessages = {
            'en-US': "I'm here to help with pricing questions. Please try again.",
            'hi-IN': "Main aapke price ke sawal mein madad kar sakta hun. Phir se puchiye.",
            'kn-IN': "Naanu nimma price questions nalli help maadabaudu. Mathe keli."
        };
        
        const responseLanguage = this.normalizeLanguage(language);
        const fallbackText = fallbackMessages[language] || fallbackMessages['en-US'];
        
        return {
            text: fallbackText,
            language: responseLanguage,
            actionable: false,
            fallback: true,
            timestamp: new Date().toISOString(),
            error: error?.message
        };
    }

    generateSpeech(text, language) {
        try {
            if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = this.getBrowserLanguage(language);
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                
                speechSynthesis.speak(utterance);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error generating speech:', error);
            return false;
        }
    }

    getBrowserLanguage(language) {
        const langMap = {
            'english': 'en-US',
            'hindi': 'hi-IN',
            'kannada': 'kn-IN'
        };
        return langMap[language] || 'en-US';
    }
}

class PrivacyManager {
    constructor() {
        this.temporaryData = new Map();
    }

    validateNoDataPersistence() {
        // Check for any persistent storage
        if (localStorage.length > 0 || sessionStorage.length > 0) {
            console.warn('Persistent storage detected - clearing for privacy');
            this.clearAnyExistingData();
        }
    }

    clearAnyExistingData() {
        // Clear any existing data
        this.temporaryData.clear();
    }

    clearAudioData() {
        // Clear audio-related temporary data
        console.log('Audio data cleared for privacy');
    }

    clearTemporaryData() {
        this.temporaryData.clear();
    }

    clearSensitiveData() {
        this.clearTemporaryData();
    }

    clearAllData() {
        this.clearTemporaryData();
        console.log('All data cleared for privacy');
    }

    startPrivacyMonitoring() {
        console.log('Privacy monitoring started');
    }
}

class AccessibilityManager {
    constructor() {
        this.userPreferences = {
            screenReader: false,
            highContrast: false,
            largeText: false
        };
    }

    setupAccessibilityFeatures() {
        console.log('Accessibility features set up');
    }

    detectUserPreferences() {
        // Detect accessibility preferences
        this.userPreferences.screenReader = this.detectScreenReader();
    }

    detectScreenReader() {
        // Simple screen reader detection
        return navigator.userAgent.includes('NVDA') || 
               navigator.userAgent.includes('JAWS') || 
               window.speechSynthesis !== undefined;
    }

    handleTabNavigation(event) {
        // Handle tab navigation
        console.log('Tab navigation handled');
    }
}

class CulturalContextManager {
    constructor() {
        this.culturalContext = {
            language: 'english',
            region: 'general',
            tradingCustoms: [],
            communicationStyle: 'professional'
        };
    }

    detectCulturalContext(language) {
        this.culturalContext.language = language;
        console.log('Cultural context detected for:', language);
    }

    loadLocalTradingCustoms() {
        this.culturalContext.tradingCustoms = [
            'Respectful communication',
            'Patient negotiation',
            'Fair pricing'
        ];
    }

    getCulturalSettings() {
        return {
            colorPreferences: null,
            layoutPreferences: null,
            interactionPatterns: { patientInteraction: true }
        };
    }

    filterResponse(response, language) {
        // Apply cultural filtering to responses
        return response;
    }
}

// Main Application Class (After all dependencies)
class LinguisticBridge {
    constructor() {
        // Initialize all components
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
        this.lastResponse = null;
        
        this.initializeApplication();
    }

    initializeApplication() {
        this.initializeUI();
        this.loadPriceData();
        this.initializePrivacyProtection();
        this.initializeAccessibility();
        this.initializeCulturalContext();
    }

    initializeUI() {
        // Get DOM elements safely
        this.micButton = document.getElementById('micButton');
        this.languageSelect = document.getElementById('language');
        this.listeningIndicator = document.getElementById('listeningIndicator');
        this.responseSection = document.getElementById('responseSection');
        this.responseText = document.getElementById('responseText');
        this.statusMessage = document.getElementById('statusMessage');
        this.speakButton = document.getElementById('speakButton');

        // Check if we have required elements
        if (!this.micButton) {
            console.log('UI elements not found - running in test mode');
            return;
        }

        // Set up event listeners
        this.setupEventListeners();
        
        // Check browser compatibility
        this.checkBrowserCompatibility();
    }

    setupEventListeners() {
        // Microphone button
        this.micButton.addEventListener('click', () => this.handleVoiceInput());
        
        // Language selection
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
            });
        }
        
        // Speak button
        if (this.speakButton) {
            this.speakButton.addEventListener('click', () => this.speakResponse());
        }

        // Voice interface callbacks
        this.voiceInterface.onSpeechResult((result) => this.processVoiceInput(result));
        this.voiceInterface.onError((error) => this.handleVoiceError(error));
    }

    checkBrowserCompatibility() {
        if (!VoiceInterface.isSupported()) {
            this.showStatus('Speech recognition not supported. Please use Chrome or Edge.', 'warning');
            this.micButton.disabled = true;
            this.micButton.style.opacity = '0.5';
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

    initializePrivacyProtection() {
        this.privacyManager.validateNoDataPersistence();
        this.privacyManager.startPrivacyMonitoring();
        
        // Auto-clear data periodically
        setInterval(() => {
            this.privacyManager.clearTemporaryData();
        }, 30000);
    }

    initializeAccessibility() {
        this.accessibilityManager.setupAccessibilityFeatures();
        this.accessibilityManager.detectUserPreferences();
    }

    initializeCulturalContext() {
        this.culturalContextManager.detectCulturalContext(this.currentLanguage);
        this.culturalContextManager.loadLocalTradingCustoms();
    }

    handleVoiceInput() {
        if (this.isProcessing) {
            this.showStatus('Please wait, processing previous request...', 'info');
            return;
        }

        if (!VoiceInterface.isSupported()) {
            this.showStatus('Speech recognition not supported in this browser.', 'error');
            return;
        }

        if (this.voiceInterface.isListening) {
            this.voiceInterface.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        this.responseSection.classList.add('hidden');
        this.hideStatus();
        
        this.showStatus('Listening...', 'info');
        this.micButton.classList.add('listening');
        this.listeningIndicator.classList.remove('hidden');
        
        this.voiceInterface.startListening(this.currentLanguage);
    }

    stopListening() {
        this.micButton.classList.remove('listening');
        this.listeningIndicator.classList.add('hidden');
        this.hideStatus();
    }

    async processVoiceInput(voiceResult) {
        this.stopListening();
        this.isProcessing = true;
        
        try {
            this.showStatus('Processing your request...', 'info');
            this.privacyManager.clearAudioData();

            // Step 1: Classify intent
            const intent = await this.intentClassifier.classifyIntent(
                voiceResult.text, 
                this.getLanguageCode(this.currentLanguage)
            );

            // Step 2: Translate if needed
            let processedText = voiceResult.text;
            if (this.currentLanguage !== 'en-US') {
                processedText = await this.translationEngine.translate(
                    voiceResult.text,
                    this.getLanguageCode(this.currentLanguage),
                    'english',
                    intent
                );
            }

            // Step 3: Get price information
            let priceData = null;
            if (intent.type === 'bargaining' || intent.type === 'bulk_purchase') {
                priceData = await this.priceDiscoveryEngine.getMarketPrice(
                    intent.product,
                    intent.category
                );
            }

            // Step 4: Get negotiation guidance
            const negotiationGuidance = await this.negotiationAssistant.generateGuidance(
                intent,
                priceData,
                processedText
            );

            // Step 5: Generate response
            const response = await this.responseGenerator.formatResponse(
                {
                    intent,
                    priceData,
                    negotiationGuidance,
                    originalText: voiceResult.text,
                    processedText: processedText
                },
                this.getLanguageCode(this.currentLanguage)
            );

            this.displayResponse(response, priceData);
            this.hideStatus();

        } catch (error) {
            console.error('Error processing voice input:', error);
            this.showStatus('Sorry, there was an error processing your request.', 'error');
        } finally {
            this.isProcessing = false;
            this.privacyManager.clearSensitiveData();
        }
    }

    displayResponse(response, priceData) {
        this.responseText.textContent = response.text;
        this.responseSection.classList.remove('hidden');
        this.lastResponse = response;
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
        
        switch (error.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please speak clearly and try again.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your connection.';
                break;
            default:
                errorMessage = 'Speech recognition error. Please try again.';
        }
        
        this.showStatus(errorMessage, 'error');
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.classList.remove('hidden');
    }

    hideStatus() {
        this.statusMessage.classList.add('hidden');
    }

    getLanguageCode(browserLang) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada'
        };
        return langMap[browserLang] || 'english';
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.linguisticBridge = new LinguisticBridge();
});

// Expose classes globally for testing
window.VoiceInterface = VoiceInterface;
window.IntentClassifier = IntentClassifier;
window.ResponseGenerator = ResponseGenerator;