// frontend/src/utils/color.ts

export type LegendEntry = {
  label: string;
  color: string;
};

type ValueBucket = {
  label: string;
  max: number;   // inclusive upper bound
  color: string;
};

// Single source of truth for value → color + legend
export const VALUE_BUCKETS: ValueBucket[] = [
  { label: 'Low',         max: 10, color: '#2563eb' }, // blue
  { label: 'Medium-low',  max: 30, color: '#60a5fa' }, // light blue
  { label: 'Medium',      max: 50, color: '#facc15' }, // yellow
  { label: 'Medium-high', max: 75, color: '#f97316' }, // orange
  { label: 'High',        max: Infinity, color: '#b91c1c' }, // red
];

// Map a numeric value to the bucket color
export function colorForValue(value: number): string {
  const bucket = VALUE_BUCKETS.find((b) => value <= b.max);
  return bucket ? bucket.color : VALUE_BUCKETS[VALUE_BUCKETS.length - 1].color;
}

// Legend just reflects the same buckets
export const LEGEND_ENTRIES: LegendEntry[] = VALUE_BUCKETS.map(
  ({ label, color }) => ({ label, color }),
);