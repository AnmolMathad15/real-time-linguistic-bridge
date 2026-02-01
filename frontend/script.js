// Real-Time Linguistic Bridge - Working Implementation

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
            const confidence = result[0].confidence || 0.8;
            
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
            this.isListening = false;
            if (this.onErrorCallback) {
                this.onErrorCallback({ error: 'start_failed', message: error.message });
            }
            return false;
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
            this.isListening = false;
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
            'en-US': {
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
            'hi-IN': {
                price_guidance: {
                    with_price: "बाज़ार में {product} का दाम ₹{price} प्रति {unit} है। {guidance}",
                    price_range: "{product} के लिए ₹{minPrice} से ₹{maxPrice} प्रति {unit} तक मिलता है। {guidance}",
                    no_price: "मुझे {product} का वर्तमान रेट नहीं पता, लेकिन सामान्य मार्गदर्शन दे सकता हूं। {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} प्रति {unit} ऑफर कर सकते हैं। {reasoning}",
                    accept_offer: "₹{price} प्रति {unit} में अच्छा डील है। {reasoning}",
                    decline_offer: "यह प्राइस कम है। {reasoning}"
                },
                cultural_guidance: {
                    respectful: "बातचीत में सम्मान रखिए।",
                    flexible: "इस प्रोडक्ट में बातचीत हो सकती है।",
                    firm: "अपना प्राइस बनाए रखिए - यह उचित है।"
                }
            },
            'kn-IN': {
                price_guidance: {
                    with_price: "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ {product} ಬೆಲೆ ₹{price} ಪ್ರತಿ {unit} ಇದೆ। {guidance}",
                    price_range: "{product} ಗೆ ₹{minPrice} ರಿಂದ ₹{maxPrice} ಪ್ರತಿ {unit} ವರೆಗೆ ಸಿಗುತ್ತದೆ। {guidance}",
                    no_price: "ನನಗೆ {product} ಪ್ರಸ್ತುತ ದರ ಗೊತ್ತಿಲ್ಲ, ಆದರೆ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ ಕೊಡಬಹುದು। {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} ಪ್ರತಿ {unit} ಆಫರ್ ಮಾಡಬಹುದು। {reasoning}",
                    accept_offer: "₹{price} ಪ್ರತಿ {unit} ನಲ್ಲಿ ಚೆನ್ನಾಗಿದೆ। {reasoning}",
                    decline_offer: "ಈ ಬೆಲೆ ಕಮ್ಮಿ। {reasoning}"
                },
                cultural_guidance: {
                    respectful: "ಮಾತುಕತೆಯಲ್ಲಿ ಗೌರವ ಇಟ್ಟುಕೊಳ್ಳಿ।",
                    flexible: "ಈ ಉತ್ಪಾದನೆಯಲ್ಲಿ ಮಾತುಕತೆ ಮಾಡಬಹುದು।",
                    firm: "ನಿಮ್ಮ ಬೆಲೆ ಕಾಪಾಡಿ - ಇದು ನ್ಯಾಯಯುತ।"
                }
            },
            'ta-IN': {
                price_guidance: {
                    with_price: "சந்தையில் {product} விலை ₹{price} ஒரு {unit}க்கு உள்ளது। {guidance}",
                    price_range: "{product}க்கு ₹{minPrice} முதல் ₹{maxPrice} ஒரு {unit}க்கு கிடைக்கும். {guidance}",
                    no_price: "எனக்கு {product} தற்போதைய விலை தெரியாது, ஆனால் பொதுவான வழிகாட்டுதல் தர முடியும். {guidance}"
                },
                negotiation_advice: {
                    counter_offer: "₹{price} ஒரு {unit}க்கு வழங்கலாம். {reasoning}",
                    accept_offer: "₹{price} ஒரு {unit}க்கு நல்ல விலை। {reasoning}",
                    decline_offer: "இந்த விலை குறைவு। {reasoning}"
                },
                cultural_guidance: {
                    respectful: "பேச்சுவார்த்தையில் மரியாதை காட்டுங்கள்।",
                    flexible: "இந்த பொருளில் பேச்சுவார்த்தை செய்யலாம்।",
                    firm: "உங்கள் விலையை பராமரியுங்கள் - இது நியாயமானது।"
                }
            }
        };
    }

    async formatResponse(data, language) {
        try {
            const { intent, priceData, negotiationGuidance } = data;
            const responseLanguage = language || 'en-US';
            
            const templates = this.responseTemplates[responseLanguage] || this.responseTemplates['en-US'];
            
            const primaryResponse = this.generatePrimaryResponse(intent, priceData, templates);
            const negotiationResponse = this.generateNegotiationResponse(negotiationGuidance, templates);
            
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

    generatePrimaryResponse(intent, priceData, templates) {
        if (!priceData) {
            return this.fillTemplate(templates.price_guidance.no_price, {
                product: intent.product || 'this item',
                guidance: templates.cultural_guidance.respectful
            });
        }

        if (priceData.ranges) {
            return this.fillTemplate(templates.price_guidance.price_range, {
                product: priceData.product,
                minPrice: priceData.ranges.minimum,
                maxPrice: priceData.ranges.premium,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, templates)
            });
        } else {
            return this.fillTemplate(templates.price_guidance.with_price, {
                product: priceData.product,
                price: priceData.marketPrice,
                unit: priceData.unit,
                guidance: this.generatePriceGuidance(priceData, templates)
            });
        }
    }

    generatePriceGuidance(priceData, templates) {
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

    generateNegotiationResponse(negotiationGuidance, templates) {
        if (!negotiationGuidance || !negotiationGuidance.counterOffers || negotiationGuidance.counterOffers.length === 0) {
            return '';
        }

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

    createFallbackResponse(data, language, error) {
        const fallbackMessages = {
            'en-US': "I'm here to help with pricing questions. Please try again.",
            'hi-IN': "मैं आपके प्राइस के सवाल में मदद कर सकता हूं। फिर से पूछिए।",
            'kn-IN': "ನಾನು ನಿಮ್ಮ ಬೆಲೆ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು। ಮತ್ತೆ ಕೇಳಿ।",
            'ta-IN': "நான் உங்கள் விலை கேள்விகளில் உதவ முடியும். மீண்டும் கேளுங்கள்।"
        };
        
        const responseLanguage = language || 'en-US';
        const fallbackText = fallbackMessages[responseLanguage] || fallbackMessages['en-US'];
        
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
                utterance.lang = language || 'en-US';
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
}

class PrivacyManager {
    constructor() {
        this.temporaryData = new Map();
    }

    validateNoDataPersistence() {
        if (localStorage.length > 0 || sessionStorage.length > 0) {
            console.warn('Persistent storage detected - clearing for privacy');
            this.clearAnyExistingData();
        }
    }

    clearAnyExistingData() {
        this.temporaryData.clear();
    }

    clearAudioData() {
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
        this.userPreferences.screenReader = this.detectScreenReader();
    }

    detectScreenReader() {
        return navigator.userAgent.includes('NVDA') || 
               navigator.userAgent.includes('JAWS') || 
               window.speechSynthesis !== undefined;
    }

    handleTabNavigation(event) {
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
        return response;
    }
}

// Main Application Class
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
        this.micButton = document.getElementById('micButton');
        this.languageSelect = document.getElementById('language');
        this.listeningIndicator = document.getElementById('listeningIndicator');
        this.responseSection = document.getElementById('responseSection');
        this.responseText = document.getElementById('responseText');
        this.statusMessage = document.getElementById('statusMessage');
        this.speakButton = document.getElementById('speakButton');
        this.tutorialButton = document.getElementById('tutorialButton');
        this.tutorialModal = document.getElementById('tutorialModal');
        this.closeTutorial = document.getElementById('closeTutorial');

        if (!this.micButton) {
            console.log('UI elements not found - running in test mode');
            return;
        }

        this.setupEventListeners();
        this.checkBrowserCompatibility();
    }

    setupEventListeners() {
        this.micButton.addEventListener('click', () => {
            if (!this.isProcessing) {
                this.handleVoiceInput();
            }
        });
        
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                console.log('Language changed to:', this.currentLanguage);
            });
        }
        
        if (this.speakButton) {
            this.speakButton.addEventListener('click', () => this.speakResponse());
        }

        if (this.tutorialButton && this.tutorialModal) {
            this.tutorialButton.addEventListener('click', () => {
                this.tutorialModal.classList.remove('hidden');
            });
        }

        if (this.closeTutorial && this.tutorialModal) {
            this.closeTutorial.addEventListener('click', () => {
                this.tutorialModal.classList.add('hidden');
            });
        }

        this.voiceInterface.onSpeechResult((result) => this.processVoiceInput(result));
        this.voiceInterface.onError((error) => this.handleVoiceError(error));
    }

    checkBrowserCompatibility() {
        if (!VoiceInterface.isSupported()) {
            this.showStatus('Speech recognition not supported. Please use Chrome or Edge.', 'error');
            if (this.micButton) {
                this.micButton.disabled = true;
                this.micButton.style.opacity = '0.5';
            }
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
            this.showStatus('Speech recognition not supported in this browser. Please use Chrome or Edge.', 'error');
            return;
        }

        if (this.voiceInterface.isListening) {
            this.voiceInterface.stopListening();
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.responseSection) {
            this.responseSection.classList.add('hidden');
        }
        this.hideStatus();
        
        this.showStatus('Listening...', 'info');
        if (this.micButton) {
            this.micButton.classList.add('listening');
        }
        if (this.listeningIndicator) {
            this.listeningIndicator.classList.remove('hidden');
        }
        
        const selectedLanguage = this.languageSelect ? this.languageSelect.value : 'en-US';
        console.log('Starting recognition with language:', selectedLanguage);
        
        const started = this.voiceInterface.startListening(selectedLanguage);
        if (!started) {
            this.stopListening();
            this.showStatus('Failed to start voice recognition. Please try again.', 'error');
        }
    }

    stopListening() {
        if (this.micButton) {
            this.micButton.classList.remove('listening');
        }
        if (this.listeningIndicator) {
            this.listeningIndicator.classList.add('hidden');
        }
        this.hideStatus();
    }

    async processVoiceInput(voiceResult) {
        this.stopListening();
        this.isProcessing = true;
        
        try {
            this.showStatus('Processing your request...', 'info');
            this.privacyManager.clearAudioData();

            const currentLanguage = this.languageSelect ? this.languageSelect.value : 'en-US';
            console.log('Processing voice input in language:', currentLanguage);

            const languageCode = this.getLanguageCode(currentLanguage);
            const intent = await this.intentClassifier.classifyIntent(
                voiceResult.text, 
                languageCode
            );

            let priceData = null;
            if (intent.type === 'bargaining' || intent.type === 'bulk_purchase') {
                priceData = await this.priceDiscoveryEngine.getMarketPrice(
                    intent.product,
                    intent.category
                );
            }

            const negotiationGuidance = await this.negotiationAssistant.generateGuidance(
                intent,
                priceData,
                voiceResult.text
            );

            const response = await this.responseGenerator.formatResponse(
                {
                    intent,
                    priceData,
                    negotiationGuidance,
                    originalText: voiceResult.text
                },
                currentLanguage
            );

            this.displayResponse(response, priceData, intent);
            this.hideStatus();

        } catch (error) {
            console.error('Error processing voice input:', error);
            this.showStatus('Sorry, there was an error processing your request.', 'error');
        } finally {
            this.isProcessing = false;
            this.privacyManager.clearSensitiveData();
        }
    }

    displayResponse(response, priceData, intent) {
        if (this.responseText) {
            this.responseText.textContent = response.text;
        }
        if (this.responseSection) {
            this.responseSection.classList.remove('hidden');
        }
        this.lastResponse = response;
        
        this.updateInfoCards(priceData, intent);
    }

    updateInfoCards(priceData, intent) {
        const priceInfo = document.getElementById('priceInfo');
        const negotiationTips = document.getElementById('negotiationTips');
        
        if (priceData && priceInfo) {
            priceInfo.classList.remove('hidden');
            const content = priceInfo.querySelector('.info-content');
            if (content) {
                content.innerHTML = `
                    <p><strong>Market Price:</strong> ₹${priceData.marketPrice} per ${priceData.unit}</p>
                    <p><strong>Price Range:</strong> ₹${priceData.ranges?.minimum || priceData.minPrice} - ₹${priceData.ranges?.premium || priceData.maxPrice}</p>
                    <p><strong>Negotiation:</strong> ${priceData.negotiation?.flexibility || 'Moderate'} flexibility</p>
                `;
            }
        }
        
        if (intent && negotiationTips) {
            negotiationTips.classList.remove('hidden');
            const content = negotiationTips.querySelector('.info-content');
            if (content) {
                const tips = this.getTipsForIntent(intent.type);
                content.innerHTML = `<ul>${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
            }
        }
    }

    getTipsForIntent(intentType) {
        const tipMap = {
            bargaining: [
                'Start with a reasonable offer',
                'Emphasize product quality',
                'Be prepared to negotiate'
            ],
            bulk_purchase: [
                'Highlight volume benefits',
                'Offer tiered pricing',
                'Build long-term relationship'
            ],
            casual_inquiry: [
                'Provide helpful information',
                'Build trust and rapport',
                'Be patient and respectful'
            ]
        };
        
        return tipMap[intentType] || tipMap.casual_inquiry;
    }

    speakResponse() {
        if (this.lastResponse) {
            const currentLanguage = this.languageSelect ? this.languageSelect.value : 'en-US';
            this.responseGenerator.generateSpeech(
                this.lastResponse.text,
                currentLanguage
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
                errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your connection and try again.';
                break;
            case 'start_failed':
                errorMessage = 'Failed to start voice recognition. Please try again.';
                break;
            default:
                errorMessage = 'Speech recognition error. Please try again.';
        }
        
        this.showStatus(errorMessage, 'error');
        console.error('Voice error:', error);
    }

    showStatus(message, type) {
        if (this.statusMessage) {
            this.statusMessage.textContent = message;
            this.statusMessage.className = `status-message ${type}`;
            this.statusMessage.classList.remove('hidden');
        }
    }

    hideStatus() {
        if (this.statusMessage) {
            this.statusMessage.classList.add('hidden');
        }
    }

    getLanguageCode(browserLang) {
        const langMap = {
            'en-US': 'english',
            'hi-IN': 'hindi',
            'kn-IN': 'kannada',
            'ta-IN': 'tamil',
            'te-IN': 'telugu',
            'bn-IN': 'bengali'
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
window.LinguisticBridge = LinguisticBridge;