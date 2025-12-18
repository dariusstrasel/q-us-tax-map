// backend/src/csv/csv-error.ts

export type CsvErrorCode =
  | 'CSV_EMPTY'
  | 'CSV_NO_ROWS'
  | 'CSV_BAD_HEADER'
  | 'CSV_BAD_ROW'
  | 'CSV_NO_VALID_ROWS';

export class CsvError extends Error {
  constructor(public readonly code: CsvErrorCode) {
    super(code);
    this.name = 'CsvError';
  }
}