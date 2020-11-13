let INITIAL_ORIGIN = [50, 50, 50];
let INITIAL_FACES = [
    {
        name: 'front',
        color: 'yellow',
        points: [
            [0, 0, 0],
            [0, 100, 0],
            [100, 100, 0],
            [100, 0, 0],
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
        ],
    },
    {
        name: 'left-side',
        color: 'orange',
        points: [
            [0, 100, 100],
            [0, 100, 0],
            [0, 0, 0],
            [0, 0, 100],
        ],
    },
    {
        name: 'right-side',
        color: 'black',
        points: [
            [100, 100, 100],
            [100, 100, 0],
            [100, 0, 0],
            [100, 0, 100],
        ],
    },
];
const tethas = {
    x: 0,
    y: 0,
    z: 0,
};

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(canvas, INITIAL_FACES);

    document
        .querySelector('#slider-x')
        .addEventListener('input', (e) => onSlider(e, 'x', canvas));
    document
        .querySelector('#slider-y')
        .addEventListener('input', (e) => onSlider(e, 'y', canvas));
    document
        .querySelector('#slider-z')
        .addEventListener('input', (e) => onSlider(e, 'z', canvas));
    document
        .querySelector('#origin')
        .addEventListener('change', (e) =>
            onOriginChange(e.target.value, canvas),
        );
});

function onOriginChange(newOrigin, canvas) {
    for (let face of INITIAL_FACES) {
        for (let point of face.points) {
            for (let i = 0; i < 3; i++) {
                point[i] += newOrigin - INITIAL_ORIGIN[i];
            }
        }
    }

    INITIAL_ORIGIN = [newOrigin, newOrigin, newOrigin];

    draw(canvas, INITIAL_FACES);
}

function draw(canvas, faces) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.sort((a, b) => {
        const sumZA = a.points.reduce((acc, value) => acc + value[2], 0);

        const sumZB = b.points.reduce((acc, value) => acc + value[2], 0);

        return sumZA < sumZB ? 1 : -1;
    });

    for (let i = 0; i < faces.length; i++) {
        const points = faces[i].points;

        ctx.beginPath();

        ctx.fillStyle = faces[i].color;

        ctx.moveTo(points[0][0], points[0][1]);

        for (let point of points) {
            ctx.lineTo(point[0], point[1]);
        }

        ctx.fill();
    }
}

function onSlider(e, axis, canvas) {
    const faces = [];
    tethaDelta = tethas[axis] - e.target.value;
    tethas[axis] = e.target.value;

    for (let face of INITIAL_FACES) {
        const points = [];

        for (let point of face.points) {
            let newPoint;

            if (axis === 'x') {
                newPoint = matrixRotationX(point, tethaDelta);
            } else if (axis === 'y') {
                newPoint = matrixRotationY(point, tethaDelta);
            } else {
                newPoint = matrixRotationZ(point, tethaDelta);
            }

            points.push(newPoint);
        }

        faces.push({
            name: face.name,
            color: face.color,
            points,
        });

        INITIAL_FACES = faces;
    }

    draw(canvas, faces);
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function matrixRotationX(point, degrees) {
    const radians = degreesToRadians(degrees);
    const [originX, originY, originZ] = INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x = realX * 1 + realY * 0 + realZ * 0;
    const y =
        realX * 0 + realY * Math.cos(radians) + realZ * -Math.sin(radians);
    const z = realX * 0 + realY * Math.sin(radians) + realZ * Math.cos(radians);

    return [x + originX, y + originY, z + originZ];
}

function matrixRotationY(point, degrees) {
    const radians = degreesToRadians(degrees);
    const [originX, originY, originZ] = INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x = realX * Math.cos(radians) + realY * 0 + realZ * Math.sin(radians);
    const y = realX * 0 + realY * 1 + realZ * 0;
    const z =
        realX * -Math.sin(radians) + realY * 0 + realZ * Math.cos(radians);

    return [x + originX, y + originY, z + originZ];
}

function matrixRotationZ(point, degrees) {
    const radians = degreesToRadians(degrees);
    const [originX, originY, originZ] = INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x =
        realX * Math.cos(radians) + realY * -Math.sin(radians) + realZ * 0;
    const y = realX * Math.sin(radians) + realY * Math.cos(radians) + realZ * 0;
    const z = realX * 0 + realY * 0 + realZ * 1;

    return [x + originX, y + originY, z + originZ];
}
