import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Invitation } from './components/Invitation';
import { Icon, TinyStar } from './components/Artwork';
import { dateLabel, eventConfig } from './config';
import { Story } from './components/Story';
import { Prediction } from './components/Prediction';
import { EventDetails } from './components/EventDetails';
import { Timeline } from './components/Timeline';
import { RSVP } from './components/RSVP';
import { Closing } from './components/Closing';
import { ScrollRibbon } from './components/ScrollRibbon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function initialInvitation() {
  try {
    return sessionStorage.getItem(`${eventConfig.id}:opened`) !== 'yes';
  } catch {
    return true;
  }
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Маленький секрет — на початок">
        <Icon name="bow" size={31} />
        <span>маленький секрет</span>
      </a>
      <nav
        className={`navigation ${menuOpen ? 'is-open' : ''}`}
        aria-label="Головна навігація"
        id="main-navigation"
      >
        <a href="#story" onClick={() => setMenuOpen(false)}>
          Наше свято
        </a>
        <a href="#prediction" onClick={() => setMenuOpen(false)}>
          Ваш прогноз
        </a>
        <a href="#details" onClick={() => setMenuOpen(false)}>
          Де й коли
        </a>
        <a href="#rsvp" className="mobile-rsvp" onClick={() => setMenuOpen(false)}>
          Я буду!
        </a>
      </nav>
      <a href="#rsvp" className="header-cta">
        Я буду! <Icon name="arrow" size={16} />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <time className="hero-date hero-enter" dateTime={eventConfig.start}>
        {dateLabel}
      </time>
      <h1 id="hero-title" className="hero-title hero-enter">
        Маленький секрет.
        <br />
        <em>Велике щастя.</em>
      </h1>
      <p className="hero-description hero-enter">
        Хлопчик чи дівчинка? Скоро дізнаємося разом.
        <br />А поки — запрошуємо вас на наше особливе свято.
      </p>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-bow-motion">
          <img src="/images/satin-bow.webp" alt="" width="1100" height="733" fetchPriority="high" />
        </div>
      </div>
      <div className="hero-notes">
        <div className="hero-sidenote sidenote-left hero-enter">
          дві можливості,
          <br />
          <em>одна велика любов</em>
          <svg viewBox="0 0 100 50">
            <path d="M2 9c20-13 35 4 65 23l22 4m-8-13 8 13-15 6" />
          </svg>
        </div>
        <div className="hero-sidenote sidenote-right hero-enter">
          <span className="tiny-heart">♡</span>наш найкращий
          <br />
          <em>сюрприз</em>
        </div>
      </div>
      <a className="button button-blush hero-action hero-enter" href="#prediction">
        <span>Відчуйте серцем</span>
        <Icon name="heart" size={18} />
      </a>
      <TinyStar className="hero-star-one" />
      <TinyStar className="hero-star-two" />
      <div className="hero-bottom hero-enter">
        <span>З любов’ю, {eventConfig.hosts}</span>
        <a href="#story" className="scroll-cue">
          Тут починається наша історія
          <Icon name="down" size={16} />
        </a>
      </div>
    </section>
  );
}

export default function App() {
  const [introOpen, setIntroOpen] = useState(initialInvitation);
  const root = useRef<HTMLDivElement>(null);
  const heroFocus = useRef<HTMLDivElement>(null);
  const closeInvitation = () => {
    try {
      sessionStorage.setItem(`${eventConfig.id}:opened`, 'yes');
    } catch {
      /* Session storage is optional. */
    }
    setIntroOpen(false);
    requestAnimationFrame(() => heroFocus.current?.focus({ preventScroll: true }));
  };
  useGSAP(
    () => {
      if (introOpen) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-enter', {
          y: 22,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
        });
        gsap.from('.hero-art img', {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'all',
        });
        // One gentle settling movement; the tied bow keeps its shape.
        gsap
          .timeline({ defaults: { ease: 'sine.inOut' } })
          .fromTo('.hero-bow-motion', { rotation: -2.5 }, { rotation: 1.5, duration: 1.1 })
          .to('.hero-bow-motion', { rotation: 0, duration: 1.2, clearProps: 'transform' });
        gsap.from('.story-letter', {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.story-letter', start: 'top 92%', once: true },
          clearProps: 'all',
        });
        gsap.from('.timeline-marker', {
          scale: 0.75,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.3)',
          scrollTrigger: { trigger: '.timeline-list', start: 'top 85%', once: true },
          clearProps: 'all',
        });
        gsap.from('.closing-art', {
          rotation: -12,
          y: 15,
          opacity: 0,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.closing', start: 'top 80%', once: true },
          clearProps: 'all',
        });
      });
      media.add(
        '(pointer: fine) and (min-width: 1025px) and (prefers-reduced-motion: no-preference)',
        () => {
          const hero = root.current?.querySelector<HTMLElement>('.hero');
          const art = root.current?.querySelector<HTMLElement>('.hero-art');
          if (!hero || !art) return;
          const xTo = gsap.quickTo(art, 'x', { duration: 0.7, ease: 'power3.out' });
          const yTo = gsap.quickTo(art, 'y', { duration: 0.7, ease: 'power3.out' });
          const rotateTo = gsap.quickTo(art, 'rotation', { duration: 0.9, ease: 'power3.out' });
          const move = (event: PointerEvent) => {
            const box = hero.getBoundingClientRect();
            xTo(((event.clientX - box.left) / box.width - 0.5) * 16);
            yTo(((event.clientY - box.top) / box.height - 0.5) * 10);
            rotateTo(((event.clientX - box.left) / box.width - 0.5) * 3);
          };
          const reset = () => {
            xTo(0);
            yTo(0);
            rotateTo(0);
          };
          hero.addEventListener('pointermove', move, { passive: true });
          hero.addEventListener('pointerleave', reset);
          return () => {
            hero.removeEventListener('pointermove', move);
            hero.removeEventListener('pointerleave', reset);
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [introOpen], revertOnUpdate: true },
  );

  return (
    <>
      <div ref={root} className="site" inert={introOpen}>
        <a className="skip-link" href="#main">
          Перейти до вмісту
        </a>
        <Header />
        <main id="main" ref={heroFocus} tabIndex={-1}>
          <Hero />
          <div className="ribbon-journey">
            <ScrollRibbon active={!introOpen} />
            <Story />
            <Prediction />
            <EventDetails />
            <Timeline />
            <RSVP />
            <Closing
              onReplay={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                setIntroOpen(true);
              }}
            />
          </div>
        </main>
      </div>
      {introOpen && <Invitation onOpen={closeInvitation} />}
    </>
  );
}
