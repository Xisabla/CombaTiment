import Phaser from 'phaser';
import { Menu, MenuOption } from '../UI/Menu';
import EventInput from '../Input/EventInput';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    fadeInTitle ()
    {
        return new Promise((resolve, reject) =>
        {
            let ticks = 0;
            let timer = setInterval(() =>
            {
                this.title.setAlpha(0.01 * ticks);
                this.title.setScale(0.05 + 0.0015 * ticks);

                ticks++;
                if (ticks >= 100)
                {
                    clearInterval(timer);
                    return resolve();
                }
            }, 10);
        });
    }

    moveTitle ()
    {
        return new Promise((resolve, reject) =>
        {
            let ticks = 0;
            let timer = setInterval(() =>
            {
                this.background.setAlpha(0.01 * ticks);
                this.title.setScale(0.2 - 0.0008 * ticks);
                this.title.setY(400 - 3 * ticks);

                ticks++;
                if (ticks >= 100)
                {
                    clearInterval(timer);
                    return resolve();
                }
            }, 10);
        });
    }

    makeMenu ()
    {
        this.frame = this.add.image(800, 400, 'hud/menuframe');

        this.menu = new Menu(this, {
            title: { image: 'title',
                scale: 0.12,
                y: 100,
                offsetBottom: 150 },

            choices: { color: '#ffffff',
                fontFamily: 'BT1982',
                fontSize: 32,
                offset: 40
            },

            sounds: {
                select: this.sounds.menu
            },

            separators: { type: 'bar',
                width: 150,
                color: 0x1111111,
                alpha: 0.5,
                offset: 40 },

            cursor: { image: 'menu/selector', scale: 1.2 },
            cursorOffsetX: 0
        });

        this.menu.add(new MenuOption('Start', { enter: () =>
        {
            this.scene.start('LevelSelect');
        } }));

        this.menu.create();
        this.menu.bindInput(this.inputs);
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        this.sounds = {};
        this.sounds.ambient = this.sound.add('music/mettaton', { loop: true, volume: 0.8 });
        this.sounds.menu = this.sound.add('music/menu_selection');
        this.sounds.ambient.play();

        this.background = this.add.image(800, 450, 'menu/background').setAlpha(0);
        this.title = this.add.image(800, 400, 'title').setScale(0.05).setAlpha(0);

        this.fadeInTitle()
            .then(() => this.moveTitle())
            .then(() => this.makeMenu());
    }

    update ()
    {}
}
