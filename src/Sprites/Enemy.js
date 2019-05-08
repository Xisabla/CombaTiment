
import Character from './Character';
import { isOver } from '../Engine/Hitbox';

export default class Enemy extends Character
{
    constructor (scene, name, x, y, spritesheet, ground, hitboxes, hitboxName, anims = {}, settings = {})
    {
        let baseVelocity = settings.baseVelocity || 250;
        let hpmax = settings.hpmax || 40;
        let scale = settings.scale || 1;

        super(scene, x, y,
            spritesheet,
            ground,
            hitboxes,
            hitboxName,
            { baseVelocity, hpmax });

        this.name = name;
        this.setScale(scale);
        this.fading = false;

        this.attackDamage = settings.attackDamage || 10;
        this.attackDone = false;

        if (anims) this.createAnims(anims);
    }

    createAnims (anims)
    {
        if (anims)
        {
            if (anims['idle']) this.createAnim(this.name + 'Idle', anims['idle']['anim'], anims['idle']['framerate']);
            if (anims['walk']) this.createAnim(this.name + 'Walk', anims['walk']['anim'], anims['walk']['framerate']);
            if (anims['attack']) this.createAnim(this.name + 'Attack', anims['attack']['anim'], anims['attack']['framerate']);
            if (anims['death']) this.createAnim(this.name + 'Death', anims['death']['anim'], anims['death']['framerate']);
        }
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play(this.name + 'Idle', true);
        this.body.setVelocityX(0);
    }

    looseHp (amount, kvx, kvy)
    {
        super.looseHp(amount);

        if (this.hp > 0)
        {
            let vx = kvx || amount * 15;
            let vy = -(kvy || amount * 5);

            if (!kvx) if (this.scene.player.flipX) vx *= -1;

            this.anims.play(this.name + 'Idle', true);
            this.body.setVelocity(vx, vy);
        }
    }

    attack (target)
    {
        this.anims.play(this.name + 'Attack', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = this.baseVelocity, right = true)
    {
        this.hitboxes.active = 'still';
        this.setFlipX(this.reverseFlipX ? !right : right);
        this.anims.play(this.name + 'Walk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    damage (target, damage)
    {
        if (damage >= target.hp)
        {
            this.scene.cameras.main.flash(2000);
            this.scene.cameras.main.shake(200, 0.1);
        }
        else
        {
            this.scene.cameras.main.shake(damage * 5, damage * 20e-5);
        }

        target.looseHp(damage);
    }

    animAttack (target)
    {
        this.anims.play(this.name + 'Attack', true);
        this.hitboxes.active = 'attack';

        let frame = this.anims.currentFrame.index;

        if (frame >= this.hitboxes.attack[1].start && frame <= this.hitboxes.attack[1].end && !this.attackDone)
        {
            this.attackDone = true;

            if (this.canAttack(target) && target.alive) this.damage(target, this.attackDamage);
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            this.anims.play(this.name + 'Idle', true);
            this.hitboxes.active = 'still';
            this.attackDone = false;
        }

        this.body.setVelocityX(0);
    }

    animDie ()
    {
        this.anims.play(this.name + 'Death', true);

        let frame = this.anims.currentFrame.index;

        if (frame === this.anims.currentAnim.frames.length)
        {
            super.die();
        }

        this.body.setVelocityX(0);
    }

    isAttacking ()
    {
        if (!this.anims) return false;

        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'Attack';
    }

    isDying ()
    {
        if (!this.anims) return false;

        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'Death';
    }

    canAttack (character)
    {
        return isOver(this.hitboxes.attack[1], character.hitboxes[character.hitboxes.active][0]);
    }

    fadeOut (nbticks = 10, tickTime = 10)
    {
        if (!this.fading)
        {
            let factor = 1 / nbticks;
            let ticks = 0;
            let timer = setInterval(() =>
            {
                this.setAlpha(1 - factor * ticks);
                ticks++;
                if (ticks >= nbticks) clearInterval(timer);
            }, tickTime);
        }

        this.fading = true;
    }

    die (anim = true)
    {
        if (this.dying || !this.alive) return false;
        this.dying = true;

        if (anim && this.anims.animationManager.anims.entries[this.name + 'Death'])
        {
            this.anims.play(this.name + 'Death', true);
            this.fadeOut(100, 10);
        }
        else
        {
            this.anims.play(this.name + 'Idle', true);
            this.fadeOut(10, 10);
            setTimeout(() =>
            {
                super.die();
            }, 100);
        }
    }

    update (time, player, enemies = [])
    {
        if (this.scene && this.scene.paused) this.idle();

        if (this.isDying()) this.animDie();
        else if (this.dying) return;
        else if (this.isAttacking()) this.animAttack(player);
        else if (Math.random() >= 0.1) super.update();
        else if (player && player.alive && this.canAttack(player)) this.attack(player);
        else if (this.body.touching.down && player && player.alive && this.hitboxes[this.hitboxes.active][0].left > player.hitboxes[player.hitboxes.active][0].right) this.walk(this.baseVelocity, false);
        else if (this.body.touching.down && player && player.alive && this.hitboxes[this.hitboxes.active][0].right < player.hitboxes[player.hitboxes.active][0].left) this.walk(this.baseVelocity, true);
        else if (this.body.touching.down) this.walk(this.baseVelocity);
        else this.idle();

        super.update();
    }
}
