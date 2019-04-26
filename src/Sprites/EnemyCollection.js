import { isOver } from '../Engine/Hitbox';

export default class EnemyCollection extends Array
{
    constructor (limit = 10, ...items)
    {
        super(...items);

        // TODO: Make this useful if we get the time
        this.limit = limit;
    }

    spawn (Enemy, scene, x, y, ground)
    {
        this.push(new Enemy(scene, x, y, ground));
    }

    spawnAll (enemies = [], delay = 100)
    {
        let t = 0;

        enemies.forEach(enemy =>
        {
            let { type, scene, x, y, ground } = enemy;

            setTimeout(() =>
            {
                this.spawn(type, scene, x, y, ground);
            }, t);

            t += delay;
        });
    }

    getOver (hitbox)
    {
        let enemies = new EnemyCollection(Infinity);

        this.forEach(enemy =>
        {
            if (isOver(hitbox, enemy.hitboxes[enemy.hitboxes.active][0])) enemies.push(enemy);
        });

        return enemies;
    }

    looseHp (damage)
    {
        let done = 0;

        this.forEach(enemy =>
        {
            if (done < 2)
            {
                enemy.looseHp(damage);
                enemy.update();

                done++;
            }
        });
    }

    update (time, player)
    {
        this.forEach((enemy, index) =>
        {
            if (enemy.alive)
            {
                enemy.update(time, player, this);
            }
            else
            {
                this.splice(index, 1);
            }
        });
    }

    get export ()
    {
        let enemies = [];

        this.forEach(enemy =>
        {
            enemies.push(enemy);
        });

        return enemies;
    }
};
