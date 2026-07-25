
const AVATAR_COLOR_CLASSES = [
  'bg-[var(--primary-500)]',
  'bg-[var(--secondary-500)]',
  'bg-[var(--blue-500)]',
  'bg-[var(--emerald-500)]',
  'bg-[var(--amber-500)]',
];

export const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getAvatarColorClass = (name: string): string =>
  AVATAR_COLOR_CLASSES[hashString(name) % AVATAR_COLOR_CLASSES.length];
