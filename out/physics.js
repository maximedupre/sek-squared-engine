export function mrua(initialPoint, speed, acceleration, sensitivity) {
    return (initialPoint +
        speed * sensitivity +
        0.5 * (acceleration * Math.pow(sensitivity, 2)));
}
