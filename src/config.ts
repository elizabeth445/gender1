/** Edit the invitation's event details here. Venue address: forrestclub.com.ua. */
export const eventConfig = {
  // Keep the storage/calendar identity stable when the event date changes.
  id: 'little-secret-december-2026',
  hosts: 'Марія та Олександр',
  start: '2027-06-12T15:00:00+03:00',
  end: '2027-06-12T18:30:00+03:00',
  timeZone: 'Europe/Kyiv',
  rsvpDeadline: '2027-06-05T23:59:00+03:00',
  venue: 'Forrest Club',
  city: 'Київ',
  address: 'просп. Литовський, 20а',
  venueUrl: 'https://forrestclub.com.ua/',
  mapsUrl: 'https://maps.app.goo.gl/oD5vNiK7MRuttKxy8',
  venueDescription:
    'Затишний ресторан серед лісу, поруч із озером. Місце для теплих зустрічей і нашого особливого моменту.',
  locationNote: 'Святкуємо разом у Forrest Club.',
  venuePhoto: {
    src: '/images/forrest-celebration-1600.webp',
    srcSet:
      '/images/forrest-celebration-640.webp 640w, /images/forrest-celebration-960.webp 960w, /images/forrest-celebration-1600.webp 1600w',
    alt: 'Святкова фотозона з рожевими й блакитними повітряними кульками серед зелені.',
    width: 1600,
    height: 1067,
  },
  schedule: [
    {
      time: '15:00',
      title: 'Теплі обійми',
      text: 'Зустрічаємося, знайомимося та ловимо перші усмішки.',
      icon: 'heart',
    },
    {
      time: '15:30',
      title: 'Трішки солодкого',
      text: 'Смакуємо частування та насолоджуємося розмовами.',
      icon: 'cake',
    },
    {
      time: '16:00',
      title: 'Довіряємо інтуїції',
      text: 'Граємо, загадуємо та ділимося передбаченнями.',
      icon: 'spark',
    },
    {
      time: '16:30',
      title: 'Той самий момент',
      text: 'Разом відкриваємо наш найбільший маленький секрет.',
      icon: 'bow',
    },
    {
      time: '17:00',
      title: 'Святкуємо любов',
      text: 'Фотографуємося, обіймаємося і запам’ятовуємо цей день.',
      icon: 'camera',
    },
  ],
} as const;

export const eventDate = new Date(eventConfig.start);
export const dateLabel = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: eventConfig.timeZone,
})
  .format(eventDate)
  .replace(/\s?р\.$/, '');
export const timeLabel = new Intl.DateTimeFormat('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: eventConfig.timeZone,
}).format(eventDate);
const weekday = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'long',
  timeZone: eventConfig.timeZone,
}).format(eventDate);
export const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
export const shortDateLabel = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: eventConfig.timeZone,
}).format(eventDate);
export const deadlineLabel = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  timeZone: eventConfig.timeZone,
}).format(new Date(eventConfig.rsvpDeadline));
