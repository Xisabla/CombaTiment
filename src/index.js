import Phaser from 'phaser';

import BootScene from './Scenes/Boot';
import SplashScene from './Scenes/Splash';
import LevelSelect from './Scenes/LevelSelect';
import Todo from './Scenes/Todo';
import Level from './Scenes/Level';
import Test from './Scenes/Test';

import config from './config/game';

const gameConfig = Object.assign(config, {
    scene: [BootScene, Todo, SplashScene, LevelSelect, Level, Test]
});

// eslint-disable-next-line no-unused-vars
let game = new Phaser.Game(gameConfig);
