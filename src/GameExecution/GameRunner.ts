import { Action } from './Action';
import { GameState } from '../GameState/GameState';
import { Player } from '../GameState/Player';

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

/*
List of all the actions a Player can take:
    Roll Dice (can only do once per turn)
    Build Road
    Build City
    Build Settlement
    Offer Trade
    Deny Trade
    Buy Dev Card
    Play Dev Card
    Discard half their hand
    Place the robber 
    Steal a card
*/