import { Injectable } from '@nestjs/common';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

@Injectable()
export class ScenarioService {
  generateRandomScenario(): Record<string, number> {
    const data: Record<string, number> = {};
    for (const state of US_STATES) {
      data[state] = Math.floor(Math.random() * 100); // 0-99
    }
    return data;
  }
}