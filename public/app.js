// Minimal US map SVG (replace with a full SVG for production)
const US_MAP_SVG = `
<svg viewBox="0 0 960 600" width="800" height="500">
  <!-- Example: Replace with full US map SVG, each state as <path id="XX" ...> -->
  <g>
    <rect id="CA" x="50" y="300" width="100" height="100"/>
    <rect id="TX" x="300" y="400" width="120" height="80"/>
    <rect id="ME" x="800" y="100" width="40" height="40"/>
    <!-- ... add all states ... -->
  </g>
</svg>
`;

const US_STATES = ['CA','TX','ME']; // Extend to all states

function colorForValue(val) {
  // Blue (low) to Red (high)
  const r = Math.round(255 * (val / 100));
  const b = 255 - r;
  return `rgb(${r},0,${b})`;
}

function renderMap(data) {
  document.getElementById('map').innerHTML = US_MAP_SVG;
  for (const state of US_STATES) {
    const el = document.getElementById(state);
    if (el) {
      const val = data[state] ?? 0;
      el.setAttribute('fill', colorForValue(val));
      el.setAttribute('class', 'state');
      el.setAttribute('title', `${state}: ${val}`);
    }
  }
}

async function fetchMapData() {
  try {
    const res = await fetch('/api/map/data');
    if (!res.ok) throw new Error('No backend');
    const data = await res.json();
    renderMap(data);
    document.getElementById('status').textContent = 'Loaded from server';
  } catch {
    document.getElementById('status').textContent = 'Backend unavailable, using client mode';
  }
}

document.getElementById('csvInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch('/api/csv/upload', { method: 'POST', body: formData });
    const { data } = await res.json();
    renderMap(data);
    document.getElementById('status').textContent = 'CSV uploaded';
  } catch {
    // Fallback: client-side CSV parse
    const reader = new FileReader();
    reader.onload = function(evt) {
      const lines = evt.target.result.trim().split('\n');
      const data = {};
      for (const line of lines.slice(1)) {
        const [state, value] = line.split(',');
        data[state.trim()] = Number(value);
      }
      renderMap(data);
      document.getElementById('status').textContent = 'CSV loaded (client)';
    };
    reader.readAsText(file);
  }
});

document.getElementById('randomBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/scenario/randomize', { method: 'POST' });
    const { data } = await res.json();
    renderMap(data);
    document.getElementById('status').textContent = 'Random scenario (server)';
  } catch {
    // Fallback: client-side random
    const data = {};
    for (const state of US_STATES) {
      data[state] = Math.floor(Math.random() * 100);
    }
    renderMap(data);
    document.getElementById('status').textContent = 'Random scenario (client)';
  }
});

// Initial load
fetchMapData();