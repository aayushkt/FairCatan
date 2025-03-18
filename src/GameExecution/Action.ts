import { Resource } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { ProbabilityOfRollingValue } from '../utils';
import { UpdateStateAfterRunningAction } from './GameRunner';

export abstract class Action {

    public Run(gameState: GameState) {
        this.Run(gameState);
        UpdateStateAfterRunningAction(gameState);
    }

    protected abstract RunAction(gameState: GameState): void;
    
}

export function RollDice(gamestate: GameState) {
    for (let playerIndex = 0; playerIndex < gamestate.players.length; ++playerIndex) {
        const player = gamestate.players[playerIndex];
        for (let settlementIndex = 0; settlementIndex < player.settlements.length; ++settlementIndex) {
            const settlement = player.settlements[settlementIndex];
            const tilesForSettlement = gamestate.board.GetTilesOfVertex(settlement);
            for (let tileIndex = 0; tileIndex < tilesForSettlement.length; ++tileIndex) {
                const tile = tilesForSettlement[tileIndex];
                const resource = gamestate.board.tileResources[tile];
                if (resource != Resource.Desert) {
                    //console.log(`Player ${player.name} Got ${resource} amt: ${gamestate.board.RollProbability(gamestate.board.tileValues[tile])}`)
                    player.resources[resource] += ProbabilityOfRollingValue(gamestate.board.tileValues[tile]);
                }
            }
        }
    }
}