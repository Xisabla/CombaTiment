import Phaser from 'phaser';

import Character from '../Sprites/Character';
import LevelPanelCollection from '../UI/LevelPanelCollection';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'LevelSelect' });
    }

    init ()
    {}

    create ()
    {
        this.add.image(800, 450, 'levelselect/background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 810, 'levelselect/ground');
        this.add.image(800, 710, 'levelselect/grass');

        this.panels = new LevelPanelCollection(this, { height: 550, y: 50, offset: 50 });

        this.panels.add({ color: 0xf39c12, name: 'Consommation\nd\'énergie', power: 'power/thunder', ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple'] });
        this.panels.add({ color: 0xe74c3c, name: 'Consommation\nd\'énergie', power: 'power/thunder', ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple'] });
        this.panels.add({ color: 0x3498db, name: 'Consommation\nd\'énergie', power: 'power/thunder', ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple'] });
        this.panels.add({ color: 0x2ecc71, name: 'Consommation\nd\'énergie', power: 'power/thunder', ennemies: ['ennemy/apple', 'ennemy/apple'] });

        this.panels.show(true, 200);

        this.player = new Character(this, 40, 500, 'feilong/idle', this.ground, 'feilong/hitbox', 'feilong');
        this.player.createAnim(this, 'idle', this.anims.generateFrameNumbers('feilong/idle', { start: 0, end: 10 }), 10, -1);
        this.player.createAnim(this, 'walk', this.anims.generateFrameNumbers('feilong/walking', { start: 0, end: 5 }), 10, -1);
        this.player.createAnim(this, 'punch', this.anims.generateFrameNumbers('feilong/punch', { start: 0, end: 3 }), 10, -1);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            select: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        };

        this.lastBouncedPanel = -1;
        this.selectedPanel = -1;

        this.hitboxGraphics = this.add.graphics();
    }

    update (time)
    {
        // Avoid crash: wait until the show animation is done
        if (time >= this.panels.panels.length * 200 * 2 * 1.5)
        {
            this.panels.checkActions(this.player, this.keys);
        }

        if (this.keys.enter.isDown && this.panels.selected !== -1)
        {
            console.log('Go to level: ' + this.panels.selected);
            this.scene.start('Level');
        }

        if (this.player.anims.currentAnim !== null && this.player.anims.currentAnim.key === 'punch')
        {
            // if the punch animation has been triggered
            this.player.anims.play('punch', true);
            this.player.hitboxes.active = 'punch';
            if (this.player.anims.currentAnim.frames.length === this.player.anims.currentFrame.index)
            {
                // finish the punch animation
                this.player.anims.play('idle', true);
                this.player.hitboxes.active = 'still';
            }
            this.player.body.setVelocityX(0);
        }
        else if (this.keys.select.isDown)
        {
            // trigger the punch animation
            this.player.body.setVelocityX(0);
            this.player.anims.play('punch', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.hitboxes.active = 'walking';
            this.player.setFlipX(false);
            this.player.anims.play('walk', true);
            this.player.body.setVelocityX(500);
        }
        else if (this.cursors.left.isDown)
        {
            this.player.hitboxes.active = 'walking';
            this.player.setFlipX(true);
            this.player.anims.play('walk', true);
            this.player.body.setVelocityX(-500);
        }
        else
        {
            this.player.hitboxes.active = 'still';
            this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);
        }

        updateHitboxes(this.player); // update player's hitbox's position
        renderHitboxes(this.hitboxGraphics, [this.player]); // render hitboxes (debug)
    }
};
