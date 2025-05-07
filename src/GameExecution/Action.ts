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
        for (let settlementIndex = 0; settlementIndex < player.settlements.size; ++settlementIndex) {
            const settlement = player.settlements[settlementIndex];
            const tilesForSettlement = gamestate.board.GetTilesOfVertex(settlement);
            for (let tileIndex = 0; tileIndex < tilesForSettlement.size; ++tileIndex) {
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

export function BuildSettlement(gamestate: GameState, player: Player, vertexLocation: number) : boolean {

    // players can only build settlements on their turn
    if (gamestate.currentPlayer != player) return false;

    // check that the player has roads leading to the location they wish to build
    let hasRoads : boolean = false;
    let possibleRoads = gamestate.board.GetRoadsOfVertex(vertexLocation);
    for (const road of player.roads) {
        if (possibleRoads.has(road)) {
            hasRoads = true;
            break;
        }
    }
    if (!hasRoads) return false;

    // check that there is not a building already there or directly neighboring
    for (const currPlayer of gamestate.players) {
        if (currPlayer.cities.has(vertexLocation) || currPlayer.settlements.has(vertexLocation)) return false;
        for (const neighbor of gamestate.board.GetNeighborsOfVertex(vertexLocation)) {
            if (currPlayer.cities.has(neighbor) || currPlayer.settlements.has(neighbor)){
                return false;
            }
        }
    }

    // update the model 
    player.settlements.add(vertexLocation);
    return true;
}

export function BuildCity(gamestate: GameState, player: Player, vertexLocation: number) : boolean {
    
    // players can only build cities on their turn
    if (gamestate.currentPlayer != player) return false;

    // cities can only be built on top of settlements
    if (!player.settlements.delete(vertexLocation)) return false;

    player.cities.add(vertexLocation);
    return true;

}

export function BuildRoad(gamestate: GameState, player: Player, roadLocation: number) : boolean {
    // players can only build roads on their turn
    if (gamestate.currentPlayer != player) return false;

    // check that there is not already a road there
    for (const currPlayer of gamestate.players) {
        for (const road of player.roads) {
            if (road == roadLocation) return false;
        }
    }

    player.roads.add(roadLocation);
    return true;
}