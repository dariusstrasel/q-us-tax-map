import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvService {
  parseCsv(csv: string): Record<string, number> {
    // Expects CSV: state,value
    const lines = csv.trim().split('\n');
    const data: Record<string, number> = {};
    for (const line of lines.slice(1)) { // skip header
      const [state, value] = line.split(',');
      data[state.trim()] = Number(value);
    }
    return data;
  }
}