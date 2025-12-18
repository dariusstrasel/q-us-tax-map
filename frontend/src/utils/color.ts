// frontend/src/utils/color.ts

// Linear blue → red scale.
// minValue = lowest expected tax rate, maxValue = highest.
const MIN_VALUE = 0;
const MAX_VALUE = 100;

function clamp01(x: number) {
  if (Number.isNaN(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

export type LegendEntry = {
  label: string;
  color: string;
};

export function colorForValue(value: number): string {
  if (value <= 10) return '#e5f5e0';
  if (value <= 20) return '#c7e9c0';
  if (value <= 30) return '#a1d99b';
  if (value <= 40) return '#74c476';
  if (value <= 50) return '#41ab5d';
  if (value <= 75) return '#238b45';
  return '#005a32';
}

export const LEGEND_ENTRIES: LegendEntry[] = [
  { label: 'Low',        color: '#2563eb' }, // blue
  { label: 'Medium-low', color: '#60a5fa' }, // light blue
  { label: 'Medium',     color: '#facc15' }, // yellow
  { label: 'Medium-high',color: '#f97316' }, // orange
  { label: 'High',       color: '#b91c1c' }, // red
];