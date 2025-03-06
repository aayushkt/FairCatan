class Player {

  name: string;
  Resources: { [ResourceType: string]: number} = { };
  Settlements: number[];
  Cities: number[];
  Roads: number[];

  constructor(name: string) {
    this.name = name;
    for (let item in Resource) {
      this.Resources[item] = 0;  
    }
  }

}

enum Resource {
  Brick="Brick",
  Lumber="Lumber",
  Ore="Ore",
  Grain="Grain",
  Wool="Wool",
}



  // function isAdult(user: User): boolean {
  //   return user.age >= 18;
  // }
  
  var me = new Player("test")

  const me2 = {
    name: "testing",
    Resources: { "Brick" : 23 },
    Settlements: [],
    Cities: [],
    Roads: []
  } satisfies Player

  console.log(me.Resources[Resource.Brick])
  me.Resources[Resource.Brick]++;
  console.log(me.Resources[Resource.Brick])