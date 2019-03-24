import Phaser from 'phaser';

import Character from '../Sprites/Character';
import { updateHitboxes, renderHitboxes } from '../Engine/Hitbox';

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
        this.data = this.cache.json.get('scenes/data');
        this.data.lastWaveScreen = 0;
        this.data.currentWave = 0;
        this.data.waveScreenFinished = true;
        this.data.waveFinished = true;
        this.data.finishingWave = false;
        this.data.ennemiesOnScreen = 0;

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

        this.player = new Character(this, 40, 500, 'feilong/idle', this.ground, 'feilong/hitbox', 'feilong');
        this.player.createAnim(this, 'idle', this.anims.generateFrameNumbers('feilong/idle', { start: 0, end: 10 }), 10, -1);
        this.player.createAnim(this, 'walk', this.anims.generateFrameNumbers('feilong/walking', { start: 0, end: 5 }), 10, -1);
        this.player.createAnim(this, 'punch', this.anims.generateFrameNumbers('feilong/punch', { start: 0, end: 3 }), 10, -1);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            select: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        };

        this.hitboxGraphics = this.add.graphics();

        this.cameras.main.setBounds(0, 0, 5600, 900);
        this.cameras.main.startFollow(this.player.body);
        this.moveCamera = 0;
    }

    handleWave (index)
    {
        let wave = this.data.waves[this.data.screens[index].waves[this.data.currentWave]];

        if (this.data.waveFinished) // if the previous wave is finished
        {
            this.data.waveFinished = false;
            console.log(wave.ennemies.length + ' ennemies spawned !'); // spawn new ennemies
            this.data.ennemiesOnScreen += wave.ennemies.length;
            this.data.currentWave++;
            /* this.ennemySpawn = setInterval(function(){
                console.log("Ennemy " + wave.ennemies[this.data.ennemiesOnScreen] + " spawned !");
                this.data.ennemiesOnScreen++;
                console.log(wave.ennemies.length);
                if(this.data.nbEnnemies >= wave.ennemies.length)
                {
                    clearInterval(scene.ennemySpawn);
                }
            }, 100); */
        }

        if (this.data.ennemiesOnScreen <= this.data.screens[index].nextWave.ennemiesNumber)
        {
            // go to next wave if the condition is fulfilled or if there are no ennemies (for the last wave)
            if (this.data.screens[index].waves.length === this.data.currentWave)
            {
                if (!this.data.ennemiesOnScreen)
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
        if (this.player.x - this.cameras.main.scrollX >= this.cameras.main.width / 2 + 50)
        {
            this.moveCamera++;
            this.cameras.main.setScroll(this.cameras.main.scrollX + this.moveCamera, 0);
        }
        else if (this.player.x - this.cameras.main.scrollX <= this.cameras.main.width / 2 - 50)
        {
            this.moveCamera++;
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

    update ()
    {
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
            this.data.ennemiesOnScreen--; // kill an ennemy
            if (this.data.ennemiesOnScreen < 0)
            {
                this.data.ennemiesOnScreen = 0;
            }
            console.log(this.data.ennemiesOnScreen);
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

        this.handleCamera(); // handle camera and waveScreens if needed
        updateHitboxes(this.player); // update player's hitbox's position
        renderHitboxes(this.hitboxGraphics, [this.player]); // render hitboxes (debug)
    }
};
