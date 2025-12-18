// backend/src/csv/csv.controller.ts
import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { MapService } from '../map/map.service';
import { CsvError } from './csv-error';

@Controller('api/csv')
export class CsvController {
  private readonly logger = new Logger(CsvController.name);

  constructor(
    private readonly csvService: CsvService,
    private readonly mapService: MapService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No CSV file uploaded. Please select a file and try again.',
      );
    }

    try {
      const data = this.csvService.parseCsv(file.buffer.toString());
      this.mapService.setMapData(data);
      return { success: true, data };
    } catch (err) {
      // Log internal details for debugging
      this.logger.warn(
        `CSV upload failed: ${err instanceof Error ? err.message : String(err)}`,
      );

      if (err instanceof CsvError) {
        // Map domain error codes to user-friendly messages
        switch (err.code) {
          case 'CSV_EMPTY':
            throw new BadRequestException(
              'The CSV file is empty. Please upload a file with data.',
            );
          case 'CSV_NO_ROWS':
            throw new BadRequestException(
              'CSV must include a header and at least one data row.',
            );
          case 'CSV_BAD_HEADER':
            throw new BadRequestException(
              'CSV header must be "state,value".',
            );
          case 'CSV_BAD_ROW':
            throw new BadRequestException(
              'One or more rows are invalid. Each row must be "STATE,VALUE".',
            );
          case 'CSV_NO_VALID_ROWS':
            throw new BadRequestException(
              'CSV contains no valid state/value rows.',
            );
        }
      }

      // Fallback for unexpected errors: generic message, no debug info
      throw new BadRequestException(
        'Invalid CSV file. Please ensure it has a "state,value" header and at least one valid row.',
      );
    }
  }
}