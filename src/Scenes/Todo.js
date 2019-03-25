import Phaser from 'phaser';
import { Menu, MenuOption } from '../UI/Menu';
import EventInput from '../Input/EventInput';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'TodoScene' });
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        this.add.image(800, 450, 'menu/background');
        this.graphics = this.add.graphics();

        this.menu = new Menu(this, {
            title: { text: 'Todo\nWill be done soon (maybe...)',
                y: 100,
                fontFamily: 'Raleway',
                fontSize: 50,
                offsetBottom: 100 },

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

        this.menu.add(new MenuOption('Back', { enter: () =>
        {
            this.scene.start('SplashScene');
        } }));

        this.menu.create();

        this.menu.bindInput(this.inputs);
    }

    update ()
    {}
}
