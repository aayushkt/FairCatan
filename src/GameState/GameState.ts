import { Board, Resource } from './Board';
import { Player } from './Player';
import { shuffle } from '../utils';

export class GameState {
    
    players: Player[] = [];
    board: Board = new Board();
    currentPlayer: Player;
    winner: Player;
    longestRoad: Player;
    largestArmy: Player;
}