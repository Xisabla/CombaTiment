import Phaser from 'phaser';
import Apple from '../sprites/Apple';

import { Hitbox, renderHitboxes, updateHitboxes } from '../Engine/Hitbox';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'SplashScene' });
    }

    create ()
    {
        let tamere = new Hitbox({
            label: 'body',
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            type: 'hitbox'
        });

        this.add.text(400, 50, '~-[ CombaTiment ]-~', {
            font: '32px Bangers',
            fill: '#ffffff'
        }).setFontSize(20).setOrigin(0.5);

        this.apple = new Apple(this, 550, 50);
        this.apple.hitboxes = {
            active: 'still',
            'still': [tamere]
        };

        this.graphics = this.add.graphics();

        this.add.existing(this.apple);
    }

    update ()
    {
        updateHitboxes(this.apple);
        renderHitboxes(this.graphics, [this.apple.hitboxes[this.apple.hitboxes.active]]);
    }
}
