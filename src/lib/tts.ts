const TTS_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\*\*(.*?)\*\*/g, "$1"],
  [/`([^`]+)`/g, "$1"],
  [/\bA\s*I\b/gi, "kunstmatige intelligentie"],
  [/\bChatGPT\b/g, "de chatassistent"],
  [/\bOpenAI\b/g, "het bedrijf achter die chatassistent"],
  [/\bMr\.\s*Beast\b/g, "Mister Beast"],
  [/\b(\d+)\s*x\s*(\d+)\b/g, "$1 keer $2"],
  [/\b(\d+)%/g, "$1 procent"],
  [/€\s?(\d+)/g, "$1 euro"],
  [/&/g, " en "],
  [/\s+\/\s+/g, " of "],
];

const ensureSentenceEnding = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

export const normalizeTtsText = (raw: string | null | undefined) => {
  if (!raw?.trim()) return undefined;

  let text = raw
    .replace(/^[-*>]\s+/gm, "")
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ");

  TTS_REPLACEMENTS.forEach(([pattern, value]) => {
    text = text.replace(pattern, value);
  });

  text = text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])(?=\S)/g, "$1 ")
    .trim();

  return text || undefined;
};

export const normalizeTtsSummary = (lines: string[] | null | undefined) => {
  if (!lines?.length) return undefined;

  const normalized = lines
    .map((line) => normalizeTtsText(line))
    .filter((line): line is string => Boolean(line))
    .map(ensureSentenceEnding);

  return normalized.length ? normalized.join(" ") : undefined;
};