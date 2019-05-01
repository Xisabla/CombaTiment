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

        // ---------- Audio

        this.load.audio('music/mettaton', ['assets/music/mus_mettaton_ex.ogg']);
        this.load.audio('music/punch', ['assets/music/punch.ogg']);
        this.load.audio('music/menu_selection', ['assets/music/menu_selection.ogg']);
        this.load.audio('music/tem', ['assets/music/mus_temvillage.ogg']);
        this.load.audio('music/nightoffire', ['assets/music/mus_nightoffire.ogg']);

        // ---------- Levels

        // Splash
        this.load.image('menu/background', 'assets/menu/background.png');
        this.load.image('menu/title', 'assets/menu/title.png');
        this.load.image('menu/selector', 'assets/menu/selector.png');

        // LevelSelect
        this.load.image('levelselect/background', 'assets/levelselect/background.png');
        this.load.image('levelselect/ground', 'assets/levelselect/ground.png');
        this.load.image('levelselect/grass', 'assets/levelselect/grass.png');

        // ---------- Interface

        // Gameplay
        this.load.image('power/thunder', 'assets/power/thunder.png');

        // GUI
        this.load.image('hud/gamepad', 'assets/hud/gamepad.png');
        this.load.image('hud/hpbar/hp', 'assets/hud/hpbar/hp.png');
        this.load.image('hud/hpbar/energy', 'assets/hud/hpbar/energy.png');
        this.load.image('hud/hpbar/frame', 'assets/hud/hpbar/frame.png');

        // ---------- Levels

        // Level
        this.load.json('scenes/data', 'assets/scenes/level.json');

        // ---------- Main Character

        // Feilong
        this.load.spritesheet('feilong/idle', 'assets/feilong/idle.png', { frameWidth: 111.17, frameHeight: 171 });
        this.load.spritesheet('feilong/walking', 'assets/feilong/walking.png', { frameWidth: 90, frameHeight: 171 });
        this.load.spritesheet('feilong/punch', 'assets/feilong/lpunch.png', { frameWidth: 118.6, frameHeight: 177 });
        this.load.spritesheet('feilong/jump', 'assets/feilong/jump.png', { frameWidth: 82, frameHeight: 187 });
        this.load.spritesheet('feilong/forwardjump', 'assets/feilong/forwardjump.png', { frameWidth: 90, frameHeight: 185 });
        this.load.json('feilong/hitbox', 'assets/feilong/hitboxes.json');

        // ---------- Enemies

        // Fridge
        this.load.spritesheet('enemies/fridge', 'assets/enemies/fridge.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/fridge/hitbox', 'assets/enemies/hitbox-fridge.json');

        // Bulb
        this.load.spritesheet('enemies/bulb/walking', 'assets/enemies/bulb-walking.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('enemies/bulb/punch', 'assets/enemies/bulb-punch.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/bulb/hitbox', 'assets/enemies/hitbox-bulb.json');

        // Radioator
        this.load.spritesheet('enemies/radiator', 'assets/enemies/radiator.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/radiator/hitbox', 'assets/enemies/hitbox-radiator.json');

        WebFont.load({
            google: {
                families: ['Raleway', 'Cairo', 'Anton']
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
