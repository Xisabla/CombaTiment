import Phaser from 'phaser';

import Player from '../Sprites/Player';
import LevelPanelCollection from '../UI/LevelPanelCollection';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import { levelEnemiesAssets } from '../utils';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'LevelSelect' });

        this.checkingSudo = false;
    }

    init ()
    {}

    create ()
    {
        this.add.image(800, 450, 'levelselect/background');

        this.sounds = {};
        this.sounds.ambient = this.sound.add('music/mettaton', { loop: true, volume: 0.8 });
        this.sounds.punch = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.energyball = this.sound.add('music/energyball', { volume: 0.2 });
        this.sounds.menuSelection = this.sound.add('music/menu_selection', { volume: 1 });

        this.sounds.ambient.play();

        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 810, 'levels/ground');
        this.panels = new LevelPanelCollection(this, { height: 550, y: 50, offset: 50 });

        this.levels = [
            this.cache.json.get('levels/0'),
            this.cache.json.get('levels/1'),
            this.cache.json.get('levels/2'),
            this.cache.json.get('levels/3')
        ];

        this.levels.forEach(level =>
        {
            let { color, name, power } = level;

            power = 'power/' + power;
            let enemies = levelEnemiesAssets(level);
            this.panels.add({ color, name, power, enemies });
        });

        this.panels.show(true, 200);

        this.player = new Player(this, 40, 525, this.ground);
        this.player.setGodmode(true);

        this.hitboxGraphics = this.add.graphics();
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (input.sudo) this.game.config.physics.arcade.debug = true;

        // Avoid crash: wait until the show animation is done
        if (time >= this.panels.panels.length * 200 * 2 * 1.5)
        {
            this.panels.checkActions(this.player, input);
        }

        if (input.attack2 && this.panels.selected !== -1)
        {
            this.sounds.menuSelection.play();
            this.sounds.ambient.stop();

            let data = this.cache.json.get('levels/' + this.panels.selected);
            data.id = this.panels.selected;

            if (data.done === false) return this.panels.panels[this.panels.selected].bounce(5, 50, 10);
            if (this.panels.selected === 1) return this.scene.start('Test');
            else this.scene.start('Level', data);
        }

        this.player.update(time, input);

        updateHitboxes(this.player);

        if (this.game.config.physics.arcade.debug) renderHitboxes(this.hitboxGraphics, [this.player]);
    }
};
