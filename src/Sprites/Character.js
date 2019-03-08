import Phaser from 'phaser';

export default class Character extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, spritesheet, platform)
    {
        super(scene, x, y, spritesheet);
		scene.physics.world.enable(this);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		scene.physics.add.collider(this, platform);
		this.setOrigin(0);
		this.body.setBounce(0);
		this.body.setCollideWorldBounds(true);
    }
	
	createAnim(scene, key, frames, framerate, repeat)
	{
		scene.anims.create({
			key: key,
			frames: frames,
			frameRate: framerate,
			repeat: repeat
		});
	}
}