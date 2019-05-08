import IceCube from './IceCube';
import { isOver } from '../../Engine/Hitbox';

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

    update (player, enemies = [])
    {
        this.time += 10;
        this.hitbox.setXY(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2);

        if (isOver(this.hitbox, player.hitboxes[player.hitboxes.active][0]))
        {
            if (this.time - this.lastHit > 500 || this.lastHit === -1)
            {
                player.looseHp(30);
                this.lastHit = this.time;
            }

            if (player.dashing) this.destroy();
        }
    }
}
