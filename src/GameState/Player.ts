import { Resource } from './Board';

export class Player {
    name: string;
    resources: { [ResourceType: string]: number} = { };
    settlements: Set<number> = new Set<number>();
    cities: Set<number> = new Set<number>();
    roads: Set<number> = new Set<number>();
  
    constructor(name: string) {
      this.name = name;
      for (let item in Resource) {
        if (item == Resource.Desert) continue;
        this.resources[item] = 0;  
      }
    }
  
  }