import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'BootScene' });

        this.loaded = false;
    }

    preload ()
    {
        this.add.text(100, 100, 'loading assets...');

        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('apple', 'assets/sprites/apple.png');

        this.add.text(100, 130, 'loading fonts...');

        WebFont.load({
            google: {
                families: ['Raleway']
            },
            active: () =>
            {
                this.loaded = true;
            }
        });
    }

    update ()
    {
        if (this.loaded) this.scene.start('SplashScene');
    }
}
