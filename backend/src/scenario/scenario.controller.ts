import { Controller, Post } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { MapService } from '../map/map.service';

@Controller('api/scenario')
export class ScenarioController {
  constructor(
    private readonly scenarioService: ScenarioService,
    private readonly mapService: MapService,
  ) {}

  @Post('randomize')
  randomizeScenario() {
    const data = this.scenarioService.generateRandomScenario();
    this.mapService.setMapData(data);
    return { success: true, data };
  }
}