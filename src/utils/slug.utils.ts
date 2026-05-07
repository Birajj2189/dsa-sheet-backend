export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateUniqueSlug(text: string, suffix?: string | number): string {
  const base = generateSlug(text);
  if (suffix !== undefined) {
    return `${base}-${suffix}`;
  }
  return base;
}
