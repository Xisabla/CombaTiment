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

        this.screenOffset = 750;
        this.enemies = new EnemyCollection();
        this.data = this.cache.json.get('scenes/data');
        this.screen = 0;
        this.waveScreenId = 0;
        this.screenStarted = false;
        this.finishingWave = false;
        this.done = false;

        this.ground = this.physics.add.staticGroup();
        for (let i = 0; i < this.data.screens.length + 2; i++)
        {
            this.add.image(800 + 2 * 800 * i, 450, 'levelselect/background');
            this.ground.create(800 + 2 * 800 * i, 810, 'levelselect/ground');
            this.add.image(800 + 2 * 800 * i, 710, 'levelselect/grass');
        }

        this.player = new Player(this, 40, 553, this.ground);
        this.hpbar = new HPBar(this.player);

        // TODO: Remove - for testing
        this.player.setGodmode(true);
        // this.enemies.spawnWave(this, this.data.waves[this.data.screens[this.screen].waves[this.wave]], 500, 564);

        this.hitboxGraphics = this.add.graphics();

        this.physics.world.bounds.width = 1600 * (this.data.screens.length + 2);
        this.physics.world.bounds.height = 900;
        this.cameras.main.setBounds(0, 0, 1600 * (this.data.screens.length + 2), 900);
        this.cameras.main.startFollow(this.player.body);
        this.moveCamera = 0;

        updateHitboxes(this.player);
    }

    // TODO: handleCamera() or lockCamera() and unlockCamera() <- might be easier to use but harder to code
    //  check for everything and then move/lock/unlock camera & world border

    spawnWave (id)
    {
        // If the wave exists, spawn it
        if (this.data.waves[id])
        {
            this.enemies.spawnWave(this, this.data.waves[id], this.screenOffset + 1600 * this.screen + this.cameras.main.width, 564);
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

    lockCamera ()
    {
        if (this.screen < this.data.screens.length && this.player.x >= this.screenOffset + 250 + 1600 * this.screen && this.cameras.main.scrollX < this.screenOffset + 1600 * this.screen)
        {
            // fluid transition
            this.cameras.main.stopFollow();
            this.moveCamera++;
            if (this.moveCamera > 20) this.moveCamera = 20;
            this.cameras.main.setScroll(this.cameras.main.scrollX + this.moveCamera, 0);
            this.physics.world.bounds.left = this.screenOffset + 250 + 1600 * this.screen;
            this.physics.world.bounds.right = this.screenOffset + 1600 * this.screen + this.cameras.main.width;

            return 1;
        }
        else if (this.cameras.main.scrollX >= this.screenOffset + 1600 * this.screen)
        {
            this.moveCamera = 0;
            this.physics.world.bounds.left = this.screenOffset + 1600 * this.screen;
            return 2;
        }
        else return 0;
    }

    unlockCamera ()
    {
        if (this.player.x - this.cameras.main.scrollX >= this.cameras.main.width / 2 + 21)
        {
            this.moveCamera++;
            if (this.moveCamera > 20) this.moveCamera = 20;
            this.cameras.main.setScroll(this.cameras.main.scrollX + this.moveCamera, 0);
        }
        else if (this.player.x - this.cameras.main.scrollX <= this.cameras.main.width / 2 - 21)
        {
            this.moveCamera++;
            if (this.moveCamera > 20) this.moveCamera = 20;
            this.cameras.main.setScroll(this.cameras.main.scrollX - this.moveCamera, 0);
        }
        else
        {
            this.cameras.main.startFollow(this.player);
            this.physics.world.bounds.left = 0;
            this.physics.world.bounds.right = 1600 * (this.data.screens.length + 2);
            this.moveCamera = 0;
            return 0;
        }
        return 1;
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

            if (this.finishingWave)
            {
                if (this.unlockCamera())
                {
                    return;
                }
                else
                {
                    this.finishingWave = false;
                }
            }

            if (this.lockCamera() !== 2)
            {
                return;
            }

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
                    this.finishingWave = true;
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
