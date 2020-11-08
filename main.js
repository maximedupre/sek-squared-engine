const INITIAL_FACES = [
    {
        name: 'front',
        color: 'yellow',
        points: [
            [0, 0, 0],
            [0, 100, 0],
            [100, 100, 0],
            [100, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        name: 'top',
        color: 'blue',
        points: [
            [0, 0, 0],
            [0, 0, 100],
            [100, 0, 100],
            [100, 0, 0],
            [0, 0, 0],
            { transition: true, point: [0, 100, 100] },
        ],
    },
    {
        name: 'back',
        color: 'green',
        points: [
            [0, 100, 100],
            [0, 0, 100],
            [100, 0, 100],
            [100, 100, 100],
            [0, 100, 100],
        ],
    },
    {
        name: 'bottom',
        color: 'pink',
        points: [
            [0, 100, 100],
            [0, 100, 0],
            [100, 100, 0],
            [100, 100, 100],
            [0, 100, 100],
        ],
    },
];

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, INITIAL_FACES);

    document.querySelector('#slider-x').addEventListener('input', (e) => {
        const degrees = e.target.value;
        const faces = [];

        for (let face of INITIAL_FACES) {
            const points = [];

            for (let point of face.points) {
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

            faces.push({
                name: face.name,
                color: face.color,
                points,
            });
        }

        draw(canvas, faces);
    });

    document.querySelector('#slider-y').addEventListener('input', (e) => {
        const degrees = e.target.value;
        const faces = [];

        for (let face of INITIAL_FACES) {
            const points = [];

            for (let point of face.points) {
                if (point.transition) {
                    const newPoint = matrixRotationY(point.point, degrees);

                    points.push({
                        transition: true,
                        point: newPoint,
                    });
                } else {
                    const newPoint = matrixRotationY(point, degrees);

                    points.push(newPoint);
                }
            }

            faces.push({
                name: face.name,
                color: face.color,
                points,
            });
        }

        draw(canvas, faces);
    });
});

function draw(canvas, faces) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.sort((a, b) => {
        const sumZA = a.points.reduce((acc, value, i) => {
            if (i < 4) {
                return acc + (value.transition ? 0 : value[2]);
            } else {
                return acc;
            }
        }, 0);

        const sumZB = b.points.reduce((acc, value, i) => {
            if (i < 4) {
                return acc + (value.transition ? 0 : value[2]);
            } else {
                return acc;
            }
        }, 0);

        return sumZA < sumZB ? 1 : -1;
    });

    for (let i = 0; i < faces.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = faces[i].color;

        for (let point of faces[i].points) {
            if (point.transition) {
                ctx.moveTo(point.point[0], point.point[1]);
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }

        ctx.fill();
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

function matrixRotationY(point, degrees) {
    const radians = degreesToRadians(degrees);
    const realX = point[0] - 50;
    const realY = point[1] - 50;
    const realZ = point[2] - 50;

    const x = realX * Math.cos(radians) + realY * 0 + realZ * Math.sin(radians);
    const y = realX * 0 + realY * 1 + realZ * 0;
    const z =
        realX * -Math.sin(radians) + realY * 0 + realZ * Math.cos(radians);

    return [x + 50, y + 50, z + 50];
}
