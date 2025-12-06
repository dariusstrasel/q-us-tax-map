// src/utils/csv.ts
/**
 * Parses a CSV string into a Record<string, number>.
 * Expects header: state,value
 */
export function parseCsv(csv) {
    const lines = csv.trim().split('\n');
    const data = {};
    for (const line of lines.slice(1)) { // skip header
        const [state, value] = line.split(',');
        if (state && value) {
            data[state.trim()] = Number(value);
        }
    }
    return data;
}
