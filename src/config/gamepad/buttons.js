export function menuButtons (controller)
{
    return {
        up: [ controller.up ],
        down: [ controller.down ],
        enter: [ controller.A, controller.right, controller.start ]
    };
};

export function characterActions (pad)
{
    return {
        attacks: [
            pad.A,
            pad.B,
            pad.X,
            pad.Y ],
        axis: [ pad.axis[0], pad.axis[1] ]
    };
}
