import Phaser from 'phaser';
import { getHitboxes } from '../Engine/Hitbox';

export default class Character extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, spritesheet, platform, hitboxes, hitboxName)
    {
        super(scene, x, y, spritesheet);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, platform);

        this.setOrigin(0);

        this.body.setBounce(0);
        this.body.setCollideWorldBounds(true);

        this.hitboxes = getHitboxes(scene.cache.json.get(hitboxes), hitboxName);
        this.baseVelocity = 500;

        this.hpmax = 200;
        this.energymax = 100;

        this.hp = this.hpmax;
        this.energy = this.energymax;
    }

    createAnim (scene, key, frames, framerate, repeat)
    {
        scene.anims.create({
            key: key,
            frames: frames,
            frameRate: framerate,
            repeat: repeat
        });
    }

    setHp (hp)
    {
        let percent = hp / this.hpmax;

        if (hp > this.hpmax) hp = this.hpmax;
        if (hp < 0) hp = 0;
        if (hp === 0) this.scene.scene.start('TodoScene'); // TODO: Respawn/Death screen

        if (hp > this.hp) this.emit('hpgain', hp - this.hp, percent, this.hpmax);
        if (hp < this.hp) this.emit('hploose', this.hp - hp, percent, this.hpmax);

        this.hp = hp;
    }

    looseHp (amount)
    {
        this.setHp(this.hp - amount);
    }

    gainHp (amount)
    {
        this.setHp(this.hp + amount);
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
        if (this.energy < amount) return false;

        this.setEnergy(this.energy - amount);

        return true;
    }

    gainEnergy (amount)
    {
        return this.setEnergy(this.energy + amount);
    }

    idle ()
    {
        this.hitboxes.active = 'still';
        this.anims.play('idle', true);
        this.body.setVelocityX(0);
    }

    walk (velocity = 500, right = true)
    {
        this.hitboxes.active = 'walking';
        this.setFlipX(!right);
        this.anims.play('walk', true);
        this.body.setVelocityX(right ? Math.abs(velocity) : -Math.abs(velocity));
    }

    punch ()
    {
        if (this.useEnergy(5))
        {
            this.body.setVelocityX(0);
            this.anims.play('punch', true);

            if (this.scene.sounds)
            {
                if (this.scene.sounds.punch) this.scene.sounds.punch.play();
            }
        }
    }

    punchAnimEnd ()
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

    checkActions (input)
    {
        if (this.anims.currentAnim !== null && this.anims.currentAnim.key === 'punch') this.punchAnimEnd();
        else if (input.attack1) this.punch();
        else if (input.direction.left) this.walk(input.getVelocity(this.baseVelocity), false);
        else if (input.direction.right) this.walk(input.getVelocity(this.baseVelocity), true);
        else this.idle();
    }
}
