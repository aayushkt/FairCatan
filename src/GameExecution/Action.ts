import { Board, Resource } from '../GameState/Board';
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

    for (let vertex = 0; vertex < Board.NUM_VERTICES; ++vertex) {
        
        // if a player has a settlement on that vertex
        let owner = gamestate.board.settlements[vertex];
        if (owner != undefined) {
            for (const tile of gamestate.board.GetTilesOfVertex(vertex)) {
                const resource = gamestate.board.tileResources[tile];
                if (resource == Resource.Desert) continue;
                owner.resources[resource] += ProbabilityOfRollingValue(gamestate.board.tileValues[tile]);
            }
            continue;
        } 

        // if a player has a city on that vertex
        owner = gamestate.board.cities[vertex];
        if (owner != undefined) {
            for (const tile of gamestate.board.GetTilesOfVertex(vertex)) {
                const resource = gamestate.board.tileResources[tile];
                if (resource == Resource.Desert) continue;
                owner.resources[resource] += 2 * ProbabilityOfRollingValue(gamestate.board.tileValues[tile]);
            }
        }
    }
}

export function BuildSettlement(gamestate: GameState, player: Player, vertexLocation: number) : boolean {

    // players can only build settlements on their turn
    if (gamestate.currentPlayer != player) return false;

    // check that the player has roads leading to the location they wish to build
    let hasRoads : boolean = false;
    for (const possibleRoad of gamestate.board.GetRoadsOfVertex(vertexLocation)) {
        if (gamestate.board.roads[possibleRoad] == player) {
            hasRoads = true; 
            break;
        }
    }
    if (!hasRoads) return false;

    // check that there is not a building already there or directly neighboring
    if (gamestate.board.settlements[vertexLocation] != undefined || gamestate.board.cities[vertexLocation] != undefined) return false;
    for (const neighbor of gamestate.board.GetNeighborsOfVertex(vertexLocation)) {
        if (gamestate.board.settlements[neighbor] != undefined || gamestate.board.cities[neighbor] != undefined) return false;
    }

    // update the model 
    gamestate.board.settlements[vertexLocation] = player;
    return true;
}

export function BuildCity(gamestate: GameState, player: Player, vertexLocation: number) : boolean {
    
    // players can only build cities on their turn
    if (gamestate.currentPlayer != player) return false;

    // cities can only be built on top of settlements
    if (gamestate.board.settlements[vertexLocation] != player) return false;

    gamestate.board.settlements[vertexLocation] = undefined;
    gamestate.board.cities[vertexLocation] = player;
    return true;

}

export function BuildRoad(gamestate: GameState, player: Player, roadLocation: number) : boolean {
    // players can only build roads on their turn
    if (gamestate.currentPlayer != player) return false;

    // check that there is not already a road there
    if (gamestate.board.roads[roadLocation] != undefined) return false;

    // make sure there is a road connected to this location
    for (const endpoint of gamestate.board.GetVerticesOfRoad(roadLocation)) {
        for (const connectingRoad of gamestate.board.GetRoadsOfVertex(endpoint)) {
            if (gamestate.board.roads[connectingRoad] == player) {
                gamestate.board.roads[roadLocation] = player;
                return true;
            }
        }
    }

    return false;
}