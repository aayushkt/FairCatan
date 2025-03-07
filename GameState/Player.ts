import { Resource } from './Board.ts';

export class Player {

    name: string;
    resources: { [ResourceType: string]: number} = { };
    settlements: number[];
    cities: number[];
    roads: number[];
  
    constructor(name: string) {
      this.name = name;
      for (let item in Resource) {
        if (item == Resource.Desert) continue;
        this.resources[item] = 0;  
      }
    }
  
  }