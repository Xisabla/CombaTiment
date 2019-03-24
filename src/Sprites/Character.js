import Phaser from 'phaser';
import { getHitboxes } from '../Engine/Hitbox';
import { actions } from '../config/gamepad/buttons';

export default class Character extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, spritesheet, platform, hitboxes, hitboxName)
    {
        super(scene, x, y, spritesheet);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, platform);
        this.setOrigin(0);
        this.body.setBounce(0);
        this.body.setCollideWorldBounds(true);
        this.hitboxes = getHitboxes(scene.cache.json.get(hitboxes), hitboxName);
    }

    createAnim (scene, key, frames, framerate, repeat)
    {
        scene.anims.create({
            key: key,
            frames: frames,
            frameRate: framerate,
            repeat: repeat
        });
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play('idle', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = 500, right = true)
    {
        this.hitboxes.active = 'walking';
        this.setFlipX(!right);
        this.anims.play('walk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    punch ()
    {
        this.body.setVelocityX(0);
        this.anims.play('punch', true);
    }

    checkActions (cursors, { keys, pad })
    {
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'punch')
        {
            // if the punch animation has been triggered
            this.anims.play('punch', true);
            this.hitboxes.active = 'punch';
            if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
            {
                // finish the punch animation
                this.anims.play('idle', true);
                this.hitboxes.active = 'still';
            }
            this.body.setVelocityX(0);
        }
        else if ((keys && keys.select.isDown) || (pad && actions(pad).attacks[0]))
        {
            this.punch();
        }
        else if (cursors.right.isDown || (pad && actions(pad).axes[0] > 0))
        {
            let velocity = actions(pad).axes[0] > 0 ? 500 * actions(pad).axes[0] : 500;
            this.walk(velocity, true);
        }
        else if (cursors.left.isDown || (pad && actions(pad).axes[0] < 0))
        {
            let velocity = actions(pad).axes[0] > 0 ? 500 * actions(pad).axes[0] : 500;
            this.walk(velocity, false);
        }
        else
        {
            this.idle();
        }
    }
}
