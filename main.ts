class Player {

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

class Port {

}

class Board {
  // the length of the longest row of tiles
  // default board size is 5
  size: number;
  ports: { [Location: number] : Port };
  tileValues: number[];
  tiles: Resource[];
}

enum Resource {
  Brick="Brick",
  Lumber="Lumber",
  Ore="Ore",
  Grain="Grain",
  Wool="Wool",
  Desert="Desert"
}



  // function isAdult(user: User): boolean {
  //   return user.age >= 18;
  // }
  
  var me = new Player("test");

  const me2 = {
    name: "testing",
    resources: { "Brick" : 23 },
    settlements: [],
    cities: [],
    roads: []
  } satisfies Player;

  console.log(me.resources[Resource.Brick]);
  me.resources[Resource.Brick]++;
  console.log(me.resources[Resource.Brick]);