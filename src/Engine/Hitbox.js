import Phaser from 'phaser';

export class Hitbox
{
    constructor (settings)
    {
        this.label = settings['label'] || 'none';
        this.type = settings['type'] || 'hitbox';
        this.start = settings['start'] || 0;
        this.end = settings['end'];
        this.x = settings['x'] || 0;
        this.y = settings['y'] || 0;
        this.anchor = settings['anchor'] || { x: 0, y: 0 };
        this.width = settings['width'] || 1;
        this.height = settings['height'] || 1;
        this.right = this.anchor.x + this.x + this.width;
        this.left = this.anchor.x + this.x;
        this.top = this.anchor.y + this.y;
        this.bottom = this.anchor.y + this.y + this.height;
        this.flipped = settings['flipped'] || false;
    }

    flip (player)
    {
        this.x = player.displayWidth - this.x - this.width;
        this.flipped = !this.flipped;
    };

    setX (x)
    {
        this.anchor.x = x;
        this.right = this.anchor.x + this.x + this.width;
        this.left = this.anchor.x + this.x;
    };

    setY (y)
    {
        this.anchor.y = y;
        this.top = this.anchor.y + this.y;
        this.bottom = this.anchor.y + this.y + this.height;
    };

    setXY (x, y)
    {
        this.setX(x);
        this.setY(y);
    };
};

export function approxeq (v1, v2, epsilon)
{
    if (epsilon == null)
    {
        epsilon = 2;
    }
    return Math.abs(v1 - v2) < epsilon;
}

export function getHitboxes (jsonFile, name)
{
    let hitbox = {};

    for (let i in jsonFile[name])
    {
        hitbox[i] = [];
        for (let j in jsonFile[name][i])
        {
            if (i !== 'active')
            {
                hitbox[i].push(new Hitbox({
                    'label': jsonFile[name][i][j].label,
                    'x': jsonFile[name][i][j].x,
                    'y': jsonFile[name][i][j].y,
                    'width': jsonFile[name][i][j].width,
                    'height': jsonFile[name][i][j].height,
                    'type': jsonFile[name][i][j].type,
                    'start': jsonFile[name][i][j].start,
                    'end': jsonFile[name][i][j].end
                }));
            }
            else
            {
                hitbox.active = jsonFile[name].active;
            }
        }
    }

    return hitbox;
}

export function isOver (rectA, rectB)
{
    /** NO CARE TOP/BOTTOM
    if (rectA.left <= rectB.left && rectA.right >= rectB.right) return true;
    else if (rectA.left >= rectB.left && rectA.right <= rectB.right) return true;
    else if (rectA.left >= rectB.left && rectA.left <= rectB.right) return true;
    else if (rectA.left <= rectB.left && rectA.right >= rectB.left) return true;
    */

    return (
        (rectA.right >= rectB.left && rectA.right <= rectB.right && rectA.bottom <= rectB.bottom && rectA.bottom >= rectB.top) ||
        (rectA.right >= rectB.left && rectA.right <= rectB.right && rectA.top >= rectB.top && rectA.top <= rectB.bottom) ||
        (rectA.left <= rectB.right && rectA.left >= rectB.left && rectA.bottom <= rectB.bottom && rectA.bottom >= rectB.top) ||
        (rectA.left <= rectB.right && rectA.left >= rectB.left && rectA.top >= rectB.top && rectA.top <= rectB.bottom) ||
        (rectB.right >= rectA.left && rectB.right <= rectA.right && rectB.bottom <= rectA.bottom && rectB.bottom >= rectA.top) ||
        (rectB.right >= rectA.left && rectB.right <= rectA.right && rectB.top >= rectA.top && rectB.top <= rectA.bottom) ||
        (rectB.left <= rectA.right && rectB.left >= rectA.left && rectB.bottom <= rectA.bottom && rectB.bottom >= rectA.top) ||
        (rectB.left <= rectA.right && rectB.left >= rectA.left && rectB.top >= rectA.top && rectB.top <= rectA.bottom)
    );
}

export function doesHit (player1, player2)
{
    for (let hitbox in player1.hitboxes[player1.hitboxes.active])
    {
        if (player1.hitboxes[player1.hitboxes.active][hitbox].type === 'hurtbox')
        {
            for (let hitbox2 in player2.hitboxes[player2.hitboxes.active])
            {
                if (player2.hitboxes[player2.hitboxes.active][hitbox2].type === 'hitbox' && isOver(player1.hitboxes[player1.hitboxes.active][hitbox], player2.hitboxes[player2.hitboxes.active][hitbox2]))
                {
                    return 1;
                }
            }
        }
    }
}

export function doesTouch (player1, zone1, player2, zone2)
{
    for (let hitbox in player1.hitboxes[player1.hitboxes.active])
    {
        if (player1.hitboxes[player1.hitboxes.active][hitbox].type === 'hitbox')
        {
            for (let hitbox2 in player2.hitboxes[player2.hitboxes.active])
            {
                if (player2.hitboxes[player2.hitboxes.active][hitbox2].type === 'hitbox' && approxeq(player1.hitboxes[player1.hitboxes.active][hitbox][zone1], player2.hitboxes[player2.hitboxes.active][hitbox][zone2]))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

export function renderHitboxes (graphics, players)
{
    graphics.clear();
    graphics.fillStyle(Phaser.Display.Color.GetColor32(255, 255, 0, 0.5), 0.3);

    for (let i = 0; i < players.length; i++)
    {
        let hitboxes = players[i].hitboxes[players[i].hitboxes.active];
        for (let hitbox in hitboxes)
        {
            if (players[i].anims.currentFrame && players[i].anims.currentFrame.index && hitboxes[hitbox].start <= players[i].anims.currentFrame.index && hitboxes[hitbox].end >= players[i].anims.currentFrame.index)
            {
                if (hitboxes[hitbox].type === 'hitbox')
                {
                    graphics.fillStyle(Phaser.Display.Color.GetColor32(0, 0, 255, 0.5), 0.3);
                }
                else
                {
                    graphics.fillStyle(Phaser.Display.Color.GetColor32(255, 0, 0, 0.5), 0.3);
                }
                graphics.fillRect(hitboxes[hitbox].anchor.x + hitboxes[hitbox].x,
                    hitboxes[hitbox].anchor.y + hitboxes[hitbox].y,
                    hitboxes[hitbox].width,
                    hitboxes[hitbox].height
                );
            }
        }
    }
}

export function updateHitboxes (player)
{
    for (let name in player.hitboxes)
    {
        if (player.hitboxes[name] !== player.hitboxes.active)
        {
            for (let hitbox in player.hitboxes[name])
            {
                player.hitboxes[name][hitbox].setXY(player.x, player.y);
                if (
                    (!player.reverseFlipX && player.flipX !== player.hitboxes[name][hitbox].flipped) ||
                    (player.reverseFlipX && player.flipX === player.hitboxes[name][hitbox].flipped)
                )
                {
                    player.hitboxes[name][hitbox].flip(player);
                }
            }
        }
    }
}
