import Phaser from 'phaser';

import Character from '../Sprites/Character';
import LevelPanelCollection from '../UI/LevelPanelCollection';
import Input from '../Input/Input';
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

        this.sounds = {};
        this.sounds.ambiant = this.sound.add('music/mettaton', { loop: true, volume: 0.3 });
        this.sounds.punch = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.menuSelection = this.sound.add('music/menu_selection', { volume: 1 });

        this.sounds.ambiant.play();

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

        this.hitboxGraphics = this.add.graphics();
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        // Avoid crash: wait until the show animation is done
        if (time >= this.panels.panels.length * 200 * 2 * 1.5)
        {
            this.panels.checkActions(this.player, input);
        }

        if (input.attack2 && this.panels.selected !== -1)
        {
            console.log('Go to level: ' + this.panels.selected);

            this.sounds.menuSelection.play();
            this.sounds.ambiant.stop();
            this.scene.start('Level');
        }

        this.player.checkActions(input);

        updateHitboxes(this.player); // update player's hitbox's position
        renderHitboxes(this.hitboxGraphics, [this.player]); // render hitboxes (debug)
    }
};
