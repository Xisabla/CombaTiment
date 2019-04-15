
import Character from './Character';
import { isOver } from '../Engine/Hitbox';

export default class Enemy extends Character
{
    constructor (scene, name, x, y, spritesheet, ground, hitboxes, hitboxName, anims = {}, settings = {})
    {
        let baseVelocity = settings.baseVelocity || 250;
        let hpmax = settings.hpmax || 100;
        let scale = settings.scale || 1;

        super(scene, x, y,
            spritesheet,
            ground,
            hitboxes,
            hitboxName,
            { baseVelocity, hpmax });

        this.name = name;
        this.setScale(scale);

        this.attackDamage = settings.attackDamage || 50;
        this.hpbarOffset = settings.hpbarOffset || { x: 40, y: -20 };

        this.attackDone = false;

        this.createHpbar();

        if (anims) this.createAnims(anims);
    }

    createAnims (anims)
    {
        if (anims)
        {
            if (anims['idle']) this.createAnim(this.name + 'Idle', anims['idle']['anim'], anims['idle']['framerate']);
            if (anims['walk']) this.createAnim(this.name + 'Walk', anims['walk']['anim'], anims['walk']['framerate']);
            if (anims['attack']) this.createAnim(this.name + 'Attack', anims['attack']['anim'], anims['attack']['framerate']);
        }
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play(this.name + 'Idle', true);
        this.body.setVelocityX(0);
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

            if (this.canAttack(target)) this.damage(target, this.attackDamage);
        }

        if (frame === this.anims.currentAnim.frames.length)
        {
            this.anims.play(this.name + 'Idle', true);
            this.hitboxes.active = 'still';
            this.attackDone = false;
        }

        this.body.setVelocityX(0);
    }

    isAttacking ()
    {
        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'Attack';
    }

    canAttack (character)
    {
        return isOver(this.hitboxes.attack[1], character.hitboxes[character.hitboxes.active][0]);
    }

    createHpbar ()
    {
        this.hpbarback = this.scene.add.graphics();
        this.hpbar = this.scene.add.graphics();

        this.hpBaseY = this.y + this.hpbarOffset.y;
        this.hpBaseX = this.hpbarOffset.x;

        this.hpbarback.fillStyle(0x696969, 0.7);
        this.hpbarback.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);

        this.hpbar.fillStyle(0xe60000, 0.7);
        this.hpbar.fillRect(this.hpBaseX, this.hpBaseY, 100, 10);
    }

    updateHpbar ()
    {
        this.hpbarback.setX(this.x);
        this.hpbar.clear();
        this.hpbar.fillStyle(0xe60000, 0.7);
        this.hpbar.fillRect(this.x + this.hpbarOffset.x, this.hpBaseY, 100 * this.hp / this.hpmax, 10);
    }

    destroyHpbar ()
    {
        this.hpbarback.destroy();
        this.hpbar.destroy();
    }

    update (time, player, ennemies = [])
    {
        // TODO: Ennemies collision

        if (this.isAttacking()) this.animAttack(player);
        else if (player && player.alive && this.canAttack(player)) this.attack(player);
        else if (player && player.alive && this.hitboxes[this.hitboxes.active][0].left > player.hitboxes[player.hitboxes.active][0].right) this.walk(this.baseVelocity, false);
        else if (player && player.alive && this.hitboxes[this.hitboxes.active][0].right < player.hitboxes[player.hitboxes.active][0].left) this.walk(this.baseVelocity, true);
        else this.walk(this.baseVelocity);

        super.update();

        if (this.alive) this.updateHpbar();
        else this.destroyHpbar();
    }
}
