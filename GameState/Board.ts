class Harbor {

}

class Board {
  harbors: { [Location: number] : Harbor };
  tileValues: number[];
  tileResources: Resource[];

  constructor() {
    this.generateTileResourcesRandomly();
    this.generateTileValuesRandomly();
  }

  private generateTileResourcesRandomly() {

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
    this.shuffle(this.tileResources);
  }

  private generateTileValuesAccordingToAlphabet() {
    // note: this is the values in their alphabetical-spiral order 
    // that corresponds to the official rule book (not the "Variable Setup")
    this.tileValues = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
  }

  private generateTileValuesRandomly() {
    let allValues = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    this.shuffle(allValues);
    for (let i = 0; i < 19; ++i) {
      if (this.tileResources[i] == Resource.Desert) {
        this.tileValues.push(0);
      } else {
        this.tileValues.pop();
      }
    }

    // TODO: no two red numbers (6s or 8s) should be adjacent
  }

  private shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
}

enum Resource {
  Brick="Brick",
  Lumber="Lumber",
  Ore="Ore",
  Grain="Grain",
  Wool="Wool",
  Desert="Desert"
}