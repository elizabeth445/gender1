import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SatinBow, Icon, TinyStar } from './Artwork';
import { shortDateLabel } from '../config';

export function Invitation({ onOpen }: { onOpen: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opening, setOpening] = useState(false);
  const started = useRef(false);
  const { contextSafe } = useGSAP({ scope: dialog });

  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      node?.close();
    };
  }, []);

  const animateOpen = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpen();
      return;
    }
    gsap
      .timeline({ defaults: { ease: 'power3.inOut' }, onComplete: onOpen })
      .addLabel('untie')
      .to('.satin-knot', { scaleX: 0.55, rotation: -12, transformOrigin: '560px 252px', duration: 0.28 }, 'untie')
      .to('.satin-loop-blue', { scaleX: 0.08, x: -90, rotation: -12, transformOrigin: '550px 252px', duration: 0.72 }, 'untie+=.15')
      .to('.satin-loop-rose', { scaleX: 0.08, x: 90, rotation: 12, transformOrigin: '550px 252px', duration: 0.72 }, 'untie+=.15')
      .to('.satin-tail-blue', { x: -290, y: 100, rotation: 18, transformOrigin: '500px 310px', duration: 0.95 }, 'untie+=.18')
      .to('.satin-tail-rose', { x: 290, y: 100, rotation: -18, transformOrigin: '600px 310px', duration: 0.95 }, 'untie+=.18')
      .to('.satin-knot', { scale: 0.15, opacity: 0, duration: 0.35 }, 'untie+=.35')
      .to('.satin-loop-blue, .satin-loop-rose', { opacity: 0, duration: 0.2 }, 'untie+=.72')
      .to('.satin-tail-blue, .satin-tail-rose', { opacity: 0, duration: 0.3 }, 'untie+=.8')
      .to('.ribbon-blue', { xPercent: -105, opacity: 0, duration: 0.65 }, 'untie+=.55')
      .to('.ribbon-rose', { xPercent: 105, opacity: 0, duration: 0.65 }, 'untie+=.55')
      .addLabel('unfold', 1.25)
      .to(
        '.card-door-left',
        { rotationY: -125, transformOrigin: 'left center', duration: 0.9 },
        'unfold',
      )
      .to(
        '.card-door-right',
        { rotationY: 125, transformOrigin: 'right center', duration: 0.9 },
        '<',
      )
      .fromTo('.card-secret', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '<.2')
      .to('.invitation-dialog', { opacity: 0, duration: 0.45 }, '+=.3');
  });

  const open = () => {
    if (started.current) return;
    started.current = true;
    setOpening(true);
    animateOpen();
  };

  return (
    <dialog
      ref={dialog}
      className="invitation-dialog"
      aria-labelledby="invitation-title"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons =
          dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onOpen();
      }}
    >
      <div className="invitation-layout">
        <div className="wordmark invitation-wordmark">
          <Icon name="bow" size={30} />
          <span>маленький секрет</span>
        </div>
        <div className="invitation-content">
          <h1 id="invitation-title">
            У нас для вас
            <br />
            маленький <em>секрет…</em>
          </h1>
          <div className="invitation-parcel" aria-hidden="true">
            <TinyStar className="parcel-star" />
            <div className="folded-card">
              <div className="card-secret">
                <Icon name="heart" size={32} />
                <span>
                  Велика любов.
                  <br />
                  <em>Маленьке диво.</em>
                </span>
                <small>{shortDateLabel}</small>
              </div>
              <div className="card-door card-door-left" />
              <div className="card-door card-door-right" />
              <div className="card-ribbon ribbon-blue" />
              <div className="card-ribbon ribbon-rose" />
              <SatinBow />
            </div>
          </div>
          <button className="button button-blush" onClick={open} disabled={opening}>
            {opening ? 'Відкриваємо наше свято…' : 'Відкрити запрошення'}
            <Icon name="arrow" size={19} />
          </button>
        </div>
        <button className="skip-button" onClick={onOpen}>
          Перейти до запрошення <Icon name="arrow" size={16} />
        </button>
      </div>
    </dialog>
  );
}
