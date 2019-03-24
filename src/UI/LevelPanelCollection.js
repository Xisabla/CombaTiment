import LevelPanel from './LevelPanel';
import { actions } from '../config/gamepad/buttons';

export default class LevelPanelCollection
{
    constructor (scene, settings = {}, panels = [])
    {
        this.scene = scene;

        this.x = settings['x'] || scene.cameras.main.width / 10;
        this.y = settings['y'] || 0;
        this.height = settings['height'] || scene.cameras.main.height / 2;
        this.offset = settings['offset'] || 0;
        this.panels = [];
        this.lastBounced = -1;
        this.selected = -1;

        panels.forEach(panel => this.add(panel));
    }

    add (panel)
    {
        if (panel instanceof LevelPanel)
        {
            this.panels.push(panel);
        }
        else
        {
            if (!panel['x']) panel.x = this.x;
            if (!panel['y']) panel.y = this.y;
            if (!panel['height']) panel.height = this.height;

            this.panels.push(new LevelPanel(this.scene, panel));
        }
    }

    unselect (selector)
    {
        if (typeof selector === 'number') this.panels[selector].unselect();
        else if (selector === '*' || selector.toLowerCase() === 'all') this.panels.forEach(panel => panel.unselect());
        else selector.forEach(id => this.unselect(id));
    }

    select (id)
    {
        this.unselect('*');

        this.panels[id].select();
        this.selected = id;
    }

    checkActions (character, { keys, pad })
    {
        this.panels.forEach((panel, id) =>
        {
            if (this.lastBounced !== id && panel.isCharacterIn(character))
            {
                panel.bounce();
                this.lastBounced = id;
            }

            if (keys.select.isDown || actions(pad).attacks[0])
            {
                if (panel.isCharacterIn(character))
                {
                    this.select(id);
                }
            }
        });
    }

    fit ()
    {
        let n = this.panels.length;
        let totalOffset = (n + 1) * this.offset;

        let width = (this.scene.cameras.main.width - totalOffset) / n;
        let x = this.offset;

        this.panels.forEach(panel =>
        {
            panel.baseX = x;
            panel.x = x;
            panel.width = width;

            x += width + this.offset;
        });
    }

    show (fit = true, bounce)
    {
        if (fit) this.fit();

        if (bounce)
        {
            let dt = bounce;
            let time = 0;

            this.panels.forEach(panel =>
            {
                setTimeout(() =>
                {
                    panel.show();
                    panel.bounce(dt / 100, dt * 1.5, dt / 50);
                }, time);

                time += dt;
            });
        }
        else
        {
            this.panels.forEach(panel =>
            {
                panel.show();
            });
        }
    }
}
