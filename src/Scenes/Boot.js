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
        // ---------- Loader
        this.assetsLoaded = false;
        this.fontsLoaded = false;

        this.loadingBar = new LoadingBar(this, {
            bind: true,
            messagePrefix: 'Loading asset:'
        });

        // ---------- Fullscreen
        let canvas = this.sys.game.canvas;
        let fullscreen = this.sys.game.device.fullscreen;

        if (!fullscreen.available)
        {
            return;
        }

        document.getElementById('fullscreen').addEventListener('click', function ()
        {
            if (document.fullscreenElement) return;

            canvas[fullscreen.request]();
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
