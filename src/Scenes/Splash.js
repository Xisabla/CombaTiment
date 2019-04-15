import Phaser from 'phaser';
import { Menu, MenuOption, MenuSeparator } from '../UI/Menu';
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
        this.frame.fillStyle(0x000000, 0.4);
        this.frame.fillRect(550, 200, 500, 450);

        this.menu = new Menu(this, {
            title: { text: 'CombaTiment',
                fontFamily: 'Anton',
                fontSize: 120,
                color: '#000000',
                y: 100,
                offsetBottom: 80 },

            choices: { color: '#ffffff',
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

            separators: { type: 'bar',
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

        this.menu.add(new MenuSeparator());
        this.menu.add(new MenuOption('Load Game'));
        this.menu.add(new MenuSeparator());
        this.menu.add(new MenuOption('Credits'));

        this.menu.create();

        this.menu.bindInput(this.inputs);
    }

    update ()
    {}
}
