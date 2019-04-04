
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
        this.attack1Done = false;
    }

    createAnims ()
    {
        this.createAnim('fridgeIdle', this.scene.anims.generateFrameNumbers('ennemies/fridge', { start: 0, end: 0 }), 10);
        this.createAnim('fridgeAttack1', [
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

    attack1 (target)
    {
        this.anims.play('fridgeAttack1', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = this.baseVelocity, right = true)
    {
        this.hitboxes.active = 'still';
        this.setFlipX(!right);
        this.anims.play('frdigeWalk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    animPunch (player)
    {
        this.anims.play('fridgeAttack1', true);
        this.hitboxes.active = 'attack1';

        let frame = this.anims.currentFrame.index;

        if (frame >= this.hitboxes.attack1[1].start && frame <= this.hitboxes.attack1[1].end && !this.attack1Done)
        {
            this.attack1Done = true;
            player.looseHp(5);
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            // finish the punch animation
            this.anims.play('fridgeIdle', true);
            this.hitboxes.active = 'still';
            this.attack1Done = false;
        }

        this.body.setVelocityX(0);
    }

    update (time, player)
    {
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'fridgeAttack1') this.animPunch(player);
        else if (isOver(this.hitboxes.attack1[1], player.hitboxes[player.hitboxes.active][0])) this.attack1(player);
        else if (this.hitboxes[this.hitboxes.active][0].left > player.hitboxes[player.hitboxes.active][0].right) this.walk(this.baseVelocity, false);
        else if (this.hitboxes[this.hitboxes.active][0].right < player.hitboxes[player.hitboxes.active][0].left) this.walk(this.baseVelocity, true);
        else this.idle();

        super.update();
    }
}
