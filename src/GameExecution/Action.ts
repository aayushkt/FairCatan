import { Resource } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { Player } from '../GameState/Player';
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


// TODO:
export function BuildSettlement(gamestate: GameState, player: Player) {
    // check if there are any valid places to build (connected via roads with no settlments as neighbors)
    let promptOptions = PlacesCanBuildSettlement(gamestate, player);
    // prompt the player to choose one of those places (or to cancel action)
    // update the model 
}

function PlacesCanBuildSettlement(gamestate: GameState, player: Player) {
    let board = gamestate.board;
    let options : number[] = [];
    for (let i = 0; i < player.roads.length; ++i) {
        // first add every vertex that is an endpoint of a road
        let currRoad = player.roads[i];
        let currEndPoints = board.GetVerticesOfRoad(currRoad);
        options.push(currEndPoints[0])
        options.push(currEndPoints[1])

        // then remove all vertices that already have buildings there or directly neighboring

    }
    return options
}

// TODO
export function BuildCity(gamestate: GameState, player: Player) {
    
}

// TODO
function PlacesCanBuildCity(gamestate: GameState, player: Player) : number[] {
    return [];
}

// TODO
export function BuildRoad(gamestate: GameState, player: Player) {
    
}