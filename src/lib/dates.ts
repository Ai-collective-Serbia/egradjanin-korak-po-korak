const MONTHS = [
  'јануар',
  'фебруар',
  'март',
  'април',
  'мај',
  'јун',
  'јул',
  'август',
  'септембар',
  'октобар',
  'новембар',
  'децембар',
];

/** Formats YYYY-MM-DD as the guide writes dates (rule 16): "13. октобар 2026.", in Cyrillic. */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`not a YYYY-MM-DD date: "${iso}"`);
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) throw new Error(`not a calendar month: "${iso}"`);
  return `${Number(day)}. ${name} ${year}.`;
}
