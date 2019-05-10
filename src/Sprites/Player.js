import Character from './Character';
import { updateHitboxes, isOver } from '../Engine/Hitbox';
import EnergyBall from './Projectiles/EnergyBall';

export default class Player extends Character
{
    constructor (scene, x, y, ground)
    {
        super(scene, x, y,
            'player/walk',
            ground,
            'player/hitbox',
            'player',
            { baseVelocity: 500, hpmax: 200 });

        this.godmode = false;
        this.energymax = 100;
        this.energy = this.energymax;
        this.energyBalls = [];
        this.projectileCreated = false;
        this.dashing = false;
        this.lastDash = -1;
        this.setDepth(1e6);
        this.punchDone = false;
        this.powerDone = false;
    }

    createAnims ()
    {
        this.createAnim('idle', this.scene.anims.generateFrameNumbers('player/walk', { start: 0, end: 1 }), 10);
        this.createAnim('walk', this.scene.anims.generateFrameNumbers('player/walk', { start: 0, end: 5 }), 10);
        this.createAnim('punch', this.scene.anims.generateFrameNumbers('player/punch', { start: 0, end: 2 }), 12);
        // TODO: Change with real throw animation
        this.createAnim('throw', this.scene.anims.generateFrameNumbers('player/throw', { start: 0, end: 6 }), 8);
        // TODO: Change with real dash animation
        this.createAnim('dash', this.scene.anims.generateFrameNumbers('player/dash', { start: 0, end: 3 }), 10);
        this.createAnim('power/thunder', this.scene.anims.generateFrameNumbers('player/thunder', { start: 0, end: 9 }), 7);
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
        this.setFlipX(!right);
        this.anims.play('walk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    punch ()
    {
        this.body.setVelocityX(0);
        this.anims.play('punch', true);
    }

    power (name)
    {
        if (this.useEnergy(80))
        {
            this.powerDone = false;
            this.body.setVelocityY(-500);
            this.body.setVelocityX(0);
            this.anims.play('power/' + name, true);
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

        if (this.useEnergy(10))
        {
            let velocity = 1000;

            this.invulnerable = true;
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

    animPunch (enemies, boss)
    {
        // if the punch animation has been triggered
        this.anims.play('punch', true);
        this.hitboxes.active = 'punch';

        let frame = this.anims.currentFrame.index;

        if (frame >= this.hitboxes.punch[1].start && frame <= this.hitboxes.punch[1].end && !this.punchDone)
        {
            this.punchDone = true;
            let damage = this.godmode ? 1e6 : 20;
            let comboIncrease = false;

            if (enemies)
            {
                let targets = enemies.getOver(this.hitboxes.punch[1]);
                targets.looseHp(damage);

                if (targets.length > 0) comboIncrease = true;
            }

            if (boss && isOver(this.hitboxes.punch[1], boss.hitboxes[boss.hitboxes.active][0]))
            {
                boss.looseHp(damage);
                comboIncrease = true;
            }

            if (this.scene.combo && this.scene.increaseCombo && comboIncrease) this.scene.increaseCombo();

            if (this.scene.sounds)
            {
                if (this.scene.sounds.punch) this.scene.sounds.punch.play();
            }
        }

        if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
        {
            // finish the punch animation
            this.anims.play('idle', true);
            this.hitboxes.active = 'still';

            this.punchDone = false;
        }

        this.body.setVelocityX(0);
    }

    animPower (power, enemies, boss)
    {
        this.anims.play('power/' + power, true);
        this.hitboxes.active = 'still';
        this.invulnerable = true;
        enemies.idle();

        if (this.anims.currentFrame.index === 6 && power === 'thunder') this.body.setVelocityY(1500);
        if (this.anims.currentFrame.index === 7 && power === 'thunder' && !this.powerDone)
        {
            this.powerDone = true;
            this.scene.cameras.main.shake(100, 0.025);
            this.scene.cameras.main.flash(100);
            if (this.scene.combo && this.scene.increaseCombo) this.scene.increaseCombo(this.scene.enemies.length);
            this.scene.enemies.looseHp(50);

            if (boss) boss.looseHp(100);
        }

        if (this.anims.currentAnim.frames.length === this.anims.currentFrame.index)
        {
            this.anims.play('idle', true);
            this.hitboxes.active = 'still';
            this.invulnerable = false;
        }

        this.body.setVelocityX(0);
    }

    animThrow ()
    {
        this.anims.play('throw', true);
        this.hitboxes.active = 'still';

        let frame = this.anims.currentFrame.index;

        if (frame === 5 && !this.projectileCreated)
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
                if (this.scene) this.scene.sounds.ambient.setVolume(initVolume * (1 - tick / (time / tickTime)));
                if (tick >= time / tickTime) clearInterval(timer);
            }, tickTime);
        }

        // Zoom
        this.scene.cameras.main.centerOn(this.x, this.y);
        this.scene.cameras.main.zoomTo(2, 1000);

        // Timed splashScreen
        setTimeout(() =>
        {
            this.scene.scene.start('DeathScene');
            this.scene.sounds.ambient.stop();
            this.destroy();
        }, 1600);

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

    update (time, input, enemies, boss)
    {
        if (this.godmode) this.regenerate(this.hpmax, this.energymax);
        if (!this.alive) return;
        if (this.dashing) return updateHitboxes(this);

        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'punch') this.animPunch(enemies, boss);
        else if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'throw') this.animThrow();
        else if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'power/thunder') this.animPower('thunder', enemies, boss);
        else if (input.attack1 && this.body.touching.down) this.punch();
        else if (input.attack2 && this.body.touching.down) this.power('thunder');
        else if (input.attack3 && this.body.touching.down && this.energy > 30) this.throw();
        else if (input.dashLeft && this.body.touching.down) this.dash(time, false);
        else if (input.dashRight && this.body.touching.down) this.dash(time, true);
        // else if (input.jump && this.body.touching.down) this.jump(input);
        else if (input.direction.left && this.body.touching.down) this.walk(input.getVelocity(this.baseVelocity), false);
        else if (input.direction.right && this.body.touching.down) this.walk(input.getVelocity(this.baseVelocity), true);
        // else if (!this.body.touching.down && this.body.velocity.x === 0) this.animJump();
        // else if (!this.body.touching.down && this.body.velocity.x !== 0) this.animForwardJump();
        else this.idle();

        if (this.scene.game.config.physics.arcade.debug) this.debug();

        if (this.hp <= 0) this.die();
        else this.regenerate();

        if (this.alive) updateHitboxes(this);
    }
}
