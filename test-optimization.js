import { analyzeUsername, batchAnalyze, clearCache, getCacheStats } from './dist/index.mjs';

console.log('=== Testing username-intelligence optimizations ===\n');

// Test 1: Basic analysis
console.log('Test 1: Basic username analysis');
const result1 = analyzeUsername('john_doe');
console.log('Username: john_doe');
console.log('Style:', result1.classification.style);
console.log('Quality Score:', result1.classification.scores.quality);
console.log('Risk Level:', result1.classification.levels.risk);
console.log();

// Test 2: Security analysis
console.log('Test 2: Security analysis (homoglyph detection)');
const result2 = analyzeUsername('раураl'); // Contains Cyrillic 'а'
console.log('Username: раураl (with Cyrillic characters)');
console.log('Security Risk:', result2.classification.scores.security_risk);
console.log('Threats:', result2.security.threats);
console.log();

// Test 3: Caching test
console.log('Test 3: Caching performance');
const start1 = Date.now();
for (let i = 0; i < 100; i++) {
  analyzeUsername('test_user');
}
const end1 = Date.now();
console.log('100 analyses of same username (cached):', end1 - start1, 'ms');
console.log('Cache stats:', getCacheStats());
console.log();

// Test 4: Batch analysis
console.log('Test 4: Batch analysis');
const batch = batchAnalyze(['user1', 'user_2', 'gamer123', 'admin_test']);
console.log('Batch results:', batch.map(b => ({
  username: b.username,
  style: b.analysis.classification.style,
  quality: b.analysis.classification.scores.quality
})));
console.log();

// Test 5: Options test - disable features for performance
console.log('Test 5: Analysis with disabled features (faster)');
const start2 = Date.now();
const result3 = analyzeUsername('simpleuser', {
  enableCache: false,
  enableSecurity: false,
  enableLinguistic: false,
  enableVisual: false
});
const end2 = Date.now();
console.log('Analysis time (minimal):', end2 - start2, 'ms');
console.log('Style:', result3.classification.style);
console.log();

// Test 6: Complex username
console.log('Test 6: Complex username analysis');
const result4 = analyzeUsername('xX_ProGamer_2024_Xx');
console.log('Username: xX_ProGamer_2024_Xx');
console.log('Style:', result4.classification.style);
console.log('Patterns:', result4.patterns);
console.log('Overall Score:', result4.classification.scores.overall);
console.log();

// Clear cache
clearCache();
console.log('Cache cleared. Final cache stats:', getCacheStats());

console.log('\n=== All tests completed successfully! ===');
