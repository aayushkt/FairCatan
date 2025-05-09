import { Board, Resource, Harbor } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { Player } from '../GameState/Player';
import { ProbabilityOfRollingValue } from '../utils';
import { UpdateStateAfterRunningAction } from './GameRunner';
import { shuffle } from '../utils';

export abstract class Action {

    public Run(gameState: GameState) {
        let resultingCommand = this.Run(gameState);
        UpdateStateAfterRunningAction(gameState);
    }

    protected abstract RunAction(gameState: GameState): string[];
    
}

/*
A quick list of all the actions possible:
    - Add Player
    - Roll dice
    - Build road
    - Build city
    - Build settlement
    - Buy development card
    - Play development card
    - Offer trade 
    - Accept trade
    - Decline trade
    - Use harbor
    - Bank exchange
    - End turn
*/

export function AddPlayer(gameState: GameState, playerName: string) {
    if (gameState.players.find((p) => {p.name == playerName}) != undefined) return false;
    gameState.players.push(new Player(playerName));
    shuffle(gameState.players);
    gameState.currentPlayer = gameState.players[0];
}

// TODO: Collapse the result strings 
// i.e. instead of 2 strings: A gains 4 wood and A gains 3 wood, 
// just have a single string: A gains 7 wood
export function RollDice(gameState: GameState) : string[] {
    let result: string[] = [];
    for (let vertex = 0; vertex < Board.NUM_VERTICES; ++vertex) {
        
        // if a player has a settlement on that vertex
        let owner = gameState.board.settlements[vertex];
        if (owner != undefined) {
            for (const tile of gameState.board.GetTilesOfVertex(vertex)) {
                const resource = gameState.board.tileResources[tile];
                if (resource == Resource.Desert) continue;
                owner.resources[resource] += ProbabilityOfRollingValue(gameState.board.tileValues[tile]);
                result.push(`${owner.name} gains ${ProbabilityOfRollingValue(gameState.board.tileValues[tile])} of ${resource}`);
            }
            continue;
        } 

        // if a player has a city on that vertex
        owner = gameState.board.cities[vertex];
        if (owner != undefined) {
            for (const tile of gameState.board.GetTilesOfVertex(vertex)) {
                const resource = gameState.board.tileResources[tile];
                if (resource == Resource.Desert) continue;
                owner.resources[resource] += 2 * ProbabilityOfRollingValue(gameState.board.tileValues[tile]);
                result.push(`${owner.name} gains ${2*ProbabilityOfRollingValue(gameState.board.tileValues[tile])} of ${resource}`);
            }
        }
    }
    return result;
}

export function BuildSettlement(gameState: GameState, player: Player, vertexLocation: number) : boolean {

    // players can only build settlements on their turn
    if (gameState.currentPlayer != player) return false;

    // players must have the required resources to build a settlement
    if (player.resources[Resource.Brick] < 1 ||
        player.resources[Resource.Lumber] < 1 ||
        player.resources[Resource.Wool] < 1 || 
        player.resources[Resource.Grain] < 1
    ) return false;

    // check that the player has roads leading to the location they wish to build
    let hasRoads : boolean = false;
    for (const possibleRoad of gameState.board.GetRoadsOfVertex(vertexLocation)) {
        if (gameState.board.roads[possibleRoad] == player) {
            hasRoads = true; 
            break;
        }
    }
    if (!hasRoads) return false;

    // check that there is not a building already there or directly neighboring
    if (gameState.board.settlements[vertexLocation] != undefined || gameState.board.cities[vertexLocation] != undefined) return false;
    for (const neighbor of gameState.board.GetNeighborsOfVertex(vertexLocation)) {
        if (gameState.board.settlements[neighbor] != undefined || gameState.board.cities[neighbor] != undefined) return false;
    }

    // update the model 
    gameState.board.settlements[vertexLocation] = player;
    return true;
}

export function BuildCity(gameState: GameState, player: Player, vertexLocation: number) : boolean {
    
    // players can only build cities on their turn
    if (gameState.currentPlayer != player) return false;

    // players must have the required resources to build a city
    if (player.resources[Resource.Ore] < 3 ||
        player.resources[Resource.Grain] < 2
    ) return false;

    // cities can only be built on top of settlements
    if (gameState.board.settlements[vertexLocation] != player) return false;

    gameState.board.settlements[vertexLocation] = undefined;
    gameState.board.cities[vertexLocation] = player;
    return true;

}

export function BuildRoad(gameState: GameState, player: Player, roadLocation: number) : boolean {
    // players can only build roads on their turn
    if (gameState.currentPlayer != player) return false;

    // players must have the required resources to build a road
    if (player.resources[Resource.Brick] < 1 ||
        player.resources[Resource.Lumber] < 1
    ) return false;

    // check that there is not already a road there
    if (gameState.board.roads[roadLocation] != undefined) return false;

    // make sure there is a road connected to this location
    for (const endpoint of gameState.board.GetVerticesOfRoad(roadLocation)) {
        for (const connectingRoad of gameState.board.GetRoadsOfVertex(endpoint)) {
            if (gameState.board.roads[connectingRoad] == player) {
                gameState.board.roads[roadLocation] = player;
                return true;
            }
        }
    }

    return false;
}

export function BuyDevCard(gameState: GameState, player: Player) {

}

export function PlayDevCard(gameState: GameState, player: Player) {

}

export function OfferTrade(gameState: GameState, initiator: Player, recipient: Player, wantResource: Resource, giveResource: Resource, wantAmount: number, giveAmount: number) {

}

export function AcceptTrade() {

}

export function DeclineTrade() {

}

export function UseHarbor(gameState: GameState, player: Player, wantResource: Resource, giveResource: Resource, harborVertexLocation: number): string {

    // check that it is the players turn
    if (gameState.currentPlayer != player) return "You can only trade at harbors during your turn";

    // get the harbor at the specificed location
    const harbor: (Harbor | undefined) = gameState.board.harbors.find(harbor => harbor.locations[0] == harborVertexLocation || harbor.locations[1] == harborVertexLocation);
    if (harbor == undefined) return `There is no harbor located at vertex ${harborVertexLocation}`;

    // you cannot trade to get a desert resource so we check the wantResource arg,
    // the giveResource arg is only checked later if the harbor is a 3:1 harbor (desert resource type)
    if (wantResource == Resource.Desert) return "You cannot trade for the desert resource at a harbor";

    // check that they have a city or settlement at the specified location
    if (gameState.board.cities[harborVertexLocation] != player && gameState.board.settlements[harborVertexLocation] != player) return `You do not have a city or settlement at vertex ${harborVertexLocation}`;

    // make sure the player has enough resources to give of the specified type
    if (harbor.harborType == Resource.Desert) {
        if (giveResource == Resource.Desert) return `You cannot trade using a desert resource at a harbor`;
        if (player.resources[giveResource] < 3) return `You need at least 3 ${giveResource} to trade, you only have ${player.resources[giveResource]}`;
    } else {
        giveResource = harbor.harborType;
        if (player.resources[giveResource] < 2) return `You need at least 2 ${giveResource} to trade, you only have ${player.resources[giveResource]}`;
    }

    // actually use the harbor
    if (harbor.harborType == Resource.Desert) {
        player.resources[giveResource] -= 3;
        player.resources[wantResource] += 1;
        return `Player ${player.name} traded 3 ${giveResource} for 1 ${wantResource} at harbor ${harborVertexLocation}`;
    } else {
        player.resources[giveResource] -= 2;
        player.resources[wantResource] += 1;
        return `Player ${player.name} traded 2 ${giveResource} for 1 ${wantResource} at harbor ${harborVertexLocation}`;
    }
}

export function BankExchange() {

}

export function EndTurn() {

}
