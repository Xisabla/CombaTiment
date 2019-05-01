import Phaser from 'phaser';

import Player from '../Sprites/Player';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import HPBar from '../UI/HPBar';
import EnemyCollection from '../Sprites/EnemyCollection';
import Radiator from '../Sprites/Radioator';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Test' });
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

        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 810, 'levelselect/ground');
        this.add.image(800, 710, 'levelselect/grass');

        this.player = new Player(this, 40, 553, this.ground);
        this.hpbar = new HPBar(this.player);

        // TODO: Remove - for testing
        this.player.setGodmode(true);

        this.enemies = new EnemyCollection();
        this.data = this.cache.json.get('scenes/data');
        this.screen = 0;
        this.waveScreenId = 0;
        this.screenStarted = false;
        this.done = false;

        // Enemy to test:
        this.enemies.spawn(Radiator, this, 500, 500, this.ground);

        this.hitboxGraphics = this.add.graphics();

        updateHitboxes(this.player);
    }

    debug ()
    {
        let mustRender = [];

        if (this.enemies.length) mustRender.push(this.enemies[0]);
        if (this.player.alive) mustRender.push(this.player);

        renderHitboxes(this.hitboxGraphics, mustRender);
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (this.player.alive) this.player.update(time, input, this.enemies);
        this.enemies.update(time, this.player);

        this.debug();
    }
};
