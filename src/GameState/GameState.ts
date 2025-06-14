import { Board } from './Board';
import { DevCard, Player } from './Player';
import { shuffle } from '../utils';
import { Trade } from '../GameActions/TradeOfferActions';

export class GameState {
    players: Player[];
    board: Board;
    devCards: DevCard[];
    currentPlayer: Player;
    winner: (Player|undefined);
    longestRoad: (Player|undefined);
    largestArmy: (Player|undefined);
    cardsBoughtThisTurn: DevCard[];
    devCardPlayedThisTurn: boolean;
    activeTradeOffers: Trade[] = [];

    constructor() {
        this.players = [];
        this.board = new Board();
        this.devCards = CreateDevCards();
        this.winner = undefined;
        this.longestRoad = undefined;
        this.largestArmy = undefined;
        this.cardsBoughtThisTurn = [];
        this.devCardPlayedThisTurn = false;
    }
}

function CreateDevCards(): DevCard[] {
    const devCards = [

        // 14 knights
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,
        DevCard.Knight,

        // 5 victory points
        DevCard.VictoryPoint,
        DevCard.VictoryPoint,
        DevCard.VictoryPoint,
        DevCard.VictoryPoint,
        DevCard.VictoryPoint,

        // 2 road building 
        DevCard.RoadBuilding,
        DevCard.RoadBuilding,

        // 2 year of plenty
        DevCard.YearOfPlenty,
        DevCard.YearOfPlenty,

        // 2 monopoly
        DevCard.Monopoly,
        DevCard.Monopoly
    ];
    shuffle(devCards);
    return devCards;
}