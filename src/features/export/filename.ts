
const COMBINING_DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');
const ILLEGAL_FILENAME_CHARS = /[\\/:*?"<>|]/g;

export function slugifyFilename(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .replace(ILLEGAL_FILENAME_CHARS, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '');

  return slug || 'meeting';
}

export function timestampSuffix(): string {
  return new Date().toISOString().slice(0, 10);
}
