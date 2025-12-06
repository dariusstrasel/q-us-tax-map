import { Controller, Get } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('api/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('data')
  getMapData() {
    return this.mapService.getCurrentMapData();
  }
}