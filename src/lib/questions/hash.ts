/** Hash stabile per deduplicare domande nel bank. */
export function questionHash(text: string): string {
  let h = 0;
  const s = text.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return `h${Math.abs(h).toString(36)}`;
}
