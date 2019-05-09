import Bulb from './Sprites/Enemies/Bulb';
import BossFridge from './Sprites/Enemies/BossFridge';
import Radiator from './Sprites/Enemies/Radioator';
import Virus from './Sprites/Enemies/Virus';
import WashMachine from './Sprites/Enemies/WashMachine';

// Enemies ------------

export const enemiesText = {
    'asbestos': 'Amiante',
    'barrel': 'Barril de\npetrole',
    'bossFridge': 'Frigo\n mal concu',
    'bulb': 'Ampoule\ngourmande',
    'camera': 'Camera',
    'clickbait': 'Clickbait',
    'concretemixer': 'Betonneuse',
    'radiator': 'Radiateur\ndisfonctionnel',
    'trojan': 'Cheval de\nTroie',
    'uranium': 'Barre\nd\'uranium',
    'washmachine': 'Machine\na laver',
    'virus': 'Virus'
};

export const enemiesObjects = {
    'bossFridge': BossFridge,
    'bulb': Bulb,
    'radiator': Radiator,
    'washmachine': WashMachine,
    'virus': Virus
};

export const enemiesAssets = {
    'asbestos': 'enemies/asbestos',
    'barrel': 'enemies/barrel',
    'bossFridge': 'enemies/bossFridge',
    'bulb': 'enemies/bulb/walking',
    'camera': 'enemies/camera',
    'clickbait': 'enemies/clickbait',
    'concretemixer': 'enemies/concretemixer',
    'radiator': 'enemies/radiator',
    'bossTrojan': 'enemies/bossTrojan',
    'uranium': 'enemies/uranium',
    'washmachine': 'enemies/washmachine',
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

// Score ------------

export function scoreTime (time)
{
    let score = Math.floor((-41 - 2 / 3) * time + 15000);

    return (score < 0) ? 0 : score;
}

export function scoreCombo (maxCombo)
{
    return 500 * maxCombo;
}

export function totalScore (time, maxCombo)
{
    return scoreTime(time) + scoreCombo(maxCombo);
}

// Promises ------------

export function wait (time = 1000)
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(() =>
        {
            resolve();
        }, time);
    });
}

export function repeat (tickTime, nbTicks, cb)
{
    return new Promise((resolve, reject) =>
    {
        let ticks = 0;

        let timer = setInterval(() =>
        {
            // Callback(currentTick, progression)
            cb(ticks, ticks / nbTicks);

            ticks++;
            if (ticks >= nbTicks)
            {
                clearInterval(timer);
                return resolve();
            }
        }, tickTime);
    });
}
