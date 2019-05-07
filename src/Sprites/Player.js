import Character from './Character';
import { updateHitboxes } from '../Engine/Hitbox';
import EnergyBall from './Projectiles/EnergyBall';

export default class Player extends Character
{
    constructor (scene, x, y, ground)
    {
        super(scene, x, y,
            'feilong/idle',
            ground,
            'feilong/hitbox',
            'feilong',
            { baseVelocity: 500, hpmax: 200 });

        this.godmode = false;
        this.energymax = 100;
        this.energy = this.energymax;
        this.energyBalls = [];
        this.projectileCreated = false;
        this.dashing = false;
        this.lastDash = -1;
        this.setDepth(1e6);
    }

    createAnims ()
    {
        this.createAnim('idle', this.scene.anims.generateFrameNumbers('feilong/idle', { start: 0, end: 10 }), 10);
        this.createAnim('walk', this.scene.anims.generateFrameNumbers('feilong/walking', { start: 0, end: 5 }), 10);
        this.createAnim('punch', this.scene.anims.generateFrameNumbers('feilong/punch', { start: 0, end: 3 }), 8);
        // TODO: Change with real throw animation
        this.createAnim('throw', this.scene.anims.generateFrameNumbers('feilong/punch', { start: 0, end: 3 }), 8);
        // TODO: Change with real dash animation
        this.createAnim('dash', this.scene.anims.generateFrameNumbers('feilong/walking', { start: 0, end: 5 }), 10);
        this.createAnim('jump', this.scene.anims.generateFrameNumbers('feilong/jump', { start: 0, end: 6 }), 6);
        this.createAnim('forwardjump', this.scene.anims.generateFrameNumbers('feilong/forwardjump', { start: 0, end: 8 }), 8);
    }

    setGodmode (value)
    {
        this.godmode = value;
    }

    setEnergy (energy)
    {
        let percent = energy / this.energymax;

        if (energy > this.energymax) energy = this.energymax;
        if (energy < 0) energy = 0;

        if (energy > this.energy) this.emit('energygain', energy - this.energy, percent, this.energymax);
        if (energy < this.energy) this.emit('energyloose', this.energy - energy, percent, this.energymax);

        this.energy = energy;
    }

    useEnergy (amount)
    {
        if (this.godmode) return true;
        if (this.energy < amount) return false;

        this.setEnergy(this.energy - amount);

        return true;
    }

    gainEnergy (amount)
    {
        return this.setEnergy(this.energy + amount);
    }

    regenerate (hp = 0, energy = 0.2)
    {
        this.gainHp(hp);
        this.gainEnergy(energy);
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play('idle', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = this.baseVelocity, right = true)
    {
        this.hitboxes.active = 'walking';
        this.setFlipX(!right);
        this.anims.play('walk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    punch (enemies)
    {
        let damage = this.godmode ? 1e6 : 20;

        this.body.setVelocityX(0);
        this.anims.play('punch', true);

        if (enemies) enemies.getOver(this.hitboxes.punch[1]).looseHp(damage);

        if (this.scene.sounds)
        {
            if (this.scene.sounds.punch) this.scene.sounds.punch.play();
        }
    }

    throw ()
    {
        if (this.useEnergy(30))
        {
            this.body.setVelocityX(0);
            this.anims.play('throw', true);
        }
    }

    dash (time, right = true)
    {
        if (time < this.lastDash + 300) return this.idle();

        if (this.useEnergy(20))
        {
            let velocity = 1000;

            this.invulnerable = true;
            this.hitboxes.active = 'walking';
            this.setFlipX(!right);
            this.anims.play('dash', true);
            this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
            this.dashing = true;
            this.lastDash = time;

            setTimeout(() =>
            {
                this.dashing = false;
                this.invulnerable = false;
                this.idle();
            }, 200);
        }
    }

    jump (input)
    {
        if (input.direction.right)
        {
            this.body.setVelocityX(input.getVelocity(this.baseVelocity));
            this.setFlipX(false);
        }
        else if (input.direction.left)
        {
            this.body.setVelocityX(-input.getVelocity(this.baseVelocity));
            this.setFlipX(true);
        }
        else
        {
            this.body.setVelocityX(0);
        }

        this.body.setVelocityY(-600);
    }

    animJump ()
    {
        this.body.setVelocityX(0);
        this.anims.play('jump', true);
    }

    animForwardJump ()
    {
        this.anims.play('forwardjump', true);
    }

    animPunch ()
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

    animThrow ()
    {
        this.anims.play('throw', true);
        this.hitboxes.active = 'still';

        if (Math.floor(this.anims.currentAnim.frames.length / 2) === this.anims.currentFrame.index && !this.projectileCreated)
        {
            this.energyBalls.push(new EnergyBall(this));
            this.projectileCreated = true;
            if (this.scene.sounds)
            {
                if (this.scene.sounds.energyball) this.scene.sounds.energyball.play();
            }
        }

        if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
        {
            this.anims.play('idle', true);
            this.hitboxes.active = 'still';
            this.projectileCreated = false;
        }

        this.body.setVelocityX(0);
    }

    die ()
    {
        if (this.godmode) return;

        // Fade sound
        if (this.scene.sounds.ambient)
        {
            let initVolume = this.scene.sounds.ambient.volume;

            let tick = 0;
            let tickTime = 10;
            let time = 1500;

            let timer = setInterval(() =>
            {
                tick++;
                this.scene.sounds.ambient.setVolume(initVolume * (1 - tick / (time / tickTime)));

                if (tick >= time / tickTime) clearInterval(timer);
            }, tickTime);
        }

        // Zoom
        this.scene.cameras.main.centerOn(this.x, this.y);
        this.scene.cameras.main.zoomTo(2, 1000);

        // Timed splashScreen
        setTimeout(() =>
        {
            this.scene.scene.start('LevelSelect');
            this.scene.sounds.ambient.stop();
            this.destroy();
        }, 2000);

        // Tell everyone that he's dead
        this.alive = false;
        this.visible = false;
    }

    debug ()
    {
        if (!this.hpText) this.hpText = this.scene.add.text(1500, 825, `HP: ${this.hp}/${this.hpmax}`).setOrigin(1).setFontSize(20);
        if (!this.energyText) this.energyText = this.scene.add.text(1500, 850, `Energy: ${this.energy}/${this.energymax}`).setOrigin(1).setFontSize(20);

        this.hpText.x = this.scene.cameras.main.scrollX + 1500;
        this.energyText.x = this.scene.cameras.main.scrollX + 1500;
        this.hpText.setText(`HP: ${this.hp}/${this.hpmax}`);
        this.energyText.setText(`Energy: ${this.energy}/${this.energymax}`);
    }

    update (time, input, enemies)
    {
        if (this.godmode) this.regenerate(this.hpmax, this.energymax);
        if (!this.alive) return;
        if (this.dashing) return updateHitboxes(this);

        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'punch') this.animPunch();
        else if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'throw') this.animThrow();
        else if (input.attack1 && this.body.touching.down) this.punch(enemies);
        else if (input.attack3 && this.body.touching.down && this.energy > 30) this.throw();
        else if (input.dashLeft && this.body.touching.down) this.dash(time, false);
        else if (input.dashRight && this.body.touching.down) this.dash(time, true);
        else if (input.jump && this.body.touching.down) this.jump(input);
        else if (input.direction.left && this.body.touching.down) this.walk(input.getVelocity(this.baseVelocity), false);
        else if (input.direction.right && this.body.touching.down) this.walk(input.getVelocity(this.baseVelocity), true);
        else if (!this.body.touching.down && this.body.velocity.x === 0) this.animJump();
        else if (!this.body.touching.down && this.body.velocity.x !== 0) this.animForwardJump();
        else this.idle();

        if (this.scene.game.config.physics.arcade.debug) this.debug();

        if (this.hp <= 0) this.die();
        else this.regenerate();

        if (this.alive) updateHitboxes(this);
    }
}
