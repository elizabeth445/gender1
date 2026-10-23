import { useEffect, useState } from 'react';
import { dateLabel, eventConfig, eventDate, timeLabel, weekdayLabel } from '../config';
import { downloadCalendar } from '../lib';
import { Icon, TinyStar } from './Artwork';

function timeRemaining() {
  return Math.max(0, eventDate.getTime() - Date.now());
}
function plural(value: number, words: [string, string, string]) {
  const hundred = value % 100;
  const ten = value % 10;
  return hundred >= 11 && hundred <= 14
    ? words[2]
    : ten === 1
      ? words[0]
      : ten >= 2 && ten <= 4
        ? words[1]
        : words[2];
}

function Countdown() {
  const [remaining, setRemaining] = useState(timeRemaining);
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(timeRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);
  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const units = [
    { value: days, label: plural(days, ['день', 'дні', 'днів']) },
    {
      value: Math.floor(seconds / 3600) % 24,
      label: plural(Math.floor(seconds / 3600) % 24, ['година', 'години', 'годин']),
    },
    {
      value: Math.floor(seconds / 60) % 60,
      label: plural(Math.floor(seconds / 60) % 60, ['хвилина', 'хвилини', 'хвилин']),
    },
    { value: seconds % 60, label: plural(seconds % 60, ['секунда', 'секунди', 'секунд']) },
  ];
  return (
    <div className="countdown-area reveal">
      {remaining > 0 ? (
        <div
          className="countdown"
          role="timer"
          aria-live="off"
          aria-label="Зворотний відлік до свята"
        >
          {units.map((unit, index) => (
            <div className="countdown-unit" key={index}>
              <span key={unit.value}>{String(unit.value).padStart(2, '0')}</span>
              <small>{unit.label}</small>
            </div>
          ))}
        </div>
      ) : (
        <p className="countdown-finished">Наш особливий день настав ♡</p>
      )}
    </div>
  );
}

export function EventDetails() {
  const address = String(eventConfig.address).trim();
  return (
    <section className="event-details section-space" id="details" aria-labelledby="details-title">
      <div className="details-top">
        <div className="details-heading reveal">
          <h2 id="details-title">
            Збережіть
            <br />
            <em>цей день.</em>
          </h2>
        </div>
        <Countdown />
      </div>
      <div className="event-information reveal">
        <div className="event-info" role="group" aria-label="Дата події">
          <Icon name="calendar" size={24} />
          <div>
            <h3>{dateLabel}</h3>
            <p>{weekdayLabel} — день для дива</p>
          </div>
        </div>
        <div className="event-info" role="group" aria-label="Час події">
          <Icon name="clock" size={24} />
          <div>
            <h3>{timeLabel}</h3>
            <p>За київським часом</p>
          </div>
        </div>
      </div>
      <div className="venue-layout">
        <figure className="venue-photo">
          <img
            src={eventConfig.venuePhoto.src}
            srcSet={eventConfig.venuePhoto.srcSet}
            sizes="(max-width: 700px) calc(100vw - 56px), (max-width: 1024px) 52vw, 55vw"
            alt={eventConfig.venuePhoto.alt}
            width={eventConfig.venuePhoto.width}
            height={eventConfig.venuePhoto.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="venue-copy" role="group" aria-label="Місце події">
          <h3>{eventConfig.venue}</h3>
          <p>{eventConfig.venueDescription}</p>
          <address>
            <Icon name="pin" size={23} />
            <span>
              {eventConfig.city},<br />
              {address || eventConfig.locationNote}
            </span>
          </address>
          <div className="venue-actions">
            {address && (
              <a
                className="button button-dark"
                href={
                  eventConfig.mapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${eventConfig.city}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Прокласти маршрут <Icon name="arrow" size={18} />
              </a>
            )}
            <a
              className="venue-website"
              href={eventConfig.venueUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Сайт ресторану <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="details-bottom reveal">
        <button className="button button-outline" onClick={downloadCalendar}>
          Додати в календар <Icon name="calendar" size={17} />
        </button>
        <p>Нехай цього дня у ваших планах буде любов.</p>
        <TinyStar />
      </div>
    </section>
  );
}
