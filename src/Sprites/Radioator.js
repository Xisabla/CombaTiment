import Enemy from './Enemy';

export default class Radiator extends Enemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'radiator', x, y,
            'enemies/radiator',
            ground,
            'enemies/radiator/hitbox', 'radiator',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/radiator', { start: 0, end: 0 }), 'framerate': 10 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('enemies/radiator', { start: 0, end: 3 }), 'framerate': 10 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/radiator', { start: 4, end: 14 }), 'framerate': 10 }
            },
            { scale: 0.5, hpmax: 60, attackDamage: 20 }
        );

        this.reverseFlipX = true;
    }
}
