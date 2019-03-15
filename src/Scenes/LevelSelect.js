import Phaser from 'phaser';

import LevelPanel from '../UI/LevelPanel';

export default class extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'LevelSelect' });
    }

    init ()
    {}

    create ()
    {
        this.add.image(800, 450, 'levelselect/background');

        let panels = [
            { x: 100,
                y: 100,
                color: 0xf39c12,
                name: 'Consommation\nd\'énergie',
                power: 'power/thunder',
                ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple'] },
            { x: 450,
                y: 100,
                color: 0xe74c3c,
                name: 'Sécurité',
                power: 'power/thunder',
                ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple'] },
            { x: 800,
                y: 100,
                color: 0x3498db,
                name: 'Energies vertes',
                power: 'power/thunder',
                ennemies: ['ennemy/apple', 'ennemy/apple', 'ennemy/apple', 'ennemy/apple'] },
            { x: 1150,
                y: 100,
                color: 0x2ecc71,
                name: 'Isolation',
                power: 'power/thunder',
                ennemies: ['ennemy/apple', 'ennemy/apple'] }
        ];

        this.panel = [];

        panels.forEach((panel, id) =>
        {
            this.panel[id] = new LevelPanel(this, panel);
        });

        this.input.keyboard.on('keydown', (event) =>
        {
            let key = event.key;

            if (key === 'Escape') this.scene.start('SplashScene');

            if (key === '&') this.panel[0].bounce();
            if (key === 'é') this.panel[1].bounce();
            if (key === '"') this.panel[2].bounce();
            if (key === '\'') this.panel[3].bounce();
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update ()
    {}
};
