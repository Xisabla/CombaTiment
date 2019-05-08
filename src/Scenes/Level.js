import Phaser from 'phaser';

import Player from '../Sprites/Player';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import HPBar from '../UI/HPBar';
import EnemyCollection from '../Sprites/EnemyCollection';
import EventInput from '../Input/EventInput';
import { Menu, MenuOption, MenuSeparator } from '../UI/Menu';
import { enemiesObjects } from '../utils';
import TutorialIceCube from '../Sprites/Projectiles/TutorialIceCube';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Level' });

        this.data = {
            waves: [],
            screens: []
        };
    }

    init (data)
    {
        this.id = data.id;
        this.data = data;
    }

    pauseMenu ()
    {
        this.pframe = this.add.image(800, 400, 'hud/pauseframe');
        this.pframe.setDepth(1e6 + 1);
        this.pframe.visible = false;

        this.pmenu = new Menu(this, {
            title: { text: ' ',
                y: 180,
                offsetBottom: 0 },

            choices: { color: '#ffffff',
                fontFamily: 'BT1982',
                fontSize: 28,
                offset: 40
            },

            sounds: {
                select: this.sounds.menu
            },

            separators: { type: 'bar',
                width: 250,
                color: 0x000000,
                alpha: 0.5,
                offset: 20 },

            cursor: { image: 'menu/selector', scale: 1.2 },
            cursorOffsetX: 0
        });

        this.pmenu.add(new MenuOption('Resume', { enter: () => this.pause() }));
        this.pmenu.add(new MenuSeparator());
        this.pmenu.add(new MenuOption('Restart', { enter: () => this.scene.start('Level', this.data) }));
        this.pmenu.add(new MenuSeparator());
        this.pmenu.add(new MenuOption('Select', { enter: () => this.scene.start('LevelSelect') }));
        this.pmenu.add(new MenuSeparator());
        this.pmenu.add(new MenuOption('Main Menu', { enter: () => this.scene.start('SplashScene') }));

        this.pmenu.create();
        this.pmenu.bindInput(this.inputs);

        this.pmenu.hide();
    }

    create ()
    {
        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });
        this.sounds = {};
        this.sounds.ambient = this.sound.add('music/' + this.data.ambient, { loop: true, volume: 0.2 });
        this.sounds.punch = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.energyball = this.sound.add('music/energyball', { volume: 0.2 });
        this.sounds.iceCube = this.sound.add('music/punch', { volume: 0.5 });
        this.sounds.ambient.play();
        this.sounds.ambient.setSeek(this.data.ambientSeek || 0);
        this.pauseMenu();

        this.paused = false;

        this.screenOffset = 750;
        this.enemies = new EnemyCollection();
        this.boss = false;
        this.bossArrived = false;
        this.screen = 0;
        this.waveScreenId = 0;
        this.screenStarted = false;
        this.finishingWave = false;
        this.done = false;

        this.ground = this.physics.add.staticGroup();
        for (let i = 0; i < this.data.screens.length + 2; i++)
        {
            this.add.image(800 + 2 * 800 * i, 450, 'levels/' + this.id + '/background');
            this.ground.create(800 + 2 * 800 * i, 810, 'levels/ground');
        }
        this.ground.create(800 + 2 * 800 * (this.data.screens.length + 2), 810, 'levels/ground');

        this.player = new Player(this, 40, 525, this.ground);

        // this.player.setGodmode(true);
        this.hpbar = new HPBar(this.player);

        if (this.data.id === 0) this.iceTuto = new TutorialIceCube(this, 6500, 690);

        this.hitboxGraphics = this.add.graphics();

        this.physics.world.bounds.width = 1600 * (this.data.screens.length + 2);
        this.physics.world.bounds.height = 900;
        this.cameras.main.setBounds(0, 0, 1600 * (this.data.screens.length + 2), 900);
        this.cameras.main.startFollow(this.player.body);
        this.moveCamera = 0;

        this.inputs = new EventInput({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });
        this.inputs.on('down', key =>
        {
            if (key === 'pause') this.pause();
        });

        updateHitboxes(this.player);
    }

    spawnWave (id)
    {
        // If the wave exists, spawn it
        if (this.data.waves[id])
        {
            this.enemies.spawnWave(this, this.data.waves[id], this.screenOffset + 1600 * this.screen + this.cameras.main.width, 560);
        }
    }

    startScreen (id)
    {
        let screen = this.data.screens[id];

        // If the screen exists
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

    launchBoss ()
    {
        if (!this.boss.alive && !this.bossArrived)
        {
            this.sounds.ambient.stop();
            this.sounds.ambient = this.sound.add('music/' + this.data.bossAmbient, { loop: true, volume: 0.2 });
            this.sounds.ambient.play();
            this.sounds.ambient.setSeek(this.data.bossAmbientSeek || 0);
            this.boss = new enemiesObjects[this.data.boss](this, this.physics.world.bounds.right + 50, 240, this.ground);
        }
        if (this.boss.x + this.boss.displayWidth >= this.physics.world.bounds.right)
        {
            this.boss.body.setVelocityX(-100);
            this.boss.anims.play(this.boss.name + 'Idle', true);
        }
        else
        {
            this.bossArrived = true;
        }
    }

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
                    this.player.gainHp((this.player.hpmax - this.player.hp) / 2);
                    this.finishingWave = true;
                    // Start the next screen
                    this.screen++;
                    this.screenStarted = false;

                    if (this.screen >= this.data.screens.length) this.player.regenerate(200, 100);
                    this.handleScreen();
                }
            }
        }
        else
        {
            if ((this.player.x >= this.physics.world.bounds.right - 700 || this.boss.alive) && !this.boss.arrived)
            {
                this.cameras.main.stopFollow(this.player);
                this.physics.world.bounds.left = 1600 * (this.data.screens.length + 1);
                this.physics.world.bounds.right = 1600 * (this.data.screens.length + 2);
                this.launchBoss();
            }
        }
    }

    pause ()
    {
        if (this.paused)
        {
            this.paused = false;
            this.sounds.ambient.resume();
            this.pmenu.hide();
            this.pframe.visible = false;
        }
        else
        {
            this.paused = true;
            this.player.idle();
            this.enemies.idle();
            this.sounds.ambient.pause();
            this.pmenu.show();
            this.pframe.visible = true;
            this.pframe.x = 800 + this.cameras.main.scrollX;
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

        if (this.player.alive) renderHitboxes(this.hitboxGraphics, [this.player]);
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (this.paused) return false;

        if (input.sudo) this.game.config.physics.arcade.debug = true;

        if (this.player.alive) this.player.update(time, input, this.enemies, this.boss);
        this.enemies.update(time, this.player);
        if (this.boss.alive && this.bossArrived) this.boss.update(time, this.player);

        this.hpbar.x = this.cameras.main.scrollX + 10;
        this.handleScreen();

        if (this.boss && this.bossArrived && !this.boss.alive)
        {
            console.log('TODO: Finish Level');
        }

        if (this.game.config.physics.arcade.debug) this.debug();
    }
};
