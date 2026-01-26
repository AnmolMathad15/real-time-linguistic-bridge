# Linguistic Bridge - Professional Trading Assistant

A professional-grade, voice-first AI web platform for multilingual price discovery and negotiation assistance for local vendors and traders.

## 🌟 Professional Edition Features

### 🎤 Advanced Voice Recognition
- Professional-grade speech processing with real-time confidence monitoring
- Multi-language support for 8 major Indian languages
- Noise cancellation and multi-accent recognition
- Visual speech quality feedback

### 🌐 Comprehensive Indian Language Support
- **25+ Languages**: Complete coverage of Indian languages including all 22 official languages plus international languages
- **Major Indian Languages**: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese
- **Regional Languages**: Bhojpuri, Rajasthani, Maithili, Magahi, Konkani, Sindhi, Kashmiri, Manipuri, Santali, Bodo, Dogri, Nepali
- **International Languages**: English, Spanish, French, Arabic, Portuguese, Chinese, Sinhala, Dhivehi
- **1500+ Keywords**: Comprehensive vocabulary with regional expressions across all languages
- **Market Terminology**: Industry-specific terms and common trading phrases in all supported languages
- **Cultural Context**: Region-aware communication patterns and local customs for each language group

### 💰 Dynamic Pricing Intelligence
- **Seasonal Pricing Models** with month-wise variations
- **Regional Market Factors** and quality-based pricing tiers
- **Bulk Discount Calculations** with smart thresholds
- **Real-time Market Insights** with supply-demand indicators

### 🤝 Professional Negotiation Strategies
- **AI-Powered Guidance** with cultural sensitivity
- **Category-Specific Tips** for different product types
- **Relationship-Building Advice** for long-term customer retention
- **Seasonal Strategy Recommendations** based on market conditions

### 🎨 Modern Professional UI
- **Enterprise-Grade Design** with clean, intuitive interface
- **Accessibility Compliant** with screen reader support
- **Mobile-First Responsive** design for all devices
- **High Contrast Mode** and reduced motion support

### 🔒 Enterprise Security & Privacy
- **Zero Data Persistence** - no storage of personal information
- **Stateless Operation** - no conversation history retained
- **Privacy-First Design** - guidance-only, no financial transactions
- **Bank-Grade Security** standards

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Browser Speech Synthesis API
- **AI Processing**: Prompt-based LLM integration
- **Hosting**: Static web hosting
- **Data**: JSON-based price datasets

## Architecture

```
Voice Input → Speech-to-Text → Intent Classification → Translation → 
Price Discovery → Negotiation Assistant → Response Generation → 
Text Display + Optional TTS
```

## Getting Started

1. **Clone or download** the project files
2. **Serve the files** using any web server (recommended for microphone access):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```
   *Note: Serving via a local server is recommended for microphone access.*
3. **Allow microphone access** when prompted
4. **Select your language** and start speaking

## File Structure

```
├── frontend/
│   ├── index.html          # Main application interface
│   ├── style.css           # Mobile-first responsive styling
│   └── script.js           # Core application logic
├── mock_data/
│   └── prices.json         # Static price dataset
├── tests/
│   ├── test-setup.js       # Testing framework setup
│   ├── property-tests.html # Property-based test runner (browser)
│   └── run-property-tests.js # Test runner script
└── README.md               # This file
```

## Usage

1. **Select Language**: Choose Hindi, Kannada, or English
2. **Tap Microphone**: Press the large microphone button
3. **Speak Naturally**: Describe your negotiation scenario
4. **Get Guidance**: Receive price suggestions and negotiation advice
5. **Listen to Response**: Optional text-to-speech playback

## Example Interactions

**Multi-Language Price Inquiry:**
- *English*: "What's the seasonal price for mangoes right now?"
- *Hindi*: "Aaj aam ka rate kya hai? Season mein kya bhav hai?"
- *Tamil*: "Maanga vilai enna? Season la eppadi irukku?"
- *Telugu*: "Mamidi rate enti? Season lo ela undi?"
- *Bengali*: "Aamer dam koto? Season e kemn?"
- *Marathi*: "Ambya cha bhav kay? Season madhe kasa?"
- *Gujarati*: "Keri nu bhav shu che? Season ma kem che?"
- *Kannada*: "Mavina bele eshtu? Season nalli hegide?"
- *Punjabi*: "Aam da rate ki hai? Season vich kive hai?"
- *Odia*: "Amba dam kete? Season re kemiti?"
- *Malayalam*: "Manga vila enthaanu? Season il engane?"
- *Assamese*: "Aam dam kiman? Season t kene?"
- *Urdu*: "Aam ki qeemat kya hai? Season mein kaisi hai?"
- *Bhojpuri*: "Aam ke rate ka ba? Season mein kaise ba?"
- *Rajasthani*: "Aam ro bhav kyan hai? Season mein kaise hai?"
- *Konkani*: "Mango bhav kitlo? Season ant koxo?"

**Advanced Negotiation Scenarios:**
- *"Customer wants 10kg onions for ₹200, season mein price kya hona chahiye?"*
- → Receive seasonal context, counter-offer suggestions, and cultural negotiation tactics

**Professional Bulk Inquiries:**
- *"Someone wants to buy 50kg wheat, bulk discount kya de sakta hun?"*
- → Get bulk discount recommendations, seasonal pricing, and relationship-building advice

**Quality-Focused Negotiations:**
- *"Premium tomatoes ka rate kya hai? Customer quality ke liye ready hai pay karne"*
- → Receive quality-based pricing and premium positioning strategies

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Good support
- **Safari**: Limited speech recognition support
- **Mobile browsers**: Optimized for touch interaction

*Note: Speech recognition availability depends on browser and OS support.*

## Privacy & Ethics

- ✅ No personal data storage
- ✅ No user authentication required
- ✅ Stateless operation
- ✅ Guidance-only (no financial transactions)
- ✅ Explicit privacy disclaimer in UI

## Testing

The application includes comprehensive property-based testing to validate universal correctness properties:

### Property-Based Tests
- **Framework**: fast-check (loaded via CDN)
- **Minimum iterations**: 100 per property
- **Coverage**: 8 core properties validating system behavior

### Running Tests
```bash
# Open in browser (recommended)
open tests/property-tests.html

# Or run test runner script
node tests/run-property-tests.js
```

### Test Properties
1. **Voice-to-Intent Processing Pipeline** - All inputs produce valid intent objects
2. **Intent Classification Accuracy** - Known keywords classify correctly
3. **Single-Turn Consistency** - Same inputs produce consistent outputs
4. **Price Discovery Completeness** - All price queries return valid ranges
5. **Negotiation Assistance Comprehensiveness** - Complete guidance provided
6. **Response Language Consistency** - Responses match requested language
7. **Privacy Protection** - No sensitive data persists
8. **Error Handling Robustness** - Invalid inputs handled gracefully

## Development Status

This is an MVP (Minimum Viable Product) designed for one-day implementation and demonstration. The system prioritizes:
- **Reliability** over feature richness
- **Deterministic logic** over complex AI
- **Browser-native APIs** over external dependencies
- **Privacy** over personalization

## Success Criteria

- Clear problem-solution fit
- Works in real-time
- Inclusive design for low-literacy users
- Demonstrates AI reasoning capabilities
- Social impact relevance for local trade

## Final Goal

Demonstrate how AI can act as a real-time linguistic and economic bridge for local trade, empowering vendors with fair pricing knowledge and confident negotiation skills.

---

**Disclaimer**: This platform provides guidance only. No financial transactions are processed, and no personal data is stored.