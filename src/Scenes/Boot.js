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
        this.load.audio('music/energyball', ['assets/music/energyball.ogg']);
        this.load.audio('music/iceCube', ['assets/music/iceCube.wav']);
        this.load.audio('music/menu_selection', ['assets/music/menu_selection.ogg']);
        this.load.audio('music/tem', ['assets/music/mus_temvillage.ogg']);
        this.load.audio('music/nightoffire', ['assets/music/mus_nightoffire.ogg']);
        this.load.audio('music/fail', ['assets/music/fail.wav']);
        this.load.audio('music/gasgasgas', ['assets/music/mus_gasgasgas.ogg']);
        this.load.audio('music/click1', ['assets/music/click1.wav']);
        this.load.audio('music/click2', ['assets/music/click2.ogg']);

        // ---------- Interface

        // Powers
        this.load.image('power/none', 'assets/power/none.png');
        this.load.image('power/thunder', 'assets/power/thunder.png');

        // GUI
        this.load.image('title', 'assets/misc/title.png');
        this.load.image('hud/gamepad', 'assets/hud/gamepad.png');
        this.load.image('hud/hpbar/hp', 'assets/hud/hpbar/hp.png');
        this.load.image('hud/hpbar/energy', 'assets/hud/hpbar/energy.png');
        this.load.image('hud/hpbar/frame', 'assets/hud/hpbar/frame.png');
        this.load.image('hud/menuframe', 'assets/misc/menuframe.png');
        this.load.image('hud/pauseframe', 'assets/misc/pauseframe.png');
        this.load.image('misc/blackend', 'assets/misc/blackend.png');
        this.load.spritesheet('misc/dash', 'assets/misc/dash.png', { frameWidth: 550, frameHeight: 320 });

        // ---------- Levels

        // Splash
        this.load.image('menu/background', 'assets/background/menu.png');
        this.load.image('menu/title', 'assets/menu/title.png');
        this.load.image('menu/selector', 'assets/menu/selector.png');

        // LevelSelect
        this.load.image('levelselect/background', 'assets/background/levelselect.png');

        // All levels
        this.load.image('levels/ground', 'assets/levels/ground.png');
        this.load.image('levels/grass', 'assets/levels/grass.png');

        // Level 0
        this.load.json('levels/0', 'assets/levels/level_0.json');
        this.load.image('levels/0/background', 'assets/background/city1.png');

        // Level 1
        this.load.json('levels/1', 'assets/levels/level_1.json');
        this.load.image('levels/0/background', 'assets/background/city2.png');

        // Level 2
        this.load.json('levels/2', 'assets/levels/level_2.json');
        this.load.image('levels/0/background', 'assets/background/city2.png');

        // Level 3
        this.load.json('levels/3', 'assets/levels/level_3.json');
        this.load.image('levels/0/background', 'assets/background/city2.png');

        // ---------- Main Character

        // Player
        this.load.json('player/hitbox', 'assets/building/hitboxes.json');
        this.load.spritesheet('player/walk', 'assets/building/walk.png', { frameWidth: 192, frameHeight: 195 });
        this.load.spritesheet('player/punch', 'assets/building/punch.png', { frameWidth: 192, frameHeight: 195 });
        this.load.spritesheet('player/throw', 'assets/building/throw.png', { frameWidth: 192, frameHeight: 195 });
        this.load.spritesheet('player/dash', 'assets/building/dash.png', { frameWidth: 192, frameHeight: 195 });

        // Feilong
        this.load.spritesheet('feilong/idle', 'assets/feilong/idle.png', { frameWidth: 111.17, frameHeight: 171 });
        this.load.spritesheet('feilong/walking', 'assets/feilong/walking.png', { frameWidth: 90, frameHeight: 171 });
        this.load.spritesheet('feilong/punch', 'assets/feilong/lpunch.png', { frameWidth: 118.6, frameHeight: 177 });
        this.load.spritesheet('feilong/jump', 'assets/feilong/jump.png', { frameWidth: 82, frameHeight: 187 });
        this.load.spritesheet('feilong/forwardjump', 'assets/feilong/forwardjump.png', { frameWidth: 90, frameHeight: 185 });
        this.load.json('feilong/hitbox', 'assets/feilong/hitboxes.json');
        this.load.spritesheet('projectiles/energyball', 'assets/projectiles/energyball.png', { frameWidth: 50, frameHeight: 40 });

        // ---------- Enemies

        // BossFridge
        this.load.spritesheet('enemies/bossFridge', 'assets/enemies/bossFridge.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/bossFridge/hitbox', 'assets/enemies/hitbox-bossFridge.json');
        this.load.json('enemies/bossFridge/pattern', 'assets/enemies/pattern-bossFridge.json');

        // Fridge
        this.load.spritesheet('enemies/fridge', 'assets/enemies/fridge.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/fridge/hitbox', 'assets/enemies/hitbox-fridge.json');
        this.load.spritesheet('projectiles/icecube', 'assets/projectiles/icecube.png', { frameWidth: 13, frameHeight: 11 });

        // Bulb
        this.load.spritesheet('enemies/bulb/walking', 'assets/enemies/bulb-walking.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('enemies/bulb/punch', 'assets/enemies/bulb-punch.png', { frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('enemies/bulb/death', 'assets/enemies/bulb-death.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/bulb/hitbox', 'assets/enemies/hitbox-bulb.json');

        // Radioator
        this.load.spritesheet('enemies/radiator', 'assets/enemies/radiator.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/radiator/hitbox', 'assets/enemies/hitbox-radiator.json');

        // WashMachine
        this.load.spritesheet('enemies/washmachine', 'assets/enemies/washmachine.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/washmachine/hitbox', 'assets/enemies/hitbox-washmachine.json');
        this.load.spritesheet('projectiles/water', 'assets/projectiles/water.png', { frameWidth: 17, frameHeight: 16 });

        // Virus
        this.load.spritesheet('enemies/virus', 'assets/enemies/virus.png', { frameWidth: 320, frameHeight: 320 });
        this.load.json('enemies/virus/hitbox', 'assets/enemies/hitbox-virus.json');

        WebFont.load({
            custom: {
                families: ['BT1982', 'Pixel'],
                urls: ['assets/fonts/backto1982.css', 'assets/fonts/pixel.css']
            },
            active: () =>
            {
                this.fontsLoaded = true;
            }
        });
    }

    update ()
    {
        if (this.assetsLoaded && this.fontsLoaded) this.scene.start('LevelSelect');
    }
}
