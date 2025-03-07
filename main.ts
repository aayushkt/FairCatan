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