import { Module } from '@nestjs/common';
import { MapModule } from './map/map.module';
import { CsvModule } from './csv/csv.module';
import { ScenarioModule } from './scenario/scenario.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [MapModule, CsvModule, ScenarioModule, StaticModule],
})
export class AppModule {}