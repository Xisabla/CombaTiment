import Phaser from 'phaser';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'BootScene' });

        this.loaded = false;
    }

    log (text)
    {
        if (!this.logText) this.logText = this.add.text(50, 100, '');

        this.logText.setText(this.logText._text + '\n' + text);
    }

    preload ()
    {
        this.log('Using assets library: "http://labs.phaser.io"\n');
        this.load.setBaseURL('http://labs.phaser.io');

        this.log('Loading [apple]=[library:assets/sprites/apple.png]...');
        this.load.image('apple', 'assets/sprites/apple.png');

        this.log('\n\n\n\n\nWaiting 2s...');

        setTimeout(() =>
        {
            this.loaded = true;
        }, 2000);
    }

    update ()
    {
        if (this.loaded) this.scene.start('SplashScene');
    }
}
