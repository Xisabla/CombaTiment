import Boss from '../Boss';

export default class BossFridge extends Boss
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'bossFridge', x, y,
            'enemies/bossFridge',
            ground,
            'enemies/bossFridge/hitbox', 'bossFridge',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/bossFridge', { start: 0, end: 3 }), 'framerate': 6 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/bossFridge', { start: 5, end: 10 }), 'framerate': 10 },
                'spawn': { 'anim': [
                    { key: 'enemies/bossFridge', frame: 13 },
                    { key: 'enemies/bossFridge', frame: 13 },
                    { key: 'enemies/bossFridge', frame: 13 },
                    { key: 'enemies/bossFridge', frame: 12 }
                ],
                'framerate': 2
                },
                'throw': { 'anim': scene.anims.generateFrameNumbers('enemies/bossFridge', { start: 14, end: 22 }), 'framerate': 10 }
            },
            { scale: 1.5 }
        );

        this.projectileName = 'IceCube';
        this.reverseFlipX = true;
        this.setFlipX(this.reverseFlipX);
    }
}
