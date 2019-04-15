import Phaser from 'phaser';

import Player from '../Sprites/Player';
import Input from '../Input/Input';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';
import HPBar from '../UI/HPBar';
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

        this.data = this.cache.json.get('scenes/data');
        this.data.lastWaveScreen = 0;
        this.data.currentWave = 0;
        this.data.waveScreenFinished = true;
        this.data.waveFinished = true;
        this.data.finishingWave = false;
        this.data.enemiesOnScreen = 0;

        this.physics.world.bounds.width = 5600;
        this.physics.world.bounds.height = 900;
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

        this.enemy = new Bulb(this, 500, 564, this.ground);

        this.hitboxGraphics = this.add.graphics();

        this.cameras.main.setBounds(0, 0, 5600, 900);
        this.cameras.main.startFollow(this.player.body);
        this.moveCamera = 0;

        updateHitboxes(this.player);
    }

    handleWave (index)
    {
        let wave = this.data.waves[this.data.screens[index].waves[this.data.currentWave]];

        if (this.data.waveFinished) // if the previous wave is finished
        {
            this.data.waveFinished = false;
            console.log(wave.enemies.length + ' enemies spawned !'); // spawn new enemies
            this.data.enemiesOnScreen += wave.enemies.length;
            this.data.currentWave++;
            /* this.enemySpawn = setInterval(function(){
                console.log("Enemy " + wave.enemies[this.data.enemiesOnScreen] + " spawned !");
                this.data.enemiesOnScreen++;
                console.log(wave.enemies.length);
                if(this.data.nbEnemies >= wave.enemies.length)
                {
                    clearInterval(scene.enemySpawn);
                }
            }, 100); */
        }

        if (this.data.enemiesOnScreen <= this.data.screens[index].nextWave.enemiesNumber)
        {
            // go to next wave if the condition is fulfilled or if there are no enemies (for the last wave)
            if (this.data.screens[index].waves.length === this.data.currentWave)
            {
                if (!this.data.enemiesOnScreen)
                {
                    this.data.waveFinished = true;
                }
            }
            else
            {
                this.data.waveFinished = true;
            }
        }

        if (this.data.waveFinished && this.data.screens[index].waves.length === this.data.currentWave)
        {
            // if all waves of the waveScreen are finished
            this.data.waveScreenFinished = true;
            this.data.finishingWave = true;
            this.data.currentWave = 0;
        }
    }

    finishWave ()
    {
        // fluid transition
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
            this.physics.world.bounds.right = 5600;
            this.data.finishingWave = false;
            this.moveCamera = 0;
        }
    }

    handleCamera ()
    {
        if (this.data.lastWaveScreen !== this.data.screens.length)
        {
            // if there is any waveScreen left to defeat
            if (this.player.x >= 1000 + 1600 * this.data.lastWaveScreen && this.cameras.main.scrollX < 750 + 1600 * this.data.lastWaveScreen)
            {
                // fluid transition
                this.cameras.main.stopFollow();
                this.moveCamera++;
                if (this.moveCamera > 20) this.moveCamera = 20;
                this.cameras.main.setScroll(this.cameras.main.scrollX + this.moveCamera, 0);
                if (this.cameras.main.scrollX >= 750 + 1600 * this.data.lastWaveScreen)
                {
                    this.physics.world.bounds.left = this.cameras.main.scrollX;
                    this.physics.world.bounds.right = this.cameras.main.scrollX + this.cameras.main.width;
                    this.moveCamera = 0;
                    this.data.waveScreenFinished = false;
                    this.data.lastWaveScreen++;
                }
            }
        }

        if (!this.data.waveScreenFinished)
        {
            this.handleWave(this.data.lastWaveScreen - 1); // start and handle the waveScreen
        }

        if (this.data.finishingWave)
        {
            this.finishWave(); // fluid transition
        }
    }

    update (time)
    {
        let input = new Input({ keyboard: this.input.keyboard, gamepad: this.input.gamepad });

        if (input.sudo) this.game.config.physics.arcade.debug = true;

        // "Randomly"
        if ((time % 500) < 30)
        {
            // Enemies deal damage (TODO: Real enemy damage (sprite, cooldown, ...))
            if (this.data.enemiesOnScreen > 0 || this.enemy.alive)
            {
                this.player.looseHp(this.data.enemiesOnScreen);
            }
            // Or regenerate if no enemies TODO: "Natural" regeneration (out-of-fight cooldown)
            else
            {
                this.player.gainHp(1);
                this.player.gainEnergy(5);
            }
        }

        // If not: jumping or already punching, then kill an enemy on input.attack1
        if (input.attack1 && !['punch', 'jump', 'forwardjump'].includes(this.player.anims.currentAnim.key))
        {
            this.data.enemiesOnScreen--; // kill an enemy

            if (this.data.enemiesOnScreen < 0)
            {
                this.data.enemiesOnScreen = 0;
            }
        };

        if (!this.enemy.alive)
        {
            this.enemy = Math.random() >= 0.5 ? new Bulb(this, this.player.x + 300, 564, this.ground) : new Fridge(this, this.player.x + 300, 564, this.ground);
        }

        if (this.player.alive) this.player.update(time, input);
        if (this.enemy.alive) this.enemy.update(time, this.player);

        this.handleCamera(); // handle camera and waveScreens if needed

        // For testing (TODO: Remove)
        if (input.attack2) this.player.gainHp(1);
        if (input.attack3) this.player.gainEnergy(1);

        // HPBar follow cameras
        this.hpbar.x = this.cameras.main.scrollX + 10;

        if (this.game.config.physics.arcade.debug)
        {
            if (!this.enemiesText) this.enemiesText = this.add.text(1500, 800, 'Enemies: 0').setOrigin(1).setFontSize(20);

            this.enemiesText.x = this.cameras.main.scrollX + 1500;
            this.enemiesText.setText(`Enemies: ${this.data.enemiesOnScreen}`);

            let mustRender = [];

            if (this.player.alive) mustRender.push(this.player);
            if (this.enemy.alive) mustRender.push(this.enemy);

            renderHitboxes(this.hitboxGraphics, mustRender);
        }
    }
};
