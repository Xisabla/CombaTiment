import Ennemy from './Ennemy';

export default class Fridge extends Ennemy
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'fridge', x, y,
            'ennemies/fridge',
            ground,
            'ennemies/fridge/hitbox', 'fridge',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('ennemies/fridge', { start: 0, end: 0 }), 'framerate': 10 },
                'walk': { 'anim': scene.anims.generateFrameNumbers('ennemies/fridge', { start: 0, end: 0 }), 'framerate': 10 },
                'attack': { 'anim': [
                    { key: 'ennemies/fridge', frame: 0 },
                    { key: 'ennemies/fridge', frame: 0 },
                    { key: 'ennemies/fridge', frame: 1 },
                    { key: 'ennemies/fridge', frame: 0 },
                    { key: 'ennemies/fridge', frame: 0 }
                ],
                'framerate': 5 }
            },
            { scale: 0.5, hpmax: 40, attackDamage: 20 }
        );

        this.reverseFlipX = true;
    }
}
