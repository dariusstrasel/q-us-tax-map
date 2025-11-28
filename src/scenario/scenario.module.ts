import { Module } from '@nestjs/common';
import { ScenarioController } from './scenario.controller';
import { ScenarioService } from './scenario.service';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  controllers: [ScenarioController],
  providers: [ScenarioService],
})
export class ScenarioModule {}