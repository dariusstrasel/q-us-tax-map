import { useEffect, useRef } from 'react';
import USMapSVG from '../assets/us-map.svg?react';

type Props = {
  data?: Record<string, number>;
  colorForValue: (val: number) => string;
};

export const USMap: React.FC<Props> = ({ data, colorForValue }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) {
      console.log('USMap: svg or data not ready', {
        hasSvg: !!svgRef.current,
        hasData: !!data,
      });
      return;
    }

    console.log('USMap data keys:', Object.keys(data));

    // Quick sanity check: does CA exist in the SVG?

    console.log('USMap data keys:', Object.keys(data));
    console.log('CA element inside SVG:', svgRef.current.getElementById('CA'));

Object.entries(data).forEach(([state, value]) => {
  const el = svgRef.current!.getElementById(state) as SVGGraphicsElement | null;
  if (el) {
    const color = colorForValue(value);
    (el as SVGPathElement).style.fill = color;
    el.setAttribute('fill', color);            // <-- add this
    el.classList.add('state');
    el.setAttribute('title', `${state}: ${value}`);
  }
});
}, [data, colorForValue]);

  return <USMapSVG ref={svgRef} />;
};

export default USMap;