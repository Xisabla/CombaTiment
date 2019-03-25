import Phaser from 'phaser';
import { getHitboxes } from '../Engine/Hitbox';

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
        this.baseVelocity = 500;
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

        if (this.scene.sounds)
        {
            if (this.scene.sounds.punch) this.scene.sounds.punch.play();
        }
    }

    punchAnimEnd ()
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

    checkActions (input)
    {
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'punch') this.punchAnimEnd();
        else if (input.attack1) this.punch();
        else if (input.direction.left) this.walk(input.getVelocity(this.baseVelocity), false);
        else if (input.direction.right) this.walk(input.getVelocity(this.baseVelocity), true);
        else this.idle();
    }
}
