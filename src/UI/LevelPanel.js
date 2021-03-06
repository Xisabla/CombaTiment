import Phaser from 'phaser';
import { enemiesText } from '../utils';

export default class LevelPanel extends Phaser.GameObjects.Container
{
    constructor (scene, settings = {})
    {
        let x = settings.x || 0;
        let y = settings.y || 0;

        super(scene, x, y);

        this.width = settings.width || 300;
        this.height = settings.height || 550;
        this.baseX = x;
        this.baseY = y;

        this.color = settings.color || 0xffffff;
        this.name = settings.name || '';

        this.power = settings.power || '';
        this.enemies = settings.enemies || [];

        this.selected = false;

        scene.add.existing(this);
    }

    isCharacterIn (character)
    {
        let x = character.x + character.width / 2;

        return (x >= this.x && x <= this.x + this.width);
    }

    showBase ()
    {
        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(this.color, 0.8)
            .fillRoundedRect(0, 0, this.width, this.height));

        this.add(new Phaser.GameObjects.Text(this.scene, this.width / 2, 50, this.name, {
            align: 'center',
            fontFamily: 'BT1982',
            fontSize: 30 })
            .setOrigin(0.5));
    }

    showPower ()
    {
        this.add(new Phaser.GameObjects.Text(this.scene, 20, 120, 'Pouvoir: ', {
            fontFamily: 'Pixel',
            fontSize: 24 }));

        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(0xffffff)
            .fillRect(20, 150, 100, 3));

        this.add(new Phaser.GameObjects.Sprite(this.scene, 20, 170, this.power)
            .setDisplaySize(50, 50)
            .setOrigin(0));
    }

    showEnemies ()
    {
        this.add(new Phaser.GameObjects.Text(this.scene, 20, 230, 'Ennemis: ', {
            fontFamily: 'Pixel',
            fontSize: 24 }));

        this.add(new Phaser.GameObjects.Graphics(this.scene)
            .fillStyle(0xffffff)
            .fillRect(20, 260, 115, 3));

        let baseY = 280;
        let size = 60;
        let offset = 22.5;
        let baseX = offset;

        let x = baseX;
        let y = baseY;

        this.enemies.forEach(enemy =>
        {
            if (!enemy) return;

            let name = enemy.split('/')[1];
            let description = enemiesText[name];

            this.add(new Phaser.GameObjects.Sprite(this.scene, x, y, enemy)
                .setDisplaySize(size, size)
                .setOrigin(0));

            this.add(new Phaser.GameObjects.Text(this.scene, x + size / 2, y + size * 1.3, description, {
                fontFamily: 'Pixel',
                fontSize: 13,
                align: 'center' })
                .setOrigin(0.5));

            x += size + offset * 2;

            if (x >= this.width - size - offset)
            {
                x = baseX; y += size + offset * 2 + 20;
            }
        });
    }

    show ()
    {
        this.showBase();
        this.showPower();
        this.showEnemies();
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

    select ()
    {
        if (this.list[0])
        {
            this.list[0].clear()
                .lineStyle(5, 0xffffff, 0.7)
                .fillStyle(this.color, 0.7)
                .fillRoundedRect(0, 0, this.width, this.height)
                .strokeRoundedRect(-2.5, -2.5, this.width + 5, this.height + 5, 32);
        }

        this.selected = true;
    }

    unselect ()
    {
        if (this.list[0])
        {
            this.list[0].clear()
                .fillStyle(this.color, 0.8)
                .fillRoundedRect(0, 0, this.width, this.height);
        }

        this.selected = false;
    }
};
