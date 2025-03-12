import { Board, Resource } from './Board.ts';
import { Player } from './Player.ts';
import { shuffle } from '../utils.ts';

export class GameState {
    
    players: Player[] = [];
    board: Board;
    currentPlayer: Player;
    robber: number;
    winner: Player;
    longestRoad: Player;
    largestArmy: Player;

    addPlayer(playerName: string) {
        this.players.push(new Player(playerName));
    }

    setupGame() {
        this.board = new Board();
        for (let i = 0; i < this.board.tileResources.length; ++i) {
            if (this.board.tileResources[i] == Resource.Desert) {
                this.robber = i;
                break;
            }
        }
        shuffle(this.players);
        this.currentPlayer = this.players[0];
    }

}