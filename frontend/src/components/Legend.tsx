// frontend/src/components/Legend.tsx
import type { LegendEntry } from '../utils/color';
import styles from './Legend.module.css';

type LegendProps = {
  entries: LegendEntry[];
};

export function Legend({ entries }: LegendProps) {
  return (
    <section className="mt-4 flex flex-col items-center gap-2 text-sm text-slate-700">
      <h2 className="text-base font-semibold text-slate-800">Tax rate legend</h2>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {entries.map((entry) => (
          <div key={entry.label} className={styles.row}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Legend;