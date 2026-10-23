import { useId, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { readLocal, writeLocal } from '../lib';
import { Icon, TinyStar } from './Artwork';

type Team = 'boy' | 'girl';
const isTeam = (value: unknown): value is Team => value === 'boy' || value === 'girl';

type Flight = {
  id: number;
  team: Team;
  left: number;
  top: number;
  width: number;
  height: number;
};

function BalloonFlight({ flight, onComplete }: { flight: Flight; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const direction = flight.team === 'boy' ? -1 : 1;
        gsap
          .timeline({ onComplete })
          .to('.balloon-flight-art', {
            y: -12,
            rotation: direction * 4,
            duration: 0.2,
            ease: 'sine.out',
          })
          .to('.balloon-flight-art', {
            y: -(flight.top + flight.height + 50),
            x: direction * Math.min(window.innerWidth * 0.04, 45),
            rotation: direction * -7,
            duration: 1.35,
            ease: 'power1.in',
          })
          .to('.balloon-flight-art', { autoAlpha: 0, duration: 0.18 }, '-=.18');
      });
      media.add('(prefers-reduced-motion: reduce)', onComplete);
      return () => media.revert();
    },
    { scope: root },
  );

  return createPortal(
    <div className="balloon-flight" ref={root} aria-hidden="true" data-team={flight.team}>
      <div
        className="balloon-flight-art"
        style={{ left: flight.left, top: flight.top, width: flight.width, height: flight.height }}
      >
        <Balloon team={flight.team} />
      </div>
    </div>,
    document.body,
  );
}

function Balloon({ team }: { team: Team }) {
  const id = useId().replace(/:/g, '');
  const blue = team === 'boy';
  return (
    <svg className="balloon" viewBox="0 0 200 240" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx=".28" cy=".2" r=".83">
          <stop stopColor={blue ? '#f4f9fc' : '#fff1ee'} />
          <stop offset=".35" stopColor={blue ? '#d5e6ef' : '#f0c9c8'} />
          <stop offset=".75" stopColor={blue ? '#9ab9cb' : '#d69da5'} />
          <stop offset="1" stopColor={blue ? '#7f9fb9' : '#bd7f8e'} />
        </radialGradient>
      </defs>
      <path d="M100 160c-18 33 35 42 6 77" stroke={blue ? '#8eabbc' : '#bc9099'} strokeWidth="1" />
      <ellipse cx="100" cy="83" rx="63" ry="76" fill={`url(#${id})`} />
      <path d="m100 157-7 9c6 2 10 2 15 0l-7-9" fill={blue ? '#9db9cc' : '#cd909d'} />
      <ellipse
        cx="74"
        cy="53"
        rx="9"
        ry="24"
        transform="rotate(25 74 53)"
        fill="white"
        opacity=".45"
      />
    </svg>
  );
}

function BalloonConfetti() {
  return (
    <svg
      className="balloon-confetti"
      viewBox="0 0 280 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <path d="m34 47 2.8 8.2L45 58l-8.2 2.8L34 69l-2.8-8.2L23 58l8.2-2.8Z" />
        <path d="m245 112 2.3 6.7 6.7 2.3-6.7 2.3-2.3 6.7-2.3-6.7-6.7-2.3 6.7-2.3Z" />
        <rect x="48" y="132" width="5" height="13" rx="1.2" transform="rotate(-28 48 132)" />
        <rect x="221" y="37" width="4" height="12" rx="1" transform="rotate(32 221 37)" />
        <circle cx="58" cy="185" r="2.5" />
        <circle cx="225" cy="83" r="2" />
        <circle cx="87" cy="24" r="1.8" />
      </g>
      <g fill="var(--confetti-pale)">
        <path d="m197 18 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
        <path d="m210 187 1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8Z" />
        <rect x="23" y="101" width="5" height="9" rx="1" transform="rotate(18 23 101)" />
        <rect x="233" y="159" width="6" height="10" rx="1" transform="rotate(-23 233 159)" />
        <circle cx="66" cy="80" r="3" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".75">
        <path d="M57 105c10-7 13 5 4 6s-6 9 2 10" />
        <path d="M208 144c-8 3-2 10 3 7s9 4 3 9" />
      </g>
      <g fill="white" opacity=".85">
        <circle cx="34" cy="58" r="1.4" />
        <circle cx="245" cy="121" r="1.2" />
      </g>
    </svg>
  );
}

export function Prediction() {
  const [team, setTeam] = useState<Team | null>(() => readLocal('prediction', isTeam));
  const [storageError, setStorageError] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const flightId = useRef(0);
  const choose = (event: MouseEvent<HTMLButtonElement>, value: Team) => {
    setTeam(value);
    setStorageError(!writeLocal('prediction', value));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFlight(null);
      return;
    }
    if (flight?.team === value) return;
    const balloon = event.currentTarget.querySelector('.balloon');
    if (!balloon) return;
    const { left, top, width, height } = balloon.getBoundingClientRect();
    setFlight({ id: ++flightId.current, team: value, left, top, width, height });
  };
  return (
    <section
      className="prediction section-space"
      id="prediction"
      aria-labelledby="prediction-title"
    >
      <div className="section-heading reveal">
        <h2 id="prediction-title">
          А як думаєте <em>ви?</em>
        </h2>
        <p>Дві команди. Одне маленьке диво. Що підказує ваше серце?</p>
      </div>
      <div className="prediction-options reveal" role="group" aria-label="Ваш прогноз">
        {(['boy', 'girl'] as const).map((option) => (
          <button
            key={option}
            className={`prediction-card ${option} ${team === option ? 'is-selected' : ''} ${flight?.team === option ? 'is-releasing' : ''}`}
            aria-pressed={team === option}
            onClick={(event) => choose(event, option)}
          >
            <div className="balloon-wrap">
              <BalloonConfetti />
              <Balloon team={option} />
              {team === option && (
                <div className="choice-burst" key={team}>
                  <TinyStar />
                  <TinyStar />
                  <TinyStar />
                  <TinyStar />
                </div>
              )}
            </div>
            <span className="choice-name">{option === 'boy' ? 'Хлопчик' : 'Дівчинка'}</span>
            <span className="choice-bottom">
              {team === option
                ? 'Це моя команда'
                : option === 'boy'
                  ? 'Команда хлопчика'
                  : 'Команда дівчинки'}
              <Icon name={team === option ? 'check' : 'arrow'} size={16} />
            </span>
          </button>
        ))}
        <span className="choice-or" aria-hidden="true">
          чи
        </span>
      </div>
      <div className="prediction-feedback" aria-live="polite" aria-atomic="true">
        {team ? (
          <p className="prediction-saved">
            <Icon name="check" size={17} />
            {storageError
              ? 'Ваш прогноз обрано. Браузер не дозволив зберегти його після закриття.'
              : 'Ваш прогноз збережено! Скоро дізнаємося, хто мав рацію.'}
          </p>
        ) : (
          <p>Торкніться своєї команди — нехай це буде ваш маленький прогноз.</p>
        )}
        <span>
          {team
            ? 'Можна передумати: просто оберіть іншу команду.'
            : 'Правильна відповідь поки що залишається секретом ♡'}
        </span>
      </div>
      {flight && (
        <BalloonFlight
          key={flight.id}
          flight={flight}
          onComplete={() => setFlight((current) => (current?.id === flight.id ? null : current))}
        />
      )}
    </section>
  );
}
