import { Board, Resource } from './Board.ts';
import { Player } from './Player.ts';
import { shuffle } from './../utils.ts';

export class GameState {
    
    gameStarted: boolean = false;
    players: Player[];
    board: Board;
    currentPlayer: Player;
    robber: number;

    constructor() {
        this.board = new Board();
        for (let i = 0; i < this.board.tileResources.length; ++i) {
            if (this.board.tileResources[i] == Resource.Desert) {
                this.robber = i;
                break;
            }
        }
    }

    addPlayer(playerName: string) {
        if (this.gameStarted) throw "Can't add a new player after the game has already started!";
        this.players.push(new Player(playerName));
    }

    startGame() {
        if (this.players.length == 0) throw "Can't start the game without any players!";
        shuffle(this.players);
        this.currentPlayer = this.players[0];
    }

}