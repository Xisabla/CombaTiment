import Phaser from 'phaser';

import Player from '../Sprites/Player';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import HPBar from '../UI/HPBar';
import EnemyCollection from '../Sprites/EnemyCollection';
import Bulb from '../Sprites/Bulb';
import Fridge from '../Sprites/Fridge';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Level' });
    }

    init ()
    {}

    create ()
    {
        this.sounds = {};
        this.sounds.ambient = this.sound.add('music/nightoffire', { loop: true, volume: 0.2 });
        this.sounds.punch = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.ambient.play();
        this.sounds.ambient.setSeek(36.5);

        this.add.image(800, 450, 'levelselect/background');
        this.add.image(2400, 450, 'levelselect/background');
        this.add.image(4000, 450, 'levelselect/background');
        this.add.image(5600, 450, 'levelselect/background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 810, 'levelselect/ground');
        this.add.image(800, 710, 'levelselect/grass');
        this.ground.create(2400, 810, 'levelselect/ground');
        this.add.image(2400, 710, 'levelselect/grass');
        this.ground.create(4000, 810, 'levelselect/ground');
        this.add.image(4000, 710, 'levelselect/grass');
        this.ground.create(5600, 810, 'levelselect/ground');
        this.add.image(5600, 710, 'levelselect/grass');

        this.player = new Player(this, 40, 553, this.ground);
        this.hpbar = new HPBar(this.player);

        this.enemies = new EnemyCollection();
        this.enemies.spawnAll([
            { type: Fridge, scene: this, x: 500, y: 564, ground: this.ground },
            { type: Bulb, scene: this, x: 500, y: 564, ground: this.ground },
            { type: Fridge, scene: this, x: 500, y: 564, ground: this.ground },
            { type: Bulb, scene: this, x: 500, y: 564, ground: this.ground },
            { type: Fridge, scene: this, x: 500, y: 564, ground: this.ground },
            { type: Bulb, scene: this, x: 500, y: 564, ground: this.ground }
        ]);

        this.hitboxGraphics = this.add.graphics();

        updateHitboxes(this.player);
    }

    debug ()
    {
        if (!this.enemiesText) this.enemiesText = this.add.text(1500, 800, 'Enemies: 0').setOrigin(1).setFontSize(20);

        this.enemiesText.x = this.cameras.main.scrollX + 1500;
        this.enemiesText.setText(`Enemies: ${this.enemies.length}`);

        let mustRender = this.enemies.export;

        if (this.player.alive) mustRender.push(this.player);

        renderHitboxes(this.hitboxGraphics, mustRender);
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (input.sudo) this.game.config.physics.arcade.debug = true;

        if (this.player.alive) this.player.update(time, input, this.enemies);
        this.enemies.update(time, this.player);

        // HPBar follow cameras
        this.hpbar.x = this.cameras.main.scrollX + 10;

        if (this.game.config.physics.arcade.debug) this.debug();
    }
};
