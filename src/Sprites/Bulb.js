import Ennemy from './Ennemy';

export default class Bulb extends Ennemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'bulb', x, y,
            'ennemies/bulb/walking',
            ground,
            'ennemies/bulb/hitbox', 'bulb',
            {
                'idle': { 'anim': [{ key: 'ennemies/bulb/walking', frame: 1 }], 'framerate': 15 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('ennemies/bulb/walking', { start: 0, end: 4 }), 'framerate': 10 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('ennemies/bulb/punch', { start: 0, end: 21 }), 'framerate': 15 }
            },
            { scale: 0.5, hpmax: 60, attackDamage: 50 }
        );
    }
}
