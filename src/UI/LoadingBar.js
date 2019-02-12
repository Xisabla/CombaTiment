export default class LoadingBar
{
    /**
     * Create a LoadingBar
     *
     * @param {Phaser.Scene} scene Scene in which the loading bar will be created
     * @param {Object} settings Settings of the LoadingBar
     */
    constructor (scene, settings)
    {
        this.scene = scene;
        this.x = settings['x'] || scene.cameras.main.width / 2;
        this.y = settings['y'] || scene.cameras.main.height / 2;

        this.showPercent = settings['percent'] || true;
        this.showLoadingText = settings['loadingText'] || true;
        this.showMessageText = settings['messageText'] || true;
        this.messagePrefix = settings['messagePrefix'] || false;

        if (settings['bind']) this.bindSceneLoader(scene.load);
    }

    /**
     * Bind the LoadingBar to a Phaser LoaderPlugin
     *
     * @param {Phaser.Loader.LoaderPlugin} loader Phaser Scene Loader
     *
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
        this.bar = this.scene.add.graphics();
        this.box = this.scene.add.graphics();
        this.box.fillStyle(0x222222, 0.8);
        this.box.fillRect(240, 270, 320, 50);

        if (this.showLoadingText) this.loadingText = this.scene.add.text(this.x, this.y - 50, 'Loading...').setOrigin(0.5, 0.5);
        if (this.showPercent) this.percentText = this.scene.add.text(this.x, this.y - 5).setOrigin(0.5, 0.5);
        if (this.showMessageText) this.messageText = this.scene.add.text(this.x, this.y + 50).setOrigin(0.5, 0.5);

        return this;
    }

    /**
     * Update the percentage and progression of the bar
     *
     * @param {Number} value Percentage of progression (between 0 and 1)
     *
     * @return  {LoadingBar}
     */
    update (value)
    {
        this.bar.clear();
        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(250, 280, 300 * value, 30);

        if (this.showPercent) this.percentText.setText(parseInt(value * 100) + '%');

        return this;
    }

    /**
     * Update the message of the bar
     *
     * @param {mixed} value Message to show
     *
     * @return  {LoadingBar}
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
