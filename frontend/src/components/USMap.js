import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import USMapSVG from '../assets/us-map.svg?react';
export const USMap = ({ data, colorForValue }) => {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!svgRef.current)
            return;
        Object.entries(data).forEach(([state, value]) => {
            const el = svgRef.current?.getElementById(state);
            if (el) {
                el.setAttribute('fill', colorForValue(value));
                el.setAttribute('class', 'state');
                el.setAttribute('title', `${state}: ${value}`);
            }
        });
    }, [data, colorForValue]);
    return _jsx(USMapSVG, { ref: svgRef });
};
