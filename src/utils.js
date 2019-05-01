import Bulb from './Sprites/Bulb';
import Fridge from './Sprites/Fridge';
import Radiator from './Sprites/Radioator';

export const enemiesObjects = {
    'bulb': Bulb,
    'fridge': Fridge,
    'radiator': Radiator
};

export const enemiesAssets = {
    'bulb': 'enemies/bulb/walking',
    'fridge': 'enemies/fridge',
    'radiator': 'enemies/radiator'
};

export function enemiesOfLevel (levelJson)
{
    let enemies = [];
    const waves = levelJson.waves;

    waves.forEach(wave =>
    {
        enemies = [...enemies, ...wave.enemies];
    });

    enemies = enemies.filter((enemy, id) => enemies.indexOf(enemy) === id);

    return enemies;
}

export function ennemiesToAssets (enemies)
{
    let assets = [];

    enemies.forEach(enemy => assets.push(enemiesAssets[enemy]));

    return assets;
}

export function levelEnemiesAssets (levelJson)
{
    return ennemiesToAssets(enemiesOfLevel(levelJson));
}
