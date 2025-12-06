import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}