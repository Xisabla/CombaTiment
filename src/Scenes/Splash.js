import Phaser from 'phaser';
import { Menu, MenuOption, MenuSeperator } from '../UI/Menu';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        this.add.image(800, 450, 'background');

        this.menu = new Menu(this, {
            title: { image: 'title',
                offsetBottom: -60 },

            choices: { color: 'black',
                fontFamily: 'Arial',
                fontSize: 32,
                offset: 40,
                enter: (elem) => console.log('Enter: ', elem.name)
            },

            seperators: { type: 'bar',
                width: 150,
                color: 0x1111111,
                alpha: 0.5,
                offset: 40 },

            // cursor: { fontSize: 32, fontFamily: 'Arial' },
            cursor: { image: 'selector', scale: 1.2 },
            cursorOffsetX: 0
        });

        this.menu.add(new MenuOption('New Game'));
        this.menu.add(new MenuSeperator({ }));
        this.menu.add(new MenuOption('Load Game'));
        this.menu.add(new MenuSeperator());
        this.menu.add(new MenuOption('Credits'));

        this.menu.create();

        this.menu.bindKeyboard(this.input.keyboard);
        this.menu.bindGamepad(this.input.gamepad);
    }

    update ()
    {}
}
