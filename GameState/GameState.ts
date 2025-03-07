import { Board } from './Board.ts'
import { Player } from './Player.ts'

export class GameState {
    
    players: Player[];
    board: Board;
    currentPlayer: Player;

    constructor() {
        this.board = new Board();
    }

    addPlayer(playerName: string) {
        this.players.push(new Player(playerName));
    }



}