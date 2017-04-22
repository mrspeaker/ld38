import pop from "../pop";
const { Game, MouseControls } = pop;
import GameScreen from "./screens/GameScreen";

const game = new Game(700, 450);
game.scene = new GameScreen(game, new MouseControls(game.renderer.view));
game.run();
