import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1600,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },
    input: {
        gamepad: true
    },
    debug: {
        character: true,
        hitboxes: false,
        level: true
    },
    localStorageName: 'combatiment'
};
