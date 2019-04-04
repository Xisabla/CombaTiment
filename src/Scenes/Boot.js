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

        // Audio
        this.load.audio('music/mettaton', ['assets/music/mus_mettaton_ex.ogg']);
        this.load.audio('music/punch', ['assets/music/punch.ogg']);
        this.load.audio('music/menu_selection', ['assets/music/menu_selection.ogg']);
        this.load.audio('music/tem', ['assets/music/mus_temvillage.ogg']);
        this.load.audio('music/nightoffire', ['assets/music/mus_nightoffire.ogg']);

        // Splash
        this.load.image('menu/background', 'assets/menu/background.png');
        this.load.image('menu/title', 'assets/menu/title.png');
        this.load.image('menu/selector', 'assets/menu/selector.png');

        // LevelSelect
        this.load.image('levelselect/background', 'assets/levelselect/background.png');
        this.load.image('levelselect/ground', 'assets/levelselect/ground.png');
        this.load.image('levelselect/grass', 'assets/levelselect/grass.png');

        // Gameplay
        this.load.image('ennemy/apple', 'assets/sprites/apple.png');
        this.load.image('power/thunder', 'assets/power/thunder.png');

        // HUD
        this.load.image('hud/gamepad', 'assets/hud/gamepad.png');
        this.load.image('hud/hpbar/hp', 'assets/hud/hpbar/hp.png');
        this.load.image('hud/hpbar/energy', 'assets/hud/hpbar/energy.png');
        this.load.image('hud/hpbar/frame', 'assets/hud/hpbar/frame.png');

        // Level
        this.load.json('scenes/data', 'assets/scenes/level.json');

        // Feilong
        this.load.spritesheet('feilong/idle', 'assets/feilong/idle.png', { frameWidth: 111.17, frameHeight: 171 });
        this.load.spritesheet('feilong/walking', 'assets/feilong/walking.png', { frameWidth: 90, frameHeight: 171 });
        this.load.spritesheet('feilong/punch', 'assets/feilong/lpunch.png', { frameWidth: 118.6, frameHeight: 177 });
        this.load.spritesheet('feilong/jump', 'assets/feilong/jump.png', { frameWidth: 82, frameHeight: 187 });
        this.load.spritesheet('feilong/forwardjump', 'assets/feilong/forwardjump.png', { frameWidth: 90, frameHeight: 185 });
        this.load.json('feilong/hitbox', 'assets/feilong/hitboxes.json');

        // Fridge
        this.load.spritesheet('ennemies/fridge', 'assets/ennemies/fridge.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('ennemies/fridge/hitbox', 'assets/ennemies/hitbox-fridge.json');

        // Bulb
        this.load.spritesheet('ennemies/bulb/walking', 'assets/ennemies/bulb-walking.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('ennemies/bulb/punch', 'assets/ennemies/bulb-punch.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('ennemies/bulb/hitbox', 'assets/ennemies/hitbox-bulb.json');

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
