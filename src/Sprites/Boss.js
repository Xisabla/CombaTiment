
import Character from './Character';
import IceCube from './Projectiles/IceCube';
import { isOver } from '../Engine/Hitbox';
import { repeat } from '../utils';

export default class Boss extends Character
{
    constructor (scene, name, x, y, spritesheet, ground, hitboxes, hitboxName, anims = {}, settings = {})
    {
        let hpmax = settings.hpmax || 40;
        let scale = settings.scale || 1;

        super(scene, x, y,
            spritesheet,
            ground,
            hitboxes,
            hitboxName,
            { hpmax });

        this.body.setCollideWorldBounds(false);
        this.name = name;
        this.setScale(scale);

        this.cooldown = settings['cooldown'] || 3000;
        this.xProjectile = settings['xProjectile'] || 0;
        this.yProjectile = settings['yProjectile'] || 0;
        this.vxProjectile = settings['vxProjectile'] || -300;
        this.vyProjectile = settings['vyProjectile'] || 0;
        this.xAirStrike = settings['xAirStrike'] || 0;
        this.yAirStrike = settings['yAirStrike'] || 0;
        this.vxAirStrike = settings['vxAirStrike'] || -300;
        this.vyAirStrike = settings['vyAirStrike'] || 0;
        this.projectileBounce = settings['projectileBounce'] || 0;
        this.airStrikeBounce = settings['airStrikeBounce'] || 0;

        this.offset = settings['offset'] || 0;
        this.spawnX = settings['spawnX'];
        this.spawnY = settings['spawnY'];

        this.pattern = settings['pattern'];
        this.patternDone = true;
        this.patternId = 0;
        this.attackId = 0;
        this.continueAttack = true;
        this.airStrikePending = false;
        this.lastFrame = -1;
        this.nextAttackTimeout = 0;
        this.timeLeft = 0;

        this.attackDamage = settings.attackDamage || 10;
        this.attackDone = false;
        this.projectiles = [];

        if (anims) this.createAnims(anims);
    }

    createAnims (anims)
    {
        if (anims)
        {
            if (anims['idle']) this.createAnim(this.name + 'Idle', anims['idle']['anim'], anims['idle']['framerate']);
            if (anims['attack']) this.createAnim(this.name + 'Attack', anims['attack']['anim'], anims['attack']['framerate']);
            if (anims['spawn']) this.createAnim(this.name + 'Spawn', anims['spawn']['anim'], anims['spawn']['framerate']);
            if (anims['throw']) this.createAnim(this.name + 'Throw', anims['throw']['anim'], anims['throw']['framerate']);
            if (anims['airStrike']) this.createAnim(this.name + 'AirStrike', anims['airStrike']['anim'], anims['airStrike']['framerate']);
            if (anims['death']) this.createAnim(this.name + 'Death', anims['death']['anim'], anims['death']['framerate']);
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
    }

    spawn ()
    {
        this.anims.play(this.name + 'Spawn', true);
        this.scene.enemies.spawnWave(this.scene, this.scene.data.waves[this.scene.data.waves.length - 1], this.x + this.spawnX, this.y + this.spawnY);
    }

    animSpawn (target)
    {
        this.anims.play(this.name + 'Spawn', true);
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

    throw ()
    {
        this.anims.play(this.name + 'Throw', true);
    }

    animThrow ()
    {
        this.anims.play(this.name + 'Throw', true);
        this.hitboxes.active = 'still';

        if (Math.floor(this.anims.currentAnim.frames.length / 2) + 1 === this.anims.currentFrame.index && !this.projectileCreated)
        {
            if (this.projectileName === 'IceCube') this.projectiles.push(new IceCube(this.scene, this.x + this.xProjectile, this.y + this.yProjectile, this.vxProjectile, this.vyProjectile, this.projectileBounce));
            this.projectileCreated = true;
            if (this.scene.sounds)
            {
                if (this.projectileName === 'IceCube' && this.scene.sounds.iceCube) this.scene.sounds.iceCube.play();
            }
        }

        if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
        {
            this.anims.play(this.name + 'Idle', true);
            this.hitboxes.active = 'still';
            this.projectileCreated = false;
        }

        this.body.setVelocityX(0);
    }

    airStrike ()
    {
        this.anims.play(this.name + 'AirStrike', true);
        this.airStrikePending = true;
    }

    animAirStrike ()
    {
        this.anims.play(this.name + 'AirStrike', true);
        this.hitboxes.active = 'still';

        if (Math.floor(this.anims.currentAnim.frames.length / 2) <= this.anims.currentFrame.index && Math.floor(this.anims.currentAnim.frames.length / 2) + 3 > this.anims.currentFrame.index)
        {
            if (this.anims.currentFrame.index !== this.lastFrame)
            {
                if (this.projectileName === 'IceCube') this.projectiles.push(new IceCube(this.scene, this.x + this.xAirStrike, this.y + this.yAirStrike, this.vxAirStrike, this.vyAirStrike, this.airStrikeBounce));
                if (this.scene.sounds)
                {
                    if (this.projectileName === 'IceCube' && this.scene.sounds.iceCube) this.scene.sounds.iceCube.play();
                }
                this.lastFrame = this.anims.currentFrame.index;
            }
        }

        if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
        {
            this.anims.play(this.name + 'Idle', true);
            this.hitboxes.active = 'still';
            this.projectileCreated = false;
        }

        this.body.setVelocityX(0);
    }

    animDie ()
    {
        this.anims.play(this.name + 'Death', true);
        if (this.scene.player) this.scene.player.setGodmode(true);

        let frame = this.anims.currentFrame.index;

        if (frame === this.anims.currentAnim.frames.length)
        {
            super.die();
        }

        if (this.active) this.body.setVelocityX(0);
    }

    finishAirStrike ()
    {
        let xMid = Math.random() * (this.scene.physics.world.bounds.width - 800) + this.scene.physics.world.bounds.left + 200;
        let space = Math.random() * 60 + 50;

        this.airStrikePending = false;
        if (this.projectileName === 'IceCube')
        {
            this.projectiles.push(new IceCube(this.scene, xMid - space, 1, 0, 500));
            this.projectiles.push(new IceCube(this.scene, xMid, 5, 0, 500));
            this.projectiles.push(new IceCube(this.scene, xMid + space, 10, 0, 500));
        }
    }

    isAirStriking ()
    {
        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'AirStrike';
    }

    isThrowing ()
    {
        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'Throw';
    }

    isSpawning ()
    {
        return this.anims.currentAnim !== null && this.anims.currentAnim.key === this.name + 'Spawn';
    }

    isAttacking ()
    {
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

    looseHp (amount)
    {
        repeat(10, 2, () =>
        {
            this.setVisible(!this.visible);
        });
        super.looseHp(amount);
    }

    die ()
    {
        if (this.dying) return;
        this.dying = true;

        if (this.scene.sounds && this.scene.sounds.ambient)
        {
            this.scene.sounds.ambient.stop();
            this.scene.sounds.explosion.play();
        }

        if (this.anims.animationManager.anims.entries[this.name + 'Death'])
        {
            this.anims.play(this.name + 'Death', true);
        }
        else
        {
            let tick = 0;
            let timer = setInterval(() =>
            {
                tick++;

                if (!this.alive) clearInterval(timer);
                else
                {
                    this.setAlpha(1 - 0.01 * tick);
                }
            }, 10);

            setTimeout(() =>
            {
                this.sounds.explosion.stop();
                super.die();
            }, 1000);
        }
    }

    followPattern (player)
    {
        if (this.patternDone)
        {
            this.patternId = Math.floor(Math.random() * this.pattern.length);
            this.attackId = 0;
            this.patternDone = false;
        }

        if (this.continueAttack)
        {
            let attack = this.pattern[this.patternId][this.attackId];

            if (attack === 'throw') this.throw();
            else if (attack === 'airStrike') this.airStrike();
            else if (attack === 'spawn') this.spawn();

            this.continueAttack = false;
            if (attack === 'airStrike')
            {
                this.nextAttackTimeout = setTimeout(() =>
                {
                    this.finishAirStrike();
                    this.continueAttack = true;
                }, this.cooldown);
            }
            else
            {
                this.nextAttackTimeout = setTimeout(() =>
                {
                    this.continueAttack = true;
                }, this.cooldown);
            }

            this.attackId++;
            if (this.attackId === this.pattern[this.patternId].length) this.patternDone = true;
        }
    }

    update (time, player)
    {
        if (this.scene && this.scene.paused) this.idle();
        else
        {
            if (this.isDying()) this.animDie();
            else if (this.dying) this.idle();
            else if (this.isAttacking()) this.animAttack(player);
            else if (this.isSpawning()) this.animSpawn(player);
            else if (this.isThrowing()) this.animThrow();
            else if (this.isAirStriking()) this.animAirStrike();
            else if (player && player.alive && !this.airStrikePending && this.canAttack(player)) this.attack(player);
            else if (!this.airStrikePending) this.followPattern(player);
            console.log(this.hp);
            super.update();
        }
    }
}
