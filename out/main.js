import { matrixRotationX, matrixRotationY, matrixRotationZ, origin2dTranslation } from './3d.js';
import { data } from './data.js';
import { mrua } from './physics.js';
var tethas = {
    x: 0,
    y: 0,
    z: 0
};
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin2dTranslation([canvas.width / 2, canvas.height / 2, 50]);
    draw(canvas, data.INITIAL_FACES);
    onSlider(-10, 'x', canvas);
    onSlider(-10, 'y', canvas);
    var METERS_PER_PX = 10;
    var TICK_IN_MS = 100;
    var TICKS_IN_SECONDS = TICK_IN_MS / 1000;
    // m/s^2
    var GRAVITY = 9.81;
    // m/s^2
    var positiveAcceleration = 0;
    // m/s
    var speed = 0;
    var cumulSeconds = 0;
    var nbTicksForSpace = 0;
    var intervalId = setInterval(function () {
        if (nbTicksForSpace > 0) {
            nbTicksForSpace--;
            positiveAcceleration += GRAVITY * TICKS_IN_SECONDS;
        }
        else {
            positiveAcceleration -= GRAVITY * 5 * TICKS_IN_SECONDS;
            positiveAcceleration = Math.max(0, positiveAcceleration);
        }
        speed += (positiveAcceleration - GRAVITY) * TICKS_IN_SECONDS;
        var y = mrua(data.INITIAL_ORIGIN[1], speed * METERS_PER_PX, TICKS_IN_SECONDS);
        console.log('cumulSeconds', cumulSeconds);
        console.log('y', y);
        console.log('speed', speed);
        console.log('acceleration', positiveAcceleration);
        origin2dTranslation([data.INITIAL_ORIGIN[0], y, 50]);
        var topThresspassPx = getLimitThresspassPx(canvas, 'top');
        var bottomThresspassPx = getLimitThresspassPx(canvas, 'bottom');
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
        cumulSeconds += TICK_IN_MS / 1000;
    }, TICK_IN_MS);
    document.addEventListener('keydown', function (e) {
        if (e.key === ' ') {
            nbTicksForSpace = 5;
        }
    });
    document
        .querySelector('#slider-x')
        .addEventListener('input', function (e) {
        return onSlider(e.target.value, 'x', canvas);
    });
    document
        .querySelector('#slider-y')
        .addEventListener('input', function (e) {
        return onSlider(e.target.value, 'y', canvas);
    });
    document
        .querySelector('#slider-z')
        .addEventListener('input', function (e) {
        return onSlider(e.target.value, 'z', canvas);
    });
});
function draw(canvas, faces) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faces.sort(function (a, b) {
        var sumZA = a.points.reduce(function (acc, value) { return acc + value[2]; }, 0);
        var sumZB = b.points.reduce(function (acc, value) { return acc + value[2]; }, 0);
        return sumZA < sumZB ? 1 : -1;
    });
    for (var i = 0; i < faces.length; i++) {
        var points = faces[i].points;
        ctx.beginPath();
        ctx.fillStyle = faces[i].color;
        ctx.globalAlpha = 0.925;
        ctx.moveTo(points[0][0], points[0][1]);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.fill();
    }
}
function onSlider(value, axis, canvas) {
    var faces = [];
    var tethaDelta = tethas[axis] - value;
    tethas[axis] = value;
    for (var _i = 0, _a = data.INITIAL_FACES; _i < _a.length; _i++) {
        var face = _a[_i];
        var points = [];
        for (var _b = 0, _c = face.points; _b < _c.length; _b++) {
            var point = _c[_b];
            var newPoint = void 0;
            if (axis === 'x') {
                newPoint = matrixRotationX(point, tethaDelta);
            }
            else if (axis === 'y') {
                newPoint = matrixRotationY(point, tethaDelta);
            }
            else {
                newPoint = matrixRotationZ(point, tethaDelta);
            }
            points.push(newPoint);
        }
        faces.push({
            name: face.name,
            color: face.color,
            points: points
        });
        data.INITIAL_FACES = faces;
    }
    draw(canvas, faces);
}
function getLimitThresspassPx(canvas, type) {
    var bottom = canvas.height;
    for (var _i = 0, _a = data.INITIAL_FACES; _i < _a.length; _i++) {
        var face = _a[_i];
        for (var _b = 0, _c = face.points; _b < _c.length; _b++) {
            var point = _c[_b];
            if ((type === 'bottom' && point[1] > bottom) ||
                (type === 'top' && point[1] < 0)) {
                return type === 'bottom' ? bottom - point[1] : -point[1];
            }
        }
    }
    return 0;
}
