/**
 * Precompiled regex patterns for better performance
 * Avoids recompiling regex on every analysis
 */

export const REGEX_PATTERNS = {
  year: /^(?:19|20)\d{2}$|(?:19|20)\d{2}$/,
  generated: /^[a-z]+[._-]?\d{4,}$/i,
  separator: /^[a-z0-9]+[._][a-z0-9]+$/i,
  repeated: /(.)\1{2,}/,
  repeatedPattern: /(.{2,})\1{2,}/,
  gamerPrefix: /^(xX|XX|zz|its|im)/i,
  gamerSuffix: /(Xx|XX|zz)$/i,
  gamerTitle: /^(the|pro|mr|ms|dr|sir|lord|lady|king|queen)[_-]?/i,
  url: /https?:\/\/|www\.|ftp:\/\//i,
  executable: /\.(exe|bat|cmd|sh|ps1|vbs|jar|app|dmg|apk|deb|rpm|msi|pkg|bin|run|dll|so|dylib)$/i,
  keyboardWalk: /qwerty|asdfgh|zxcvbn|123456|password|qazwsx|12345678|abc123|iloveyou|welcome|monkey|dragon|master|sunshine|princess|login|admin123|letmein|football|baseball|trustno1/i,
  phone: /\+?\d{10,15}/,
  cardNumber: /\d{13,19}/,
  ssn: /\d{3}-\d{2}-\d{4}/,
  fullEmail: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  zalgo: /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]{5,}/,
  bot: /bot|crawler|spider|scraper|automation|script|fake|dummy|test|temp|trash|spam|junk/i,
  leet: /[4@8(316!05$7+2]/g,
  excessiveUppercase: /[A-Z]/g,
  lowercaseAscii: /[a-z]/g,
  camelCase: /^[A-Z][a-z]+[A-Z][a-z]+/,
  snakeCase: /^[a-z]+_[a-z]+(_[a-z]+)*$/,
  kebabCase: /^[a-z]+-[a-z]+(-[a-z]+)*$/,
  mixedScript: /[^\x00-\x7F]/,
  ascii: /[a-zA-Z]/g,
  nonAscii: /[^\x00-\x7F]/g,
  fileExtension: /\.(png|jpg|jpeg|gif|bmp|svg|webp|ico|tiff|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z|tar|gz)$/i,
  ipAddress: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  hash: /[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64}/i,
  randomString: /^[A-Z0-9]{8,}$/i,
  vowel: /[aeiou]/i,
  creditCard: /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/,
  iban: /[A-Z]{2}\d{2}[A-Z0-9]{1,30}/i,
  uuid: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  invisible: /[\u200B-\u200D\uFEFF\u180E\u2060-\u2069\u202A-\u202E\uFFF9-\uFFFB\u034F\u115F-\u1160\u17B4-\u17B5\u3164]/,
  rtlMarks: /[\u200E\u200F\u202A-\u202E]/g,
  combiningMarks: /\p{M}{5,}/gu,
  suspiciousSpaces: /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g,
  controlChars: /[\x00-\x1F\x7F-\x9F]/,
  whitespace: /\s+/g,
  startsWithLetter: /^\p{L}/u,
  endsWithLetter: /\p{L}$/u,
  startsWithNumber: /^\p{N}/u,
  endsWithNumber: /\p{N}$/u,
  startsWithSymbol: /^[\p{P}\p{S}]/u,
  endsWithSymbol: /[\p{P}\p{S}]$/u,
  letter: /\p{L}/gu,
  number: /\p{N}/gu,
  uppercase: /\p{Lu}/gu,
  lowercase: /\p{Ll}/gu,
  whitespaceChar: /\p{Z}/gu,
  punctuation: /\p{P}/gu,
  symbol: /\p{S}/gu,
  mark: /\p{M}/gu,
  control: /\p{C}/gu,
  emoji: /\p{Emoji}/gu,
  segmentSplit: /[._\-\s]/,
  alphaSegment: /[^a-zA-Z\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]+/,
  numericSegment: /[^0-9]+/,
  wordBoundary: /\b/g,
  camelBoundary: /[a-z][A-Z]/g,
  separatorBoundary: /[._\-]/g,
  combiningChars: /\p{M}/u,
  wideChars: /[\u4E00-\u9FFF\u3400-\u4DBF\uFF00-\uFFEF]/,
  narrowChars: /[iIl1|:;',.]/,
  wideLatin: /[mMwW@]/,
  decorative: /[✨🌟⭐★☆♥♡▪▫●○◆◇■□▲△]/,
  tld: /\.(com|net|org|edu|gov|mil|co|io|ai|me|tv|biz|info|xyz|app|dev|tech|online|site|store|shop|cloud|digital|web|pro|mobi|name|tel|asia|eu|us|uk|ca|au|de|fr|jp|cn|ru|br|in|kr|mx|it|es|nl|se|no|dk|fi|pl|be|ch|at|cz|gr|pt|ro|hu|ie|za|nz|sg|hk|tw|th|my|ph|vn|id|ae|sa|eg|pk|bd|ng|ke|gh|tz|ug|zm|zw|bw|mw|sz|ls|na|ao|mz|cd|cg|ga|cm|ci|sn|ml|bf|ne|td|cf|gn|sl|lr|gm|gw|mr|st|cv|km|sc|mu|mg|re|yt|tf|sh|pm|wf|pf|nc|vu|fj|ki|sb|to|ws|sm|as|gu|mp|pw|fm|mh|nr|tv|tk|nu|ck|pn)$/i
};

const EMAIL_TLD_REGEX = new RegExp(
  '^(com|net|org|edu|gov|mil|co|io|ai|me|tv|biz|info|xyz|app|dev|tech|online|site|store|shop|cloud|digital|web|pro|mobi|name|tel|asia|eu|us|uk|ca|au|de|fr|jp|cn|ru|br|in|kr|mx|it|es|nl|se|no|dk|fi|pl|be|ch|at|cz|gr|pt|ro|hu|ie|za|nz|sg|hk|tw|th|my|ph|vn|id|ae|sa|eg|pk|bd|ng|ke|gh|tz|ug|zm|zw|bw|mw|sz|ls|na|ao|mz|cd|cg|ga|cm|ci|sn|ml|bf|ne|td|cf|gn|sl|lr|gm|gw|mr|st|cv|km|sc|mu|mg|re|yt|tf|sh|pm|wf|pf|nc|vu|fj|ki|sb|to|ws|sm|as|gu|mp|pw|fm|mh|nr|tv|tk|nu|ck|pn)$',
  'i'
);

export function isValidEmailTLD(tld) {
  return EMAIL_TLD_REGEX.test(tld);
}

export const RTL_SCRIPTS_SET = new Set(["Arabic", "Hebrew", "Syriac", "Thaana", "Nko"]);

export const IGNORED_SCRIPTS_SET = new Set(["Common", "Inherited"]);

export const SAFE_MIX_PAIRS_SET = new Set([
  "Latin,Arabic", "Latin,Bopomofo", "Latin,Cyrillic", "Latin,Greek", "Latin,Han",
  "Latin,Hebrew", "Latin,Hiragana", "Latin,Hangul", "Latin,Katakana", "Latin,Thai",
  "Latin,Devanagari", "Han,Hiragana", "Han,Katakana", "Hiragana,Katakana",
  "Han,Hiragana,Katakana", "Han,Hangul", "Han,Bopomofo", "Arabic,Persian",
  "Devanagari,Bengali", "Cyrillic,Latin"
]);

export function isSafeScriptMix(scripts) {
  const sorted = [...scripts].sort().join(",");
  return SAFE_MIX_PAIRS_SET.has(sorted);
}

const KEYBOARD_WALKS_SET = new Set([
  'qwerty', 'asdfgh', 'zxcvbn', '123456', 'password', 'qazwsx',
  '12345678', 'abc123', 'iloveyou', 'welcome', 'monkey', 'dragon',
  'master', 'sunshine', 'princess', 'login', 'admin123', 'letmein',
  'football', 'baseball', 'trustno1'
]);

export function isKeyboardWalk(str) {
  return KEYBOARD_WALKS_SET.has(str.toLowerCase());
}
