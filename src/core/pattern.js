import { deLeet } from "../utils/text.js";
import { PROFANITY_WORDS, PROFANITY_PATTERNS, TOXIC_PHRASES, HATE_SPEECH, SEXUAL_CONTENT, DRUG_CONTENT, VIOLENCE_CONTENT } from "../data/profanity.js";
import { PRIVILEGED_KEYWORDS, GOVERNMENT_KEYWORDS } from "../data/brands.js";
import { REGEX_PATTERNS, isValidEmailTLD } from "../utils/patterns.js";

const PRIVILEGED_KEYWORDS_SET = new Set(PRIVILEGED_KEYWORDS.map(k => k.toLowerCase()));
const GOVERNMENT_KEYWORDS_SET = new Set(GOVERNMENT_KEYWORDS.map(k => k.toLowerCase()));
const PROFANITY_WORDS_SET = new Set(PROFANITY_WORDS.map(w => w.toLowerCase()));
const TOXIC_PHRASES_SET = new Set(TOXIC_PHRASES.map(p => p.toLowerCase()));
const HATE_SPEECH_SET = new Set(HATE_SPEECH.map(w => w.toLowerCase()));
const SEXUAL_CONTENT_SET = new Set(SEXUAL_CONTENT.map(w => w.toLowerCase()));
const DRUG_CONTENT_SET = new Set(DRUG_CONTENT.map(w => w.toLowerCase()));
const VIOLENCE_CONTENT_SET = new Set(VIOLENCE_CONTENT.map(w => w.toLowerCase()));

export function detectPatterns(username, options = {}) {
  const patterns = [];
  const lower = username.toLowerCase();
  const normalized = deLeet(lower);
  const len = username.length;

  if (REGEX_PATTERNS.year.test(username)) {
    patterns.push("year-indicator");
  }

  if (REGEX_PATTERNS.generated.test(username)) {
    patterns.push("generated-style");
  }

  if (username.includes("@")) {
    const parts = username.split("@");
    if (parts.length === 2 && isValidEmailTLD(parts[1].split(".").pop())) {
      patterns.push("email-format");
    }
  }

  if (REGEX_PATTERNS.separator.test(username) && !username.includes("@")) {
    patterns.push("separator-style");
  }

  if (REGEX_PATTERNS.repeated.test(username)) {
    patterns.push("repeated-character");
  }

  if (REGEX_PATTERNS.repeatedPattern.test(username)) {
    patterns.push("repeated-pattern");
  }

  if (
    (username.startsWith("xX") && username.endsWith("Xx")) ||
    (username.startsWith("XX") && username.endsWith("XX")) ||
    (username.startsWith("zz") && username.endsWith("zz")) ||
    (username.startsWith("its") || username.startsWith("im")) ||
    REGEX_PATTERNS.gamerTitle.test(username)
  ) {
    patterns.push("gamer-style");
  }

  for (const keyword of PRIVILEGED_KEYWORDS_SET) {
    if (normalized.includes(keyword)) {
      patterns.push("privileged-keyword");
      break;
    }
  }

  for (const keyword of GOVERNMENT_KEYWORDS_SET) {
    if (normalized.includes(keyword)) {
      patterns.push("government-keyword");
      break;
    }
  }

  if (REGEX_PATTERNS.url.test(username)) {
    patterns.push("url-pattern");
  }

  if (REGEX_PATTERNS.executable.test(username)) {
    patterns.push("executable-extension");
  }

  if (REGEX_PATTERNS.keyboardWalk.test(normalized)) {
    patterns.push("keyboard-walk");
  }

  if (REGEX_PATTERNS.phone.test(username)) {
    patterns.push("phone-number");
  }

  if (REGEX_PATTERNS.cardNumber.test(username)) {
    patterns.push("potential-card-number");
  }

  if (REGEX_PATTERNS.ssn.test(username)) {
    patterns.push("ssn-pattern");
  }

  if (REGEX_PATTERNS.fullEmail.test(username)) {
    patterns.push("full-email");
  }

  const markCount = (normalized.match(REGEX_PATTERNS.mark) || []).length;
  if (markCount > 10 || (len > 0 && markCount / len > 0.3)) {
    patterns.push("excessive-marks");
    patterns.push("zalgo-text");
  }

  if (REGEX_PATTERNS.zalgo.test(username)) {
    patterns.push("zalgo-text");
  }

  if (REGEX_PATTERNS.bot.test(normalized)) {
    patterns.push("bot-indicator");
  }

  if (options.blockProfanity !== false) {
    for (const word of PROFANITY_WORDS_SET) {
      if (normalized.includes(word)) {
        patterns.push("profanity");
        break;
      }
    }

    if (!patterns.includes("profanity")) {
      for (const pattern of PROFANITY_PATTERNS) {
        if (pattern.test(username)) {
          patterns.push("profanity");
          break;
        }
      }
    }

    if (!patterns.includes("toxic-phrase")) {
      for (const phrase of TOXIC_PHRASES_SET) {
        if (normalized.includes(phrase)) {
          patterns.push("toxic-phrase");
          break;
        }
      }
    }

    for (const word of HATE_SPEECH_SET) {
      if (normalized.includes(word)) {
        patterns.push("hate-speech");
        break;
      }
    }

    for (const word of SEXUAL_CONTENT_SET) {
      if (normalized.includes(word)) {
        patterns.push("sexual-content");
        break;
      }
    }

    for (const word of DRUG_CONTENT_SET) {
      if (normalized.includes(word)) {
        patterns.push("drug-reference");
        break;
      }
    }

    for (const word of VIOLENCE_CONTENT_SET) {
      if (normalized.includes(word)) {
        patterns.push("violence-reference");
        break;
      }
    }
  }

  const leetMatches = normalized.match(REGEX_PATTERNS.leet);
  const leetScore = leetMatches ? leetMatches.length : 0;
  if (leetScore > 2 && REGEX_PATTERNS.vowel.test(username)) {
    patterns.push("leet-speak");
  }

  if (len > 30) {
    patterns.push("very-long");
  }

  if (len < 3) {
    patterns.push("very-short");
  }

  const upperCount = (username.match(REGEX_PATTERNS.excessiveUppercase) || []).length;
  const lowerCount = (username.match(REGEX_PATTERNS.lowercaseAscii) || []).length;
  if (upperCount > 0 && lowerCount > 0 && upperCount > lowerCount * 2) {
    patterns.push("excessive-uppercase");
  }

  if (REGEX_PATTERNS.camelCase.test(username)) {
    patterns.push("camel-case");
  }

  if (REGEX_PATTERNS.snakeCase.test(username)) {
    patterns.push("snake-case");
  }

  if (REGEX_PATTERNS.kebabCase.test(username)) {
    patterns.push("kebab-case");
  }

  if (REGEX_PATTERNS.mixedScript.test(username) && REGEX_PATTERNS.ascii.test(username)) {
    const ascii = (username.match(REGEX_PATTERNS.ascii) || []).length;
    const nonAscii = (username.match(REGEX_PATTERNS.nonAscii) || []).length;
    if (ascii > 0 && nonAscii > 0 && ascii < len * 0.3) {
      patterns.push("mixed-script-suspicious");
    }
  }

  if (REGEX_PATTERNS.fileExtension.test(username)) {
    patterns.push("file-extension");
  }

  if (REGEX_PATTERNS.ipAddress.test(username)) {
    patterns.push("ip-address");
  }

  if (REGEX_PATTERNS.hash.test(username)) {
    patterns.push("hash-like");
  }

  if (REGEX_PATTERNS.randomString.test(username) && !REGEX_PATTERNS.vowel.test(username)) {
    patterns.push("random-string");
  }

  if (REGEX_PATTERNS.creditCard.test(username)) {
    patterns.push("credit-card-pattern");
  }

  if (REGEX_PATTERNS.iban.test(username) && len >= 15) {
    patterns.push("iban-like");
  }

  if (REGEX_PATTERNS.uuid.test(username)) {
    patterns.push("uuid-format");
  }

  return patterns;
}