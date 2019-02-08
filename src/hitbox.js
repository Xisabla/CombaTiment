var Hitbox = function(settings)
{
	this.label = settings['label'] || 'none';
	this.type = settings['type'] || 'hurtbox';
	this.x = settings['x'] || 0;
	this.y = settings['y'] || 0;
	this.anchor = settings['anchor'] || {x: 0, y: 0};
	this.width = settings['width'] || 1;
	this.height = settings['height'] || 1;
	this.right = this.anchor.x + this.x + this.width;
	this.left = this.anchor.x + this.x;
	this.top = this.anchor.y + this.y;
	this.bottom = this.anchor.y + this.y + this.height;
	this.setX = function(x){
		this.anchor.x = x;
		this.right = this.anchor.x + this.x + this.width;
		this.left = this.anchor.x + this.x;
	};
	this.setY = function(y){
		this.anchor.y = y;
		this.top = this.anchor.y + this.y;
		this.bottom = this.anchor.y + this.y + this.height;
	};
	this.setXY = function(x, y){
		this.setX(x);
		this.setY(y);
	};
};

function approxeq(v1, v2, epsilon) {
    if (epsilon == null) {
      epsilon = 2;
    }
    return Math.abs(v1 - v2) < epsilon;
}

function getHitboxes(jsonFile, name)
{
    var hitbox = {};
    for(i in jsonFile[name])
    {
        hitbox[i] = [];
        for(j in jsonFile[name][i])
        {
            if(i !== "active")
            {
                hitbox[i].push(new Hitbox({
                    "label" : jsonFile[name][i][j].label,
                    "x" : jsonFile[name][i][j].x,
                    "y" : jsonFile[name][i][j].y,
                    "width" : jsonFile[name][i][j].width,
                    "height" : jsonFile[name][i][j].height,
					"type" : jsonFile[name][i][j].type
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

function isOver(rectA, rectB)
{
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

function doesHit(player1, player2)
{
	for(hitbox in player1.hitboxes[player1.hitboxes.active])
	{
		if(player1.hitboxes[player1.hitboxes.active][hitbox].type === 'hurtbox')
		{
			for(hitbox2 in player2.hitboxes[player2.hitboxes.active])
			{
				if(player2.hitboxes[player2.hitboxes.active][hitbox2].type === 'hitbox' && isOver(player1.hitboxes[player1.hitboxes.active][hitbox], player2.hitboxes[player2.hitboxes.active][hitbox2]))
				{
                    return 1;
				}
			}
		}
	}
}


function doesTouch(player1, zone1, player2, zone2)
{
	for(hitbox in player1.hitboxes[player1.hitboxes.active])
	{
		if(player1.hitboxes[player1.hitboxes.active][hitbox].type === 'hitbox')
		{
			for(hitbox2 in player2.hitboxes[player2.hitboxes.active])
			{
				if(player2.hitboxes[player2.hitboxes.active][hitbox2].type === 'hitbox' && approxeq(player1.hitboxes[player1.hitboxes.active][hitbox][zone1], player2.hitboxes[player2.hitboxes.active][hitbox][zone2]))
				{
					return true;
				}
			}
		}
	}
    return false;
}

function renderHitboxes(graphics, hitboxes)
{
	graphics.clear();
	graphics.fillStyle(Phaser.Display.Color.GetColor32(255, 255, 0, 0.5), 0.3);  
	
	for(var i = 0; i < 2; i++)
	{
		for(hitbox in hitboxes[i])
		{
			if(hitboxes[i][hitbox].type === 'hitbox')
			{
				graphics.fillStyle(Phaser.Display.Color.GetColor32(0, 0, 255, 0.5), 0.3); 
			}
			else
			{
				graphics.fillStyle(Phaser.Display.Color.GetColor32(255, 0, 0, 0.5), 0.3); 
			}
			graphics.fillRect(hitboxes[i][hitbox].anchor.x + hitboxes[i][hitbox].x, 
				hitboxes[i][hitbox].anchor.y + hitboxes[i][hitbox].y, 
				hitboxes[i][hitbox].width,
				hitboxes[i][hitbox].height
			);	
		}
	}
}

function updateHitboxes(player)
{
	for(name in player.hitboxes)
	{
		if(player.hitboxes[name] !== player.hitboxes.active)
		{
			for(hitbox in player.hitboxes[name])
			{
				player.hitboxes[name][hitbox].setXY(player.x, player.y);
				//console.log(player.hitboxes[name][hitbox].anchor);
			}		
		}
	}
}