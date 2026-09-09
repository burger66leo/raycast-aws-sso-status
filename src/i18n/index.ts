import { messages } from "./messages";
export const languages = ["en", "zh-TW", "zh-CN", "ja", "ko"] as const;
export type Language = (typeof languages)[number];
const messageKeys = Object.keys(messages).sort((a, b) => b.length - a.length);
export function resolveLanguage(value?: string): Language {
  return languages.find((language) => language === value) || "en";
}
/** Translate fixed application text, including concatenated config issues. Never translate user identifiers. */
export function translator(language?: string) {
  const index = languages.indexOf(resolveLanguage(language));
  const lookup = (text: string) => messages[text as keyof typeof messages]?.[index];
  return (text: string): string => {
    const exact = lookup(text);
    if (exact) return exact;
    const translated: string[] = [];
    let remaining = text;
    while (remaining) {
      const key = messageKeys.find((candidate) => remaining === candidate || remaining.startsWith(`${candidate} `));
      if (!key) {
        translated.push(remaining);
        break;
      }
      translated.push(lookup(key)!);
      remaining = remaining.slice(key.length).trimStart();
    }
    return translated.join(" ");
  };
}
