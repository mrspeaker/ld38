import pop from "../pop";
const { Assets, Game, MouseControls, KeyControls, Sound } = pop;
import GameScreen from "./screens/GameScreen";

const game = new Game(700, 450);
const mouse = new MouseControls(game.renderer.view);
const keys = new KeyControls();

game.theme = new Sound("./res/sounds/theme.mp3", {volume: 0.45, loop: true});

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

Assets.addReadyListener(() => {
  game.theme.play();
});

game.run();
