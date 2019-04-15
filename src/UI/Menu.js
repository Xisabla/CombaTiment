/**
 * Object to create an manage a visual menu
 */
export class Menu
{
    /**
     * Create a Menu
     *
     * @param {Phaser.Scene} scene Scene in which the Menu will be created
     * @param {object} [settings={}] Settings of the Menu
     */
    constructor (scene, settings = {})
    {
        /**
         * Phaser Scene
         * @type {Phaser.Scene}
         * @private
         */
        this.scene = scene;

        let title = settings['title'] || { text: 'Menu' };

        /**
         * Title settings
         * @type {object}
         * @public
         */
        this.title = this._parseTitle(title);

        /**
         * Global choices settings
         * @type {object}
         * @public
         */
        this.choices = settings['choices'] || {};

        /**
         * Global separators settings
         * @type {object}
         * @public
         */
        this.separators = settings['separators'] || {};

        let cursor = settings['cursor'] || {};

        /**
         * Cursor settings
         * @type {object}
         * @public
         */
        this.cursor = this._parseCursor(cursor);

        /**
         * Menu sounds
         * @type {object}
         * @public
         */
        this.sounds = settings['sounds'] || {};

        let choicesOffset = this.choices['offset'] || {};
        let separatorsOffset = this.separators['offset'] || {};

        this.choices.offset = parseOffset(choicesOffset);
        this.separators.offset = parseOffset(separatorsOffset);

        /**
         * Ordered list of the menu's elements
         * @type {Array<MenuOption|MenuSeparator>} Ordered list of elements of the menu
         * @private
         */
        this.elements = [];

        /**
         * Selected element index
         * @type {number}
         * @private
         */
        this.selectedIndex = -1;
    }

    /**
     * Parse Title parameter and return the parsed object
     *
     * @param {object} title Title object
     *
     * @return {object} Parsed Title
     */
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

    /**
     * Parse Cursor parameter and return the parsed object
     *
     * @param {object} cursor Cursor object
     *
     * @return {object} Parsed Cursor
     */
    _parseCursor (cursor)
    {
        let offset = cursor['offset'] || {};

        cursor.offset = parseOffset(offset);

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

    /**
     * Count the number of options in the menu's elements
     *
     * @return {number} Number of options
     */
    countOptions ()
    {
        let options = this.elements.filter(elem => elem instanceof MenuOption);

        return options.length;
    }

    /**
     * Return the MenuOption at the given index
     *
     * @param {number} index Index in the Option's list
     *
     * @return  {MenuOption} Option
     */
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

    /**
     * Add an element to the element's list
     *
     * @param {MenuOption|MenuSeparator} element
     *
     * @return {Menu}
     */
    add (element)
    {
        this.elements.push(element);

        return this;
    }

    /**
     * Move the Cursor to the defined position
     *
     * @param {number} x
     * @param {number} y
     */
    _moveCursor (x, y)
    {
        if (this.cursorText) this.cursorText.setPosition(x + this.cursor.offset['top'], y + this.cursor.offset['bottom']);
        if (this.cursorImage) this.cursorImage.setPosition(x + this.cursor.offset['top'], y + this.cursor.offset['bottom']);
    }

    /**
     * Select the choice at the given index
     * Executes the select function of the found option
     *
     * @param {number} index
     *
     * @return  {MenuOption} Selected element
     */
    select (index)
    {
        index %= this.countOptions();
        let element = this.getOption(index);

        this.selectedIndex = index;
        this._moveCursor(element.x, element.y);

        element.select();

        return element;
    }

    /**
     * Select the upper element of the Menu
     *
     * @return {MenuOption}
     */
    selectUp ()
    {
        if (this.selectedIndex <= 0) return this.select(this.countOptions() - 1);

        return this.select(--this.selectedIndex);
    }

    /**
     * Select the downer element of the Menu
     *
     * @return {MenuOption}
     */
    selectDown ()
    {
        if (this.selectedIndex >= this.countOptions() - 1) return this.select(0);

        return this.select(++this.selectedIndex);
    }

    /**
     * Execute the enter function of the currently selected element
     *
     * @return {mixed}
     */
    enter ()
    {
        let selected = this.getOption(this.selectedIndex);

        if (this.scene.sounds)
        {
            if (this.scene.sounds.ambient)
            {
                if (this.scene.sounds.ambient.isPlaying) this.scene.sounds.ambient.stop();
            }
        }

        return selected.enter();
    }

    /**
     * Show Menu Title
     */
    _showTitle ()
    {
        if (this.title.type === 'image')
        {
            if (!this.titleImage)
            {
                /**
                 * Menu Title Image Object
                 * @type {Phaser.GameObjects.Image}
                 * @private
                 */
                this.titleImage = this.scene.add.image(this.title.x, this.title.y, this.title.image);
            }
            this.titleImage.setScale(this.title.scale);
        }
        else
        {
            if (!this.titleText)
            {
                /**
                 * Menu Title Text Object
                 * @type {Phaser.GameObjects.Text}
                 * @private
                 */
                this.titleText = this.scene.add.text(this.title.x, this.title.y, this.title.text);
            }
            this.titleText.setOrigin(0.5);
            this.titleText.setAlign('center');
            this.titleText.setColor(this.title.color);
            this.titleText.setFontFamily(this.title.fontFamily);
            this.titleText.setFontSize(this.title.fontSize);
        }
    }

    /**
     * Show Menu Elements
     *
     * @param {number} x X base position
     * @param {number} y Y base position
     */
    _showElements (x, y)
    {
        this.elements.forEach(element =>
        {
            let settings = {};

            if (element instanceof MenuOption) settings = this.choices;
            if (element instanceof MenuSeparator) settings = this.separators;

            element.show(this.scene, x, y, settings);

            y += element.getHeight();

            if (element instanceof MenuOption) y += this.choices.offset.bottom;
            if (element instanceof MenuSeparator) y += this.separators.offset.bottom;
        });
    }

    /**
     * Show Menu Cursor
     */
    _showCursor ()
    {
        if (this.cursor.type === 'text')
        {
            if (!this.cursorText)
            {
                /**
                 * Menu Cursor Text Object
                 * @type {Phaser.GameObjects.Text}
                 * @private
                 */
                this.cursorText = this.scene.add.text(0, 0, this.cursor.text);
            }

            this.cursorText.setOrigin(0.5);
            this.cursorText.setColor(this.cursor.color);
            this.cursorText.setFontFamily(this.cursor.fontFamily);
            this.cursorText.setFontSize(this.cursor.fontSize);
        }

        if (this.cursor.type === 'image')
        {
            if (!this.cursorImage)
            {
                /**
                 * Menu Cursor Image Object
                 * @type {Phaser.GameObjects.Image}
                 * @private
                 */
                this.cursorImage = this.scene.add.image(0, 0, this.cursor.image);
            }

            this.cursorImage.setScale(this.cursor.scale);
        }
    }

    /**
     * Initially create and show the Menu's elements
     */
    create ()
    {
        this._showTitle();

        let titleHeight = (this.title.type === 'text') ? (this.titleText.height) : (this.titleImage.height * this.title.scale);

        let y = titleHeight / 2 + this.title.y + this.title.offsetBottom;

        this._showElements(this.title.x, y);
        this._showCursor();

        if (this.countOptions() > 0) this.select(0);
    }

    bindInput (input)
    {
        input.on('down', key =>
        {
            if (this.sounds.select && ['down', 'up', 'confirm'].includes(key)) this.sounds.select.play();

            if (key === 'down') this.selectDown();
            if (key === 'up') this.selectUp();
            if (key === 'confirm') this.enter();
        });
    }
};

/**
 * Object that represent an Option in a Menu
 */
export class MenuOption
{
    /**
     * Create a named MenuOption
     *
     * @param {string} name Name of the Option (also shown text)
     * @param {object} [settings={}] Settings of the Option
     */
    constructor (name, settings = {})
    {
        /**
         * Name of the Option
         * @type {string}
         * @private
         */
        this.name = name;

        /**
         * Option X position
         * @type {number}
         * @private
         */
        this.x = 0;

        /**
         * Option Y position
         * @type {number}
         * @private
         */
        this.y = 0;

        /**
         * Option base settings
         * @type {object}
         * @private
         */
        this.settings = settings;
    }

    /**
     * Define major object settings
     *
     * @param {object} settings Object settings
     * @param {object} global Global settings to merge
     */
    define (settings = {}, global = {})
    {
        let offset = settings['offset'] || global['offset'] || {};

        /**
         * Option text color
         * @type {string}
         * @public
         */
        this.color = settings['color'] || global['color'] || 'white';

        /**
         * Option text font family
         * @type {string}
         * @public
         */
        this.fontFamily = settings['fontFamily'] || global['fontFamily'] || 'Courier';

        /**
         * Option text font size
         * @type {number}
         * @public
         */
        this.fontSize = settings['fontSize'] || global['fontSize'] || 12;

        /**
         * Option text offset
         * @type {object}
         * @public
         */
        this.offset = parseOffset(offset);

        this.y += this.offset.top;

        /**
         * Option select function
         * @type {function}
         * @private
         */
        this.fn_select = settings['select'] || global['select'] || undefined;

        /**
         * Option enter function
         * @type {function}
         * @private
         */
        this.fn_enter = settings['enter'] || global['enter'] || undefined;
    }

    /**
     * Get the height of the graphical Option
     *
     * @return {number} Height of the Object
     */
    getHeight ()
    {
        return this.optionText.height;
    }

    /**
     * Execute the select function of the Option
     *
     * @return  {mixed} Select function's return
     */
    select ()
    {
        if (this.fn_select && typeof this.fn_select === 'function') return this.fn_select(this);
    }

    /**
     * Execute the enter function of the Option
     *
     * @return  {mixed} Enter function's return
     */
    enter ()
    {
        if (this.fn_enter && typeof this.fn_enter === 'function') return this.fn_enter(this);
    }

    /**
     * Show the Option
     *
     * @param {Phaser.Scene} scene Scene in which the Option will be showed
     * @param {number} x X base position
     * @param {number} y Y base position
     * @param {object} [settings={}] Global settings to merge
     */
    show (scene, x, y, settings = {})
    {
        this.x = x;
        this.y = y;

        this.define(this.settings, settings);

        /**
         * Option Text Object
         * @type {Phaser.GameObjects.Text} Option Text
         * @private
         */
        this.optionText = scene.add.text(this.x, this.y, this.name);

        this.optionText.setOrigin(0.5);
        this.optionText.setColor(this.color);
        this.optionText.setFontFamily(this.fontFamily);
        this.optionText.setFontSize(this.fontSize);

        this.y += this.optionText.height / 2;
        this.optionText.setPosition(this.x, this.y);
    }
};

/**
 * Object that represent a Separator in a Menu
 */
export class MenuSeparator
{
    /**
     * Create a MenuSeparator
     *
     * @param {object} [settings={}] Settings of the separator
     */
    constructor (settings = {})
    {
        /**
         * Separator Type
         * @type {string}
         * @private
         */
        this.type = 'bar';

        if (settings['image'] || (settings['type'] && settings['type'].toLowerCase() === 'image')) this.type = 'image';
        else if (settings['text'] || (settings['type'] && settings['type'].toLowerCase() === 'text')) this.type = 'text';

        /**
         * Separator base settings
         * @type {object}
         * @private
         */
        this.settings = settings;
    }

    /**
     * Define major object settings
     *
     * @param {object} settings Object settings
     * @param {object} global Global settings to merge
     */
    define (settings = {}, global = {})
    {
        let offset = settings['offset'] || global['offset'] || {};

        if (this.type === 'bar')
        {
            /**
             * Separator Bar Width
             * @type {number}
             * @public
             */
            this.width = settings['width'] || global['width'] || 100;

            /**
             * Separator Bar Height
             * @type {number}
             * @public
             */
            this.height = settings['height'] || global['height'] || 1;

            /**
             * Separator Bar Color
             * @type {number}
             * @public
             */
            this.color = settings['color'] || global['color'] || 0xffffff;

            /**
             * Separator Bar Alpha
             * @type {number}
             * @public
             */
            this.alpha = settings['alpha'] || global['alpha'] || 1;
        }

        if (this.type === 'text')
        {
            /**
             * Separator Text Content
             * @type {string}
             * @public
             */
            this.text = settings['text'] || global['text'] || '-----------';

            /**
             * Separator Text Color
             * @type {string}
             * @public
             */
            this.color = settings['color'] || global['color'] || 'white';

            /**
             * Separator Text font family
             * @type {string}
             * @public
             */
            this.fontFamily = settings['fontFamily'] || global['fontFamily'] || 'Courier';

            /**
             * Separator Text font size
             * @type {number}
             * @public
             */
            this.fontSize = settings['fontSize'] || global['fontSize'] || 10;
        }

        if (this.type === 'image')
        {
            /**
             * Separator Image
             * @type {string}
             * @public
             */
            this.image = settings['image'] || global['image'] || 'divider';

            /**
             * Separator Image Scale
             * @type {number}
             * @public
             */
            this.scale = settings['scale'] || global['scale'] || 1;
        }

        /**
         * Separator Object Offset
         * @type {object}
         * @public
         */
        this.offset = parseOffset(offset);
    }

    /**
     * Get the height of the graphical Separator
     *
     * @return {number} Height of the Object
     */
    getHeight ()
    {
        if (this.type === 'bar') return this.height;
        if (this.type === 'image') return this.separatorImage.height * this.scale;
        if (this.type === 'text') return this.separatorText.height;

        return 0;
    }

    /**
     * Show the Separator Bar
     *
     * @param {Phaser.Scene} scene Phaser Scene
     * @param {number} x X position
     * @param {number} y Y position
     */
    _showBar (scene, x, y)
    {
        /**
         * Separator Bar Object
         * @type {Phaser.GameObjects.Graphics}
         * @private
         */
        this.bar = scene.add.graphics();

        this.bar.fillStyle(this.color, this.alpha);
        this.bar.fillRect(x - this.width / 2, y - this.height, this.width, this.height);
    }

    /**
     * Show the Separator Image
     *
     * @param {Phaser.Scene} scene Phaser Scene
     * @param {number} x X position
     * @param {number} y Y position
     */
    _showImage (scene, x, y)
    {
        /**
         * Separator Image Object
         * @type {Phaser.GameObjects.Image}
         * @private
         */
        this.separatorImage = scene.add.image(x, y, this.image);

        this.separatorImage.setOrigin(0.5);
        this.separatorImage.setScale(this.scale);

        y += this.separatorImage.height * this.scale / 2;
        this.separatorImage.setPosition(x, y);
    }

    /**
     * Show the Separator Text
     *
     * @param {Phaser.Scene} scene Phaser Scene
     * @param {number} x X position
     * @param {number} y Y position
     */
    _showText (scene, x, y)
    {
        /**
         * Separator Text Object
         * @type {Phaser.GameObjects.Text}
         * @private
         */
        this.separatorText = scene.add.text(x, y, this.text);

        this.separatorText.setOrigin(0.5, 0);
        this.separatorText.setColor(this.color);
        this.separatorText.setFontFamily(this.fontFamily);
        this.separatorText.setFontSize(this.fontSize);

        y += this.separatorText.height / 2;

        this.separatorText.setPosition(x, y);
    }

    /**
     * Show the Separator
     *
     * @param {Phaser.Scene} scene Scene in which the Separator will be showed
     * @param {number} x X base position
     * @param {number} y Y base position
     * @param {object} settings Global settings to merge
     */
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
