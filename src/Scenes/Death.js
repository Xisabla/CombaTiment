import Phaser from 'phaser';
import EventInput from '../Input/EventInput';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'DeathScene' });
    }

    fadeInTitle ()
    {
        return new Promise((resolve, reject) =>
        {
            let ticks = 0;
            let timer = setInterval(() =>
            {
                this.title.setAlpha(0.02 * ticks);
                this.title.setFontSize(10 + ticks);

                ticks++;
                if (ticks >= 100)
                {
                    clearInterval(timer);
                    return resolve();
                }
            }, 10);
        });
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        this.background = this.add.image(800, 450, 'menu/background').setAlpha(0);
        this.title = this.add.text(800, 400, 'Vous etes mort')
            .setOrigin(0.5)
            .setAlpha(0)
            .setAlign('center')
            .setFontSize(10)
            .setFontFamily('BT1982')
            .setColor('#ffffff');

        setTimeout(() =>
        {
            this.sound.add('music/fail', { volume: 0.8 }).play();
        }, 250);

        this.fadeInTitle()
            .then(() =>
            {
                setTimeout(() =>
                {
                    this.scene.start('LevelSelect');
                }, 1000);
            });
    }

    update ()
    {}
}
