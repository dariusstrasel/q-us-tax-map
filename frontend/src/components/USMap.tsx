// frontend/src/components/USMap.tsx
import { useEffect, useRef } from 'react';
import UsMapSvg from '../assets/us-map.svg?react';

type Point = { x: number; y: number };

type USMapProps = {
  data: Record<string, number>;
  colorForValue: (value: number) => string;
  selectedState: string | null;
  onStateClick?: (code: string) => void;
};

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

const SMALL_STATE_CODES = ['CT', 'RI', 'DE', 'MD', 'MA', 'VT', 'NH', 'NJ', 'DC'];

// Rough centroids based on your SVG viewBox
const STATE_CENTROIDS: Record<string, Point> = {
  AL: { x: 730, y: 390 },
  AK: { x: 170, y: 470 },
  AZ: { x: 380, y: 340 },
  AR: { x: 630, y: 370 },
  CA: { x: 260, y: 290 },
  CO: { x: 490, y: 280 },
  CT: { x: 890, y: 190 },
  DE: { x: 890, y: 270 },
  FL: { x: 800, y: 460 },
  GA: { x: 780, y: 410 },
  HI: { x: 190, y: 380 },
  ID: { x: 340, y: 170 },
  IL: { x: 620, y: 290 },
  IN: { x: 670, y: 290 },
  IA: { x: 590, y: 250 },
  KS: { x: 530, y: 310 },
  KY: { x: 700, y: 320 },
  LA: { x: 630, y: 440 },
  ME: { x: 920, y: 100 },
  MD: { x: 870, y: 290 },
  MA: { x: 900, y: 170 },
  MI: { x: 700, y: 210 },
  MN: { x: 580, y: 180 },
  MS: { x: 680, y: 410 },
  MO: { x: 590, y: 320 },
  MT: { x: 420, y: 110 },
  NE: { x: 520, y: 240 },
  NV: { x: 300, y: 230 },
  NH: { x: 890, y: 150 },
  NJ: { x: 880, y: 250 },
  NM: { x: 440, y: 340 },
  NY: { x: 840, y: 180 },
  NC: { x: 810, y: 350 },
  ND: { x: 500, y: 100 },
  OH: { x: 730, y: 270 },
  OK: { x: 530, y: 370 },
  OR: { x: 250, y: 150 },
  PA: { x: 820, y: 250 },
  RI: { x: 910, y: 180 },
  SC: { x: 800, y: 380 },
  SD: { x: 500, y: 160 },
  TN: { x: 690, y: 350 },
  TX: { x: 500, y: 430 },
  UT: { x: 370, y: 260 },
  VT: { x: 880, y: 130 },
  VA: { x: 830, y: 320 },
  WA: { x: 230, y: 90 },
  WV: { x: 770, y: 300 },
  WI: { x: 630, y: 190 },
  WY: { x: 450, y: 200 },
  DC: { x: 870, y: 300 },
};

// External label positions for tiny states, off to the Atlantic
const EXTERNAL_LABEL_POSITIONS: Record<string, Point> = {
  CT: { x: 950, y: 210 },
  RI: { x: 950, y: 230 },
  MA: { x: 950, y: 190 },
  VT: { x: 950, y: 150 },
  NH: { x: 950, y: 170 },
  NJ: { x: 950, y: 250 },
  DE: { x: 950, y: 270 },
  MD: { x: 950, y: 290 },
  DC: { x: 950, y: 310 },
};

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

export default function USMap({
  data,
  colorForValue,
  selectedState,
  onStateClick,
}: USMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getSvg = () =>
    (containerRef.current?.querySelector('svg') as SVGSVGElement | null) ?? null;

  // 1. Create text labels for each state (once)
  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;

    US_STATES.forEach((code) => {
      const centroid = STATE_CENTROIDS[code];
      if (!centroid) return;

      // avoid duplicates on hot-reload
      if (svg.querySelector(`text.state-label[data-code="${code}"]`)) return;

      const text = svg.ownerDocument.createElementNS(
        'http://www.w3.org/2000/svg',
        'text',
      );
      text.textContent = code;
      text.setAttribute('x', String(centroid.x));
      text.setAttribute('y', String(centroid.y));
      text.setAttribute('class', 'state-label');
      text.setAttribute('data-code', code);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', '#333');
      text.style.pointerEvents = 'none';

      svg.appendChild(text);
    });
  }, []);

  // 2. Color states based on `data`
  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;

    Object.entries(data).forEach(([code, value]) => {
      const el = svg.getElementById(code) as SVGPathElement | null;
      if (!el) return;

      const color = colorForValue(value);
      el.style.fill = color;
      el.setAttribute('fill', color);
      el.classList.add('state');
      el.setAttribute('title', `${code}: ${value}`);
    });
  }, [data, colorForValue]);

  // 3. Adjust small-state labels (collision detection + leader lines)
  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;

    // Remove old leader lines
    svg.querySelectorAll('.state-label-leader').forEach((node) => node.remove());

    const labels = Array.from(
      svg.querySelectorAll<SVGTextElement>('text.state-label'),
    );

    const measured = labels.map((label) => {
      const box = label.getBBox();
      const code = label.textContent?.trim() ?? '';
      return { label, box, code };
    });

    const collidingCodes = new Set<string>();

    for (let i = 0; i < measured.length; i++) {
      for (let j = i + 1; j < measured.length; j++) {
        const a = measured[i];
        const b = measured[j];
        if (!a.code || !b.code) continue;
        if (
          !SMALL_STATE_CODES.includes(a.code) &&
          !SMALL_STATE_CODES.includes(b.code)
        ) {
          continue;
        }
        if (rectsOverlap(a.box, b.box)) {
          collidingCodes.add(a.code);
          collidingCodes.add(b.code);
        }
      }
    }

    collidingCodes.forEach((code) => {
      const entry = measured.find((m) => m.code === code);
      if (!entry) return;
      const label = entry.label;

      const centroid = STATE_CENTROIDS[code];
      const external = EXTERNAL_LABEL_POSITIONS[code];
      if (!centroid || !external) return;

      label.setAttribute('x', String(external.x));
      label.setAttribute('y', String(external.y));
      label.classList.add('state-label--external');

      const line = svg.ownerDocument.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      );
      line.setAttribute('x1', String(centroid.x));
      line.setAttribute('y1', String(centroid.y));
      line.setAttribute('x2', String(external.x));
      line.setAttribute('y2', String(external.y));
      line.setAttribute('class', 'state-label-leader');
      line.setAttribute('stroke', '#555');
      line.setAttribute('stroke-width', '0.75');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('pointer-events', 'none');

      svg.appendChild(line);
    });
  }, [data]);

  // 4. Highlight selected state with bold border
  useEffect(() => {
    const svg = getSvg();
    if (!svg) return;

    US_STATES.forEach((code) => {
      const el = svg.getElementById(code) as SVGPathElement | null;
      if (!el) return;
      if (code === selectedState) {
        el.classList.add('state--selected');
      } else {
        el.classList.remove('state--selected');
      }
    });
  }, [selectedState]);

  // 5. Attach click handlers to states
  useEffect(() => {
    const svg = getSvg();
    if (!svg || !onStateClick) return;

    const handlers: Array<{ el: SVGElement; handler: () => void }> = [];

    US_STATES.forEach((code) => {
      const el = svg.getElementById(code) as SVGElement | null;
      if (!el) return;
      const handler = () => onStateClick(code);
      el.style.cursor = 'pointer';
      el.addEventListener('click', handler);
      handlers.push({ el, handler });
    });

    return () => {
      handlers.forEach(({ el, handler }) =>
        el.removeEventListener('click', handler),
      );
    };
  }, [onStateClick]);

  return (
    <div ref={containerRef}>
      <UsMapSvg />
    </div>
  );
}