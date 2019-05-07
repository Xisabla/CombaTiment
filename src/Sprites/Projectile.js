import Phaser from 'phaser';
import { Hitbox } from '../Engine/Hitbox';

export default class Projectile extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, spritesheet, settings = {})
    {
        super(scene, x, y, spritesheet);

        let flipped = settings.flipped || false;

        this.time = 0;
        this.baseVelocityX = (settings.baseVelocityX !== undefined) ? settings.baseVelocityX : 100;
        this.baseVelocityY = (settings.baseVelocityY !== undefined) ? settings.baseVelocityY : 0;
        this.gravity = !(!settings.gravity || false);

        if (flipped) this.baseVelocityX *= -1;

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.body.allowGravity = this.gravity;
        this.body.setVelocityX(this.baseVelocityX);
        this.body.setVelocityY(this.baseVelocityY);
        this.setFlipX(flipped);

        this.body.setBounce(0);
        if (scene.ground) scene.physics.add.collider(this, scene.ground);

        this.hitbox = new Hitbox({
            type: 'hurtbox',
            anchor: { x, y },
            width: this.displayWidth,
            height: this.displayHeight,
            end: 1
        });

        this.timer = setInterval(() =>
        {
            this.update(this.scene.player, this.scene.enemies);
        }, 10);
    }

    createAnim (key, frames, framerate, repeat = -1)
    {
        if (!this.anims.animationManager.anims.entries[key])
        {
            this.scene.anims.create({
                key: key,
                frames: frames,
                frameRate: framerate,
                repeat: repeat
            });
        }
    }

    destroy ()
    {
        clearInterval(this.timer);
        super.destroy();
    }

    update (player, enemies = [])
    {
        this.time += 10;
        this.hitbox.setXY(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2);

        let x = this.x;
        let y = this.y;
        let camera = this.scene.cameras.main;

        if (x < camera.scrollX || x > camera.scrollX + camera.width || y <= 0)
        {
            this.destroy();
        }
    }
}
