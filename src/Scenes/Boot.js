import Phaser from 'phaser';
import WebFont from 'webfontloader';

import LoadingBar from '../UI/LoadingBar';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'BootScene' });

        this.assetsLoaded = false;
        this.fontsLoaded = false;
    }

    preload ()
    {
        this.loadingBar = new LoadingBar(this, {
            bind: true,
            messagePrefix: 'Loading asset:'
        });

        this.load.on('complete', () =>
        {
            this.assetsLoaded = true;
        });

        for (let i = 0; i < 999; i++)
        {
            this.load.image('apple' + i, 'assets/sprites/apple.png');
        }

        WebFont.load({
            google: {
                families: ['Raleway']
            },
            active: () =>
            {
                this.fontsLoaded = true;
            }
        });
    }

    update ()
    {
        if (this.assetsLoaded && this.fontsLoaded) this.scene.start('SplashScene');
    }
}
