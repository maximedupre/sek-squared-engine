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
        { transition: true, point: [0, 100, 100] },
    ],
    [
        [0, 100, 100],
        [0, 0, 100],
        [100, 0, 100],
        [100, 100, 100],
        [0, 100, 100],
    ],
    [
        [0, 100, 100],
        [0, 100, 0],
        [100, 100, 0],
        [100, 100, 100],
        [0, 100, 100],
    ],
];

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, INITIAL_FACES);

    document.querySelector('input').addEventListener('input', (e) => {
        const degrees = e.target.value;
        const faces = [];

        for (let face of INITIAL_FACES) {
            const points = [];

            for (let point of face) {
                if (point.transition) {
                    const newPoint = matrixRotationX(point.point, degrees);

                    points.push({
                        transition: true,
                        point: newPoint,
                    });
                } else {
                    const newPoint = matrixRotationX(point, degrees);

                    points.push(newPoint);
                }
            }

            faces.push(points);
        }

        draw(canvas, faces);
    });
});

function draw(canvas, faces) {
    const colors = ['blue', 'red', 'transparent', 'green', 'yellow'];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // faces = faces.sort((a, b) => {
    //     let sumZA = 0;
    //     let sumZB = 0;

    //     for (let point of a) {
    //         if (!point.transition) {
    //             sumZA += point.reduce((acc, value) => acc + value[2], 0);
    //         }
    //     }

    //     for (let point of b) {
    //         if (!point.transition) {
    //             sumZB += point.reduce((acc, value) => acc + value[2], 0);
    //         }
    //     }

    //     return sumZA > sumZB ? 1 : -1;
    // });

    for (let i = 0; i < faces.length; i++) {
        ctx.beginPath();
        // ctx.fillStyle = colors[i];
        ctx.strokeStyle = colors[i];

        for (let point of faces[i]) {
            if (point.transition) {
                ctx.moveTo(point.point[0], point.point[1]);
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }

        ctx.stroke();
        // ctx.fill();
    }
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function matrixRotationX(point, degrees) {
    const radians = degreesToRadians(degrees);
    const realX = point[0] - 50;
    const realY = point[1] - 50;
    const realZ = point[2] - 50;

    const x = realX * 1 + realY * 0 + realZ * 0;
    const y =
        realX * 0 + realY * Math.cos(radians) + realZ * -Math.sin(radians);
    const z = realX * 0 + realY * Math.sin(radians) + realZ * Math.cos(radians);

    return [x + 50, y + 50, z + 50];
}
