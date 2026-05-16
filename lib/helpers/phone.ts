import { parsePhoneNumberFromString } from "libphonenumber-js";

export function getDialablePhone(phone: string): string | null {
  if (!phone) return null;
  const parsed = parsePhoneNumberFromString(phone, "EG");
  if (parsed) return parsed.number;

  const cleaned = phone
    .replace(/[^^\d+]/g, "")
    .replace(/[^\d+]/g, "")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function formatPhoneDisplay(phone: string): string {
  if (!phone) return "";
  const parsed = parsePhoneNumberFromString(phone, "EG");
  return parsed?.formatInternational() ?? phone;
}
