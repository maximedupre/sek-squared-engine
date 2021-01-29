export function mrua(
    initialPoint: number,
    speed: number,
    acceleration: number,
    sensitivity: number,
) {
    return (
        initialPoint +
        speed * sensitivity +
        0.5 * (acceleration * Math.pow(sensitivity, 2))
    );
}
