"use client";
import { ActivityPayload } from "./activity"
import Locale from '@/locale/th.json';

type ActivityLocaleKey = keyof typeof Locale.activity

function replaceLocalePlaceholders(locale: string, data: Record<string, any>): string {
  const placeholders = locale.match(/{\w+}/g);

  if (placeholders) {
    placeholders.forEach((placeholder) => {
      const key = placeholder.slice(1, -1); 
      const replacement = data[key] || placeholder; 
      locale = locale.replace(placeholder, replacement);
    });
  }

  return locale;
}

export const ParseActivity = async (payload: ActivityPayload) => {
  const id: ActivityLocaleKey = (`${payload.category}-${payload.type}`).toLowerCase() as ActivityLocaleKey;
  let locale: string = Locale.activity[id];
  locale = replaceLocalePlaceholders(locale, payload.data as any)

  return locale || "unknown";
}