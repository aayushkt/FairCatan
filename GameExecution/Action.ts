import { GameState } from '../GameState/GameState.ts'

export interface Action {
    run(gameState: GameState): void
}