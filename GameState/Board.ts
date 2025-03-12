import { shuffle } from '../utils.ts';

export class Harbor {

}

export class Board {
  harbors: { [Location: number] : Harbor };
  tileValues: number[];
  tileResources: Resource[];

  constructor() {
    this.generateTileResourcesRandomly();
    this.generateTileValuesAccordingToAlphabet();
  }

  private generateTileResourcesRandomly() {

    this.tileResources = [];

    // default catan board contains:

    // 3 bricks
    this.tileResources.push(Resource.Brick);
    this.tileResources.push(Resource.Brick);
    this.tileResources.push(Resource.Brick);

    // 4 lumber
    this.tileResources.push(Resource.Lumber);
    this.tileResources.push(Resource.Lumber);
    this.tileResources.push(Resource.Lumber);
    this.tileResources.push(Resource.Lumber);

    // 3 ore
    this.tileResources.push(Resource.Ore);
    this.tileResources.push(Resource.Ore);
    this.tileResources.push(Resource.Ore);

    // 4 grain
    this.tileResources.push(Resource.Grain);
    this.tileResources.push(Resource.Grain);
    this.tileResources.push(Resource.Grain);
    this.tileResources.push(Resource.Grain);

    // 4 wool
    this.tileResources.push(Resource.Wool);
    this.tileResources.push(Resource.Wool);
    this.tileResources.push(Resource.Wool);
    this.tileResources.push(Resource.Wool);

    // and 1 desert
    this.tileResources.push(Resource.Desert);

    // shuffle them all up and place them
    shuffle(this.tileResources);
  }

  private generateTileValuesAccordingToAlphabet() {
    // note: this is the values in their (reverse) alphabetical-spiral order 
    // that corresponds to the official rule book (not the "Variable Setup")
    this.tileValues = [];
    let orderedValues = [11, 3, 6, 5, 4, 9, 10, 8, 4, 11, 12, 9, 10, 8, 3, 6, 2, 5];
    for (let i = 0; i < 19; ++i) {
      if (this.tileResources[i] == Resource.Desert) {
        this.tileValues.push(0);
        continue;
      }
      const temp = orderedValues.pop();
      if (temp == undefined) {
        this.tileValues.push(0);
      } else {
        this.tileValues.push(temp);
      }
    }
  }

  private generateTileValuesRandomly() {
    let allValues = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    shuffle(allValues);
    // for (let i = 0; i < 19; ++i) {
    //   if (this.tileResources[i] == Resource.Desert) {
    //     this.tileValues.push(0);
    //   } else {
    //     this.tileValues.push(allValues.pop());
    //   }
    // }

    // TODO: no two red numbers (6s or 8s) should be adjacent
  }

}

export enum Resource {
  Brick="Brick",
  Lumber="Lumber",
  Ore="Ore",
  Grain="Grain",
  Wool="Wool",
  Desert="Desert"
}