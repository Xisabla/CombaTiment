import Phaser from 'phaser';

export default class Fence extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, player)
    {
        super(scene, x, y, 'misc/fence');

        if (!this.anims.animationManager.anims.entries['fence'])
        {
            this.scene.anims.create({
                key: 'fence',
                frames: this.scene.anims.generateFrameNumbers('misc/fence', { start: 0, end: 1 }),
                frameRate: 3,
                repeat: true
            });
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        this.body.immovable = true;

        this.body.allowGravity = false;

        scene.physics.add.collider(this, player, () =>
        {
            this.body.setVelocityX(0);
            player.body.setVelocityX(0);
        }, null, scene);
    }

    update ()
    {
        this.anims.play('fence', true);
    }
}
