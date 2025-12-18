import { useEffect, useState } from 'react';
import USMap from './components/USMap';
import { Controls } from './components/Controls';
import { Legend } from './components/Legend';
import { colorForValue, LEGEND_ENTRIES } from './utils/color';
import { parseCsv } from './utils/csv';
import { StateModal } from './components/StateModal';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

export default function App() {
  const [data, setData] = useState<Record<string, number>>({});
  const [csvError, setCsvError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ code: string; value: number | undefined } | null>(null);

  useEffect(() => {
    fetchMapData();
  }, []);

  async function fetchMapData() {
    try {
      const res = await fetch('/api/map/data');
      if (!res.ok) throw new Error('Failed to fetch map data');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setData({});
    }
  }

  async function handleCsvUpload(file: File) {
    setCsvError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/csv/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let message = 'Failed to upload CSV. Please check the file and try again.';
        try {
          const body = await res.json();
          if (body?.message) {
            message = Array.isArray(body.message)
              ? body.message.join('\n')
              : String(body.message);
          }
        } catch {
          /* ignore parse error */
        }
        setCsvError(message);
        return;
      }

      const { data } = await res.json();
      setData(data);
    } catch (err) {
      console.error('CSV upload failed, falling back to client parse', err);
      try {
        const text = await file.text();
        setData(parseCsv(text));
      } catch {
        setCsvError(
          'Could not parse CSV file. Please ensure it has a "state,value" header and at least one valid row.',
        );
      }
    }
  }

  async function handleRandomize() {
    try {
      const res = await fetch('/api/scenario/randomize', { method: 'POST' });
      const { data } = await res.json();
      setData(data);
    } catch {
      const randomData: Record<string, number> = {};
      US_STATES.forEach(
        (s) => (randomData[s] = Math.floor(Math.random() * 100)),
      );
      setData(randomData);
    }
  }

  function handleStateClick(code: string) {
    setSelected({ code, value: data[code] });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4 md:mb-6">
          US Taxation Map - Scenario Visualizer
        </h1>

        {csvError && <p className="csv-error">{csvError}</p>}

        <div className="mb-4 md:mb-6">
          <Controls
            onCsvUpload={handleCsvUpload}
            onRandomize={handleRandomize}
          />
        </div>

        <div className="mx-auto max-w-4xl">
          <USMap
            data={data}
            colorForValue={colorForValue}
            selectedState={selected?.code ?? null}
            onStateClick={handleStateClick}
          />
        </div>

        <Legend entries={LEGEND_ENTRIES} />
      </div>

      {selected && (
        <StateModal
          code={selected.code}
          value={selected.value}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}