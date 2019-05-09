import Phaser from 'phaser';
import IceCube from './IceCube';
import { isOver } from '../../Engine/Hitbox';

class TutorialDash extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'misc/dash');

        if (!this.anims.animationManager.anims.entries['tutodash'])
        {
            this.scene.anims.create({
                key: 'tutodash',
                frames: this.scene.anims.generateFrameNumbers('misc/dash', { start: 0, end: 1 }),
                frameRate: 2,
                repeat: true
            });
        }

        this.setScale(0.5);

        scene.add.existing(this);
    }
}

export default class TutorialIceCube extends IceCube
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 0, 0);

        this.text = scene.add.text(x, y - 70, 'Dash !')
            .setOrigin(0.5)
            .setAlign('center')
            .setFontSize(32)
            .setFontFamily('Pixel');

        this.sprite = new TutorialDash(scene, x, y - 200);
    }

    destroy ()
    {
        this.text.destroy();
        this.sprite.destroy();
        super.destroy();
    }

    update (player, enemies = [])
    {
        this.time += 10;
        this.hitbox.setXY(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2);
        this.sprite.anims.play('tutodash', true);
        this.text.visible = (this.sprite.anims.currentFrame.index === 2);

        if (isOver(this.hitbox, player.hitboxes[player.hitboxes.active][0]))
        {
            if (this.time - this.lastHit > 500 || this.lastHit === -1)
            {
                player.looseHp(30);
                this.lastHit = this.time;
            }

            if (player.dashing) this.destroy();
        }
    }
}
