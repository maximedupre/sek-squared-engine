import { matrixRotationX, matrixRotationY, matrixRotationZ, matrixScaleZ, origin2dTranslation, } from './3d.js';
import { data } from './data.js';
import { getAcceleration, getMovement, getSpeed, GRAVITY } from './physics.js';
var INTERVAL_IN_S = 0.01;
var NB_INTERVALS_FOR_SPACE_PER_SECOND = 0.4;
var tethas = {
    x: 0,
    y: 0,
    z: 0
};
var scale = 1;
var nbIntervalsForSpace = 0;
window.addEventListener('DOMContentLoaded', function () {
    var axis = ['x', 'y', 'z'];
    var canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin2dTranslation([canvas.width / 2, canvas.height / 2, 50]);
    draw(canvas, data.INITIAL_FACES);
    onSliderRotation(-10, 'x', canvas);
    onSliderRotation(-10, 'y', canvas);
    start(canvas);
    document.addEventListener('keydown', function (e) {
        if (e.key === ' ') {
            nbIntervalsForSpace =
                NB_INTERVALS_FOR_SPACE_PER_SECOND / INTERVAL_IN_S;
        }
    });
    var _loop_1 = function (a) {
        document
            .querySelector("#slider-" + a + "-rotation")
            .addEventListener('input', function (e) {
            return onSliderRotation(e.target.value, a, canvas);
        });
    };
    for (var _i = 0, axis_1 = axis; _i < axis_1.length; _i++) {
        var a = axis_1[_i];
        _loop_1(a);
    }
    document
        .querySelector("#slider-z-scaling")
        .addEventListener('input', function (e) {
        return onSliderScaling(e.target.value, canvas);
    });
});
function start(canvas) {
    var METERS_PER_PX = 10;
    // m/s^2
    var positiveAcceleration = 0;
    // m/s
    var speed = 0;
    var intervalId = setInterval(function () {
        if (nbIntervalsForSpace > 0) {
            nbIntervalsForSpace--;
            positiveAcceleration += getAcceleration(GRAVITY * 2, INTERVAL_IN_S);
        }
        else {
            positiveAcceleration -= getAcceleration(GRAVITY * 5, INTERVAL_IN_S);
            positiveAcceleration = Math.max(0, positiveAcceleration);
        }
        speed += getSpeed(positiveAcceleration - GRAVITY, INTERVAL_IN_S);
        var speedInPx = speed * METERS_PER_PX;
        var y = data.INITIAL_ORIGIN[1] - getMovement(speedInPx, INTERVAL_IN_S);
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
            document.querySelector('.gameover').style.display =
                'block';
        }
        draw(canvas, data.INITIAL_FACES);
    }, INTERVAL_IN_S * 1000);
}
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
function onSliderRotation(value, axis, canvas) {
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
function onSliderScaling(value, canvas) {
    var tmpOriginX = data.INITIAL_ORIGIN[0];
    var tmpOriginY = data.INITIAL_ORIGIN[1];
    var tmpOriginZ = data.INITIAL_ORIGIN[2];
    var scaleRatio = +value / scale;
    scale = +value;
    for (var _i = 0, _a = data.INITIAL_FACES; _i < _a.length; _i++) {
        var face = _a[_i];
        for (var _b = 0, _c = face.points; _b < _c.length; _b++) {
            var point = _c[_b];
            matrixScaleZ(point, scaleRatio);
        }
    }
    data.INITIAL_ORIGIN[0] *= scaleRatio;
    data.INITIAL_ORIGIN[1] *= scaleRatio;
    data.INITIAL_ORIGIN[2] *= scaleRatio;
    origin2dTranslation([tmpOriginX, tmpOriginY, tmpOriginZ]);
    draw(canvas, data.INITIAL_FACES);
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
