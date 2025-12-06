import React, { useEffect, useRef } from 'react';
import USMapSVG from '../assets/us-map.svg?react';

type Props = {
  data: Record<string, number>;
  colorForValue: (val: number) => string;
};

export const USMap: React.FC<Props> = ({ data, colorForValue }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    Object.entries(data).forEach(([state, value]) => {
      const el = svgRef.current?.getElementById(state);
      if (el) {
        el.setAttribute('fill', colorForValue(value));
        el.setAttribute('class', 'state');
        el.setAttribute('title', `${state}: ${value}`);
      }
    });
  }, [data, colorForValue]);

  return <USMapSVG ref={svgRef} />;
};