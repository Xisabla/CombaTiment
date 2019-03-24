import Phaser from 'phaser';

import BootScene from './scenes/Boot';
import SplashScene from './scenes/Splash';
import LevelSelect from './Scenes/LevelSelect';
import Todo from './Scenes/Todo';
import Level from './Scenes/Level';

import config from './config/game';

const gameConfig = Object.assign(config, {
    scene: [BootScene, Todo, SplashScene, LevelSelect, Level]
});

// eslint-disable-next-line no-unused-vars
let game = new Phaser.Game(gameConfig);
