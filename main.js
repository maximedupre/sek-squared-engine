const INITIAL_POINTS = [
    [0, 0, 0],
    [0, 100, 0],
    [100, 100, 0],
    [100, 0, 0],
    [0, 0, 0],
];

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, INITIAL_POINTS);

    document.querySelector('input').addEventListener('input', (e) => {
        const degrees = e.target.value;
        const radians = degreesToRadians(degrees);
        const points = [];

        for (let point of INITIAL_POINTS) {
            const realX = point[0] - 50;
            const realY = point[1] - 50;
            const realZ = point[2];

            const x = realX * 1 + realY * 0 + realZ * 0;
            const y =
                realX * 0 +
                realY * Math.cos(radians) +
                realZ * -Math.sin(radians);
            const z =
                realX * 0 +
                realY * Math.sin(radians) +
                realZ * Math.cos(radians);

            points.push([x + 50, y + 50, z]);
        }

        draw(canvas, points);
    });
});

function draw(canvas, points) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let point of points) {
        ctx.lineTo(point[0], point[1]);
    }

    ctx.stroke();
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
