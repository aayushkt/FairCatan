import { Action } from './Action';
import { GameState } from '../GameState/GameState';
import { Player } from '../GameState/Player';

export function CalculatePossibleActions(gameState: GameState) {

    let possibleActions: Action[] = [];

    if (gameState.winner != undefined) return possibleActions;

    return possibleActions;
}

// this function needs to run after every time an action is ran.
export function UpdateStateAfterRunningAction(gameState: GameState) {
    CheckIfSomeoneWon(gameState);
    // TODO: Add checks to distribute longest road and largest army here
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
    totalPoints += player.settlements.size;
    totalPoints += (player.cities.size * 2);
    if (gameState.longestRoad == player) totalPoints += 2;
    if (gameState.largestArmy == player) totalPoints += 2;
    return totalPoints;
}
