  // download tsx from npm and run: npx tsx src/main.ts
  // if this doesn't work due to error 'running scripts is disabled on this system', click the dropdown next to the '+' for a new terminal and run it from command prompt, not powershell
  import { GameState } from './GameState/GameState';
  import { AddPlayer } from './GameActions/GeneralActions';
  import { Application, Texture, Sprite } from 'pixi.js';

  console.log("please work");
(async () =>
{
    let g = new GameState();

  AddPlayer(g, "Alice");
  AddPlayer(g, "Bob");
  AddPlayer(g, "Charlie");
  AddPlayer(g, "Devon");

// Create a new PixiJS application
const app = new Application();

// Add the canvas to the document body
document.body.appendChild(app.view);

// Load a sprite
const bunny = new Sprite(Texture.WHITE);
bunny.scale.set(0.1);
bunny.x = 100;
bunny.y = 100;

// Add the sprite to the stage
app.stage.addChild(bunny);

// Animate the sprite (optional)
app.ticker.add(() => {
    bunny.rotation += 0.01;
});
})();

