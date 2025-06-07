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
    playableDevCards: DevCard[] = [];
    playedDevCards: DevCard[] = []; // this is where knight and progress cards go after being played. Victory cards always remain in playableDevCards[]
    constructor(name: string) {
      this.name = name;
    }
  
  }