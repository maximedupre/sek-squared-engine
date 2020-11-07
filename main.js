const INITIAL_FACES = [
    [
        [0, 0, 0],
        [0, 100, 0],
        [100, 100, 0],
        [100, 0, 0],
        [0, 0, 0],
    ],
    [
        [0, 0, 0],
        [0, 0, 100],
        [100, 0, 100],
        [100, 0, 0],
        [0, 0, 0],
    ],
];

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, INITIAL_FACES);

    document.querySelector('input').addEventListener('input', (e) => {
        const degrees = e.target.value;
        const radians = degreesToRadians(degrees);
        const faces = [];

        for (let face of INITIAL_FACES) {
            const points = [];

            for (let point of face) {
                const realX = point[0] - 50;
                const realY = point[1] - 50;
                const realZ = point[2] - 50;

                const x = realX * 1 + realY * 0 + realZ * 0;
                const y =
                    realX * 0 +
                    realY * Math.cos(radians) +
                    realZ * -Math.sin(radians);
                const z =
                    realX * 0 +
                    realY * Math.sin(radians) +
                    realZ * Math.cos(radians);

                points.push([x + 50, y + 50, z + 50]);
            }

            faces.push(points);
        }

        draw(canvas, faces);
    });
});

function draw(canvas, faces) {
    const colors = ['blue', 'red'];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < faces.length; i++) {
        console.log(colors[i]);
        ctx.beginPath();
        ctx.strokeStyle = colors[i];

        for (let point of faces[i]) {
            ctx.lineTo(point[0], point[1]);
        }

        ctx.stroke();
    }
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
