import { Board } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { DevCard, Player } from '../GameState/Player';

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
        let resultingCommand = this.Run(gameState);
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
    gameState.activeTradeOffers = gameState.activeTradeOffers.filter(trade => trade.IsPossibleTrade());
}

function CheckIfSomeoneWon(gameState: GameState) {
    let players = gameState.players;
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
    totalPoints += player.playableDevCards.filter(card => card == DevCard.VictoryPoint).length;
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


    // TODO: starting with the largest group, find the longest road in each group.
    // since the longest road of a group can never be larger than the group size itself,
    // we can skip all the smaller groups. 
    // e.g the largest group has longest road length 5. The next group has longest road length 6.
    // the remaining groups are all of size 5 or less, so we know the longest road is length 6.
}

// puts roads into 'groups' which are contiguous sections of road owned by a player
// not necessarily a straight path - e.g. three straight paths meeting at one point are a group
// TODO: IF A PLAYER PLACES THEIR SETTLEMENT/CITY BETWEEN ROADS IT CAN BREAK THE GROUP  
function GroupRoads(gameState: GameState): Set<Set<number>> {
    let allGroups : Set<Set<number>> = new Set<Set<number>>();
    let firstArbitraryGroup : Set<number> = new Set<number>();
    allGroups.add(firstArbitraryGroup);

    for (let currRoad = 0; currRoad < Board.NUM_ROADS; ++currRoad) {
        if (gameState.board.roads[currRoad] == undefined) continue; // if there is no road here, continue

        // first we get all the roads that are connected to this one, owned by the same player
        const allRoadsThatConnectToTheCurrRoad = new Set<number>();
        const roadEndpoints = gameState.board.GetVerticesOfRoad(currRoad);
        for (const roadsThatConnectToOneSide of gameState.board.GetRoadsOfVertex(roadEndpoints[0])) {
            if (gameState.board.roads[currRoad] == gameState.board.roads[roadsThatConnectToOneSide] 
                && currRoad != roadsThatConnectToOneSide) allRoadsThatConnectToTheCurrRoad.add(roadsThatConnectToOneSide);
        }
        for (const roadsThatConnectToTheOtherSide of gameState.board.GetRoadsOfVertex(roadEndpoints[1])) {
            if (gameState.board.roads[currRoad] == gameState.board.roads[roadsThatConnectToTheOtherSide] 
                && currRoad != roadsThatConnectToTheOtherSide) allRoadsThatConnectToTheCurrRoad.add(roadsThatConnectToTheOtherSide);
        }

        // now we get all the possible groups that this road can connect to
        // (this can be more than one)
        let allGroupsThisRoadConnects = new Set<Set<number>>();
        for (const neighbors of allRoadsThatConnectToTheCurrRoad) {
            for (const group of allGroups) {
                if (group.has(neighbors)) {
                    allGroupsThisRoadConnects.add(group)
                    break; // each neighbor should only belong to one group
                }
            }
        }

        // finally, we combine all the groups this road connects together into one big group (if any)
        // and add it back into the allGroups set
        let newGroup = new Set<number>();
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

export function UpdateLargestArmy(gameState: GameState) {
    let largestArmy: number;
    if (gameState.largestArmy != undefined) {
        largestArmy = gameState.largestArmy.playedDevCards.filter(x => x == DevCard.Knight).length;
    } else {
        largestArmy = 2;
    }
    for (const player of gameState.players) {
        const armySize = player.playedDevCards.filter(x => x == DevCard.Knight).length;
        if (armySize > largestArmy) {
            gameState.largestArmy = player;
            largestArmy = armySize;
        }
    }
}