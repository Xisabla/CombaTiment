const Phaser = require('phaser');

function create ()
{
    let text1 = this.add.text(100, 100, 'Hello World');
    text1.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
}

let config = {
    type: Phaser.WEBGL,
    parent: 'phaser-exmaple',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

// eslint-disable-next-line no-unused-vars
let game = new Phaser.Game(config);
