import Projectile from '../Projectile';
import { isOver } from '../../Engine/Hitbox';

export default class Water extends Projectile
{
    constructor (scene, x, y, flipped)
    {
        super(scene, x, y, 'projectiles/water', {
            baseVelocityX: 300,
            baseVelocityY: 0,
            flipped,
            gravity: false
        });

        this.setScale(2);
        this.lastHit = -1;

        this.createAnim('water', scene.anims.generateFrameNumbers('projectiles/water', { start: 0, end: 3 }), 10);
        this.anims.play('water');
    }

    update (player, enemies = [])
    {
        super.update();

        if (isOver(this.hitbox, player.hitboxes[player.hitboxes.active][0]))
        {
            if (this.time - this.lastHit > 500 || this.lastHit === -1)
            {
                player.looseHp(20);
                this.lastHit = this.time;
            }

            if (player.dashing) this.destroy();
        }
    }
}
