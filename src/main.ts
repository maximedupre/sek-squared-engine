import {
    matrixRotationX,
    matrixRotationY,
    matrixRotationZ,
    origin2dTranslation,
} from './3d.js';
import { data } from './data.js';
import { mrua } from './physics.js';

const tethas = {
    x: 0,
    y: 0,
    z: 0,
};
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    origin2dTranslation([canvas.width / 2, canvas.height / 2, 50]);
    draw(canvas, data.INITIAL_FACES);
    onSlider(-10, 'x', canvas);
    onSlider(-10, 'y', canvas);

    const TICK = 100;
    let cumulSecs = 0;
    let isSpacePressed = false;
    let acceleration = 0.981;
    let speed = 0;

    const intervalId = setInterval(() => {
        if (!isSpacePressed) {
            acceleration = Math.min(acceleration + 0.1, 0.981);
        } else {
            acceleration = Math.max(acceleration - 0.3, -0.981);
            isSpacePressed = false;
        }

        speed += acceleration * cumulSecs;

        const y = mrua(data.INITIAL_ORIGIN[1], speed, acceleration, cumulSecs);

        origin2dTranslation([data.INITIAL_ORIGIN[0], y, 50]);

        const topThresspassPx = getLimitThresspassPx(canvas, 'top');
        const bottomThresspassPx = getLimitThresspassPx(canvas, 'bottom');

        if (topThresspassPx > 0 || bottomThresspassPx < 0) {
            origin2dTranslation([
                data.INITIAL_ORIGIN[0],
                data.INITIAL_ORIGIN[1] +
                    (topThresspassPx || bottomThresspassPx),
                50,
            ]);

            clearInterval(intervalId);
        }

        draw(canvas, data.INITIAL_FACES);

        cumulSecs += TICK / 1000;
    }, TICK);

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            isSpacePressed = true;
        }
    });

    document
        .querySelector('#slider-x')
        .addEventListener('input', (e: KeyboardEvent) =>
            onSlider((e.target as HTMLInputElement).value, 'x', canvas),
        );
    document
        .querySelector('#slider-y')
        .addEventListener('input', (e) =>
            onSlider((e.target as HTMLInputElement).value, 'y', canvas),
        );
    document
        .querySelector('#slider-z')
        .addEventListener('input', (e) =>
            onSlider((e.target as HTMLInputElement).value, 'z', canvas),
        );
});

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
        ctx.globalAlpha = 0.925;

        ctx.moveTo(points[0][0], points[0][1]);

        for (let point of points) {
            ctx.lineTo(point[0], point[1]);
        }

        ctx.fill();
    }
}

function onSlider(value, axis, canvas) {
    const faces = [];
    const tethaDelta = tethas[axis] - value;
    tethas[axis] = value;

    for (let face of data.INITIAL_FACES) {
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

        data.INITIAL_FACES = faces;
    }

    draw(canvas, faces);
}

function getLimitThresspassPx(canvas, type) {
    const bottom = canvas.height;

    for (let face of data.INITIAL_FACES) {
        for (let point of face.points) {
            if (
                (type === 'bottom' && point[1] > bottom) ||
                (type === 'top' && point[1] < 0)
            ) {
                return type === 'bottom' ? bottom - point[1] : -point[1];
            }
        }
    }

    return 0;
}
