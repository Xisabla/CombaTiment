import Phaser from 'phaser';

import Character from '../Sprites/Character';
import LevelPanelCollection from '../UI/LevelPanelCollection';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import { actions } from '../config/gamepad/buttons';

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
        this.sounds.music = this.sound.add('music/mettaton', { loop: true, volume: 0.3 });
        this.sounds.punch = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.menuSelection = this.sound.add('music/menu_selection');
        this.sounds.music.play();

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
        let pad = null;

        if (this.input.gamepad.total > 0)
        {
            let padIndex = 0;

            while (this.input.gamepad.getPad(padIndex).vibration === null) padIndex++;

            pad = this.input.gamepad.getPad(padIndex);
        }

        // Avoid crash: wait until the show animation is done
        if (time >= this.panels.panels.length * 200 * 2 * 1.5)
        {
            this.panels.checkActions(this.player, { keys: this.keys, pad });
        }

        if ((this.keys.enter.isDown || (pad && actions(pad).attacks[1])) && this.panels.selected !== -1)
        {
            console.log('Go to level: ' + this.panels.selected);
            this.sounds.menuSelection.play();
            this.sounds.music.stop();
            this.scene.start('Level');
        }

        this.player.checkActions(this.cursors, { keys: this.keys, pad }, this.sounds);

        updateHitboxes(this.player); // update player's hitbox's position
        renderHitboxes(this.hitboxGraphics, [this.player]); // render hitboxes (debug)
    }
};
