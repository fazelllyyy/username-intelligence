import { UNICODE_SCRIPTS } from "../data/scripts.js";
import { RTL_SCRIPTS_SET, IGNORED_SCRIPTS_SET, isSafeScriptMix } from "../utils/patterns.js";

const COMMON_SCRIPTS = ["Latin", "Cyrillic", "Greek", "Arabic", "Hebrew", "Han", "Hiragana", "Katakana", "Hangul", "Thai", "Devanagari"];

const SCRIPT_CACHE = new Map();

export function detectScript(username) {
  const cacheKey = username;
  if (SCRIPT_CACHE.has(cacheKey)) {
    return SCRIPT_CACHE.get(cacheKey);
  }

  const detected = {};
  const len = username.length;

  for (const script of COMMON_SCRIPTS) {
    try {
      const regex = new RegExp(`\\p{Script=${script}}`, 'gu');
      const match = username.match(regex);

      if (match) {
        detected[script] = match.length;
      }
    } catch (e) {
      continue;
    }
  }

  const totalDetected = Object.values(detected).reduce((sum, count) => sum + count, 0);
  
  if (totalDetected < len * 0.8) {
    for (const script of UNICODE_SCRIPTS) {
      if (detected[script]) continue;
      if (!COMMON_SCRIPTS.includes(script)) {
        try {
          const regex = new RegExp(`\\p{Script=${script}}`, 'gu');
          const match = username.match(regex);

          if (match) {
            detected[script] = match.length;
          }
        } catch (e) {
          continue;
        }
      }
    }
  }

  const emojiRegex = /\p{Emoji_Presentation}/gu;
  const emojiMatch = username.match(emojiRegex);
  const emojiCount = emojiMatch ? emojiMatch.length : 0;

  if (emojiCount > 0) {
    detected["Emoji"] = emojiCount;
  }

  const unknownCount = len - Object.values(detected).reduce((sum, count) => sum + count, 0);
  if (unknownCount > 0) {
    detected["Unknown"] = unknownCount;
  }

  const activeScripts = Object.keys(detected).filter(s =>
    !IGNORED_SCRIPTS_SET.has(s) && s !== "Unknown" && s !== "Emoji"
  );

  let primary = "Unknown";
  let secondary = null;
  let max = 0;
  let secondMax = 0;

  for (const [script, count] of Object.entries(detected)) {
    if (!IGNORED_SCRIPTS_SET.has(script)) {
      if (count > max) {
        secondMax = max;
        secondary = primary !== "Unknown" ? primary : null;
        max = count;
        primary = script;
      } else if (count > secondMax && script !== primary) {
        secondMax = count;
        secondary = script;
      }
    }
  }

  if (primary === "Unknown" && activeScripts.length === 0) {
    const commonCount = detected["Common"] || 0;
    const inheritedCount = detected["Inherited"] || 0;
    if (commonCount + inheritedCount > 0) {
      primary = "Common";
    }
  }

  const isMixed = activeScripts.length > 1;
  const isRTL = RTL_SCRIPTS_SET.has(primary);
  const hasRTL = activeScripts.some(s => RTL_SCRIPTS_SET.has(s));
  const hasBidiMix = hasRTL && activeScripts.some(s => !RTL_SCRIPTS_SET.has(s) && s !== "Common");

  let isDangerousMix = false;

  if (isMixed) {
    if (!isSafeScriptMix(activeScripts)) {
      const cjk = ["Han", "Hiragana", "Katakana", "Hangul", "Bopomofo"];
      const isAllCJK = activeScripts.every(s => cjk.includes(s));

      if (!isAllCJK) {
        const hasCyrillicLatin = activeScripts.includes("Cyrillic") && activeScripts.includes("Latin");
        
        if (hasCyrillicLatin) {
          isDangerousMix = true;
        } else if (activeScripts.length > 3) {
          isDangerousMix = true;
        } else {
          const hasLatin = activeScripts.includes("Latin");
          const otherScripts = activeScripts.filter(s => s !== "Latin");
          if (hasLatin && otherScripts.length > 2) {
            isDangerousMix = true;
          }
        }
      }
    }

    if (hasBidiMix) {
      isDangerousMix = true;
    }
  }

  const scriptDiversity = activeScripts.length / Math.max(1, len);

  const result = {
    primary,
    secondary,
    detected: Object.keys(detected),
    counts: detected,
    is_mixed: isMixed,
    is_dangerous_mix: isDangerousMix,
    is_rtl: isRTL,
    has_rtl: hasRTL,
    has_bidi_mix: hasBidiMix,
    has_emoji: emojiCount > 0,
    script_diversity: Number(scriptDiversity.toFixed(3)),
    active_scripts: activeScripts
  };

  SCRIPT_CACHE.set(cacheKey, result);
  
  if (SCRIPT_CACHE.size > 1000) {
    const firstKey = SCRIPT_CACHE.keys().next().value;
    SCRIPT_CACHE.delete(firstKey);
  }

  return result;
}