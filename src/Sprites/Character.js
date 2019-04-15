import Phaser from 'phaser';
import { getHitboxes, updateHitboxes } from '../Engine/Hitbox';

export default class Character extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, spritesheet, ground, hitboxes, hitboxName, settings = {})
    {
        super(scene, x, y, spritesheet);

        scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, ground);

        this.setOrigin(0);
        this.alive = true;
        this.reverseFlipX = false;

        this.body.setBounce(0);
        this.body.setCollideWorldBounds(true);

        this.hitboxes = getHitboxes(scene.cache.json.get(hitboxes), hitboxName);

        this.baseVelocity = settings.baseVelocity || 100;
        this.hpmax = settings.hpmax || 100;
        this.hp = settings.hp || this.hpmax;

        this.createAnims();
    }

    setHp (hp)
    {
        let percent = hp / this.hpmax;

        if (hp > this.hpmax) hp = this.hpmax;
        if (hp < 0) hp = 0;

        if (hp > this.hp) this.emit('hpgain', hp - this.hp, percent, this.hpmax);
        if (hp < this.hp) this.emit('hploose', this.hp - hp, percent, this.hpmax);
        if (hp === 0) this.emit('death');

        this.hp = hp;
    }

    gainHp (amount)
    {
        this.setHp(this.hp + amount);
    }

    looseHp (amount)
    {
        this.setHp(this.hp - amount);
    }

    createAnim (key, frames, framerate, repeat = -1)
    {
        if (!this.anims.animationManager.anims.entries[key])
        {
            this.scene.anims.create({
                key: key,
                frames: frames,
                frameRate: framerate,
                repeat: repeat
            });
        }
    }

    createAnims ()
    {}

    idle ()
    {
        this.hitboxes.active = 'still';
        this.body.setVelocityX(0);
    }

    update (time, input)
    {
        if (this.hp <= 0)
        {
            this.alive = false;
            this.destroy();
        }

        if (this.alive) updateHitboxes(this);
    }
}
