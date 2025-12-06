import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { MapService } from '../map/map.service';

@Controller('api/csv')
export class CsvController {
  constructor(
    private readonly csvService: CsvService,
    private readonly mapService: MapService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    const data = this.csvService.parseCsv(file.buffer.toString());
    this.mapService.setMapData(data);
    return { success: true, data };
  }
}