// Test Setup for Real-Time Linguistic Bridge
// This file contains ALL mock implementations for testing - NOT for runtime use

// Mock Web Speech API for testing environments
class MockSpeechRecognition {
    constructor() {
        this.continuous = false;
        this.interimResults = false;
        this.lang = 'en-US';
        this.onstart = null;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
        this.isListening = false;
    }

    start() {
        this.isListening = true;
        if (this.onstart) this.onstart();
        
        // Simulate realistic speech recognition result
        setTimeout(() => {
            if (this.onresult && this.isListening) {
                const mockEvent = {
                    results: [{
                        0: { 
                            transcript: 'test speech input for negotiation',
                            confidence: 0.85
                        },
                        isFinal: true
                    }]
                };
                this.onresult(mockEvent);
            }
            
            // Simulate end event
            setTimeout(() => {
                this.isListening = false;
                if (this.onend) this.onend();
            }, 50);
        }, 100);
    }

    stop() {
        this.isListening = false;
        if (this.onend) this.onend();
    }

    abort() {
        this.isListening = false;
        if (this.onerror) {
            this.onerror({ error: 'aborted' });
        }
    }
}

// Mock Speech Synthesis API for testing environments
class MockSpeechSynthesis {
    constructor() {
        this.speaking = false;
        this.pending = false;
        this.paused = false;
    }

    speak(utterance) {
        console.log('Mock TTS speaking:', utterance.text, 'in language:', utterance.lang);
        this.speaking = true;
        
        // Simulate speech completion
        setTimeout(() => {
            this.speaking = false;
            if (utterance.onend) utterance.onend();
        }, 100);
    }

    cancel() {
        console.log('Mock TTS cancelled');
        this.speaking = false;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    getVoices() {
        return [
            { lang: 'en-US', name: 'Mock English Voice' },
            { lang: 'hi-IN', name: 'Mock Hindi Voice' },
            { lang: 'kn-IN', name: 'Mock Kannada Voice' }
        ];
    }
}

// Mock SpeechSynthesisUtterance for testing
class MockSpeechSynthesisUtterance {
    constructor(text) {
        this.text = text;
        this.lang = 'en-US';
        this.volume = 1;
        this.rate = 1;
        this.pitch = 1;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
    }
}

// Setup mocks for testing environment ONLY
// NOTE: Test pages should include 'test' in URL to activate mocks
// This should NEVER run in production browsers
if (typeof window !== 'undefined' && window.location && window.location.href.includes('test')) {
    console.warn('Loading test mocks - this should only happen in test environment');
    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
    window.speechSynthesis = new MockSpeechSynthesis();
    window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
}

// Export for Node.js testing environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MockSpeechRecognition,
        MockSpeechSynthesis,
        MockSpeechSynthesisUtterance,
        setupMocks: () => {
            global.SpeechRecognition = MockSpeechRecognition;
            global.webkitSpeechRecognition = MockSpeechRecognition;
            global.speechSynthesis = new MockSpeechSynthesis();
            global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
        }
    };
}

// Test utilities for property-based testing
if (typeof window !== 'undefined' && window.location && window.location.href.includes('test')) {
    window.testUtils = {
        // Generate test voice inputs
        generateVoiceInput: (language = 'en-US', confidence = 0.8) => ({
            text: 'Sample negotiation text',
            language: language,
            confidence: confidence,
            timestamp: new Date(),
            duration: 1500
        }),
        
        // Generate test intents
        generateIntent: (type = 'bargaining') => ({
            type: type,
            confidence: 0.8,
            keywords: ['price', 'negotiate'],
            product: 'rice',
            category: 'grains'
        }),
        
        // Simulate speech recognition errors
        simulateError: (errorType = 'no-speech') => ({
            error: errorType,
            message: 'Test error',
            timestamp: new Date()
        })
    };
}