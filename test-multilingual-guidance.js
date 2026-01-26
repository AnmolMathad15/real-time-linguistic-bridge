// Test script for multilingual guidance functionality
// Run this in browser console after loading the main application

async function testMultilingualGuidance() {
    console.log('🌍 Testing Multilingual Guidance System...\n');
    
    // Test data
    const testData = {
        intent: { 
            type: 'price_inquiry', 
            product: 'tomatoes',
            quantity: 5,
            unit: 'kg'
        },
        priceData: { 
            product: 'tomatoes', 
            marketPrice: 50, 
            unit: 'kg',
            ranges: {
                minimum: 40,
                premium: 60
            },
            negotiation: { flexibility: 'moderate' }
        },
        negotiationGuidance: {
            counterOffers: [{
                price: 45,
                message: 'Good price for bulk purchase',
                recommended: true
            }],
            culturalContext: {
                customary: ['Maintain respectful dialogue', 'Allow time for customer consideration']
            },
            confidence: 0.8
        }
    };
    
    // Test languages with expected response indicators
    const testLanguages = [
        { code: 'en-US', name: 'English', indicator: 'market range' },
        { code: 'hi-IN', name: 'Hindi', indicator: 'bazaar mein' },
        { code: 'kn-IN', name: 'Kannada', indicator: 'market nalli' },
        { code: 'ta-IN', name: 'Tamil', indicator: 'sandhai vilai' },
        { code: 'te-IN', name: 'Telugu', indicator: 'market lo' },
        { code: 'bn-IN', name: 'Bengali', indicator: 'bazarer' },
        { code: 'mr-IN', name: 'Marathi', indicator: 'bazarat' },
        { code: 'gu-IN', name: 'Gujarati', indicator: 'bazaar ma' },
        { code: 'pa-IN', name: 'Punjabi', indicator: 'bazaar vich' },
        { code: 'or-IN', name: 'Odia', indicator: 'bazaar re' },
        { code: 'ml-IN', name: 'Malayalam', indicator: 'market il' },
        { code: 'as-IN', name: 'Assamese', indicator: 'bazaar t' },
        { code: 'ur-IN', name: 'Urdu', indicator: 'bazaar mein' }
    ];
    
    const results = {
        passed: 0,
        failed: 0,
        errors: []
    };
    
    // Initialize ResponseGenerator
    const responseGenerator = new ResponseGenerator();
    
    for (const lang of testLanguages) {
        try {
            console.log(`Testing ${lang.name} (${lang.code})...`);
            
            const response = await responseGenerator.formatResponse(testData, lang.code);
            
            // Verify response properties
            const checks = [
                { name: 'Has text', condition: response.text && response.text.length > 0 },
                { name: 'Correct language', condition: response.language === responseGenerator.normalizeLanguage(lang.code) },
                { name: 'Not fallback', condition: !response.fallback },
                { name: 'Contains price info', condition: response.text.includes('₹40') || response.text.includes('₹60') },
                { name: 'Language-specific content', condition: response.text.toLowerCase().includes(lang.indicator.toLowerCase()) }
            ];
            
            const passed = checks.every(check => check.condition);
            
            if (passed) {
                console.log(`✅ ${lang.name}: PASSED`);
                console.log(`   Response: "${response.text.substring(0, 100)}..."`);
                results.passed++;
            } else {
                console.log(`❌ ${lang.name}: FAILED`);
                const failedChecks = checks.filter(check => !check.condition);
                failedChecks.forEach(check => console.log(`   - ${check.name}: FAILED`));
                console.log(`   Response: "${response.text}"`);
                results.failed++;
                results.errors.push(`${lang.name}: ${failedChecks.map(c => c.name).join(', ')}`);
            }
            
        } catch (error) {
            console.log(`💥 ${lang.name}: ERROR - ${error.message}`);
            results.failed++;
            results.errors.push(`${lang.name}: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('📊 TEST SUMMARY:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / testLanguages.length) * 100).toFixed(1)}%`);
    
    if (results.errors.length > 0) {
        console.log('\n🔍 ERRORS:');
        results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Test fallback functionality
    console.log('\n🔄 Testing Fallback Functionality...');
    try {
        const fallbackResponse = responseGenerator.createFallbackResponse(testData, 'hi-IN', new Error('Test error'));
        const fallbackPassed = fallbackResponse.fallback && fallbackResponse.text.includes('madad');
        console.log(`Fallback test: ${fallbackPassed ? '✅ PASSED' : '❌ FAILED'}`);
        if (fallbackPassed) results.passed++;
        else results.failed++;
    } catch (error) {
        console.log(`Fallback test: 💥 ERROR - ${error.message}`);
        results.failed++;
    }
    
    return results;
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
    console.log('Multilingual Guidance Test loaded. Run testMultilingualGuidance() to execute tests.');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testMultilingualGuidance };
}