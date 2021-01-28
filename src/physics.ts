export function mrua(
    initialPoint: number,
    speed: number,
    acceleration: number,
    cumulSecs: number,
) {
    return initialPoint + speed + 0.5 * acceleration * Math.pow(cumulSecs, 2);
}
