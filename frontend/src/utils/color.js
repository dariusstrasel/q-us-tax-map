// src/utils/color.ts
/**
 * Maps a value (0-100) to a color from blue (low) to red (high).
 */
export function colorForValue(val) {
    const r = Math.round(255 * (val / 100));
    const b = 255 - r;
    return `rgb(${r},0,${b})`;
}
