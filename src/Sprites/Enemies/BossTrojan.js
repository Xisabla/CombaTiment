import Boss from '../Boss';

export default class BossTrojan extends Boss
{
    constructor (scene, x, y, ground)
    {
        super(
            scene, 'bossTrojan', x, y,
            'enemies/bossTrojan',
            ground,
            'enemies/bossTrojan/hitbox', 'bossTrojan',
            {
                'idle': { 'anim': scene.anims.generateFrameNumbers('enemies/bossTrojan', { start: 0, end: 3 }), 'framerate': 6 },
                'attack': { 'anim': scene.anims.generateFrameNumbers('enemies/bossTrojan', { start: 5, end: 12 }), 'framerate': 10 },
                'spawn': { 'anim': [
                    { key: 'enemies/bossTrojan', frame: 13 },
                    { key: 'enemies/bossTrojan', frame: 14 },
                    { key: 'enemies/bossTrojan', frame: 15 },
                    { key: 'enemies/bossTrojan', frame: 16 },
                    { key: 'enemies/bossTrojan', frame: 16 },
                    { key: 'enemies/bossTrojan', frame: 16 },
                    { key: 'enemies/bossTrojan', frame: 17 }
                ],
                'framerate': 5
                },
                'throw': { 'anim': scene.anims.generateFrameNumbers('enemies/bossTrojan', { start: 13, end: 21 }), 'framerate': 7 },
                'airStrike': { 'anim': scene.anims.generateFrameNumbers('enemies/bossTrojan', { start: 13, end: 21 }), 'framerate': 7 },
                'death': { 'anim': scene.anims.generateFrameNumbers('enemies/bossTrojan', { start: 26, end: 37 }), 'framerate': 3 }
            },
            {
                scale: 1.5,
                pattern: scene.cache.json.get('enemies/bossTrojan/pattern'),
                spawnX: 280,
                spawnY: 280,
                hpmax: 1500,
                cooldown: 4000,
                offset: -100,
                xProjectile: 280,
                yProjectile: 280,
                vxProjectile: -300,
                vyProjectile: 700,
                projectileBounce: 0.8,
                xAirStrike: 280,
                yAirStrike: 280,
                vxAirStrike: -100,
                vyAirStrike: 2000,
                airStrikeBounce: 1
            }
        );

        this.projectileName = 'IceCube';
        this.reverseFlipX = true;
        this.setFlipX(this.reverseFlipX);
    }
}
