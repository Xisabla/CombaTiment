import { EventEmitter } from 'events';
import keys from './KeyboardEventKeys';
import buttons from './GamepadEventButtons';

export default class EventInput extends EventEmitter
{
    constructor ({ keyboard, gamepad })
    {
        super();

        this.keyboard = keyboard;
        this.gamepad = gamepad;

        this.keyboard.on('keydown', event =>
        {
            let key = Object.keys(keys).find(key => keys[key] === event.keyCode);
            if (key !== undefined) this.emit('down', key);
        });

        this.gamepad.on('down', (pad, button) =>
        {
            let key = Object.keys(buttons).find(key => buttons[key] === button.index);
            if (key !== undefined) this.emit('down', key);
        });
    }
}
