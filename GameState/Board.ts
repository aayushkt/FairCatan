import { shuffle } from '../utils';

export class Harbor {

}

export class Board {

  harbors: { [Location: number] : Harbor };
  tileValues: number[];
  tileResources: Resource[];

  constructor() {
    this.tileResources = this.generateTileResourcesRandomly();
    this.tileValues = this.generateTileValuesAccordingToAlphabet(this.tileResources);
  }

  private generateTileResourcesRandomly(): Resource[] {

    let tileResources: Resource[] = [];

    // default catan board contains:

    // 3 bricks
    tileResources.push(Resource.Brick);
    tileResources.push(Resource.Brick);
    tileResources.push(Resource.Brick);

    // 4 lumber
    tileResources.push(Resource.Lumber);
    tileResources.push(Resource.Lumber);
    tileResources.push(Resource.Lumber);
    tileResources.push(Resource.Lumber);

    // 3 ore
    tileResources.push(Resource.Ore);
    tileResources.push(Resource.Ore);
    tileResources.push(Resource.Ore);

    // 4 grain
    tileResources.push(Resource.Grain);
    tileResources.push(Resource.Grain);
    tileResources.push(Resource.Grain);
    tileResources.push(Resource.Grain);

    // 4 wool
    tileResources.push(Resource.Wool);
    tileResources.push(Resource.Wool);
    tileResources.push(Resource.Wool);
    tileResources.push(Resource.Wool);

    // and 1 desert
    tileResources.push(Resource.Desert);

    // shuffle them all up 
    shuffle(tileResources);

    return tileResources;
  }

  private generateTileValuesAccordingToAlphabet(tileResources: Resource[]): number[] {
    let tileValues: number[] = [];
    // note: this is the values in their (reverse) alphabetical-spiral order 
    // that corresponds to the official rule book (not the "Variable Setup")
    let orderedValues = [11, 3, 6, 5, 4, 9, 10, 8, 4, 11, 12, 9, 10, 8, 3, 6, 2, 5];
    for (let i = 0; i < tileResources.length; ++i) {
      if (tileResources[i] == Resource.Desert) {
        tileValues.push(0);
        continue;
      }
      const temp = orderedValues.pop();
      if (temp == undefined) {
        tileValues.push(0);
      } else {
        tileValues.push(temp);
      }
    }

    return tileValues;
  }

  public GetNeighborsOfVertex(vertex: number): number[] {
    if (vertex < 0 || vertex > 53) return [];

    // see CatanBoardVerticesAnnotated.png for a clear diagram
    // on how this algorithm works and to understand the terms used here

    // first, find out the row number of the vertex
    
    // then find the position in the row (the column)

    // its three neighbors will be on the other side of the row (upper/lower)
    // in the same position and position + 1

    // also check for edge cases (if the vertex is on the left edge it wont)
    // have three neighbors

    return [];
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