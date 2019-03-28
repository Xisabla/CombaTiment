import Phaser from 'phaser';

export default class Input
{
    constructor ({ keyboard, gamepad })
    {
        this.keyboard = keyboard;
        this.gamepad = gamepad;

        this.pad = this.findPad(this.gamepad);
        this.cursors = this.keyboard.createCursorKeys();
        this.keys = {
            A: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            Z: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            E: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            space: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        if (this.pad)
        {
            this.padAxeH = this.pad.axes[0].getValue();
        }

        this.direction = {
            left: this.cursors.left.isDown || this.padAxeH < 0,
            right: this.cursors.right.isDown || this.padAxeH > 0
        };

        this.jump = this.cursors.up.isDown || this.keys.space.isDown || this.pad.A;

        this.attack1 = this.keys.A.isDown || this.pad.X;
        this.attack2 = this.keys.Z.isDown || this.pad.Y;
        this.attack3 = this.keys.E.isDown || this.pad.B;
    }

    getVelocity (baseVelocity)
    {
        if (this.padAxeH) return Math.abs(this.padAxeH) * baseVelocity;

        return baseVelocity;
    }

    findPad (gamepad)
    {
        let padIndex = 0;

        while (padIndex < gamepad.gamepads.length && gamepad.getPad(padIndex).id.substr(0, 15) === 'Unknown Gamepad') padIndex++;

        return (padIndex >= gamepad.gamepads.length) ? false : gamepad.getPad(padIndex);
    }
}
