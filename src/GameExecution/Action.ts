import { Board, Resource, Harbor } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { DevCard, Player } from '../GameState/Player';
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
                if (gameState.board.robber == tile) continue;
                const resource = gameState.board.tileResources[tile];
                if (resource == undefined) continue;
                owner.resources[resource] += ProbabilityOfRollingValue(gameState.board.tileValues[tile]);
                result.push(`${owner.name} gains ${ProbabilityOfRollingValue(gameState.board.tileValues[tile])} of ${resource}`);
            }
            continue;
        } 

        // if a player has a city on that vertex
        owner = gameState.board.cities[vertex];
        if (owner != undefined) {
            for (const tile of gameState.board.GetTilesOfVertex(vertex)) {
                if (gameState.board.robber == tile) continue;
                const resource = gameState.board.tileResources[tile];
                if (resource == undefined) continue;
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

export function BuyDevCard(gameState: GameState, player: Player): string {
    if (gameState.currentPlayer != player) return "You can only buy development cards during your turn";
    if (player.resources[Resource.Ore] < 1 ||
        player.resources[Resource.Wool] < 1 ||
        player.resources[Resource.Grain] < 1
    ) return `You need at least 1 ore, 1 wool, and 1 grain to buy a development card, you have ${player.resources[Resource.Ore]} ore, ${player.resources[Resource.Wool]} wool, and ${player.resources[Resource.Grain]} grain`;
    const card = gameState.devCards.pop();
    if (card == undefined) return "There are no development cards left to buy";
    player.devCards.push(card);
    gameState.cardsBoughtThisTurn.push(card);
    return `Player ${player.name} bought a development card`;
}

export function PlayDevCard(gameState: GameState, player: Player, cardToPlay: DevCard, args: number[]) {
    if (gameState.currentPlayer != player) return "You can only play development cards during your turn";
    if (gameState.devCardPlayedThisTurn) return "You can only play one development card per turn";
    if (cardToPlay == DevCard.VictoryPoint) return "You can't play victory cards";
    const numOfCardsPlayerOwns = player.devCards.filter(x => x == cardToPlay).length;
    if (numOfCardsPlayerOwns <= 0) return `You do not have a ${cardToPlay} development card`;
    const numOfCardsBoughtThisTurn = gameState.cardsBoughtThisTurn.filter(x => x == cardToPlay).length;
    if (numOfCardsBoughtThisTurn >= numOfCardsPlayerOwns) return "You cannot play development cards on the same turn you bought them";
    
    switch (cardToPlay) {
        case DevCard.Knight:
            if (args.length > 2) return `You can have a maximum of two arguments when playing a knight card: The tile you move the robber to, and (if applicable) the opponent to steal from`;
            if (args.length < 1) return `You need at least one argument to play a knight card: the tile you move the robber to`;
            const tile = args[0];
            if (tile == gameState.board.robber) return "You must move the robber to a different tile when playing the knight card";
            if (tile < 0 || tile >= gameState.board.tileResources.length) return `Tiles are numbered 0-${gameState.board.tileResources.length - 1}, no tile with number ${tile} exists`;
            if (args.length == 2) {
                const victimVertex = args[1];
                if (!gameState.board.GetVerticesOfTile(tile).has(victimVertex)) return `The vertex ${victimVertex} is not on the tile ${tile}, you must steal from a player on that tile`;
                let victim = gameState.board.settlements[victimVertex];
                if (victim == undefined) victim = gameState.board.cities[victimVertex];
                if (victim == undefined) return `There is no player on vertex ${victim} to steal from`;
                if (victim == player) return `You cannot steal from yourself`;
                
                // actually play the card if we pass all the checks
                gameState.board.robber = tile;
                let resourcesCanSteal: Resource[] = [];
                // TODO: FINISH THIS
            } else {
                for (const vertex of gameState.board.GetVerticesOfTile(tile)) {
                    if (gameState.board.settlements[vertex] != undefined && gameState.board.settlements[vertex] != player) return `You must steal from an opponent built on the tile you are placing the robber on`;
                    if (gameState.board.cities[vertex] != undefined && gameState.board.cities[vertex] != player) return `You must steal from an opponent built on the tile you are placing the robber on`;
                }

                // actually play the card if we pass all the checks
                gameState.board.robber = tile;
            }
            
            break;

        case DevCard.RoadBuilding:
            if (args.length == 0 || args.length > 2) return `Provide two arguments for the two road places you want to build`;
            break;

        case DevCard.YearOfPlenty:
            if (args.length != 2) return `You need to select two resources to take, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            break;

        case DevCard.Monopoly:
            if (args.length != 2) return `You need to name a resource, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            break;
    }

    // remove the card played from the player
    player.devCards.splice(player.devCards.indexOf(cardToPlay));
    gameState.devCardPlayedThisTurn = true;
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

    // check that they have a city or settlement at the specified location
    if (gameState.board.cities[harborVertexLocation] != player && gameState.board.settlements[harborVertexLocation] != player) return `You do not have a city or settlement at vertex ${harborVertexLocation}`;

    // make sure the player has enough resources to give of the specified type
    if (harbor.harborType == undefined) {
        if (player.resources[giveResource] < 3) return `You need at least 3 ${giveResource} to trade, you only have ${player.resources[giveResource]}`;
        player.resources[giveResource] -= 3;
        player.resources[wantResource] += 1;
        return `Player ${player.name} traded 3 ${giveResource} for 1 ${wantResource} at harbor ${harborVertexLocation}`;
    } else {
        if (player.resources[giveResource] < 2) return `You need at least 2 ${giveResource} to trade, you only have ${player.resources[giveResource]}`;
        player.resources[giveResource] -= 2;
        player.resources[wantResource] += 1;
        return `Player ${player.name} traded 2 ${giveResource} for 1 ${wantResource} at harbor ${harborVertexLocation}`;
    }
}

export function BankExchange(gameState: GameState, player: Player, wantResource: Resource, giveResource: Resource): string {
    if (gameState.currentPlayer != player) return "You can only trade at harbors during your turn";
    if (player.resources[giveResource] < 4) return `You must have at least 4 ${giveResource} to exchange with the bank, you only have ${player.resources[giveResource]}`
    player.resources[giveResource] -= 4;
    player.resources[wantResource] += 1;
    return `Player ${player.name} traded 4 ${giveResource} for 1 ${wantResource} with the bank`;
}

export function EndTurn() {

}
