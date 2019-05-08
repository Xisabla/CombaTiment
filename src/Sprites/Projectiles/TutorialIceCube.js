import IceCube from './IceCube';

export default class TutorialIceCube extends IceCube
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 0, 0);

        this.text = scene.add.text(x, y - 180, 'Dash !')
            .setOrigin(0.5)
            .setAlign('center')
            .setFontSize(32)
            .setFontFamily('Pixel');
    }

    destroy ()
    {
        this.text.destroy();
        super.destroy();
    }
}
