import Enemy from './Enemy';

export default class Fridge extends Enemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'fridge', x, y,
            'enemies/fridge',
            ground,
            'enemies/fridge/hitbox', 'fridge',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/fridge', { start: 0, end: 0 }), 'framerate': 10 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('enemies/fridge', { start: 0, end: 0 }), 'framerate': 10 },
                'attack': { 'anim': [
                    { key: 'enemies/fridge', frame: 0 },
                    { key: 'enemies/fridge', frame: 0 },
                    { key: 'enemies/fridge', frame: 1 },
                    { key: 'enemies/fridge', frame: 0 },
                    { key: 'enemies/fridge', frame: 0 }
                ],
                'framerate': 5 }
            },
            { scale: 0.5, hpmax: 40, attackDamage: 20 }
        );

        this.reverseFlipX = true;
    }
}
