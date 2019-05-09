import Phaser from 'phaser';

import Player from '../Sprites/Player';
import EventInput from '../Input/EventInput';
import { wait, repeat, scoreTime, scoreCombo, totalScore } from '../utils';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'EndLevel' });

        this.data = {
            level: null,
            power: null,
            time: 99999,
            maxCombo: 0
        };
    }

    init (data)
    {
        this.data = data;
    }

    slowWrite (x, y, text, time = 100, settings = {})
    {
        let stext = this.add.text(x, y, '');
        if (settings.origin) stext.setOrigin(settings.origin);
        if (settings.align) stext.setAlign(settings.align);
        if (settings.fontFamily) stext.setFontFamily(settings.fontFamily);
        if (settings.fontSize) stext.setFontSize(settings.fontSize);

        let nbChars = text.length;

        return repeat(time, nbChars, (tick) =>
        {
            stext.setText(stext.text + text.charAt(tick));
        });
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        // TODO: Add sounds (button, score)
        this.sounds = {};
        this.sounds.click1 = this.sound.add('music/click1', { volume: 0.5 });
        this.sounds.click2 = this.sound.add('music/click2', { loop: true, volume: 0.5 });
        this.sounds.click2.play();

        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 810, 'levels/ground');

        this.player = new Player(this, 40, 525, this.ground);
        this.player.setGodmode(true);
        this.player.idle();

        this.slowWrite(800, 100, 'Niveau ' + this.data.level, 100, { origin: 0.5, align: 'center', fontFamily: 'BT1982', fontSize: 40 })
            .then(() => wait(500))
            .then(() => this.slowWrite(400, 250, 'Temps: ', 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(650, 250, this.data.time + ' s', 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(400, 300, 'Score Temps: ', 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(650, 300, scoreTime(this.data.time).toString(), 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(400, 350, 'Combo Max: ', 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(650, 350, this.data.maxCombo.toString(), 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(400, 400, 'Score Combo: ', 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() => this.slowWrite(650, 400, scoreCombo(this.data.maxCombo).toString(), 50, { origin: 0, align: 'left', fontFamily: 'Pixel', fontSize: 30 }))
            .then(() =>
            {
                this.sounds.click2.stop();
                return wait(500);
            })
            .then(() =>
            {
                this.add.text(400, 500, 'Total').setOrigin(0).setAlign('left').setFontFamily('BT1982').setFontSize(35);
                this.sounds.click1.play();
            })
            .then(() => wait(600))
            .then(() =>
            {
                this.add.text(650, 500, totalScore(this.data.time, this.data.maxCombo).toString()).setOrigin(0).setAlign('left').setFontFamily('BT1982').setFontSize(35);
                this.sounds.click1.play();
            })
            .then(() => wait(1000))
            .then(() => this.player.walk(400, true));
    }

    update (time)
    {
        if (this.player.x >= 1400) this.scene.start('LevelSelect');
    }
};
