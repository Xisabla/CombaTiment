import Phaser from 'phaser';

import BootScene from './scenes/Boot';
import SplashScene from './scenes/Splash';
import LevelSelect from './Scenes/LevelSelect';

import config from './config/game';

const gameConfig = Object.assign(config, {
    scene: [BootScene, SplashScene, LevelSelect]
});

// eslint-disable-next-line no-unused-vars
let game = new Phaser.Game(gameConfig);
