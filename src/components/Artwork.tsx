import { useId } from 'react';

export function Icon({
  name,
  size = 22,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v15m-6-6 6 6 6-6" />
      </>
    ),
    heart: (
      <path d="M12 20S3 14.5 3 8.5a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1C21 14.5 12 20 12 20Z" />
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4m8-4v4M4 11h16m-12 4h2m4 0h2" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    spark: (
      <>
        <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
      </>
    ),
    cake: (
      <>
        <path d="M4 14h16v7H4zm0 3c3 3 5-3 8 0s5-3 8 0M7 14V9h10v5m-5-5V5m0-3v1" />
      </>
    ),
    bow: (
      <>
        <path d="M12 12C-3-4-2 22 12 12Zm0 0C27-4 26 22 12 12Zm-1 1L6 22m7-9 5 9" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    camera: (
      <>
        <path d="m8 5 1-2h6l1 2h5v15H3V5Z" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
    replay: (
      <>
        <path d="M4 9a8 8 0 1 1 0 6M4 4v5h5" />
      </>
    ),
    menu: <path d="M4 8h16M4 16h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    edit: (
      <>
        <path d="m4 16 12-12 4 4L8 20H4Z" />
        <path d="m13 7 4 4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}

export function Bow({
  className = '',
  color = 'rose',
}: {
  className?: string;
  color?: 'rose' | 'blue' | 'cream';
}) {
  const id = useId().replace(/:/g, '');
  const colors =
    color === 'blue'
      ? ['#c1d5e1', '#829fb9', '#e1edf1']
      : color === 'cream'
        ? ['#ecd9a5', '#c2a575', '#fff0c8']
        : ['#d9a5aa', '#b97783', '#f6d3d1'];
  return (
    <svg className={`drawn-bow ${className}`} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="10" y1="0" x2="190" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors[2]} />
          <stop offset=".4" stopColor={colors[0]} />
          <stop offset=".65" stopColor={colors[1]} />
          <stop offset=".85" stopColor={colors[2]} />
          <stop offset="1" stopColor={colors[0]} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`} stroke={colors[1]} strokeWidth=".65">
        <path
          className="bow-tail-left"
          d="M104 71c-20 20-42 35-48 74l19-5 12 13c-5-30 17-51 25-70Z"
        />
        <path
          className="bow-tail-right"
          d="M113 74c12 18 39 21 49 64l-17-7-13 14c2-31-15-38-26-62Z"
        />
        <path
          className="bow-loop-left"
          d="M107 72C86 20 26 12 30 46c5 35 49 49 77 34l1-8ZM96 70C76 49 45 30 39 39c-8 13 23 34 57 31Z"
          fillRule="evenodd"
        />
        <path
          className="bow-loop-right"
          d="M113 73c22-54 80-59 77-25-3 33-47 46-78 32l1-7Zm12-3c22-22 47-36 53-29 8 13-20 30-53 29Z"
          fillRule="evenodd"
        />
        <path d="M104 65c-6 4-5 15 0 20l13-1c5-4 5-15 0-20Z" />
      </g>
      <path
        d="M108 68c-3 5-1 12 1 14M44 45c10 13 28 22 47 27m40 0c15-8 33-18 43-27"
        stroke={colors[2]}
        strokeWidth="1.5"
        opacity=".8"
      />
    </svg>
  );
}

export function TinyStar({ className = '' }: { className?: string }) {
  return (
    <svg className={`tiny-star ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 1c0 15-4 19-19 19 15 0 19 4 19 19 0-15 4-19 19-19C24 20 20 16 20 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CelebrationStillLife() {
  const id = useId().replace(/:/g, '');
  return (
    <div className="timeline-art" aria-hidden="true">
      <svg viewBox="0 0 420 300" fill="none">
        <defs>
          <radialGradient id={`${id}-balloon`} cx=".25" cy=".2" r=".9">
            <stop stopColor="#fbefed" />
            <stop offset=".65" stopColor="#e5bdc1" />
            <stop offset="1" stopColor="#c893a0" />
          </radialGradient>
          <linearGradient
            id={`${id}-paper`}
            x1="145"
            y1="99"
            x2="282"
            y2="235"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fffdf7" />
            <stop offset="1" stopColor="#ede3d4" />
          </linearGradient>
        </defs>
        <ellipse cx="214" cy="264" rx="153" ry="13" fill="#725a43" opacity=".045" />
        <path d="M80 139c-25 42 59 47 66 89" stroke="#bc979d" />
        <ellipse cx="80" cy="87" rx="37" ry="49" fill={`url(#${id}-balloon)`} />
        <ellipse
          cx="67"
          cy="69"
          rx="5"
          ry="14"
          transform="rotate(24 67 69)"
          fill="white"
          opacity=".5"
        />
        <path d="m80 135-5 9h10Z" fill="#cf9eaa" />
        <g transform="rotate(12 249 161)">
          <rect
            x="183"
            y="72"
            width="137"
            height="173"
            rx="2"
            fill="#a08b73"
            opacity=".08"
            transform="translate(4 6)"
          />
          <rect x="183" y="72" width="137" height="173" rx="2" fill="#f5e8cf" stroke="#d6c5a8" />
          <rect x="194" y="83" width="115" height="151" rx="1" stroke="#d6c5a8" strokeWidth=".6" />
          <path d="M251 102c-17-21-36 8 0 27 36-19 17-48 0-27Z" stroke="#b99d7e" />
        </g>
        <g transform="rotate(-8 216 187)">
          <rect
            x="127"
            y="126"
            width="179"
            height="121"
            rx="2"
            fill="#80604d"
            opacity=".07"
            transform="translate(2 5)"
          />
          <rect
            x="127"
            y="126"
            width="179"
            height="121"
            rx="2"
            fill={`url(#${id}-paper)`}
            stroke="#d9ccba"
          />
          <path d="m128 127 88 66 89-66" fill="#f9f1e6" stroke="#d9ccba" />
          <path d="m128 246 63-69m114 69-63-69" stroke="#dfd1bf" />
          <path d="M127 183h179" stroke="#adc5d6" strokeWidth="18" />
          <path d="M127 180h179" stroke="#dbe8ee" strokeWidth="4" opacity=".7" />
        </g>
        <g transform="rotate(-6 88 229)">
          <rect x="55" y="199" width="73" height="60" fill="#d3e0e5" stroke="#b3c7d1" />
          <rect x="50" y="189" width="83" height="14" rx="1" fill="#e1ebed" stroke="#b3c7d1" />
          <path d="M91 190v69" stroke="#cba8af" strokeWidth="13" />
          <path d="M91 190c-34-35-37 8 0 0 34-35 37 8 0 0" fill="#e6c9cb" stroke="#cba8af" />
        </g>
        <path
          d="M351 80c-22-25-43 11 0 35 43-24 22-60 0-35Z"
          fill="#e4c5c8"
          transform="rotate(15 351 97)"
        />
        <path d="M351 80v35" stroke="#c8a0a8" transform="rotate(15 351 97)" />
        <g strokeLinecap="round">
          <path d="m136 63 7-10m185 175 8 5m-163 38 2 8" stroke="#b8cad5" strokeWidth="3" />
          <path d="m41 151 6 5m304-15 8 3m-64-95 2 7" stroke="#d9b7be" strokeWidth="3" />
        </g>
        <path
          d="M148 94c0 8-2 10-10 10 8 0 10 2 10 10 0-8 2-10 10-10-8 0-10-2-10-10Zm206 116c0 10-3 13-13 13 10 0 13 3 13 13 0-10 3-13 13-13-10 0-13-3-13-13Z"
          fill="#c6ab76"
        />
      </svg>
      <Bow className="timeline-art-bow" color="blue" />
    </div>
  );
}

/** The hero's satin photograph, separated into independently moving ribbon pieces. */
export function SatinBow() {
  const id = useId().replace(/:/g, '');
  const pieces = [
    { name: 'loop-blue', x: 0, y: 0, width: 550, height: 310 },
    { name: 'loop-rose', x: 550, y: 0, width: 550, height: 310 },
    { name: 'tail-blue', x: 0, y: 310, width: 550, height: 423 },
    { name: 'tail-rose', x: 550, y: 310, width: 550, height: 423 },
    { name: 'knot', x: 505, y: 200, width: 110, height: 105 },
  ];
  return (
    <svg className="invitation-bow satin-bow" viewBox="0 0 1100 733" aria-hidden="true">
      <defs>{pieces.map(piece => <clipPath id={`${id}-${piece.name}`} key={piece.name}><rect x={piece.x} y={piece.y} width={piece.width} height={piece.height} /></clipPath>)}</defs>
      {pieces.map(piece => <g key={piece.name} className={`satin-piece satin-${piece.name}`}><image href="/images/satin-bow.webp" width="1100" height="733" clipPath={`url(#${id}-${piece.name})`} /></g>)}
    </svg>
  );
}
