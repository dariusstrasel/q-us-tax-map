import { Injectable } from '@nestjs/common';

@Injectable()
export class MapService {
  private mapData: Record<string, number> = {};

  setMapData(data: Record<string, number>) {
    this.mapData = data;
  }

  getCurrentMapData() {
    return this.mapData;
  }
}