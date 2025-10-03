export function digits12(input: unknown): string {
  const s = (input ?? '').toString();
  return s.replace(/\D/g, '').slice(0, 12);
}

export function formatUzPhoneDash(digits: unknown): string {
  const v = digits12(digits);
  if (v.length <= 3) return v;
  const m = v.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{0,2})$/);
  if (!m) return v;
  const [, g1, g2, g3, g4, g5] = m;
  return [g1, g2, g3, g4, g5].filter(Boolean).join('-');
}

export function formatUzPhonePretty(digits: unknown): string {
  const v = digits12(digits);
  const m = v.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (!m) return v || '-';
  const [, g1, g2, g3, g4, g5] = m;
  return `+${g1} (${g2}) ${g3}-${g4}-${g5}`;
}
