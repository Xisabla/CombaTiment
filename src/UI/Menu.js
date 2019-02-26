export class Menu
{
    constructor (scene, settings = {})
    {
        this.scene = scene;

        let title = settings['title'] || { text: 'Menu' };
        let cursor = settings['cursor'] || {};

        this.choices = settings['choices'] || {};
        this.seperators = settings['seperators'] || {};

        let choicesOffset = this.choices['offset'] || {};
        let seperatorsOffset = this.seperators['offset'] || {};

        this.title = this._parseTitle(title);
        this.cursor = this._parseCursor(cursor);
        this.cursorOffsetX = settings['cursorOffsetX'];
        this.cursorOffsetY = settings['cursorOffsetY'];
        if (this.cursorOffsetX === undefined) this.cursorOffsetX = -100;
        if (this.cursorOffsetY === undefined) this.cursorOffsetY = 0;
        this.choices.offset = parseOffset(choicesOffset);
        this.seperators.offset = parseOffset(seperatorsOffset);
        this.elements = [];
    }

    _parseTitle (title)
    {
        if (!title['x']) title.x = this.scene.cameras.main.width / 2;
        if (!title['y']) title.y = 50;
        if (title['offsetBottom'] === undefined) title.offsetBottom = this.scene.cameras.main.height / 10;

        if (title['image'])
        {
            title.type = 'image';

            if (!title['scale']) title.scale = 1;
        }
        else
        {
            title.type = 'text';

            if (!title['text']) title.text = 'Menu';
            if (!title['color']) title.color = 'white';
            if (!title['fontFamily']) title.fontFamily = 'Courier';
            if (!title['fontSize']) title.fontSize = 24;
        }

        return title;
    }

    _parseCursor (cursor)
    {
        if (cursor['image'])
        {
            cursor.type = 'image';

            if (!cursor['scale']) cursor.scale = 1;
        }
        else
        {
            cursor.type = 'text';

            if (!cursor['text']) cursor.text = '>';
            if (!cursor['color']) cursor.color = 'white';
            if (!cursor['fontFamily']) cursor.fontFamily = 'Courier';
            if (!cursor['fontSize']) cursor.fontSize = 12;
        }

        return cursor;
    }

    countOptions ()
    {
        let n = 0;

        this.elements.forEach(element =>
        {
            if (element instanceof MenuOption) n++;
        });

        return n;
    }

    getOption (index)
    {
        let i = 0;
        let elem;

        this.elements.some(element =>
        {
            elem = element;
            if (element instanceof MenuOption) i++;
            return i - 1 === index;
        });

        return elem;
    }

    add (element)
    {
        this.elements.push(element);

        return this;
    }

    _moveCursor (x, y)
    {
        if (this.cursorText) this.cursorText.setPosition(x + this.cursorOffsetX, y + this.cursorOffsetY);
        if (this.cursorImage) this.cursorImage.setPosition(x + this.cursorOffsetX, y + this.cursorOffsetY);
    }

    select (index)
    {
        index %= this.countOptions();
        let element = this.getOption(index);

        this.selectedIndex = index;
        this._moveCursor(element.x, element.y);

        element.select();

        return element;
    }

    selectUp ()
    {
        if (this.selectedIndex <= 0) return this.select(this.countOptions() - 1);

        return this.select(--this.selectedIndex);
    }

    selectDown ()
    {
        if (this.selectedIndex >= this.countOptions() - 1) return this.select(0);

        return this.select(++this.selectedIndex);
    }

    enter ()
    {
        let selected = this.getOption(this.selectedIndex);

        return selected.enter();
    }

    _showTitle ()
    {
        if (this.title.type === 'image')
        {
            if (!this.titleImage) this.titleImage = this.scene.add.image(this.title.x, this.title.y, this.title.image);
            this.titleImage.setScale(this.title.scale);
        }
        else
        {
            if (!this.titleText) this.titleText = this.scene.add.text(this.title.x, this.title.y, this.title.text);
            this.titleText.setOrigin(0.5);
            this.titleText.setColor(this.title.color);
            this.titleText.setFontFamily(this.title.fontFamily);
            this.titleText.setFontSize(this.title.fontSize);
        }
    }

    _showElements (x, y)
    {
        this.elements.forEach(element =>
        {
            let settings = {};

            if (element instanceof MenuOption) settings = this.choices;
            if (element instanceof MenuSeperator) settings = this.seperators;

            element.show(this.scene, x, y, settings);

            y += element.getHeight();

            if (element instanceof MenuOption) y += this.choices.offset.bottom;
            if (element instanceof MenuSeperator) y += this.seperators.offset.bottom;
        });
    }

    _showCursor ()
    {
        if (this.cursor.type === 'text')
        {
            if (!this.cursorText) this.cursorText = this.scene.add.text(0, 0, this.cursor.text);
            this.cursorText.setOrigin(0.5);
            this.cursorText.setColor(this.cursor.color);
            this.cursorText.setFontFamily(this.cursor.fontFamily);
            this.cursorText.setFontSize(this.cursor.fontSize);
        }

        if (this.cursor.type === 'image')
        {
            if (!this.cursorImage) this.cursorImage = this.scene.add.image(0, 0, this.cursor.image);
            this.cursorImage.setScale(this.cursor.scale);
        }
    }

    create ()
    {
        this._showTitle();

        let y = (this.title.type === 'text') ? (this.titleText.height / 2) : (this.titleImage.height * this.title.scale / 2) + this.title.y + this.title.offsetBottom;

        this._showElements(this.title.x, y);
        this._showCursor();

        if (this.countOptions() > 0) this.select(0);
    }

    bindKeyboard (keyboard, keys = { down: ['ArrowDown'], up: ['ArrowUp'], enter: ['Enter'] })
    {
        keyboard.on('keydown', (event) =>
        {
            let key = event.key;

            if (keys.down.includes(key)) this.selectDown();
            if (keys.up.includes(key)) this.selectUp();
            if (keys.enter.includes(key)) this.enter();
        });
    }

    bindGamepad (gamepad, buttons = { down: [13], up: [12], enter: [0] })
    {
        gamepad.on('down', (pad, button) =>
        {
            let index = button.index;

            if (buttons.down.includes(index)) this.selectDown();
            if (buttons.up.includes(index)) this.selectUp();
            if (buttons.enter.includes(index)) this.enter();
        });
    }
};

export class MenuOption
{
    constructor (name, settings = {})
    {
        this.name = name;
        this.x = 0;
        this.y = 0;

        this.settings = settings;
    }

    define (settings = {}, global = {})
    {
        let offset = settings['offset'] || global['offset'] || {};

        this.color = settings['color'] || global['color'] || 'white';
        this.fontFamily = settings['fontFamily'] || global['fontFamily'] || 'Courier';
        this.fontSize = settings['fontSize'] || global['fontSize'] || 12;
        this.offset = parseOffset(offset);

        this.y += this.offset.top;

        this.fn_select = settings['select'] || global['select'] || undefined;
        this.fn_enter = settings['enter'] || global['enter'] || undefined;
    }

    getHeight ()
    {
        return this.optionText.height;
    }

    select ()
    {
        if (this.fn_select && typeof this.fn_select === 'function') return this.fn_select(this);
    }

    enter ()
    {
        if (this.fn_enter && typeof this.fn_enter === 'function') return this.fn_enter(this);
    }

    show (scene, x, y, settings = {})
    {
        this.x = x;
        this.y = y;

        this.define(this.settings, settings);

        this.optionText = scene.add.text(this.x, this.y, this.name);
        this.optionText.setOrigin(0.5);
        this.optionText.setColor(this.color);
        this.optionText.setFontFamily(this.fontFamily);
        this.optionText.setFontSize(this.fontSize);

        this.y += this.optionText.height / 2;
        this.optionText.setPosition(this.x, this.y);
    }
};

export class MenuSeperator
{
    constructor (settings = {})
    {
        if (settings['image'] || (settings['type'] && settings['type'].toLowerCase() === 'image')) this.type = 'image';
        else if (settings['text'] || (settings['type'] && settings['type'].toLowerCase() === 'text')) this.type = 'text';
        else this.type = 'bar';

        this.settings = settings;
    }

    define (settings = {}, global = {})
    {
        let offset = settings['offset'] || global['offset'] || {};

        if (this.type === 'bar')
        {
            this.width = settings['width'] || global['width'] || 100;
            this.height = settings['height'] || global['height'] || 1;
            this.color = settings['color'] || global['color'] || 0xffffff;
            this.alpha = settings['alpha'] || global['alpha'] || 1;
        }

        if (this.type === 'text')
        {
            this.text = settings['text'] || global['text'] || '-----------';
            this.color = settings['color'] || global['color'] || 'white';
            this.fontFamily = settings['fontFamily'] || global['fontFamily'] || 'Courier';
            this.fontSize = settings['fontSize'] || global['fontSize'] || 10;
        }

        if (this.type === 'image')
        {
            this.image = settings['image'] || global['image'] || 'divider';
            this.scale = settings['scale'] || global['scale'] || 1;
        }

        this.offset = parseOffset(offset);
    }

    getHeight ()
    {
        if (this.type === 'bar') return this.height;
        if (this.type === 'image') return this.seperatorImage.height * this.scale;
        if (this.type === 'text') return this.seperatorText.height;

        return 0;
    }

    _showBar (scene, x, y)
    {
        this.bar = scene.add.graphics();
        this.bar.fillStyle(this.color, this.alpha);
        this.bar.fillRect(x - this.width / 2, y - this.height, this.width, this.height);
    }

    _showImage (scene, x, y)
    {
        this.seperatorImage = scene.add.image(x, y, this.image);
        this.seperatorImage.setOrigin(0.5);
        this.seperatorImage.setScale(this.scale);

        y += this.seperatorImage.height * this.scale / 2;
        this.seperatorImage.setPosition(x, y);
    }

    _showText (scene, x, y)
    {
        this.seperatorText = scene.add.text(x, y, this.text);
        this.seperatorText.setOrigin(0.5, 0);
        this.seperatorText.setColor(this.color);
        this.seperatorText.setFontFamily(this.fontFamily);
        this.seperatorText.setFontSize(this.fontSize);

        y += this.seperatorText.height / 2;
        this.seperatorText.setPosition(x, y);
    }

    show (scene, x, y, settings)
    {
        this.define(this.settings, settings);

        y += this.offset.top;

        if (this.type === 'bar') this._showBar(scene, x, y);
        if (this.type === 'image') this._showImage(scene, x, y);
        if (this.type === 'text') this._showText(scene, x, y);
    }
};

/**
 * Parse an offset:
 *   Take the offset object, parse it and fill it with defaultValues if needed
 *
 * @param {object} [offset] Offset to parse
 * @param {object} [defaultValues] Default values
 *
 * @return {object} Parsed offset
 */
export function parseOffset (offset, defaultValues = { top: 0, bottom: 0, left: 0, right: 0 })
{
    if (typeof offset === 'number') return { top: offset, bottom: offset, left: offset, right: offset };

    if (offset['top']) defaultValues.top = offset['top'];
    if (offset['bottom']) defaultValues.bottom = offset['bottom'];
    if (offset['left']) defaultValues.left = offset['left'];
    if (offset['right']) defaultValues.right = offset['right'];

    return defaultValues;
}
