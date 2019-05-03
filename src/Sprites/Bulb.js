import Enemy from './Enemy';

export default class Bulb extends Enemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'bulb', x, y,
            'enemies/bulb/walking',
            ground,
            'enemies/bulb/hitbox', 'bulb',
            {
                'idle': { 'anim': [{ key: 'enemies/bulb/walking', frame: 1 }], 'framerate': 15 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('enemies/bulb/walking', { start: 0, end: 4 }), 'framerate': 10 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/bulb/punch', { start: 0, end: 21 }), 'framerate': 25 }
            },
            { scale: 0.5, attackDamage: 30 }
        );
    }
}
