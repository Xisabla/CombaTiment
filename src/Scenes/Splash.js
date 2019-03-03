import Phaser from 'phaser';
import { Menu, MenuOption, MenuSeperator } from '../UI/Menu';

import { xbox } from '../config/gamepad';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        this.add.image(800, 450, 'menu/background');

        this.menu = new Menu(this, {
            title: { image: 'menu/title',
                y: 100,
                offsetBottom: -60 },

            choices: { color: '#2c3e50',
                fontFamily: 'Raleway',
                fontSize: 32,
                offset: 40 },

            seperators: { type: 'bar',
                width: 150,
                color: 0x1111111,
                alpha: 0.5,
                offset: 40 },

            cursor: { image: 'menu/selector', scale: 1.2 },
            cursorOffsetX: 0
        });

        this.menu.add(new MenuSeperator({ }));
        this.menu.add(new MenuOption('Load Game'));
        this.menu.add(new MenuSeperator());
        this.menu.add(new MenuOption('Credits'));

        this.menu.create();

        this.menu.bindKeyboard(this.input.keyboard);
        this.menu.bindGamepad(this.input.gamepad, xbox);
    }

    update ()
    {}
}
