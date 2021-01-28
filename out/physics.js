export function mrua(initialPoint, speed, acceleration, cumulSecs) {
    return initialPoint + speed + 0.5 * acceleration * Math.pow(cumulSecs, 2);
}
