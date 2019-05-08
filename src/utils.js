import Bulb from './Sprites/Enemies/Bulb';
import BossFridge from './Sprites/Enemies/BossFridge';
import Radiator from './Sprites/Enemies/Radioator';
import Virus from './Sprites/Enemies/Virus';

export const enemiesText = {
    'bossFridge': 'Frigo\n mal concu',
    'bulb': 'Ampoule\ngourmande',
    'radiator': 'Radiateur\ndisfonctionnel',
    'virus': 'Virus'
};

export const enemiesObjects = {
    'bossFridge': BossFridge,
    'bulb': Bulb,
    'radiator': Radiator,
    'virus': Virus
};

export const enemiesAssets = {
    'bossFridge': 'enemies/bossFridge',
    'bulb': 'enemies/bulb/walking',
    'radiator': 'enemies/radiator',
    'virus': 'enemies/virus'
};

export function enemiesOfLevel (levelJson)
{
    let enemies = [];
    const waves = levelJson.waves;

    waves.forEach(wave =>
    {
        enemies = [...enemies, ...wave.enemies];
    });

    enemies.push(levelJson.boss);
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
