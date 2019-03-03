import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1600,
    height: 900,
    input: {
        gamepad: true
    },
    localStorageName: 'combatiment'
};
