import { Resource } from "../GameState/Board";
import { GameState } from "../GameState/GameState";
import { Player } from "../GameState/Player";

export function BuildSettlement(
  gameState: GameState,
  player: Player,
  vertexLocation: number,
): boolean {
  // players can only build settlements on their turn
  if (gameState.currentPlayer != player) return false;

  // players must have the required resources to build a settlement
  if (
    player.resources[Resource.Brick] < 1 ||
    player.resources[Resource.Lumber] < 1 ||
    player.resources[Resource.Wool] < 1 ||
    player.resources[Resource.Grain] < 1
  )
    return false;

  // check that the player has roads leading to the location they wish to build
  let hasRoads: boolean = false;
  for (const possibleRoad of gameState.board.GetRoadsOfVertex(vertexLocation)) {
    if (gameState.board.roads[possibleRoad] == player) {
      hasRoads = true;
      break;
    }
  }
  if (!hasRoads) return false;

  // check that there is not a building already there or directly neighboring
  if (
    gameState.board.settlements[vertexLocation] != undefined ||
    gameState.board.cities[vertexLocation] != undefined
  )
    return false;
  for (const neighbor of gameState.board.GetNeighborsOfVertex(vertexLocation)) {
    if (
      gameState.board.settlements[neighbor] != undefined ||
      gameState.board.cities[neighbor] != undefined
    )
      return false;
  }

  // update the model
  gameState.board.settlements[vertexLocation] = player;
  return true;
}

export function BuildCity(
  gameState: GameState,
  player: Player,
  vertexLocation: number,
): boolean {
  // players can only build cities on their turn
  if (gameState.currentPlayer != player) return false;

  // players must have the required resources to build a city
  if (
    player.resources[Resource.Ore] < 3 ||
    player.resources[Resource.Grain] < 2
  )
    return false;

  // cities can only be built on top of settlements
  if (gameState.board.settlements[vertexLocation] != player) return false;

  gameState.board.settlements[vertexLocation] = undefined;
  gameState.board.cities[vertexLocation] = player;
  return true;
}

export function BuildRoad(
  gameState: GameState,
  player: Player,
  roadLocation: number,
): boolean {
  // players can only build roads on their turn
  if (gameState.currentPlayer != player) return false;

  // players must have the required resources to build a road
  if (
    player.resources[Resource.Brick] < 1 ||
    player.resources[Resource.Lumber] < 1
  )
    return false;

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
