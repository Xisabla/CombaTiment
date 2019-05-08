import Bulb from './Sprites/Enemies/Bulb';
import Fridge from './Sprites/Enemies/Fridge';
import Radiator from './Sprites/Enemies/Radioator';
import Virus from './Sprites/Enemies/Virus';
import BossFridge from './Sprites/Enemies/BossFridge';

export const enemiesText = {
    'bulb': 'Ampoule\ngourmande',
    'fridge': 'Frigo\n mal concu',
    'radiator': 'Radiateur\ndisfonctionnel',
    'virus': 'Virus'
};

export const enemiesObjects = {
    'bulb': Bulb,
    'fridge': Fridge,
    'radiator': Radiator,
    'virus': Virus,
    'bossFridge': BossFridge
};

export const enemiesAssets = {
    'bulb': 'enemies/bulb/walking',
    'fridge': 'enemies/fridge',
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
