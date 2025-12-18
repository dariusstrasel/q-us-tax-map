// backend/src/csv/csv.service.ts
import { Injectable } from '@nestjs/common';
import { CsvError } from './csv-error';

@Injectable()
export class CsvService {
  parseCsv(csv: string): Record<string, number> {
    if (!csv || !csv.trim()) {
      throw new CsvError('CSV_EMPTY');
    }

    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      throw new CsvError('CSV_NO_ROWS');
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    if (header[0] !== 'state' || header[1] !== 'value') {
      throw new CsvError('CSV_BAD_HEADER');
    }

    const data: Record<string, number> = {};

    for (const rawLine of lines.slice(1)) {
      const line = rawLine.trim();
      if (!line) continue;

      const [state, valueStr] = line.split(',');
      const stateCode = state?.trim();
      const value = Number(valueStr);

      if (!stateCode || Number.isNaN(value)) {
        throw new CsvError('CSV_BAD_ROW');
      }

      data[stateCode] = value;
    }

    if (Object.keys(data).length === 0) {
      throw new CsvError('CSV_NO_VALID_ROWS');
    }

    return data;
  }
}