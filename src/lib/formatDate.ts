export function formatDate(dateInput?: string | Date, opts?: { weekday?: boolean; month?: 'short' | 'long' | 'numeric'; locale?: string }) {
  if (!dateInput) return '';
  let date: Date;
  if (typeof dateInput === 'string') {
    // Prefer parsing YYYY-MM-DD without timezone shift
    const isoMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const y = parseInt(isoMatch[1], 10);
      const m = parseInt(isoMatch[2], 10) - 1;
      const d = parseInt(isoMatch[3], 10);
      date = new Date(y, m, d);
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = dateInput;
  }

  const locale = opts?.locale || 'en-GB';
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: opts?.month || 'short',
    year: 'numeric',
  };
  if (opts?.weekday) options.weekday = 'short';

  try {
    return new Intl.DateTimeFormat(locale, options).format(date as Date);
  } catch (e) {
    return date.toLocaleDateString();
  }
}

export default formatDate;

export function isoToDDMMYYYY(iso?: string) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const [, y, mm, d] = m;
  return `${d}/${mm}/${y}`;
}

export function ddmmyyyyToISO(input?: string) {
  if (!input) return null;
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mm, y] = m;
  // Basic validity check
  const day = parseInt(d, 10);
  const month = parseInt(mm, 10);
  const year = parseInt(y, 10);
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() + 1 !== month || dt.getDate() !== day) return null;
  return `${year.toString().padStart(4, '0')}-${mm}-${d}`;
}
