import Projectile from '../Projectile';

export default class EnergyBall extends Projectile
{
    constructor (player)
    {
        let delta = (player.flipX) ? 100 : (player.displayWidth - 100);

        super(player.scene, player.x + delta, player.y + 110, 'projectiles/energyball', {
            baseVelocityX: 500,
            flipped: player.flipX
        });

        this.graphics = this.scene.add.graphics();
    }

    update (player, enemies = [])
    {
        super.update();

        let kvx = 150;
        let kvy = 50;
        if (this.flipX) kvx *= -1;

        if (enemies.length) enemies.getOver(this.hitbox).looseHp(0.9, kvx, kvy);
    }
}
