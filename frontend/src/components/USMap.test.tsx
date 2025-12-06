// src/components/USMap.test.tsx
import { render } from '@testing-library/react';
import { USMap } from './USMap';
import { colorForValue } from '../utils/color';
import '@testing-library/jest-dom';


test('renders USMap and colors CA', () => {
  const data = { CA: 50 };
  render(<USMap data={data} colorForValue={colorForValue} />);
  const ca = document.getElementById('CA');
  expect(ca).toBeTruthy();
  expect(ca?.getAttribute('fill')).toBe(colorForValue(50));
});