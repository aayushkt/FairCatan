import { Board, Resource, Harbor } from '../GameState/Board';
import { GameState } from '../GameState/GameState';
import { DevCard, Player } from '../GameState/Player';
import { ProbabilityOfRollingValue } from '../utils';
import { shuffle } from '../utils';
import { BuildRoad } from './BuildActions';

export function AddPlayer(gameState: GameState, playerName: string) {
    if (gameState.players.find((p) => {p.name == playerName}) != undefined) return false;
    gameState.players.push(new Player(playerName));
    shuffle(gameState.players);
    gameState.currentPlayer = gameState.players[0];
}

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

export function BuyDevCard(gameState: GameState, player: Player): string {
    if (gameState.currentPlayer != player) return "You can only buy development cards during your turn";
    if (player.resources[Resource.Ore] < 1 ||
        player.resources[Resource.Wool] < 1 ||
        player.resources[Resource.Grain] < 1
    ) return `You need at least 1 ore, 1 wool, and 1 grain to buy a development card, you have ${player.resources[Resource.Ore]} ore, ${player.resources[Resource.Wool]} wool, and ${player.resources[Resource.Grain]} grain`;
    const card = gameState.devCards.pop();
    if (card == undefined) return "There are no development cards left to buy";
    player.playableDevCards.push(card);
    gameState.cardsBoughtThisTurn.push(card);
    return `Player ${player.name} bought a development card`;
}

export function PlayDevCard(gameState: GameState, player: Player, cardToPlay: DevCard, args: number[]): string {
    if (gameState.currentPlayer != player) return "You can only play development cards during your turn";
    if (gameState.devCardPlayedThisTurn) return "You can only play one development card per turn";
    if (cardToPlay == DevCard.VictoryPoint) return "You can't play victory cards, they will automatically be revealed once you reach 10 points";
    const numOfCardsPlayerOwns = player.playableDevCards.filter(x => x == cardToPlay).length;
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
                // steal 1 resource at random from the player, ignoring fractions of a resource.
                // e.g. treat a player with 0.99 brick and 1.3 sheep the same as a player with 0 brick and 1 sheep
                let resourcesCanSteal: Resource[] = [];
                for (const resource of Object.keys(player.resources) as Resource[]) {
                    for (let count = 0; count < player.resources[resource]; ++count) {
                        resourcesCanSteal.push(resource);
                    }
                }
                if (resourcesCanSteal.length > 0) {
                    shuffle(resourcesCanSteal);
                    const stolenResource = resourcesCanSteal[0];
                    player.resources[stolenResource] += 1;
                    victim.resources[stolenResource] -= 1;
                }
                 
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
            BuildRoad(gameState, player, args[0]);
            BuildRoad(gameState, player, args[1]);
            // TODO: Should handle the case where order matters. Building the first road connected to the second should be allowed.
            break;

        case DevCard.YearOfPlenty:
            if (args.length != 2) return `You need to select two resources to take, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            const resource1 = MapNumberToResource(args[0]);
            if (resource1 == undefined) return `You need to name a resource, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            const resource2 = MapNumberToResource(args[1]);
            if (resource2 == undefined) return `You need to name a resource, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            player.resources[resource1]++;
            player.resources[resource2]++;
            break;

        case DevCard.Monopoly:
            if (args.length != 2) return `You need to name a resource, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            const resource = MapNumberToResource(args[0]);
            if (resource == undefined) return `You need to name a resource, 0=Brick, 1=Lumber, 2=Ore, 3=Grain, 4=Wool`;
            let totalResource = 0;
            for (const p of gameState.players) {
                // only count the whole numbers of a resource when stealing, a player with 1.3 brick will have 0.3 brick left 
                totalResource += (p.resources[resource] - (p.resources[resource] % 1));
                p.resources[resource] %= 1; 
            }
            player.resources[resource] += totalResource;
            break;
    }

    // remove the card played from the player
    player.playableDevCards.splice(player.playableDevCards.indexOf(cardToPlay));
    player.playedDevCards.push(cardToPlay);
    gameState.devCardPlayedThisTurn = true;
    return `Player ${player} played a ${cardToPlay}`; 
}

function MapNumberToResource(number: number): (Resource | undefined) {
    switch(number) {
        case 0: return Resource.Brick;
        case 1: return Resource.Lumber;
        case 2: return Resource.Ore;
        case 3: return Resource.Grain;
        case 4: return Resource.Wool;
        default: return undefined
    }
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
    // TODO
}
