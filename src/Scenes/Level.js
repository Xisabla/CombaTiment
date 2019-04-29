import Phaser from 'phaser';

import Player from '../Sprites/Player';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import HPBar from '../UI/HPBar';
import EnemyCollection from '../Sprites/EnemyCollection';

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

        // TODO: Remove - for testing
        this.player.setGodmode(true);

        this.enemies = new EnemyCollection();
        this.data = this.cache.json.get('scenes/data');
        this.screen = 0;
        this.waveScreenId = 0;
        this.screenStarted = false;
        this.done = false;

        // this.enemies.spawnWave(this, this.data.waves[this.data.screens[this.screen].waves[this.wave]], 500, 564);

        this.hitboxGraphics = this.add.graphics();

        updateHitboxes(this.player);
    }

    // TODO: handleCamera() or lockCamera() and unlockCamera() <- might be easier to use but harder to code
    //  check for everything and then move/lock/unlock camera & world border

    spawnWave (id)
    {
        // If the wave exists, spawn it
        if (this.data.waves[id])
        {
            this.enemies.spawnWave(this, this.data.waves[id], 500, 564);
        }
    }

    startScreen (id)
    {
        let screen = this.data.screens[id];

        // If the screen exists
        // TODO: First, unlock the camera
        // TODO: Wait for the player to be in the good 'x' range and then lock the camera
        if (screen)
        {
            // Set the initial wave screen id to 0
            this.waveScreenId = 0;

            // If there is a wave number in the screen
            if (screen.waves[this.waveScreenId] !== undefined)
            {
                // Call to spawn it
                this.spawnWave(screen.waves[this.waveScreenId]);
            }

            this.screenStarted = true;
        }
        // Otherwise
        else
        {
            // The level is done
            this.done = true;
        }
    }

    nextWaveCond ()
    {
        let screen = this.data.screens[this.screen];

        if (screen)
        {
            let nextWave = screen.nextWave;
            let enemiesCondition = (nextWave && nextWave.enemiesNumber) ? nextWave.enemiesNumber : 0;

            if (this.enemies.spawnFinish && this.enemies.length <= enemiesCondition) return true;
        }
        return false;
    }

    // TODO: handleScreen()
    //  if no screen started: start n°0 screen
    //  if can start next wave
    //      and wave remaining: start next wave
    //      and no wave remain and no enemies: start next screen
    handleScreen ()
    {
        // If the level is not done
        if (!this.done)
        {
            // Init screen if not done
            if (!this.screen) this.screen = 0;

            // If no screen is started, start it
            if (!this.screenStarted)
            {
                this.startScreen(this.screen);
            }

            // If you can call next wave
            if (this.nextWaveCond())
            {
                let screen = this.data.screens[this.screen];

                // And there is another wave after it
                if (screen.waves[this.waveScreenId + 1] !== undefined)
                {
                    this.waveScreenId++;
                    // Call to spawn it
                    this.spawnWave(screen.waves[this.waveScreenId]);
                }
                // Otherwise, if there is no enemies left
                else if (this.enemies.length === 0)
                {
                    // Start the next screen
                    this.screen++;
                    this.screenStarted = false;
                    this.handleScreen();
                }
            }
        }
    }

    debug ()
    {
        if (!this.enemiesText) this.enemiesText = this.add.text(1500, 800, 'Enemies: -').setOrigin(1).setFontSize(20);
        this.enemiesText.x = this.cameras.main.scrollX + 1500;
        this.enemiesText.setText(`Enemies: ${this.enemies.length}`);

        if (!this.waveText) this.waveText = this.add.text(1500, 775, 'Wave: -').setOrigin(1).setFontSize(20);
        this.waveText.x = this.cameras.main.scrollX + 1500;
        this.waveText.setText(`Wave: ${this.waveNb}`);

        // Causes lags
        // let mustRender = this.enemies.export;
        let mustRender = [];

        if (this.player.alive) mustRender.push(this.player);

        renderHitboxes(this.hitboxGraphics, mustRender);
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (input.sudo) this.game.config.physics.arcade.debug = true;

        if (this.player.alive) this.player.update(time, input, this.enemies);
        this.enemies.update(time, this.player);

        this.hpbar.x = this.cameras.main.scrollX + 10;
        this.handleScreen();
        // TODO: this.handleCamera();

        if (!this.done) console.log('Screen', this.screen);
        else console.log('Level Done - Go find out the princess');

        if (this.game.config.physics.arcade.debug) this.debug();
    }
};
