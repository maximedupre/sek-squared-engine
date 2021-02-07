// m/s^2
export const GRAVITY = 9.81;

export function getMovement(speed: number, seconds: number) {
    return speed * seconds;
}

export function getSpeed(acceleration: number, seconds: number) {
    return acceleration * seconds;
}

export function getAcceleration(impulse: number, seconds: number) {
    return impulse * seconds;
}
