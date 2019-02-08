import Phaser from 'phaser';
import Apple from '../sprites/Apple';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        this.add.text(400, 50, '~-[ CombaTiment ]-~', {
            font: '32px Bangers',
            fill: '#ffffff'
        }).setFontSize(20).setOrigin(0.5);

        this.apple = new Apple(this, 550, 50);

        this.add.existing(this.apple);
    }

    update ()
    {}
}
