
import Character from './Character';
import { isOver } from '../Engine/Hitbox';

export default class Fridge extends Character
{
    constructor (scene, x, y, ground)
    {
        super(scene, x, y,
            'ennemies/fridge',
            ground,
            'ennemies/fridge/hitbox',
            'fridge',
            { baseVelocity: 250, hpmax: 100 });

        this.setScale(0.5);
        this.attackDone = false;

        this.hpbarback = this.scene.add.graphics();
        this.hpbar = this.scene.add.graphics();

        this.hpBaseY = this.y - 15;
        this.hpBaseX = 40;

        this.hpbarback.fillStyle(0x696969, 0.7);
        this.hpbarback.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);

        this.hpbar.fillStyle(0xe60000, 0.7);
        this.hpbar.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);
    }

    createAnims ()
    {
        this.createAnim('fridgeIdle', this.scene.anims.generateFrameNumbers('ennemies/fridge', { start: 0, end: 0 }), 10);
        this.createAnim('fridgeWalk', this.scene.anims.generateFrameNumbers('ennemies/fridge', { start: 0, end: 0 }), 10);
        this.createAnim('fridgeAttack', [
            { key: 'ennemies/fridge', frame: 0 },
            { key: 'ennemies/fridge', frame: 0 },
            { key: 'ennemies/fridge', frame: 1 },
            { key: 'ennemies/fridge', frame: 0 },
            { key: 'ennemies/fridge', frame: 0 }
        ], 5);
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play('fridgeIdle', true);
        this.body.setVelocityX(0);
    }

    attack (target)
    {
        this.anims.play('fridgeAttack', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = this.baseVelocity, right = true)
    {
        this.hitboxes.active = 'still';
        this.setFlipX(!right);
        this.anims.play('fridgeWalk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    animPunch (player)
    {
        this.anims.play('fridgeAttack', true);
        this.hitboxes.active = 'attack';

        let frame = this.anims.currentFrame.index;

        if (frame >= this.hitboxes.attack[1].start && frame <= this.hitboxes.attack[1].end && !this.attackDone)
        {
            this.attackDone = true;

            if (isOver(this.hitboxes.attack[1], player.hitboxes[player.hitboxes.active][0]))
            {
                let damage = 20;

                if (damage >= player.hp)
                {
                    this.scene.cameras.main.flash(2000);
                    this.scene.cameras.main.shake(200, 0.1);
                }
                else
                {
                    this.scene.cameras.main.flash();
                    this.scene.cameras.main.shake(200, 0.005);
                }

                player.looseHp(damage);
            }
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            // finish the punch animation
            this.anims.play('fridgeIdle', true);
            this.hitboxes.active = 'still';
            this.attackDone = false;
        }

        this.body.setVelocityX(0);
    }

    update (time, player)
    {
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'fridgeAttack') this.animPunch(player);
        else if (player && player.alive && isOver(this.hitboxes.attack[1], player.hitboxes[player.hitboxes.active][0])) this.attack(player);
        else if (player && player.alive && this.hitboxes[this.hitboxes.active][0].left > player.hitboxes[player.hitboxes.active][0].right) this.walk(this.baseVelocity, false);
        else if (player && player.alive && this.hitboxes[this.hitboxes.active][0].right < player.hitboxes[player.hitboxes.active][0].left) this.walk(this.baseVelocity, true);
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
