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
    resources: { [ResourceType: string]: number} = { };
    devCards: DevCard[] = [];

    constructor(name: string) {
      this.name = name;
      for (let item in Resource) {
        if (item == Resource.Desert) continue;
        this.resources[item] = 0;  
      }
    }
  
  }