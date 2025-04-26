import { shuffle } from '../utils';

export class Harbor {
  locations: number[];
  harborType: Resource; // a desert resource represents a 3:1 harbor of any type
  constructor(locations: number[], harborType: Resource) {
    this.locations = locations;
    this.harborType = harborType;
  }
}

export class Board {

  harbors: Harbor[] = []; // a desert resource represents a 3:1 harbor of any type
  tileValues: number[];
  tileResources: Resource[];

  constructor() {
    this.tileResources = this.generateTileResourcesRandomly();
    this.tileValues = this.generateTileValuesAccordingToAlphabet(this.tileResources);
    this.setupHarbors();
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

  public GetNeighborsOfVertex(vertex: number): Set<number> {
    // check CatanReferences/CatanBoardVerticesAnnotated.png to see which
    // vertices neighbor each other
    switch(vertex) {
      case 0: return new Set<number>([3, 4]);
      case 1: return new Set<number>([4, 5]);
      case 2: return new Set<number>([5, 6]);
      case 3: return new Set<number>([0, 7]);
      case 4: return new Set<number>([0, 1, 8]);
      case 5: return new Set<number>([1, 2, 9]);
      case 6: return new Set<number>([2, 10]);
      case 7: return new Set<number>([3, 11, 12]);
      case 8: return new Set<number>([4, 12, 13]);
      case 9: return new Set<number>([5, 13, 14]);
      case 10: return new Set<number>([6, 14, 15]);
      case 11: return new Set<number>([7, 16]);
      case 12: return new Set<number>([7, 8, 17]);
      case 13: return new Set<number>([8, 9, 18]);
      case 14: return new Set<number>([9, 10, 19]);
      case 15: return new Set<number>([10, 20]);
      case 16: return new Set<number>([11, 21, 22]);
      case 17: return new Set<number>([12, 22, 23]);
      case 18: return new Set<number>([13, 23, 24]);
      case 19: return new Set<number>([14, 24, 25]);
      case 20: return new Set<number>([15, 25, 26]);
      case 21: return new Set<number>([16, 27]);
      case 22: return new Set<number>([16, 17, 28]);
      case 23: return new Set<number>([17, 18, 29]);
      case 24: return new Set<number>([18, 19, 30]);
      case 25: return new Set<number>([19, 20, 31]);
      case 26: return new Set<number>([20, 32]);
      case 27: return new Set<number>([21, 33]);
      case 28: return new Set<number>([22, 33, 34]);
      case 29: return new Set<number>([23, 34, 35]);
      case 30: return new Set<number>([24, 35, 36]);
      case 31: return new Set<number>([25, 36, 37]);
      case 32: return new Set<number>([26, 37]);
      case 33: return new Set<number>([27, 28, 38]);
      case 34: return new Set<number>([28, 29, 39]);
      case 35: return new Set<number>([29, 30, 40]);
      case 36: return new Set<number>([30, 31, 41]);
      case 37: return new Set<number>([31, 32, 42]);
      case 38: return new Set<number>([33, 43]);
      case 39: return new Set<number>([34, 43, 44]);
      case 40: return new Set<number>([35, 44, 45]);
      case 41: return new Set<number>([36, 45, 46]);
      case 42: return new Set<number>([37, 46]);
      case 43: return new Set<number>([38, 39, 47]);
      case 44: return new Set<number>([39, 40, 49]);
      case 45: return new Set<number>([40, 41, 51]);
      case 46: return new Set<number>([41, 42, 53]);
      case 47: return new Set<number>([43, 51]);
      case 48: return new Set<number>([44, 51, 52]);
      case 49: return new Set<number>([45, 52, 53]);
      case 50: return new Set<number>([46, 53]);
      case 51: return new Set<number>([47, 48]);
      case 52: return new Set<number>([48, 49]);
      case 53: return new Set<number>([49, 50]);
    
      default: throw `ERROR: CANNOT FIND NEIGHBORS OF VERTEX ${vertex}, IT DOES NOT EXIST`;
    }
  }

  public GetTilesOfVertex(vertex: number): Set<number> {
    // check CatanReferences/CatanBoardVerticesAnnotated.png to see which
    // vertices neighbor each other
    switch(vertex) {
      case 0: return new Set<number>([0]);
      case 1: return new Set<number>([1]);
      case 2: return new Set<number>([2]);
      case 3: return new Set<number>([0]);
      case 4: return new Set<number>([0, 1]);
      case 5: return new Set<number>([1, 2]);
      case 6: return new Set<number>([2]);
      case 7: return new Set<number>([0, 3]);
      case 8: return new Set<number>([0, 1, 4]);
      case 9: return new Set<number>([1, 2, 5]);
      case 10: return new Set<number>([2, 6]);
      case 11: return new Set<number>([3]);
      case 12: return new Set<number>([0, 3, 4]);
      case 13: return new Set<number>([1, 4, 5]);
      case 14: return new Set<number>([2, 5, 6]);
      case 15: return new Set<number>([6]);
      case 16: return new Set<number>([3, 7]);
      case 17: return new Set<number>([3, 4, 8]);
      case 18: return new Set<number>([4, 5, 9]);
      case 19: return new Set<number>([5, 6, 10]);
      case 20: return new Set<number>([6, 11]);
      case 21: return new Set<number>([7]);
      case 22: return new Set<number>([3, 7, 8]);
      case 23: return new Set<number>([4, 8, 9]);
      case 24: return new Set<number>([5, 9, 10]);
      case 25: return new Set<number>([6, 10, 11]);
      case 26: return new Set<number>([11]);
      case 27: return new Set<number>([7]);
      case 28: return new Set<number>([7, 8, 12]);
      case 29: return new Set<number>([8, 9, 13]);
      case 30: return new Set<number>([9, 10, 14]);
      case 31: return new Set<number>([10, 11, 15]);
      case 32: return new Set<number>([11]);
      case 33: return new Set<number>([7, 12]);
      case 34: return new Set<number>([8, 12, 13]);
      case 35: return new Set<number>([9, 13, 14]);
      case 36: return new Set<number>([10, 14, 15]);
      case 37: return new Set<number>([11, 15]);
      case 38: return new Set<number>([12]);
      case 39: return new Set<number>([12, 13, 16]);
      case 40: return new Set<number>([13, 14, 17]);
      case 41: return new Set<number>([14, 15, 18]);
      case 42: return new Set<number>([15]);
      case 43: return new Set<number>([12, 16]);
      case 44: return new Set<number>([13, 16, 17]);
      case 45: return new Set<number>([14, 17, 18]);
      case 46: return new Set<number>([15, 18]);
      case 47: return new Set<number>([16]);
      case 48: return new Set<number>([16, 17]);
      case 49: return new Set<number>([17, 18]);
      case 50: return new Set<number>([18]);
      case 51: return new Set<number>([16]);
      case 52: return new Set<number>([17]);
      case 53: return new Set<number>([18]);
    
      default: throw `ERROR: CANNOT FIND TILES OF VERTEX ${vertex}, IT DOES NOT EXIST`;
    }
  }

  public GetVerticesOfTile(tile: number): Set<number> {
    switch (tile) {
      case 0: return new Set<number>([0, 3, 4, 7, 8, 12]);
      case 1: return new Set<number>([1, 4, 5, 8, 9, 13]);
      case 2: return new Set<number>([2, 5, 6, 9, 10, 14]);
      case 3: return new Set<number>([7, 11, 12, 16, 17, 22]);
      case 4: return new Set<number>([8, 12, 13, 17, 18, 23]);
      case 5: return new Set<number>([9, 13, 14, 18, 19, 24]);
      case 6: return new Set<number>([10, 14, 15, 19, 20, 25]);
      case 7: return new Set<number>([16, 21, 22, 27, 28, 33]);
      case 8: return new Set<number>([17, 22, 23, 28, 29, 34]);
      case 9: return new Set<number>([18, 23, 24, 29, 30, 35]);
      case 10: return new Set<number>([19, 24, 25, 30, 31, 36]);
      case 11: return new Set<number>([20, 25, 26, 31, 32, 37]);
      case 12: return new Set<number>([28, 33, 34, 38, 39, 43]);
      case 13: return new Set<number>([29, 34, 35, 39, 40, 44]);
      case 14: return new Set<number>([30, 35, 36, 40, 41, 45]);
      case 15: return new Set<number>([31, 36, 37, 41, 42, 46]);
      case 16: return new Set<number>([39, 43, 44, 47, 48, 51]);
      case 17: return new Set<number>([40, 44, 45, 48, 49, 52]);
      case 18: return new Set<number>([41, 45, 46, 49, 50, 53]);
      default: throw `ERROR: CANNOT FIND VERTICES OF TILE ${tile}, IT DOES NOT EXIST`;
    }
  }

  public GetRoadsOfVertex(vertex: number): Set<number> {
    switch (vertex) {
      case 0: return new Set<number>([0, 1]);
      case 1: return new Set<number>([2, 3]);
      case 2: return new Set<number>([4, 5]);
      case 3: return new Set<number>([0, 6]);
      case 4: return new Set<number>([1, 2, 7]);
      case 5: return new Set<number>([3, 4, 8]);
      case 6: return new Set<number>([5, 9]);
      case 7: return new Set<number>([6, 10, 11]);
      case 8: return new Set<number>([7, 12, 13]);
      case 9: return new Set<number>([8, 14, 15]);
      case 10: return new Set<number>([9, 16, 17]);
      case 11: return new Set<number>([10, 18]);
      case 12: return new Set<number>([11, 12, 19]);
      case 13: return new Set<number>([13, 14, 20]);
      case 14: return new Set<number>([15, 16, 21]);
      case 15: return new Set<number>([17, 22]);
      case 16: return new Set<number>([18, 23, 24]);
      case 17: return new Set<number>([19, 25, 26]);
      case 18: return new Set<number>([20, 27, 28]);
      case 19: return new Set<number>([21, 29, 30]);
      case 20: return new Set<number>([22, 31, 32]);
      case 21: return new Set<number>([23, 33]);
      case 22: return new Set<number>([24, 25, 34]);
      case 23: return new Set<number>([26, 27, 35]);
      case 24: return new Set<number>([28, 29, 36]);
      case 25: return new Set<number>([30, 31, 37]);
      case 26: return new Set<number>([32, 38]);
      case 27: return new Set<number>([33, 39]);
      case 28: return new Set<number>([34, 40, 41]);
      case 29: return new Set<number>([35, 42, 43]);
      case 30: return new Set<number>([36, 44, 45]);
      case 31: return new Set<number>([37, 46, 47]);
      case 32: return new Set<number>([38, 48]);
      case 33: return new Set<number>([39, 40, 49]);
      case 34: return new Set<number>([41, 42, 50]);
      case 35: return new Set<number>([43, 44, 51]);
      case 36: return new Set<number>([45, 46, 52]);
      case 37: return new Set<number>([47, 48, 53]);
      case 38: return new Set<number>([49, 54]);
      case 39: return new Set<number>([50, 55, 56]);
      case 40: return new Set<number>([51, 57, 58]);
      case 41: return new Set<number>([52, 59, 60]);
      case 42: return new Set<number>([53, 61]);
      case 43: return new Set<number>([54, 55, 62]);
      case 44: return new Set<number>([56, 57, 63]);
      case 45: return new Set<number>([58, 59, 64]);
      case 46: return new Set<number>([60, 61, 65]);
      case 47: return new Set<number>([62, 66]);
      case 48: return new Set<number>([63, 67, 68]);
      case 49: return new Set<number>([64, 69, 70]);
      case 50: return new Set<number>([65, 71]);
      case 51: return new Set<number>([66, 67]);
      case 52: return new Set<number>([68, 69]);
      case 53: return new Set<number>([70, 71]);
      default: throw `ERROR: CANNOT FIND ROADS OF VERTEX ${vertex}, IT DOES NOT EXIST`;
    }
  }

  public GetVerticesOfRoad(road: number): Set<number> {
    switch (road) {
      case 0: return new Set<number>([0, 3]);
      case 1: return new Set<number>([0, 4]);
      case 2: return new Set<number>([1, 4]);
      case 3: return new Set<number>([1, 5]);
      case 4: return new Set<number>([2, 5]);
      case 5: return new Set<number>([2, 6]);
      case 6: return new Set<number>([3, 7]);
      case 7: return new Set<number>([4, 8]);
      case 8: return new Set<number>([5, 9]);
      case 9: return new Set<number>([6, 10]);
      case 10: return new Set<number>([7, 11]);
      case 11: return new Set<number>([7, 12]);
      case 12: return new Set<number>([8, 12]);
      case 13: return new Set<number>([8, 13]);
      case 14: return new Set<number>([9, 13]);
      case 15: return new Set<number>([9, 14]);
      case 16: return new Set<number>([10, 14]);
      case 17: return new Set<number>([10, 15]);
      case 18: return new Set<number>([11, 16]);
      case 19: return new Set<number>([12, 17]);
      case 20: return new Set<number>([13, 18]);
      case 21: return new Set<number>([14, 19]);
      case 22: return new Set<number>([15, 20]);
      case 23: return new Set<number>([16, 21]);
      case 24: return new Set<number>([16, 22]);
      case 25: return new Set<number>([17, 22]);
      case 26: return new Set<number>([17, 23]);
      case 27: return new Set<number>([18, 23]);
      case 28: return new Set<number>([18, 24]);
      case 29: return new Set<number>([19, 24]);
      case 30: return new Set<number>([19, 25]);
      case 31: return new Set<number>([20, 25]);
      case 32: return new Set<number>([20, 26]);
      case 33: return new Set<number>([21, 27]);
      case 34: return new Set<number>([22, 28]);
      case 35: return new Set<number>([23, 29]);
      case 36: return new Set<number>([24, 30]);
      case 37: return new Set<number>([25, 31]);
      case 38: return new Set<number>([26, 32]);
      case 39: return new Set<number>([27, 33]);
      case 40: return new Set<number>([28, 33]);
      case 41: return new Set<number>([28, 34]);
      case 42: return new Set<number>([29, 34]);
      case 43: return new Set<number>([29, 35]);
      case 44: return new Set<number>([30, 35]);
      case 45: return new Set<number>([30, 36]);
      case 46: return new Set<number>([31, 36]);
      case 47: return new Set<number>([31, 37]);
      case 48: return new Set<number>([32, 37]);
      case 49: return new Set<number>([33, 38]);
      case 50: return new Set<number>([34, 39]);
      case 51: return new Set<number>([35, 40]);
      case 52: return new Set<number>([36, 41]);
      case 53: return new Set<number>([37, 42]);
      case 54: return new Set<number>([38, 43]);
      case 55: return new Set<number>([39, 43]);
      case 56: return new Set<number>([39, 44]);
      case 57: return new Set<number>([40, 44]);
      case 58: return new Set<number>([40, 45]);
      case 59: return new Set<number>([41, 45]);
      case 60: return new Set<number>([41, 46]);
      case 61: return new Set<number>([42, 46]);
      case 62: return new Set<number>([43, 47]);
      case 63: return new Set<number>([44, 48]);
      case 64: return new Set<number>([45, 49]);
      case 65: return new Set<number>([46, 50]);
      case 66: return new Set<number>([47, 51]);
      case 67: return new Set<number>([48, 51]);
      case 68: return new Set<number>([48, 52]);
      case 69: return new Set<number>([49, 52]);
      case 70: return new Set<number>([49, 53]);
      case 71: return new Set<number>([50, 53]);
      default: throw `ERROR: CANNOT FIND VERTICES OF ROAD ${road}, IT DOES NOT EXIST`;
    }
  }

  private setupHarbors() {
    let defaultLocations = [
      [0, 3],
      [1, 5],
      [10, 15],
      [11, 16],
      [26, 32],
      [33, 38],
      [42, 46],
      [47, 51],
      [49, 52]
    ];
    shuffle(defaultLocations);
    let defaultHarborTypes = [
      Resource.Brick,
      Resource.Grain,
      Resource.Lumber,
      Resource.Ore,
      Resource.Wool,
      Resource.Desert,
      Resource.Desert,
      Resource.Desert,
      Resource.Desert,
    ]
    for (let i = 0; i < defaultLocations.length; ++i) {
      this.harbors.push(new Harbor(defaultLocations[i], defaultHarborTypes[i]));
    }
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