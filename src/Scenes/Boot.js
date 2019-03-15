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

        // Splash
        this.load.image('menu/background', 'assets/menu/background.png');
        this.load.image('menu/title', 'assets/menu/title.png');
        this.load.image('menu/selector', 'assets/menu/selector.png');
        this.load.json('assets/hitboxes', 'assets/hitboxes.json');

        // LevelSelect
        this.load.image('levelselect/background', 'assets/levelselect/background.png');
        this.load.image('levelselect/ground', 'assets/levelselect/ground.png');

        // Gameplay
        this.load.image('ennemy/apple', 'assets/sprites/apple.png');
        this.load.image('power/thunder', 'assets/power/thunder.png');

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
