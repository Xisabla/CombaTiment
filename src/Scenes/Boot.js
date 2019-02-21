import Phaser from 'phaser';
import WebFont from 'webfontloader';

import LoadingBar from '../UI/LoadingBar';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'BootScene' });
    }

    init ()
    {
        this.assetsLoaded = false;
        this.fontsLoaded = false;

        this.loadingBar = new LoadingBar(this, {
            bind: true,
            messagePrefix: 'Loading asset:'
        });
    }

    preload ()
    {
        this.load.on('complete', () =>
        {
            this.assetsLoaded = true;
        });

        this.load.image('background', 'assets/menu/background.png');
        this.load.image('title', 'assets/menu/title.png');
        this.load.image('divider', 'assets/menu/divider.png');
        this.load.image('selector', 'assets/menu/selector.png');

        WebFont.load({
            google: {
                families: ['Raleway', 'Cairo']
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
