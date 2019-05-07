import Phaser from 'phaser';
import { Menu, MenuOption } from '../UI/Menu';
import EventInput from '../Input/EventInput';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        this.add.image(800, 450, 'menu/background');

        this.sounds = {};
        this.sounds.ambient = this.sound.add('music/mettaton', { loop: true, volume: 0.8 });
        this.sounds.menu = this.sound.add('music/menu_selection');
        this.sounds.ambient.play();

        this.frame = this.add.graphics();
        this.frame.fillStyle(0x000000, 0.7);
        this.frame.fillRect(550, 300, 500, 250);

        this.menu = new Menu(this, {
            title: { image: 'title',
                scale: 0.12,
                y: 100,
                offsetBottom: 180 },

            choices: { color: '#ffffff',
                fontFamily: 'Raleway',
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

    update ()
    {}
}
