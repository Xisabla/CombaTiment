import Phaser from 'phaser';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        this.add.text(400, 50, '~-[ CombaTiment ]-~', {
            font: '32px Raleway',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    update ()
    {}
}
