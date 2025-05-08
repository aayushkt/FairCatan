  // download tsx from npm and run: npx tsx src/main.ts

  import { Player } from './GameState/Player';
  import { Board, Resource } from './GameState/Board';
  import { GameState } from './GameState/GameState';
  import { RollDice, AddPlayer } from './GameExecution/Action';

  let g = new GameState();

  AddPlayer(g, "Alice");
  AddPlayer(g, "Bob");
  AddPlayer(g, "Charlie");
  AddPlayer(g, "Devon");


  // run the game forever until someone wins
  while(g.winner == undefined) {
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
  
