const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 15;

export function sanitizePhoneInput(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS);
  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
}

export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return '#';
  }

  if (digits.length === 10 && digits.startsWith('5')) {
    return `tel:+90${digits}`;
  }

  return `tel:+${digits}`;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return phone;
  }

  if (digits.length === 10 && digits.startsWith('5')) {
    return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }

  return phone.startsWith('+') ? phone : `+${digits}`;
}
