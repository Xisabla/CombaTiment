import Phaser from 'phaser';
import EventInput from '../Input/EventInput';
import { wait, repeat } from '../utils';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'DeathScene' });
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        this.background = this.add.image(800, 450, 'menu/background').setAlpha(0);
        this.title = this.add.text(800, 400, 'Game Over')
            .setOrigin(0.5)
            .setAlpha(0)
            .setAlign('center')
            .setFontSize(10)
            .setFontFamily('BT1982')
            .setColor('#ffffff');

        wait(250)
            .then(() => this.sound.add('music/fail', { volume: 0.8 }).play());

        repeat(10, 100, (ticks) =>
        {
            this.title.setAlpha(0.02 * ticks);
            this.title.setFontSize(10 + ticks);
        })
            .then(() => wait(1000))
            .then(() => this.scene.start('LevelSelect'));
    }

    update ()
    {}
}
