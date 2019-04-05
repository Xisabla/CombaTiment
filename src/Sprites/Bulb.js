
import Character from './Character';
import { isOver } from '../Engine/Hitbox';

export default class Bulb extends Character
{
    constructor (scene, x, y, ground)
    {
        super(scene, x, y,
            'ennemies/bulb/walking',
            ground,
            'ennemies/bulb/hitbox',
            'bulb',
            { baseVelocity: 250, hpmax: 100 });

        this.setScale(0.5);
        this.attackDone = false;

        this.hpbarback = this.scene.add.graphics();
        this.hpbar = this.scene.add.graphics();

        this.hpBaseY = this.y - 20;
        this.hpBaseX = 40;

        this.hpbarback.fillStyle(0x696969, 0.7);
        this.hpbarback.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);

        this.hpbar.fillStyle(0xe60000, 0.7);
        this.hpbar.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);
    }

    createAnims ()
    {
        this.createAnim('bulbIdle', [
            { key: 'ennemies/bulb/walking', frame: 1 }
        ], 10);
        this.createAnim('bulbAttack', this.scene.anims.generateFrameNumbers('ennemies/bulb/punch', { start: 0, end: 21 }), 15);
        this.createAnim('bulbWalk', this.scene.anims.generateFrameNumbers('ennemies/bulb/walking', { start: 0, end: 4 }), 10);
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play('bulbIdle', true);
        this.body.setVelocityX(0);
    }

    attack (target)
    {
        this.anims.play('bulbAttack', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = this.baseVelocity, right = true)
    {
        this.hitboxes.active = 'still';
        this.setFlipX(right);
        this.anims.play('bulbWalk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    animPunch (player)
    {
        this.anims.play('bulbAttack', true);
        this.hitboxes.active = 'attack';

        let frame = this.anims.currentFrame.index;

        if (frame >= this.hitboxes.attack[1].start && frame <= this.hitboxes.attack[1].end && !this.attackDone)
        {
            this.attackDone = true;

            if (isOver(this.hitboxes.attack[1], player.hitboxes[player.hitboxes.active][0]))
            {
                player.looseHp(5);
            }
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            this.anims.play('bulbIdle', true);
            this.hitboxes.active = 'still';
            this.attackDone = false;
        }

        this.body.setVelocityX(0);
    }

    update (time, player)
    {
        // TODO: Check for player alive
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'bulbAttack') this.animPunch(player);
        else if (isOver(this.hitboxes.attack[1], player.hitboxes[player.hitboxes.active][0])) this.attack(player);
        else if (this.hitboxes[this.hitboxes.active][0].left > player.hitboxes[player.hitboxes.active][0].right) this.walk(this.baseVelocity, false);
        else if (this.hitboxes[this.hitboxes.active][0].right < player.hitboxes[player.hitboxes.active][0].left) this.walk(this.baseVelocity, true);
        else this.idle();

        super.update();

        if (this.alive)
        {
            this.hpbarback.setX(this.x);
            this.hpbar.clear();
            this.hpbar.fillStyle(0xe60000, 0.7);
            this.hpbar.fillRect(this.x + 40, this.hpBaseY, 100 * this.hp / this.hpmax, 10);
        }
        else
        {
            this.hpbarback.destroy();
            this.hpbar.destroy();
        }
    }
}
