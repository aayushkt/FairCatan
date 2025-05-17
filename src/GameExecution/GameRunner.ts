import { Action } from './Action';
import { GameState } from '../GameState/GameState';
import { DevCard, Player } from '../GameState/Player';

// this function needs to run after every time an action is ran.
export function UpdateStateAfterRunningAction(gameState: GameState) {
    CheckIfSomeoneWon(gameState);
    UpdateLongestRoad(gameState);
    UpdateLargestArmy(gameState);
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
    // TODO
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