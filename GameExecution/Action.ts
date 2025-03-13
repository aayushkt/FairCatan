import { GameState } from '../GameState/GameState';
import { UpdateStateAfterRunningAction } from './GameRunner';

export abstract class Action {

    public Run(gameState: GameState) {
        this.Run(gameState);
        UpdateStateAfterRunningAction(gameState);
    }

    protected abstract RunAction(gameState: GameState): void;
    
}