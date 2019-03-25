import Phaser from 'phaser';
import { Menu, MenuOption, MenuSeperator } from '../UI/Menu';
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
        this.sounds.ambiant = this.sound.add('music/mettaton', { loop: true, volume: 0.3 });
        this.sounds.menu = this.sound.add('music/menu_selection');
        this.sounds.ambiant.play();

        this.menu = new Menu(this, {
            title: { image: 'menu/title',
                y: 100,
                offsetBottom: -60 },

            choices: { color: '#2c3e50',
                fontFamily: 'Raleway',
                fontSize: 32,
                offset: 40,
                enter: () =>
                {
                    this.scene.start('TodoScene');
                }
            },

            sounds: {
                select: this.sounds.menu
            },

            seperators: { type: 'bar',
                width: 150,
                color: 0x1111111,
                alpha: 0.5,
                offset: 40 },

            cursor: { image: 'menu/selector', scale: 1.2 },
            cursorOffsetX: 0
        });

        this.menu.add(new MenuOption('New Game', { enter: () =>
        {
            this.scene.start('LevelSelect');
        } }));

        this.menu.add(new MenuSeperator());
        this.menu.add(new MenuOption('Load Game'));
        this.menu.add(new MenuSeperator());
        this.menu.add(new MenuOption('Credits'));

        this.menu.create();

        this.menu.bindInput(this.inputs);
    }

    update ()
    {}
}
