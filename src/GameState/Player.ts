import { Resource } from './Board';

export enum DevCard {
  Knight="Knight",
  RoadBuilding="RoadBuilding",
  YearOfPlenty="YearOfPlenty",
  Monopoly="Monopoly",
  VictoryPoint="VictoryPoint"
}

export class Player {
    name: string;
    resources: Record<Resource, number> = {
      "Brick": 0,
      "Lumber": 0,
      "Ore": 0,
      "Grain": 0,
      "Wool": 0,
    };
    devCards: DevCard[] = [];

    constructor(name: string) {
      this.name = name;
    }
  
  }