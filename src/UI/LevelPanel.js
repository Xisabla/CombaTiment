import Phaser from 'phaser';

export default class LevelPanel extends Phaser.GameObjects.Container
{
    constructor (scene, settings = {})
    {
        let x = settings.x || 0;
        let y = settings.y || 0;

        super(scene, x, y);

        this.width = settings.width || 300;
        this.baseX = x;
        this.baseY = y;

        this.color = settings.color || 0xffffff;
        this.name = settings.name || '';

        this.power = settings.power || '';
        this.ennemies = settings.ennemies || [];

        this._showBase();
        this._showPower();
        this._showEnnemies();

        scene.add.existing(this);
    }

    _showBase ()
    {
        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(this.color, 0.8)
            .fillRoundedRect(0, 0, 300, 550));

        this.add(new Phaser.GameObjects.Text(this.scene, 150, 50, this.name, {
            align: 'center',
            fontFamily: 'Raleway',
            fontSize: 36 })
            .setOrigin(0.5));
    }

    _showPower ()
    {
        this.add(new Phaser.GameObjects.Text(this.scene, 20, 120, 'Power: ', {
            fontFamily: 'Raleway',
            fontSize: 24 }));

        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(0xffffff)
            .fillRect(20, 150, 75, 3));

        this.add(new Phaser.GameObjects.Sprite(this.scene, 20, 170, this.power)
            .setDisplaySize(50, 50)
            .setOrigin(0));
    }

    _showEnnemies ()
    {
        this.add(new Phaser.GameObjects.Text(this.scene, 20, 230, 'Ennemies: ', {
            fontFamily: 'Raleway',
            fontSize: 24 }));

        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(0xffffff)
            .fillRect(20, 260, 115, 3));

        let baseX = 20;
        let baseY = 280;
        let size = 50;
        let offset = 10;

        let x = baseX;
        let y = baseY;

        this.ennemies.forEach(ennemy =>
        {
            this.add(new Phaser.GameObjects.Sprite(this.scene, x, y, ennemy)
                .setDisplaySize(size, size)
                .setOrigin(0));

            x += size + offset * 2;

            if (x >= this.width - size - offset)
            {
                x = baseX; y += size + offset * 2;
            }
        });
    }

    bounce (pixels = 5, time = 200, tick = 10)
    {
        let timerUp = setInterval(() =>
        {
            this.setY(this.y - pixels);
        }, tick);

        setTimeout(() =>
        {
            clearInterval(timerUp);

            let timerDown = setInterval(() =>
            {
                this.setY(this.y + pixels);
            }, tick);

            setTimeout(() =>
            {
                clearInterval(timerDown);
                this.setY(this.baseY);
            }, time / 2);
        }, time / 2);
    }
};
