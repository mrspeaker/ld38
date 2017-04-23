import pop from "../pop";
const { Game, MouseControls, KeyControls } = pop;
import GameScreen from "./screens/GameScreen";

const game = new Game(700, 450);
const mouse = new MouseControls(game.renderer.view);
const keys = new KeyControls();

const start = () => {
  keys.reset();
  game.scene = new GameScreen(
    game,
    mouse,
    keys,
    start
  );
};

start();
game.run();
