export function menuButtons (controller)
{
    return {
        up: [ controller.up ],
        down: [ controller.down ],
        enter: [ controller.A, controller.right, controller.start ]
    };
};

export const actionsDefault = {
    attacks: [ false, false, false ],
    axes: [ 0, 0 ]
};

export function actions (pad)
{
    if (!pad) return actionsDefault;

    return {
        attacks: [
            pad.X,
            pad.Y,
            pad.B ],
        axes: [ pad.axes[0].getValue(), pad.axes[1].getValue() ]
    };
}
