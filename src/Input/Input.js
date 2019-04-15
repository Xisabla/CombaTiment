import Phaser from 'phaser';

export default class Input
{
    constructor ({ keyboard, gamepad })
    {
        this.keyboard = keyboard;
        this.gamepad = gamepad;

        this.pad = Input.findPad(this.gamepad);
        this.cursors = this.keyboard.createCursorKeys();
        this.keys = {
            A: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            Z: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            E: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            space: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        if (this.pad)
        {
            if (this.pad.axes[0]) this.padAxeH = this.pad.axes[0].getValue();
            if (this.pad.buttons[0]) this.b0 = this.pad.buttons[0].value;
            if (this.pad.buttons[1]) this.b1 = this.pad.buttons[1].value;
            if (this.pad.buttons[2]) this.b2 = this.pad.buttons[2].value;
            if (this.pad.buttons[3]) this.b3 = this.pad.buttons[3].value;
            if (this.pad.buttons[4]) this.b4 = this.pad.buttons[4].value;
            if (this.pad.buttons[5]) this.b5 = this.pad.buttons[5].value;
            if (this.pad.buttons[6]) this.b6 = this.pad.buttons[6].value;
            if (this.pad.buttons[7]) this.b7 = this.pad.buttons[7].value;
            if (this.pad.buttons[8]) this.b8 = this.pad.buttons[8].value;
            if (this.pad.buttons[9]) this.b9 = this.pad.buttons[9].value;
            if (this.pad.buttons[10]) this.b10 = this.pad.buttons[10].value;
            if (this.pad.buttons[11]) this.b11 = this.pad.buttons[11].value;
            if (this.pad.buttons[12]) this.b12 = this.pad.buttons[12].value;
            if (this.pad.buttons[13]) this.b13 = this.pad.buttons[13].value;
            if (this.pad.buttons[14]) this.b14 = this.pad.buttons[14].value;
            if (this.pad.buttons[15]) this.b15 = this.pad.buttons[15].value;
        }

        this.direction = {
            left: this.cursors.left.isDown || this.padAxeH < 0,
            right: this.cursors.right.isDown || this.padAxeH > 0
        };

        this.jump = this.cursors.up.isDown || this.keys.space.isDown || this.pad.A;

        this.attack1 = this.keys.A.isDown || this.pad.X;
        this.attack2 = this.keys.Z.isDown || this.pad.Y;
        this.attack3 = this.keys.E.isDown || this.pad.B;

        this.sudo = this.b4 && this.b5 && this.b6 && this.b7 && this.b10 && this.b11;
    }

    getVelocity (baseVelocity)
    {
        if (this.padAxeH) return Math.abs(this.padAxeH) * baseVelocity;

        return baseVelocity;
    }

    static findPad (gamepad)
    {
        let padIndex = 0;

        while (padIndex < gamepad.gamepads.length && gamepad.getPad(padIndex).id.substr(0, 15) === 'Unknown Gamepad') padIndex++;

        return (padIndex >= gamepad.gamepads.length) ? false : gamepad.getPad(padIndex);
    }
}
