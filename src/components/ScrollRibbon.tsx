import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollRibbon({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  useGSAP(
    () => {
      const drawing = svg.current;
      const line = path.current;
      const journey = drawing?.parentElement;
      if (!drawing || !line || !journey || !active) return;
      let previousWidth = 0;
      let previousHeight = 0;
      const draw = () => {
        const width = journey.clientWidth;
        const height = journey.clientHeight;
        if (width === previousWidth && height === previousHeight) return false;
        previousWidth = width;
        previousHeight = height;
        drawing.setAttribute('viewBox', `0 0 ${width} ${height}`);
        const gutter = width < 700 ? 9 : width < 1100 ? 20 : 36;
        const left = gutter;
        const right = width - gutter;
        let x = right;
        let d = `M ${width * 0.8} 0 C ${width * 0.8} 45 ${x} 20 ${x} 90`;
        const sections = [...journey.querySelectorAll<HTMLElement>(':scope > section')];
        for (let index = 0; index < sections.length - 1; index++) {
          const bottom = sections[index].offsetTop + sections[index].offsetHeight;
          const nextX = index % 2 === 0 ? left : right;
          d += ` C ${x} ${bottom - 150} ${x} ${bottom - 90} ${x} ${bottom - 52}`;
          d += ` C ${x} ${bottom + 10} ${nextX} ${bottom - 10} ${nextX} ${bottom + 52}`;
          x = nextX;
        }
        const endY = height - 80;
        d += ` C ${x} ${endY - 130} ${width * 0.8} ${endY - 80} ${width * 0.8} ${endY}`;
        d += ' c -30 -28 -34 9 0 20 c 34 -11 30 -48 0 -20';
        line.setAttribute('d', d);
        return true;
      };
      draw();
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          line,
          {
            strokeDasharray: () => line.getTotalLength(),
            strokeDashoffset: () => line.getTotalLength(),
          },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: journey,
              start: 'top 90%',
              end: 'bottom bottom',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      let timer = 0;
      const observer = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (draw()) ScrollTrigger.refresh();
        }, 120);
      });
      observer.observe(journey);
      return () => {
        observer.disconnect();
        clearTimeout(timer);
        media.revert();
      };
    },
    { scope: svg, dependencies: [active], revertOnUpdate: true },
  );
  return (
    <svg
      ref={svg}
      className="journey-ribbon"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path ref={path} stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
