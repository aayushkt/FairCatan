class GameState {
    
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