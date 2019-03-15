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
}
