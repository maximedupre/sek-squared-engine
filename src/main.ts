import {
    facesOrigin2dTranslation,
    pointMatrixRotationX,
    pointMatrixRotationY,
    pointMatrixRotationZ,
    pointMatrixScaleZ as pointMatrixScale,
} from './3d.js';
import { data, Face, Point } from './data.js';
import { getAcceleration, getMovement, getSpeed, GRAVITY } from './physics.js';

const INTERVAL_IN_S = 0.01;
const NB_INTERVALS_FOR_SPACE_PER_SECOND = 0.4;

const tethas = {
    x: 0,
    y: 0,
    z: 0,
};
let scale = 1;
let nbIntervalsForSpace = 0;

window.addEventListener('DOMContentLoaded', () => {
    const axis: any[] = ['x', 'y', 'z'];
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    facesOrigin2dTranslation([canvas.width / 2, canvas.height / 2, 50]);
    draw(canvas, data.INITIAL_FACES);
    onSliderRotation(-10, 'x', canvas);
    onSliderRotation(-10, 'y', canvas);
    start(canvas);

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            nbIntervalsForSpace =
                NB_INTERVALS_FOR_SPACE_PER_SECOND / INTERVAL_IN_S;
        }
    });

    for (let a of axis) {
        (document.querySelector(
            `#slider-${a}-rotation`,
        ) as HTMLInputElement).addEventListener('input', (e: Event) => {
            onSliderRotation(+(e.target as HTMLInputElement).value, a, canvas);
        });
    }

    (document.querySelector(
        `#slider-z-scaling`,
    ) as HTMLInputElement).addEventListener('input', (e: Event) => {
        onSliderScaling((e.target as HTMLInputElement).value, canvas);
    });
});

function start(canvas: HTMLCanvasElement) {
    const METERS_PER_PX = 10;
    // m/s^2
    let positiveAcceleration = 0;
    // m/s
    let speed = 0;
    let cumulSecs = 0;

    const intervalId = setInterval(() => {
        cumulSecs += INTERVAL_IN_S;

        if (nbIntervalsForSpace > 0) {
            nbIntervalsForSpace--;

            positiveAcceleration += getAcceleration(GRAVITY * 2, INTERVAL_IN_S);
        } else {
            positiveAcceleration -= getAcceleration(GRAVITY * 5, INTERVAL_IN_S);
            positiveAcceleration = Math.max(0, positiveAcceleration);
        }

        speed += getSpeed(positiveAcceleration - GRAVITY, INTERVAL_IN_S);

        const speedInPx = speed * METERS_PER_PX;
        const y =
            data.INITIAL_ORIGIN[1] - getMovement(speedInPx, INTERVAL_IN_S);

        facesOrigin2dTranslation([data.INITIAL_ORIGIN[0], y, 50]);

        const topThresspassPx = getLimitThresspassPx(canvas, 'top');
        const bottomThresspassPx = getLimitThresspassPx(canvas, 'bottom');

        if (topThresspassPx > 0 || bottomThresspassPx < 0) {
            facesOrigin2dTranslation([
                data.INITIAL_ORIGIN[0],
                data.INITIAL_ORIGIN[1] +
                    (topThresspassPx || bottomThresspassPx),
                50,
            ]);

            clearInterval(intervalId);
            (document.querySelector('.gameover') as any).style.display =
                'block';
        }

        draw(canvas, data.INITIAL_FACES);
        (document.querySelector(
            '.timer',
        ) as any).textContent = `${cumulSecs.toFixed(2)} SECONDS`;
    }, INTERVAL_IN_S * 1000);
}

function draw(canvas: HTMLCanvasElement, faces: Face[]) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.sort((a, b) => {
        const sumZA = a.points.reduce(
            (acc: number, value: Point) => acc + value[2],
            0,
        );

        const sumZB = b.points.reduce(
            (acc: number, value: Point) => acc + value[2],
            0,
        );

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

function onSliderRotation(
    value: number,
    axis: 'x' | 'y' | 'z',
    canvas: HTMLCanvasElement,
) {
    const faces = [];
    const tethaDelta = tethas[axis] - value;
    tethas[axis] = value;

    for (let face of data.INITIAL_FACES) {
        const points = [];

        for (let point of face.points) {
            let newPoint;

            if (axis === 'x') {
                newPoint = pointMatrixRotationX(point, tethaDelta);
            } else if (axis === 'y') {
                newPoint = pointMatrixRotationY(point, tethaDelta);
            } else {
                newPoint = pointMatrixRotationZ(point, tethaDelta);
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

function onSliderScaling(value: string, canvas: HTMLCanvasElement) {
    const scaleRatio = +value / scale;
    scale = +value;

    for (let face of data.INITIAL_FACES) {
        for (let point of face.points) {
            const newPoint = pointMatrixScale(point, scaleRatio);
            point[0] = newPoint[0];
            point[1] = newPoint[1];
            point[2] = newPoint[2];
        }
    }

    draw(canvas, data.INITIAL_FACES);
}

function getLimitThresspassPx(canvas: HTMLCanvasElement, type: string) {
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
