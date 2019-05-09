import Enemy from '../Enemy';
import { updateHitboxes } from '../../Engine/Hitbox';
import Water from '../Projectiles/Water';

export default class WashMachine extends Enemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'washmachine', x, y,
            'enemies/washmachine',
            ground,
            'enemies/washmachine/hitbox', 'washmachine',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/washmachine', { start: 0, end: 0 }), 'framerate': 10 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('enemies/washmachine', { start: 0, end: 4 }), 'framerate': 10 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/washmachine', { start: 5, end: 9 }), 'framerate': 10 },
                'death': { 'anim': scene.anims.generateFrameNumbers('enemies/washmachine', { start: 10, end: 16 }), 'framerate': 10 }
            },
            { scale: 0.5, hpmax: 60, attackDamage: 20 }
        );

        this.projectiles = [];

        this.reverseFlipX = true;
        this.lastAttack = -1;
        this.attackDone = false;
    }

    attack (time, target)
    {
        this.setFlipX(this.x > target.x);
        this.lastAttack = time;

        this.anims.play(this.name + 'Attack', true);
        this.body.setVelocityX(0);
    }

    throw ()
    {
        let x = this.x;

        if (!this.flipX) x = this.x + 120;

        this.projectiles.push(new Water(this.scene, x, this.y + 110, this.flipX));
    }

    animAttack ()
    {
        this.anims.play(this.name + 'Attack', true);
        this.hitboxes.active = 'attack';

        let frame = this.anims.currentFrame.index;

        if (frame === this.anims.currentAnim.frames.length && !this.attackDone)
        {
            this.attackDone = true;

            this.throw();
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            this.anims.play(this.name + 'Idle', true);
            this.hitboxes.active = 'still';
            this.attackDone = false;
        }

        this.body.setVelocityX(0);
    }

    distance (target)
    {
        if (!target) return 1e6;
        if (!target.x) return 1e6;

        return Math.abs(this.x - target.x);
    }

    escape (target)
    {
        let right = (this.x - target.x) > 0;

        this.walk(this.baseVelocity, right);
    }

    supdate ()
    {
        if (this.hp <= 0) this.die();
        if (this.alive) updateHitboxes(this);
    }

    update (time, player, enemies = [])
    {
        if (this.scene && this.scene.paused) this.idle();

        if (this.isDying()) this.animDie();
        else if (this.dying) return;
        else if (this.isAttacking()) this.animAttack();
        else if (Math.random() >= 0.1) this.supdate();
        else if (this.distance(player) < 300 && !this.body.touching.left && !this.body.touching.right) this.escape(player);
        else if (time > this.lastAttack + 3000) this.attack(time, player);
        else this.idle();

        this.supdate();
    }
}
