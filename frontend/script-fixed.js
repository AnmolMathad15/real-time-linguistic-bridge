// Component Classes

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
        
        // Configure recognition settings
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        // Event handlers
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
        // Deterministic keyword patterns for intent classification
        this.intentPatterns = {
            bargaining: {
                english: ['price', 'cost', 'rate', 'cheap', 'expensive', 'discount', 'deal', 'negotiate', 'lower', 'reduce'],
                hindi: ['daam', 'kimat', 'rate', 'sasta', 'mehnga', 'kam', 'zyada', 'mol', 'bhav', 'chhoot'],
                kannada: ['bele', 'rate', 'olleya', 'ketta', 'kammi', 'jaasti', 'vyavasthe', 'mol'],
                tamil: ['vilai', 'rate', 'kuraiva', 'adhiga', 'mol', 'pechu', 'kammi'],
                telugu: ['rate', 'vila', 'takkuva', 'ekkuva', 'mol', 'matalu', 'kammi'],
                bengali: ['dam', 'rate', 'kom', 'beshi', 'mol', 'katha', 'chhad'],
                marathi: ['bhav', 'rate', 'kami', 'jasta', 'mol', 'bolu', 'kam'],
                gujarati: ['bhav', 'rate', 'ochhu', 'vadhare', 'mol', 'vaat', 'kam'],
                punjabi: ['bhaav', 'rate', 'ghat', 'zyada', 'mol', 'gall', 'kam'],
                odia: ['dam', 'rate', 'kam', 'beshi', 'mol', 'katha', 'ghata'],
                malayalam: ['vila', 'rate', 'kurav', 'kooduthal', 'mol', 'samsaram', 'kurakuka'],
                assamese: ['dam', 'rate', 'kom', 'beshi', 'mol', 'kotha', 'kam'],
                urdu: ['qeemat', 'rate', 'kam', 'zyada', 'mol', 'baat', 'ghata']
            },
            bulk_purchase: {
                english: ['bulk', 'wholesale', 'quantity', 'lots', 'many', 'kilos', 'tons', 'boxes', 'sacks'],
                hindi: ['thok', 'bada', 'quantity', 'zyada', 'kilo', 'ton', 'bori', 'dabba'],
                kannada: ['thumba', 'dodda', 'quantity', 'jaasti', 'kilo', 'ton', 'gunny', 'box'],
                tamil: ['periya', 'adhiga', 'quantity', 'kilo', 'ton', 'pai', 'petti'],
                telugu: ['pedda', 'ekkuva', 'quantity', 'kilo', 'ton', 'gunny', 'box'],
                bengali: ['boro', 'beshi', 'quantity', 'kilo', 'ton', 'bosta', 'box'],
                marathi: ['motha', 'jasta', 'quantity', 'kilo', 'ton', 'pishvi', 'box'],
                gujarati: ['motu', 'vadhare', 'quantity', 'kilo', 'ton', 'bori', 'box'],
                punjabi: ['vadda', 'zyada', 'quantity', 'kilo', 'ton', 'bori', 'dabba'],
                odia: ['bada', 'beshi', 'quantity', 'kilo', 'ton', 'bosta', 'box'],
                malayalam: ['valiya', 'kooduthal', 'quantity', 'kilo', 'ton', 'choru', 'box'],
                assamese: ['boro', 'beshi', 'quantity', 'kilo', 'ton', 'bosta', 'box'],
                urdu: ['bara', 'zyada', 'quantity', 'kilo', 'ton', 'bori', 'dabba']
            },
            casual_inquiry: {
                english: ['what', 'how', 'tell', 'know', 'information', 'help', 'available', 'have'],
                hindi: ['kya', 'kaise', 'batao', 'pata', 'jaankari', 'madad', 'milta', 'hai'],
                kannada: ['yenu', 'hege', 'heli', 'gottide', 'mahiti', 'sahaya', 'sigutta', 'ide'],
                tamil: ['enna', 'eppadi', 'sollu', 'theriyum', 'vishayam', 'uthavi', 'kidaikum', 'irukku'],
                telugu: ['enti', 'ela', 'cheppu', 'teliyali', 'vishayam', 'sahayam', 'dorukutundi', 'undi'],
                bengali: ['ki', 'kivabe', 'bolo', 'jani', 'tothyo', 'sahajyo', 'pawa', 'ache'],
                marathi: ['kay', 'kase', 'sanga', 'mahit', 'mahiti', 'madad', 'milte', 'aahe'],
                gujarati: ['shu', 'kevi', 'kaho', 'khabar', 'mahiti', 'madad', 'male', 'chhe'],
                punjabi: ['ki', 'kiven', 'dasso', 'pata', 'jaankari', 'madad', 'milda', 'hai'],
                odia: ['kana', 'kemiti', 'kaha', 'jana', 'tathya', 'sahajya', 'mile', 'achhi'],
                malayalam: ['enthu', 'engane', 'parayuka', 'ariyam', 'visheshangal', 'sahayam', 'kittum', 'undu'],
                assamese: ['ki', 'kene', 'kowa', 'janu', 'tothyo', 'sahajyo', 'pabo', 'ase'],
                urdu: ['kya', 'kaise', 'batao', 'maloom', 'malumat', 'madad', 'milta', 'hai']
            }
        };

        // Product patterns for different languages
        this.productPatterns = {
            vegetables: {
                english: ['onion', 'potato', 'tomato', 'carrot', 'cabbage', 'spinach', 'cauliflower', 'peas', 'beans', 'brinjal', 'okra', 'cucumber', 'radish', 'beetroot'],
                hindi: ['pyaaz', 'aloo', 'tamatar', 'gajar', 'patta', 'palak', 'gobi', 'matar', 'sem', 'baingan', 'bhindi', 'kheera', 'mooli', 'chukandar'],
                kannada: ['eerulli', 'aalugadde', 'tomato', 'carrot', 'kosu', 'palak', 'hookosu', 'batani', 'beans', 'badane', 'bende', 'southe', 'mullangi', 'beetroot'],
                tamil: ['vengayam', 'urulaikizhangu', 'thakkali', 'carrot', 'muttaikose', 'pasalai', 'cauliflower', 'pattani', 'beans', 'kathiri', 'vendai', 'vellarikkai', 'mullangi', 'beetroot'],
                telugu: ['ullipaya', 'bangaladumpa', 'tomato', 'carrot', 'kosu', 'palakura', 'cauliflower', 'batani', 'beans', 'vankaya', 'benda', 'dosakai', 'mullangi', 'beetroot'],
                bengali: ['peyaj', 'aloo', 'tomato', 'gajar', 'bandhakopi', 'palang', 'phulkopi', 'motor', 'beans', 'begun', 'dherosh', 'shosha', 'mulo', 'beetroot'],
                marathi: ['kanda', 'batata', 'tomato', 'gajar', 'kobi', 'palak', 'phulkobi', 'vatana', 'beans', 'wangi', 'bhendi', 'kakdi', 'mula', 'beetroot'],
                gujarati: ['dungri', 'bataka', 'tameta', 'gajar', 'kobi', 'palak', 'phulkobi', 'vatana', 'beans', 'ringan', 'bhinda', 'kakdi', 'mula', 'beetroot'],
                punjabi: ['piyaz', 'aloo', 'tamatar', 'gajar', 'kobi', 'palak', 'gobi', 'matar', 'beans', 'baingan', 'bhindi', 'kheera', 'mooli', 'chukandar'],
                odia: ['piyaja', 'aloo', 'tamato', 'gajara', 'kobi', 'palanga', 'phulkobi', 'matara', 'beans', 'baigana', 'bhendi', 'kakharu', 'mula', 'beetroot'],
                malayalam: ['ulli', 'urulakizhangu', 'thakkali', 'carrot', 'muttakose', 'cheera', 'cauliflower', 'pattani', 'beans', 'vazhuthananga', 'vendakka', 'vellarikka', 'mullangi', 'beetroot'],
                assamese: ['piyaj', 'aloo', 'bilahi', 'gajor', 'kobi', 'paleng', 'phulkobi', 'motor', 'beans', 'baingan', 'bhindi', 'tiya', 'mula', 'beetroot'],
                urdu: ['pyaz', 'aloo', 'tamatar', 'gajar', 'kobi', 'palak', 'gobi', 'matar', 'beans', 'baingan', 'bhindi', 'kheera', 'mooli', 'chukandar']
            },
            fruits: {
                english: ['apple', 'banana', 'orange', 'mango', 'grapes', 'pomegranate', 'papaya', 'guava', 'pineapple', 'watermelon', 'melon', 'lemon', 'lime'],
                hindi: ['seb', 'kela', 'santra', 'aam', 'angoor', 'anar', 'papita', 'amrood', 'ananas', 'tarbooz', 'kharbuja', 'nimbu', 'kagzi'],
                kannada: ['sebu', 'balehannu', 'kittale', 'maavu', 'drakshi', 'daalimbe', 'papaya', 'seebe', 'ananas', 'kallangadi', 'kharbuja', 'nimbe', 'lime'],
                tamil: ['apple', 'vazhai', 'orange', 'manga', 'thiratchai', 'mathulai', 'papali', 'koyya', 'ananas', 'tharboosani', 'melon', 'elumichai', 'lime'],
                telugu: ['apple', 'arati', 'orange', 'mamidi', 'draksha', 'danimma', 'boppayi', 'jama', 'ananas', 'puchakaya', 'melon', 'nimma', 'lime'],
                bengali: ['apple', 'kola', 'komola', 'aam', 'angur', 'dalim', 'pepe', 'peyara', 'anaras', 'tormuj', 'kharmuj', 'lebu', 'lime'],
                marathi: ['apple', 'kela', 'santra', 'amba', 'draksh', 'dalimb', 'papai', 'peru', 'ananas', 'kalingar', 'kharbuj', 'limbu', 'lime'],
                gujarati: ['apple', 'kela', 'santra', 'keri', 'draksh', 'dadam', 'papaya', 'jamphal', 'ananas', 'tarbuj', 'kharbuja', 'limbu', 'lime'],
                punjabi: ['apple', 'kela', 'santra', 'aam', 'angoor', 'anar', 'papita', 'amrood', 'ananas', 'tarbooz', 'kharbuja', 'nimbu', 'lime'],
                odia: ['apple', 'kadali', 'komola', 'amba', 'angura', 'dalimba', 'amrita', 'pijuli', 'sapuri', 'tarbuja', 'khira', 'lembu', 'lime'],
                malayalam: ['apple', 'pazham', 'orange', 'manga', 'munthiri', 'mathalam', 'papaya', 'pera', 'kayithachakka', 'tharboosam', 'melon', 'cherunaranga', 'lime'],
                assamese: ['apple', 'kol', 'komola', 'aam', 'angur', 'dalim', 'amita', 'madhuri', 'anaras', 'tormuj', 'khormuj', 'tenga', 'lime'],
                urdu: ['seb', 'kela', 'santra', 'aam', 'angoor', 'anar', 'papita', 'amrood', 'ananas', 'tarbooz', 'kharbuja', 'nimbu', 'lime']
            },
            grains: {
                english: ['rice', 'wheat', 'barley', 'corn', 'millet', 'oats', 'quinoa', 'lentils', 'chickpeas', 'beans', 'peas'],
                hindi: ['chawal', 'gehun', 'jau', 'makka', 'bajra', 'jai', 'quinoa', 'dal', 'chana', 'rajma', 'matar'],
                kannada: ['akki', 'godhi', 'barley', 'musukina', 'sajje', 'oats', 'quinoa', 'bele', 'kadale', 'beans', 'batani'],
                tamil: ['arisi', 'godhumai', 'barley', 'cholam', 'kambu', 'oats', 'quinoa', 'paruppu', 'kadala', 'beans', 'pattani'],
                telugu: ['biyyam', 'godhumalu', 'barley', 'mokka', 'sajjalu', 'oats', 'quinoa', 'pappu', 'sanagalu', 'beans', 'batani'],
                bengali: ['chal', 'gom', 'barley', 'bhutta', 'bajra', 'oats', 'quinoa', 'dal', 'chola', 'beans', 'motor'],
                marathi: ['tandul', 'gahu', 'barley', 'makka', 'bajri', 'oats', 'quinoa', 'dal', 'harbara', 'beans', 'vatana'],
                gujarati: ['chaval', 'ghau', 'barley', 'makkai', 'bajri', 'oats', 'quinoa', 'dal', 'chana', 'beans', 'vatana'],
                punjabi: ['chawal', 'kanak', 'barley', 'makki', 'bajra', 'oats', 'quinoa', 'dal', 'chana', 'beans', 'matar'],
                odia: ['chaula', 'gahama', 'barley', 'makka', 'bajra', 'oats', 'quinoa', 'dali', 'chanaa', 'beans', 'matara'],
                malayalam: ['ari', 'gothambu', 'barley', 'cholam', 'kambam', 'oats', 'quinoa', 'parippu', 'kadala', 'beans', 'pattani'],
                assamese: ['bhat', 'ghom', 'barley', 'bhutta', 'bajra', 'oats', 'quinoa', 'dal', 'boot', 'beans', 'motor'],
                urdu: ['chawal', 'gandum', 'barley', 'makka', 'bajra', 'oats', 'quinoa', 'dal', 'chana', 'beans', 'matar']
            }
        };
    }

    async classifyIntent(text, language = 'english') {
        const normalizedText = text.toLowerCase();
        const words = normalizedText.split(/\s+/);
        
        // Score each intent type
        const scores = {
            bargaining: this.calculateIntentScore(words, 'bargaining', language),
            bulk_purchase: this.calculateIntentScore(words, 'bulk_purchase', language),
            casual_inquiry: this.calculateIntentScore(words, 'casual_inquiry', language)
        };
        
        // Find the highest scoring intent
        const maxScore = Math.max(...Object.values(scores));
        const detectedIntent = Object.keys(scores).find(key => scores[key] === maxScore);
        
        // Extract product information
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
        // Check all product categories
        for (const category of Object.keys(this.productPatterns)) {
            const products = this.productPatterns[category][language] || [];
            for (const product of products) {
                if (words.some(word => word.includes(product) || product.includes(word))) {
                    return product;
                }
            }
        }
        
        // If no specific product found, try to extract from common patterns
        const productIndicators = ['for', 'of', 'about', 'regarding'];
        for (let i = 0; i < words.length - 1; i++) {
            if (productIndicators.includes(words[i])) {
                return words[i + 1];
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
        // Predefined phrase templates for common trade terms
        this.tradeTerms = {
            hindi: {
                'what is the price': 'kya daam hai',
                'how much': 'kitna',
                'too expensive': 'bahut mehnga',
                'good price': 'accha daam',
                'discount': 'chhoot',
                'bulk order': 'thok mein',
                'quality': 'quality',
                'fresh': 'taza'
            },
            kannada: {
                'what is the price': 'bele eshtu',
                'how much': 'eshtu',
                'too expensive': 'thumba jaasti',
                'good price': 'olleya bele',
                'discount': 'kammi',
                'bulk order': 'thumba quantity',
                'quality': 'quality',
                'fresh': 'hosa'
            },
            tamil: {
                'what is the price': 'vilai enna',
                'how much': 'evvalavu',
                'too expensive': 'romba jaasti',
                'good price': 'nalla vilai',
                'discount': 'kurav',
                'bulk order': 'periya quantity',
                'quality': 'quality',
                'fresh': 'puthusu'
            },
            telugu: {
                'what is the price': 'rate enti',
                'how much': 'entha',
                'too expensive': 'chaala ekkuva',
                'good price': 'manchidi',
                'discount': 'takkuva',
                'bulk order': 'ekkuva quantity',
                'quality': 'quality',
                'fresh': 'kotha'
            },
            bengali: {
                'what is the price': 'dam koto',
                'how much': 'koto',
                'too expensive': 'khub beshi',
                'good price': 'bhalo dam',
                'discount': 'kom',
                'bulk order': 'beshi quantity',
                'quality': 'quality',
                'fresh': 'taja'
            },
            marathi: {
                'what is the price': 'bhav kay',
                'how much': 'kiti',
                'too expensive': 'khup jasta',
                'good price': 'changla bhav',
                'discount': 'kami',
                'bulk order': 'jasta quantity',
                'quality': 'quality',
                'fresh': 'taja'
            },
            gujarati: {
                'what is the price': 'bhav shu che',
                'how much': 'ketlu',
                'too expensive': 'khub vadhare',
                'good price': 'saras bhav',
                'discount': 'ochhu',
                'bulk order': 'vadhare quantity',
                'quality': 'quality',
                'fresh': 'taju'
            },
            punjabi: {
                'what is the price': 'bhaav ki hai',
                'how much': 'kinna',
                'too expensive': 'bahut zyada',
                'good price': 'changa bhaav',
                'discount': 'ghat',
                'bulk order': 'zyada quantity',
                'quality': 'quality',
                'fresh': 'taja'
            },
            odia: {
                'what is the price': 'dam kete',
                'how much': 'kete',
                'too expensive': 'bahut beshi',
                'good price': 'bhala dam',
                'discount': 'kam',
                'bulk order': 'beshi quantity',
                'quality': 'quality',
                'fresh': 'nua'
            },
            malayalam: {
                'what is the price': 'vila enthaanu',
                'how much': 'ethra',
                'too expensive': 'kooduthal',
                'good price': 'nalla vila',
                'discount': 'kurav',
                'bulk order': 'kooduthal quantity',
                'quality': 'quality',
                'fresh': 'puthusu'
            },
            assamese: {
                'what is the price': 'dam kiman',
                'how much': 'kiman',
                'too expensive': 'bahut beshi',
                'good price': 'bhal dam',
                'discount': 'kom',
                'bulk order': 'beshi quantity',
                'quality': 'quality',
                'fresh': 'notun'
            },
            urdu: {
                'what is the price': 'qeemat kya hai',
                'how much': 'kitna',
                'too expensive': 'bahut zyada',
                'good price': 'acchi qeemat',
                'discount': 'kam',
                'bulk order': 'zyada quantity',
                'quality': 'quality',
                'fresh': 'taza'
            }
        };
    }

    async translate(text, fromLanguage, toLanguage, intent = null) {
        // For now, implement basic template-based translation
        // In a real implementation, this would use a translation API
        
        const normalizedText = text.toLowerCase().trim();
        
        // Check if we have a direct template match
        if (toLanguage === 'english' && this.tradeTerms[fromLanguage]) {
            const terms = this.tradeTerms[fromLanguage];
            for (const [english, foreign] of Object.entries(terms)) {
                if (normalizedText.includes(foreign)) {
                    return text.replace(new RegExp(foreign, 'gi'), english);
                }
            }
        }
        
        // Reverse translation (English to other languages)
        if (fromLanguage === 'english' && this.tradeTerms[toLanguage]) {
            const terms = this.tradeTerms[toLanguage];
            for (const [english, foreign] of Object.entries(terms)) {
                if (normalizedText.includes(english.toLowerCase())) {
                    return text.replace(new RegExp(english, 'gi'), foreign);
                }
            }
        }
        
        // If no template match, return original text
        // In a real implementation, this would call a translation service
        return text;
    }

    // Helper method to detect language from text
    detectLanguage(text) {
        const normalizedText = text.toLowerCase();
        
        // Simple language detection based on common words
        const languageIndicators = {
            hindi: ['hai', 'ka', 'ki', 'ke', 'mein', 'se', 'ko', 'aur'],
            kannada: ['ide', 'alli', 'ge', 'nalli', 'inda', 'mattu', 'aadre'],
            tamil: ['irukku', 'la', 'ku', 'um', 'oda', 'nu', 'nga'],
            telugu: ['undi', 'lo', 'ki', 'tho', 'kuda', 'ani', 'ga'],
            bengali: ['ache', 'er', 'te', 'ke', 'ar', 'o', 'ta'],
            marathi: ['aahe', 'la', 'chi', 'cha', 'che', 'ani', 'te'],
            gujarati: ['chhe', 'na', 'ma', 'ne', 'thi', 'ane', 'te'],
            punjabi: ['hai', 'da', 'di', 'de', 'ch', 'te', 'nu'],
            odia: ['achhi', 'ra', 're', 'ku', 'ru', 'o', 'ta'],
            malayalam: ['undu', 'nte', 'il', 'ude', 'um', 'anu', 'aanu'],
            assamese: ['ase', 'r', 't', 'k', 'aru', 'o', 'ta'],
            urdu: ['hai', 'ka', 'ki', 'ke', 'mein', 'se', 'aur']
        };
        
        let maxMatches = 0;
        let detectedLanguage = 'english';
        
        for (const [language, indicators] of Object.entries(languageIndicators)) {
            const matches = indicators.filter(indicator => 
                normalizedText.includes(indicator)
            ).length;
            
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedLanguage = language;
            }
        }
        
        return detectedLanguage;
    }
}

class PriceDiscoveryEngine {
    constructor() {
        this.priceData = {};
        this.fallbackPrices = {
            vegetables: { min: 20, avg: 40, max: 80, unit: 'kg' },
            fruits: { min: 30, avg: 60, max: 120, unit: 'kg' },
            grains: { min: 40, avg: 80, max: 150, unit: 'kg' },
            general: { min: 25, avg: 50, max: 100, unit: 'kg' }
        };
    }

    loadPriceData(data) {
        this.priceData = data;
        console.log('Price data loaded:', Object.keys(data).length, 'items');
    }

    async getMarketPrice(product, category = 'general') {
        // First try to find exact product match
        let priceInfo = this.findExactMatch(product);
        
        // If not found, try category-based pricing
        if (!priceInfo) {
            priceInfo = this.getCategoryPricing(category);
        }
        
        // Add market intelligence
        priceInfo = this.addMarketIntelligence(priceInfo, product, category);
        
        return priceInfo;
    }

    findExactMatch(product) {
        const normalizedProduct = product.toLowerCase();
        
        // Check direct matches
        if (this.priceData[normalizedProduct]) {
            return { ...this.priceData[normalizedProduct] };
        }
        
        // Check partial matches
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
        
        // Add seasonal adjustments
        priceInfo.seasonal = this.getSeasonalAdjustments(category);
        
        // Add quality grades
        priceInfo.quality = this.getQualityGrades(category);
        
        // Add bulk pricing
        priceInfo.bulk = this.getBulkPricing(priceInfo);
        
        // Add negotiation flexibility
        priceInfo.negotiation = this.getNegotiationFlexibility(priceInfo, category);
        
        // Add market trends
        priceInfo.trends = this.getMarketTrends(category);
        
        return priceInfo;
    }

    getSeasonalAdjustments(category) {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        
        const seasonalData = {
            vegetables: {
                peak: { months: [10, 11, 12, 1, 2], priceMultiplier: 0.8 },
                low: { months: [6, 7, 8], priceMultiplier: 1.3 }
            },
            fruits: {
                peak: { months: [3, 4, 5, 6], priceMultiplier: 0.7 },
                low: { months: [11, 12, 1], priceMultiplier: 1.4 }
            },
            grains: {
                peak: { months: [11, 12, 1, 2], priceMultiplier: 0.9 },
                low: { months: [6, 7, 8], priceMultiplier: 1.1 }
            }
        };
        
        return seasonalData[category] || null;
    }

    getQualityGrades(category) {
        const qualityGrades = {
            vegetables: ['Premium', 'Grade A', 'Grade B', 'Standard'],
            fruits: ['Export Quality', 'Premium', 'Grade A', 'Standard'],
            grains: ['Premium', 'Grade A', 'Grade B', 'Commercial']
        };
        
        return qualityGrades[category] || ['Standard', 'Good', 'Premium'];
    }

    getBulkPricing(priceInfo) {
        const basePrice = priceInfo.marketPrice || priceInfo.minPrice || 50;
        
        return {
            thresholds: [
                { quantity: 10, discount: 0.05, price: Math.round(basePrice * 0.95) },
                { quantity: 25, discount: 0.10, price: Math.round(basePrice * 0.90) },
                { quantity: 50, discount: 0.15, price: Math.round(basePrice * 0.85) },
                { quantity: 100, discount: 0.20, price: Math.round(basePrice * 0.80) }
            ],
            unit: priceInfo.unit || 'kg'
        };
    }

    getNegotiationFlexibility(priceInfo, category) {
        const basePrice = priceInfo.marketPrice || priceInfo.minPrice || 50;
        
        // Determine flexibility based on category and price range
        let flexibility = 'moderate';
        if (category === 'vegetables') flexibility = 'high';
        else if (category === 'grains') flexibility = 'low';
        
        return {
            flexibility: flexibility,
            negotiableRange: {
                min: Math.round(basePrice * 0.85),
                max: Math.round(basePrice * 1.15)
            },
            factors: this.getNegotiationFactors(category)
        };
    }

    getNegotiationFactors(category) {
        const factors = {
            vegetables: ['freshness', 'quantity', 'regular_customer', 'end_of_day'],
            fruits: ['ripeness', 'quantity', 'season', 'quality_grade'],
            grains: ['storage_quality', 'quantity', 'market_rates', 'payment_terms'],
            general: ['quantity', 'quality', 'market_conditions', 'customer_relationship']
        };
        
        return factors[category] || factors.general;
    }

    getMarketTrends(category) {
        // Simulate market trends (in real implementation, this would come from market data)
        const trends = ['stable', 'rising', 'falling'];
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        
        return {
            current: randomTrend,
            confidence: 0.7,
            factors: this.getTrendFactors(category, randomTrend)
        };
    }

    getTrendFactors(category, trend) {
        const trendFactors = {
            rising: ['increased_demand', 'supply_shortage', 'seasonal_factors'],
            falling: ['oversupply', 'reduced_demand', 'competition'],
            stable: ['balanced_supply_demand', 'normal_season', 'steady_market']
        };
        
        return trendFactors[trend] || trendFactors.stable;
    }

    // Helper method to get price ranges for display
    getPriceRanges(priceInfo) {
        if (!priceInfo) return null;
        
        const base = priceInfo.marketPrice || priceInfo.minPrice || 50;
        
        return {
            minimum: Math.round(base * 0.8),
            average: base,
            premium: Math.round(base * 1.2),
            unit: priceInfo.unit || 'kg'
        };
    }
}

class NegotiationAssistant {
    constructor() {
        // Negotiation strategies based on intent and market conditions
        this.strategies = {
            bargaining: {
                high_confidence: ['emphasize_quality', 'show_market_rates', 'offer_bulk_discount'],
                medium_confidence: ['be_flexible', 'find_middle_ground', 'add_value'],
                low_confidence: ['listen_carefully', 'ask_questions', 'build_rapport']
            },
            bulk_purchase: {
                high_confidence: ['offer_tiered_pricing', 'emphasize_savings', 'provide_guarantees'],
                medium_confidence: ['negotiate_terms', 'flexible_payment', 'quality_assurance'],
                low_confidence: ['understand_needs', 'build_trust', 'start_small']
            },
            casual_inquiry: {
                high_confidence: ['provide_information', 'educate_customer', 'build_relationship'],
                medium_confidence: ['answer_questions', 'show_options', 'be_helpful'],
                low_confidence: ['listen_actively', 'gather_information', 'be_patient']
            }
        };

        // Cultural factors for different regions
        this.culturalFactors = {
            hindi: ['respect_for_elders', 'relationship_building', 'patience_in_negotiation'],
            kannada: ['local_customs', 'community_respect', 'fair_dealing'],
            tamil: ['traditional_values', 'mutual_respect', 'long_term_relationships'],
            telugu: ['hospitality', 'trust_building', 'family_oriented_approach'],
            bengali: ['cultural_sensitivity', 'intellectual_discussion', 'artistic_appreciation'],
            marathi: ['business_acumen', 'practical_approach', 'community_values'],
            gujarati: ['business_mindset', 'value_for_money', 'entrepreneurial_spirit'],
            punjabi: ['warmth', 'generosity', 'straightforward_communication'],
            odia: ['traditional_values', 'respect_for_culture', 'patient_approach'],
            malayalam: ['education_respect', 'quality_consciousness', 'fair_pricing'],
            assamese: ['cultural_pride', 'traditional_values', 'respectful_communication'],
            urdu: ['poetic_communication', 'respect_for_tradition', 'courteous_approach']
        };
    }

    async generateGuidance(intent, priceData, originalText) {
        try {
            // Analyze customer intent and context
            const customerAnalysis = this.analyzeCustomer(intent, originalText);
            
            // Generate counter-offer suggestions
            const counterOffers = this.generateCounterOffers(intent, priceData, customerAnalysis);
            
            // Suggest negotiation tactics
            const tactics = this.suggestTactics(intent, priceData, customerAnalysis);
            
            // Generate value propositions
            const valuePropositions = this.generateValuePropositions(intent, priceData);
            
            // Provide decision guidance
            const decisions = this.generateDecisionGuidance(intent, priceData, customerAnalysis);
            
            // Add cultural context
            const culturalContext = this.getCulturalContext(intent);
            
            return {
                customerAnalysis,
                counterOffers,
                tactics,
                valuePropositions,
                decisions,
                culturalContext,
                confidence: this.calculateConfidence(intent, priceData),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating negotiation guidance:', error);
            return this.createFallbackGuidance(intent);
        }
    }

    analyzeCustomer(intent, originalText) {
        const analysis = {
            priceAwareness: 'moderate',
            urgency: 'normal',
            flexibility: 'moderate',
            signals: []
        };

        // Analyze price awareness
        const priceKeywords = ['expensive', 'cheap', 'rate', 'price', 'cost'];
        if (priceKeywords.some(keyword => originalText.toLowerCase().includes(keyword))) {
            analysis.priceAwareness = 'high';
            analysis.signals.push('price_conscious');
        }

        // Analyze urgency
        const urgencyKeywords = ['urgent', 'quickly', 'immediately', 'now', 'today'];
        if (urgencyKeywords.some(keyword => originalText.toLowerCase().includes(keyword))) {
            analysis.urgency = 'high';
            analysis.signals.push('time_sensitive');
        }

        // Analyze flexibility
        if (intent.type === 'bulk_purchase') {
            analysis.flexibility = 'high';
            analysis.signals.push('bulk_buyer');
        } else if (intent.type === 'bargaining') {
            analysis.flexibility = 'moderate';
            analysis.signals.push('negotiator');
        }

        return analysis;
    }

    generateCounterOffers(intent, priceData, customerAnalysis) {
        if (!priceData || !priceData.marketPrice) {
            return [{
                level: 'standard',
                price: null,
                message: 'Let me check the current market price for you',
                reasoning: ['Price data not available'],
                recommended: true
            }];
        }

        const basePrice = priceData.marketPrice;
        const offers = [];

        // Generate different offer levels based on customer analysis
        if (customerAnalysis.priceAwareness === 'high') {
            // Price-conscious customer - offer competitive pricing
            offers.push({
                level: 'competitive',
                price: Math.round(basePrice * 0.95),
                message: `Special price for you: ₹${Math.round(basePrice * 0.95)} per ${priceData.unit}`,
                reasoning: ['Customer is price-aware', 'Competitive positioning'],
                recommended: true
            });
        }

        if (intent.type === 'bulk_purchase') {
            // Bulk purchase - offer volume discounts
            const bulkPrice = Math.round(basePrice * 0.85);
            offers.push({
                level: 'bulk',
                price: bulkPrice,
                message: `Bulk pricing available: ₹${bulkPrice} per ${priceData.unit}`,
                reasoning: ['Volume discount applicable', 'Bulk purchase intent'],
                recommended: intent.type === 'bulk_purchase'
            });
        }

        // Standard offer
        offers.push({
            level: 'standard',
            price: basePrice,
            message: `Current market rate: ₹${basePrice} per ${priceData.unit}`,
            reasoning: ['Standard market pricing', 'Fair market value'],
            recommended: offers.length === 0
        });

        return offers;
    }

    suggestTactics(intent, priceData, customerAnalysis) {
        const confidence = intent.confidence || 0.5;
        const intentType = intent.type || 'casual_inquiry';
        
        let confidenceLevel = 'medium_confidence';
        if (confidence > 0.7) confidenceLevel = 'high_confidence';
        else if (confidence < 0.4) confidenceLevel = 'low_confidence';

        const strategySet = this.strategies[intentType] || this.strategies.casual_inquiry;
        const primaryTactics = strategySet[confidenceLevel] || strategySet.medium_confidence;

        // Add context-specific tactics
        const contextualTactics = [];
        if (customerAnalysis.urgency === 'high') {
            contextualTactics.push('acknowledge_urgency', 'offer_quick_solution');
        }
        if (customerAnalysis.priceAwareness === 'high') {
            contextualTactics.push('justify_pricing', 'show_value');
        }

        // Tactics to avoid
        const avoidTactics = [];
        if (customerAnalysis.flexibility === 'low') {
            avoidTactics.push('aggressive_negotiation', 'pressure_tactics');
        }

        return {
            primary: primaryTactics,
            secondary: contextualTactics,
            avoid: avoidTactics
        };
    }

    generateValuePropositions(intent, priceData) {
        const propositions = [];

        // Quality-based propositions
        if (priceData && priceData.quality) {
            propositions.push({
                type: 'quality',
                message: `Premium quality ${priceData.product} - ${priceData.quality[0]} grade`,
                reasoning: 'Quality differentiation'
            });
        }

        // Service-based propositions
        propositions.push({
            type: 'service',
            message: 'Free home delivery for orders above ₹500',
            reasoning: 'Added service value'
        });

        // Relationship-based propositions
        if (intent.type === 'bulk_purchase') {
            propositions.push({
                type: 'relationship',
                message: 'Special rates for regular bulk customers',
                reasoning: 'Long-term relationship building'
            });
        }

        // Freshness/timing propositions
        propositions.push({
            type: 'freshness',
            message: 'Fresh stock arrived this morning',
            reasoning: 'Freshness advantage'
        });

        return propositions;
    }

    generateDecisionGuidance(intent, priceData, customerAnalysis) {
        const guidance = {
            accept: { conditions: [], reasoning: [] },
            counter: { conditions: [], reasoning: [] },
            decline: { conditions: [], reasoning: [] }
        };

        // Accept conditions
        if (priceData && priceData.marketPrice) {
            const marketPrice = priceData.marketPrice;
            guidance.accept.conditions.push(`Customer offers ₹${Math.round(marketPrice * 0.95)} or above`);
            guidance.accept.reasoning.push('Price is within acceptable range');
        }

        if (intent.type === 'bulk_purchase') {
            guidance.accept.conditions.push('Bulk quantity of 25kg or more');
            guidance.accept.reasoning.push('Volume justifies special pricing');
        }

        // Counter conditions
        guidance.counter.conditions.push('Customer offers below market rate');
        guidance.counter.reasoning.push('Opportunity to negotiate better terms');

        if (customerAnalysis.flexibility === 'high') {
            guidance.counter.conditions.push('Customer shows flexibility');
            guidance.counter.reasoning.push('Good negotiation potential');
        }

        // Decline conditions
        guidance.decline.conditions.push('Offer is significantly below cost price');
        guidance.decline.reasoning.push('Maintain business viability');

        return guidance;
    }

    getCulturalContext(intent) {
        const language = intent.language || 'english';
        const factors = this.culturalFactors[language] || this.culturalFactors.hindi;

        return {
            language: language,
            customary: [
                'Allow time for customer consideration',
                'Maintain respectful dialogue',
                'Avoid aggressive pressure tactics'
            ],
            factors: factors,
            communicationStyle: this.getCommunicationStyle(language)
        };
    }

    getCommunicationStyle(language) {
        const styles = {
            hindi: 'respectful_and_patient',
            kannada: 'friendly_and_local',
            tamil: 'traditional_and_respectful',
            telugu: 'warm_and_hospitable',
            bengali: 'intellectual_and_cultural',
            marathi: 'practical_and_business_focused',
            gujarati: 'business_minded_and_efficient',
            punjabi: 'warm_and_straightforward',
            odia: 'traditional_and_patient',
            malayalam: 'educated_and_quality_focused',
            assamese: 'cultural_and_respectful',
            urdu: 'courteous_and_poetic'
        };

        return styles[language] || 'respectful_and_professional';
    }

    calculateConfidence(intent, priceData) {
        let confidence = 0.5;

        // Boost confidence based on intent clarity
        if (intent.confidence > 0.7) confidence += 0.2;
        else if (intent.confidence < 0.3) confidence -= 0.2;

        // Boost confidence based on price data availability
        if (priceData && priceData.marketPrice) confidence += 0.2;
        else confidence -= 0.1;

        // Boost confidence based on product specificity
        if (intent.product && intent.product !== 'unknown' && intent.product !== 'general item') {
            confidence += 0.1;
        }

        return Math.max(0.1, Math.min(1.0, confidence));
    }

    createFallbackGuidance(intent) {
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