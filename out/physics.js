// m/s^2
export var GRAVITY = 9.81;
export function getMovement(speed, seconds) {
    return speed * seconds;
}
export function getSpeed(acceleration, seconds) {
    return acceleration * seconds;
}
export function getAcceleration(impulse, seconds) {
    return impulse * seconds;
}
