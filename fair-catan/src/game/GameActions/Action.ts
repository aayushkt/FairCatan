import { Board } from "../GameState/Board";
import { GameState } from "../GameState/GameState";
import { DevCard, Player } from "../GameState/Player";

/*
A quick list of all the actions possible:
    - General Actions:
        - Add Player
        - Roll dice
        - Use harbor
        - Bank exchange
        - End turn
    - Build Actions:
        - Build road
        - Build city
        - Build settlement
    - Dev Card Actions:
        - Buy development card
        - Play development card
    - Trade Offer Actions:
        - Offer trade 
        - Accept trade
        - Decline trade
*/

export abstract class Action {
  public Run(gameState: GameState) {
    this.RunAction(gameState);
    UpdateStateAfterRunningAction(gameState);
  }

  protected abstract RunAction(gameState: GameState): string[];
}

// this function needs to run after every time an action is ran.
export function UpdateStateAfterRunningAction(gameState: GameState) {
  CheckIfSomeoneWon(gameState);
  UpdateLongestRoad(gameState);
  UpdateLargestArmy(gameState);
  RemoveImpossibleTrades(gameState);
}

// remove any trades that can no longer occuer (i.e. player A can't give wood now that he has none)
function RemoveImpossibleTrades(gameState: GameState) {
  gameState.activeTradeOffers = gameState.activeTradeOffers.filter((trade) =>
    trade.IsPossibleTrade(),
  );
}

function CheckIfSomeoneWon(gameState: GameState) {
  const players = gameState.players;
  for (let i = 0; i < players.length; ++i) {
    if (CalculateVictoryPointsForPlayer(gameState, players[i]) >= 10) {
      if (gameState.winner != undefined) throw "ERROR: THERE IS A TIE!";
      gameState.winner = players[i];
      return;
    }
  }
}

function CalculateVictoryPointsForPlayer(gameState: GameState, player: Player) {
  let totalPoints: number = 0;
  totalPoints += player.playableDevCards.filter(
    (card) => card == DevCard.VictoryPoint,
  ).length;
  for (const owner of gameState.board.settlements) {
    if (owner == player) totalPoints++;
  }
  for (const owner of gameState.board.cities) {
    if (owner == player) totalPoints += 2;
  }
  if (gameState.longestRoad == player) totalPoints += 2;
  if (gameState.largestArmy == player) totalPoints += 2;
  return totalPoints;
}

export function UpdateLongestRoad(gameState: GameState) {
  const allGroups = GroupRoads(gameState);
  let longestRoadLength: number = 0;
  let longestRoadGroup: undefined | Set<number> = undefined;
  for (const group of allGroups) {
    const thisGroupsLongestRoadLength = GetLongestRoadOfGroup(group);
    if (thisGroupsLongestRoadLength > longestRoadLength) {
      longestRoadLength = thisGroupsLongestRoadLength;
      longestRoadGroup = group;
    }
  }
  // TODO: Some logic to make sure longest road isn't taken from the current player unless
  // they have a longer one. i.e. two players with road length 7, the first one keeps longest road
  //   if (longestRoadLength > 5 && longestRoadLength > gameState.longestRoad) {
  //     longestRoad = longestRoadGroup?.player
  //   }
  console.log(longestRoadGroup);
}

// puts roads into 'groups' which are contiguous sections of road owned by a player
// not necessarily a straight path - e.g. three straight paths meeting at one point are a group
function GroupRoads(gameState: GameState): Set<Set<number>> {
  const allGroups: Set<Set<number>> = new Set<Set<number>>();

  for (let currRoad = 0; currRoad < Board.NUM_ROADS; ++currRoad) {
    const playerWhoOwnsTheRoad = gameState.board.roads[currRoad];
    if (playerWhoOwnsTheRoad == undefined) continue; // if there is no road here, continue

    // get all the roads that are connected to this one, owned by the same player
    const allRoadsThatConnectToTheCurrRoad = new Set<number>();
    const roadEndpoints = gameState.board.GetVerticesOfRoad(currRoad);
    roadEndpoints.forEach((side) => {
      // the player is blocked if another person has built a settlement or city next to the road
      const playerIsBlockedOnThisSide =
        (gameState.board.settlements[side] != playerWhoOwnsTheRoad &&
          gameState.board.settlements[side] != undefined) ||
        (gameState.board.cities[side] != playerWhoOwnsTheRoad &&
          gameState.board.cities[side] != undefined);

      // if they aren't blocked, this road belongs to the group on the other side if the player has a road there
      if (!playerIsBlockedOnThisSide) {
        for (const roadsThatConnectToOneSide of gameState.board.GetRoadsOfVertex(
          side,
        )) {
          if (
            gameState.board.roads[currRoad] ==
              gameState.board.roads[roadsThatConnectToOneSide] &&
            currRoad != roadsThatConnectToOneSide
          )
            allRoadsThatConnectToTheCurrRoad.add(roadsThatConnectToOneSide);
        }
      }
    });

    // now we get all the possible groups that this road can connect to since we have all the roads it connects to
    const allGroupsThisRoadConnects = new Set<Set<number>>();
    for (const neighbors of allRoadsThatConnectToTheCurrRoad) {
      for (const group of allGroups) {
        if (group.has(neighbors)) {
          allGroupsThisRoadConnects.add(group);
          break; // each neighbor should only belong to one group
        }
      }
    }

    // finally, we combine all the groups this road connects together into one big group (if any)
    // and add it back into the allGroups set
    const newGroup = new Set<number>();
    newGroup.add(currRoad);
    for (const group of allGroupsThisRoadConnects) {
      allGroups.delete(group);
      for (const road of group) {
        newGroup.add(road);
      }
    }
    allGroups.add(newGroup);
  }
  return allGroups;
}

function GetLongestRoadOfGroup(group: Set<number>): number {
  if (group.size < 3) return group.size;
  // TODO, this is not trivial lol
  return 0;
}

export function UpdateLargestArmy(gameState: GameState) {
  let largestArmy: number;
  if (gameState.largestArmy != undefined) {
    largestArmy = gameState.largestArmy.playedDevCards.filter(
      (x) => x == DevCard.Knight,
    ).length;
  } else {
    largestArmy = 2;
  }
  for (const player of gameState.players) {
    const armySize = player.playedDevCards.filter(
      (x) => x == DevCard.Knight,
    ).length;
    if (armySize > largestArmy) {
      gameState.largestArmy = player;
      largestArmy = armySize;
    }
  }
}
