// frontend/src/components/WorldMap.tsx
import { useEffect, useRef } from 'react';
import WorldSvg from '../assets/world-map.svg?react'; // via vite-plugin-svgr

type WorldMapProps = {
  data: Record<string, number>;
  colorForValue: (v: number) => string;
  selectedRegion: string | null;
  onRegionClick?: (code: string) => void;
};

export function WorldMap({ data, colorForValue, selectedRegion, onRegionClick }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    Object.entries(data).forEach(([code, value]) => {
      const el = svg.getElementById(code) as SVGPathElement | null;
      if (!el) return;
      const color = colorForValue(value);
      el.style.fill = color;
      el.setAttribute('fill', color);
      el.classList.add('region');
      el.setAttribute('title', `${code}: ${value}`);
    });
  }, [data, colorForValue]);

  // Very similar selection + click logic as USMap, just with different key set.

  return <WorldSvg ref={svgRef} />;
}