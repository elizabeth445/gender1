import { eventConfig } from './config';

export function readLocal<T>(key: string, validate: (value: unknown) => value is T): T | null {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(`${eventConfig.id}:${key}:v1`) ?? 'null',
    );
    return validate(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(`${eventConfig.id}:${key}:v1`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function escapeICS(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function calendarContent() {
  const stamp = (date: string | Date) =>
    new Date(date)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const location = [eventConfig.venue, eventConfig.city, eventConfig.address]
    .filter(Boolean)
    .join(', ');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Little Secret//Invitation//UK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${eventConfig.id}@little-secret.local`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(eventConfig.start)}`,
    `DTEND:${stamp(eventConfig.end)}`,
    `SUMMARY:${escapeICS('Маленький секрет — наше особливе свято')}`,
    `DESCRIPTION:${escapeICS(`${eventConfig.hosts} запрошують розділити особливий момент. ${eventConfig.locationNote}`)}`,
    `LOCATION:${escapeICS(location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // RFC 5545: fold lines at 75 UTF-8 octets, without splitting a Unicode character.
  const encoder = new TextEncoder();
  return (
    lines
      .map((line) => {
        let current = '';
        let bytes = 0;
        const folded: string[] = [];
        for (const char of line) {
          const size = encoder.encode(char).length;
          if (bytes + size > 75) {
            folded.push(current);
            current = ' ';
            bytes = 1;
          }
          current += char;
          bytes += size;
        }
        return [...folded, current].join('\r\n');
      })
      .join('\r\n') + '\r\n'
  );
}

export function downloadCalendar() {
  const url = URL.createObjectURL(
    new Blob([calendarContent()], { type: 'text/calendar;charset=utf-8' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'malenkyi-sekret.ics';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
