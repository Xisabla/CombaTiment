import Enemy from '../Enemy';

export default class Virus extends Enemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'virus', x, y,
            'enemies/virus',
            ground,
            'enemies/virus/hitbox', 'virus',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/virus', { start: 0, end: 0 }), 'framerate': 10 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('enemies/virus', { start: 0, end: 3 }), 'framerate': 8 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/virus', { start: 4, end: 14 }), 'framerate': 15 }
            },
            { scale: 0.5 }
        );

        this.reverseFlipX = true;
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

        if (frame >= this.anims.currentAnim.frames.length)
        {
            this.die();
        }

        this.body.setVelocityX(0);
    }
}
