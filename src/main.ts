

  // download tsx from npm and run: npx tsx main.ts

  import { Player } from './GameState/Player';
  import { Board, Resource } from './GameState/Board';
  import { GameState } from './GameState/GameState';
  import { CalculatePossibleActions } from './GameExecution/GameRunner';

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

  // console.log(me.resources[Resource.Brick]);
  me.resources[Resource.Brick]++;
  // console.log(me.resources[Resource.Brick]);


  let b = new Board();
  console.log(b.tileResources);
  console.log(b.tileValues);


  // example of what a game might look like

  let g = new GameState();
  g.addPlayer("Alice");
  g.addPlayer("Bob");
  g.addPlayer("Charlie");
  g.addPlayer("Devon");

  g.setupGame();


  // run the game forever until someone wins
  let possibleActions = CalculatePossibleActions(g);
  while(possibleActions.length != 0) {
    // send all clients the possible actions that can be taken
    // listen for a response,
    // if the response is a valid action, enact it, then repeat
  }

  // print outcome
  if (g.winner == undefined) {
    console.log(`Game ended with no winner!`);
  } else {
    console.log(`Player "${g.winner.name}" Wins!`);
  }
  
