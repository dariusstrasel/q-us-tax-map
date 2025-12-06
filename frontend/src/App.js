import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState, useEffect } from 'react';
import { USMap } from './components/USMap';
import { Controls } from './components/Controls';
import { Legend } from './components/Legend';
import { parseCsv } from './utils/csv';
import { colorForValue } from './utils/color';
const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
export default function App() {
    const [data, setData] = useState({});
    // Fetch map data from backend on mount
    useEffect(() => {
        fetchMapData();
    }, []);
    async function fetchMapData() {
        try {
            const res = await fetch('/api/map/data');
            if (!res.ok)
                throw new Error();
            setData(await res.json());
        }
        catch {
            // fallback: empty or local
            setData({});
        }
    }
    async function handleCsvUpload(file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/csv/upload', { method: 'POST', body: formData });
            const { data } = await res.json();
            setData(data);
        }
        catch {
            // fallback: client-side parse
            const text = await file.text();
            setData(parseCsv(text));
        }
    }
    async function handleRandomize() {
        try {
            const res = await fetch('/api/scenario/randomize', { method: 'POST' });
            const { data } = await res.json();
            setData(data);
        }
        catch {
            // fallback: client-side random
            const randomData = {};
            US_STATES.forEach(s => (randomData[s] = Math.floor(Math.random() * 100)));
            setData(randomData);
        }
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "US Taxation Map - Scenario Visualizer" }), _jsx(Controls, { onCsvUpload: handleCsvUpload, onRandomize: handleRandomize }), _jsx(USMap, { data: data, colorForValue: colorForValue }), _jsx(Legend, {})] }));
}
