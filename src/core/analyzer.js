import { normalizeUsername, normalizeAggressively } from "../utils/normalize.js";
import { calculateEntropy, analyzeComplexity } from "../utils/math.js";
import { analyzeCharacters } from "./character.js";
import { detectScript } from "./script.js";
import { detectPatterns } from "./pattern.js";
import { classifyUsername } from "./classifier.js";
import { detectSecurity } from "./security.js";
import { analyzeStructure } from "./structure.js";
import { analyzeLinguistic } from "./linguistic.js";
import { analyzeVisual } from "./visual.js";
import { getCachedAnalysis, setCachedAnalysis } from "../utils/cache.js";

const DEFAULT_OPTIONS = {
  enableCache: true,
  enableSecurity: true,
  enableLinguistic: true,
  enableVisual: true,
  enablePatterns: true,
  enableStructure: true,
  strict: false,
  blockProfanity: false,
  checkVisual: false
};

export function analyze(username, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const normalized = normalizeUsername(username);
  const cacheKey = `${normalized}:${JSON.stringify(opts)}`;
  
  if (opts.enableCache) {
    const cached = getCachedAnalysis(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const characters = analyzeCharacters(username);
  const script = detectScript(username);
  
  const patterns = opts.enablePatterns ? detectPatterns(username, opts) : [];
  const security = opts.enableSecurity ? detectSecurity(username, script, opts) : {
    has_invisible_chars: false,
    has_homoglyph_risk: false,
    has_confusables: false,
    confusable_count: 0,
    homoglyph_risk_level: 0,
    zero_width_chars: [],
    threats: [],
    warnings: [],
    vulnerabilities: [],
    threat_count: 0,
    vulnerability_count: 0,
    severity_distribution: { critical: 0, high: 0, medium: 0, low: 0 },
    is_suspicious: false,
    is_highly_suspicious: false
  };
  
  const structure = opts.enableStructure ? analyzeStructure(username) : {
    has_balanced_structure: true,
    complexity_level: "simple"
  };
  
  const linguistic = opts.enableLinguistic ? analyzeLinguistic(username, script) : {
    word_likeness: 0.5,
    name_likeness: 0.5,
    pronounceability: 0.5,
    is_natural: true,
    is_memorable: 0.5
  };
  
  const visual = opts.enableVisual ? analyzeVisual(username, characters) : {
    readability_score: 100,
    aesthetic_score: 50,
    distinctiveness: 50
  };
  
  const entropy = calculateEntropy(username);
  const complexity = analyzeComplexity(username);

  const classification = classifyUsername({
    characters,
    patterns,
    script,
    entropy,
    security,
    structure,
    linguistic,
    visual,
    complexity
  });

  const result = {
    input: username,
    meta: {
      length: username.length,
      normalized,
      byte_length: new Blob([username]).size,
      grapheme_length: [...new Intl.Segmenter().segment(username)].length
    },
    stats: {
      entropy: classification.scores.entropy,
      ...characters
    },
    script,
    patterns,
    security,
    structure,
    linguistic,
    visual,
    complexity,
    classification
  };

  if (opts.enableCache) {
    setCachedAnalysis(cacheKey, result);
  }

  return result;
}