import Phaser from 'phaser';

export default class HPBar extends Phaser.GameObjects.Container
{
    constructor (character)
    {
        super(character.scene, 10, 10);

        this.character = character;

        this.scene.add.existing(this);

        this.frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'hud/hpbar/frame').setOrigin(0);
        this.hp = new Phaser.GameObjects.Image(this.scene, 0, 0, 'hud/hpbar/hp').setOrigin(0);
        this.energy = new Phaser.GameObjects.Image(this.scene, 0, 0, 'hud/hpbar/energy').setOrigin(0);

        this.add(this.frame);
        this.add(this.hp);
        this.add(this.energy);

        this.character.on('hpgain', (hp, percent, max) =>
        {
            this.hp.setCrop(16, 0, (this.hp.width - 32) * percent, this.hp.height);
        });

        this.character.on('hploose', (hp, percent, max) =>
        {
            this.hp.setCrop(16, 0, (this.hp.width - 32) * percent, this.hp.height);
        });

        this.character.on('energygain', (energy, percent, max) =>
        {
            this.energy.setCrop(238, 0, (this.energy.width - 282) * percent, this.energy.height);
        });

        this.character.on('energyloose', (energy, percent, max) =>
        {
            this.energy.setCrop(238, 0, (this.energy.width - 282) * percent, this.energy.height);
        });
    }
}
