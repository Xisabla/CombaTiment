/**
 * Object to create and manage a loading bar
 */
export default class LoadingBar
{
    /**
     * Create a LoadingBar
     *
     * @param {Phaser.Scene} scene Scene in which the LoadingBar will be created
     * @param {Object} [settings={}] Settings of the LoadingBar
     */
    constructor (scene, settings = {})
    {
        /**
         * Phaser Scene
         * @type {Phaser.Scene}
         * @private
         */
        this.scene = scene;

        /**
         * LoadingBar x position
         * @type {number}
         * @public
         */
        this.x = settings['x'] || scene.cameras.main.width / 2;

        /**
         * LoadingBar y position
         * @type {number}
         * @public
         */
        this.y = settings['y'] || scene.cameras.main.height / 2;

        /**
         * LoadingBar width
         * @type {number}
         * @public
         */
        this.width = settings['width'] || 300;

        /**
         * LoadingBar height
         * @type {number}
         * @public
         */
        this.height = settings['height'] || 50;

        /**
         * Offset between bar and box
         * @type {number}
         * @public
         */
        this.offsetBox = settings['offsetBox'] || 10;

        /**
         * Offset on top of the LoadingBar bewteen the bar and the loading text
         * @type {number}
         * @public
         */
        this.offsetTop = settings['offsetTop'] || 25;

        /**
         * Offset on the bottom of the LoadingBar bewteen the bar and the message text
         * @type {number}
         * @public
         */
        this.offsetBottom = settings['offsetBottom'] || 30;

        /**
         * Color of the Box containing the Bar
         * @type {number}
         * @public
         */
        this.boxColor = settings['boxColor'] || 0x222222;

        /**
         * Alpha color value
         * @type {number}
         * @public
         */
        this.boxAlpha = settings['boxAlpha'] || 0.8;

        /**
         * Color if the Bar
         * @type {number}
         * @public
         */
        this.barColor = settings['barColor'] || 0xffffff;

        /**
         * Alpha color value
         * @type {number}
         * @public
         */
        this.barAlpha = settings['barAlpha'] || 1;

        /**
         * Define if the current percentage is shown or not
         * @type {boolean}
         * @public
         */
        this.showPercent = settings['percent'] || true;

        /**
         * Define if the LoadingText is shown or not
         * @type {boolean}
         * @public
         */
        this.showLoadingText = settings['loadingText'] || true;

        /**
         * Define if the MessageText is shown or not
         * @type {boolean}
         * @public
         */
        this.showMessageText = settings['messageText'] || true;

        /**
         * Facultative MessageText prefix
         * @type {string|boolean}
         * @public
         */
        this.messagePrefix = settings['messagePrefix'] || false;

        /**
         * Color of the percentage' text
         * @type {string}
         * @public
         */
        this.percentColor = settings['percentColor'] || 'white';

        /**
         * Color of the LoadingText
         * @type {string}
         * @public
         */
        this.loadingColor = settings['loadingColor'] || 'white';

        /**
         * Color of the MessageText
         * @type {string}
         * @public
         */
        this.messageColor = settings['messageColor'] || 'white';

        if (settings['bind']) this.bindSceneLoader(scene.load);
    }

    /**
     * Bind the LoadingBar to a Phaser LoaderPlugin
     *
     * @param {Phaser.Loader.LoaderPlugin} loader Phaser Scene Loader
     * @public
     * @return {LoadingBar}
     */
    bindSceneLoader (loader)
    {
        this.create();

        loader.on('progress', (value) =>
        {
            this.update(value);
        });

        loader.on('fileprogress', (file) =>
        {
            this.updateMessage(file.key);
        });

        loader.on('complete', () =>
        {
            this.destroy();
        });

        return this;
    }

    /**
     * Create the LoadingBar graphics and texts in the scene
     *
     * @return {LoadingBar}
     */
    create ()
    {
        /**
         * Bar of the LoadingBar
         * @type {Phaser.GameObjects.Graphics}
         * @private
         */
        this.bar = this.scene.add.graphics();

        /**
         * Box containing the Bar
         * @type {Phaser.GameObjects.Graphics}
         * @private
         */
        this.box = this.scene.add.graphics();

        this.box.fillStyle(this.boxColor, this.boxAlpha);
        this.box.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        if (this.showLoadingText)
        {
            /**
             * Loading text
             * @type {Phaser.GameObjects.Text}
             * @private
             */
            this.loadingText = this.scene.add.text(this.x, this.y - this.height / 2 - this.offsetTop, 'Loading...');

            this.loadingText.setColor(this.loadingColor);
            this.loadingText.setOrigin(0.5, 0.5);
        }

        if (this.showPercent)
        {
            /**
             * Current percentage text
             * @type {Phaser.GameObjects.Text}
             * @private
             */
            this.percentText = this.scene.add.text(this.x, this.y);

            this.percentText.setColor(this.percentColor);
            this.percentText.setOrigin(0.5, 0.5);
        }

        if (this.showMessageText)
        {
            /**
             * Message text
             * @type {Phaser.GameObjects.Text}
             * @private
             */
            this.messageText = this.scene.add.text(this.x, this.y + this.height / 2 + this.offsetBottom);

            this.messageText.setColor(this.messageColor);
            this.messageText.setOrigin(0.5, 0.5);
        }
        return this;
    }

    /**
     * Update the percentage and progression of the bar
     *
     * @param {Number} value Percentage of progression (between 0 and 1)
     *
     * @return {LoadingBar}
     */
    update (value)
    {
        let x = this.x - this.width / 2 + this.offsetBox;
        let y = this.y - this.height / 2 + this.offsetBox;
        let width = (this.width - this.offsetBox * 2) * value;
        let height = this.height - this.offsetBox * 2;

        this.bar.clear();
        this.bar.fillStyle(this.barColor, this.barAlpha);
        this.bar.fillRect(x, y, width, height);

        if (this.showPercent) this.percentText.setText(parseInt(value * 100) + '%');

        return this;
    }

    /**
     * Update the message of the bar
     *
     * @param {mixed} value Message to show
     *
     * @return {LoadingBar}
     */
    updateMessage (value)
    {
        if (this.showMessageText)
        {
            if (this.messagePrefix)
            {
                this.messageText.setText(this.messagePrefix + ' ' + value);
            }
            else
            {
                this.messageText.setText(value);
            }
        }

        return this;
    }

    /**
     * Destroy all elements from the scene
     *
     * @return {LoadingBar}
     */
    destroy ()
    {
        this.bar.destroy();
        this.box.destroy();

        if (this.showLoadingText) this.loadingText.destroy();
        if (this.showPercent) this.percentText.destroy();
        if (this.showMessageText) this.messageText.destroy();

        return this;
    }
};
