import { data } from './data.js';
export function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
export function origin2dTranslation(newOrigin) {
    for (var _i = 0, _a = data.INITIAL_FACES; _i < _a.length; _i++) {
        var face = _a[_i];
        for (var _b = 0, _c = face.points; _b < _c.length; _b++) {
            var point = _c[_b];
            for (var i = 0; i < 2; i++) {
                point[i] += newOrigin[i] - data.INITIAL_ORIGIN[i];
            }
        }
    }
    data.INITIAL_ORIGIN = [newOrigin[0], newOrigin[1], data.INITIAL_ORIGIN[2]];
}
export function matrixRotationX(point, tethaDelta) {
    var radians = degreesToRadians(tethaDelta);
    var _a = data.INITIAL_ORIGIN, originX = _a[0], originY = _a[1], originZ = _a[2];
    var realX = point[0] - originX;
    var realY = point[1] - originY;
    var realZ = point[2] - originZ;
    var x = realX * 1 + realY * 0 + realZ * 0;
    var y = realX * 0 + realY * Math.cos(radians) + realZ * -Math.sin(radians);
    var z = realX * 0 + realY * Math.sin(radians) + realZ * Math.cos(radians);
    return [x + originX, y + originY, z + originZ];
}
export function matrixRotationY(point, tethaDelta) {
    var radians = degreesToRadians(tethaDelta);
    var _a = data.INITIAL_ORIGIN, originX = _a[0], originY = _a[1], originZ = _a[2];
    var realX = point[0] - originX;
    var realY = point[1] - originY;
    var realZ = point[2] - originZ;
    var x = realX * Math.cos(radians) + realY * 0 + realZ * Math.sin(radians);
    var y = realX * 0 + realY * 1 + realZ * 0;
    var z = realX * -Math.sin(radians) + realY * 0 + realZ * Math.cos(radians);
    return [x + originX, y + originY, z + originZ];
}
export function matrixRotationZ(point, degrees) {
    var radians = degreesToRadians(degrees);
    var _a = data.INITIAL_ORIGIN, originX = _a[0], originY = _a[1], originZ = _a[2];
    var realX = point[0] - originX;
    var realY = point[1] - originY;
    var realZ = point[2] - originZ;
    var x = realX * Math.cos(radians) + realY * -Math.sin(radians) + realZ * 0;
    var y = realX * Math.sin(radians) + realY * Math.cos(radians) + realZ * 0;
    var z = realX * 0 + realY * 0 + realZ * 1;
    return [x + originX, y + originY, z + originZ];
}
export function matrixScaleZ(point, scaleRatio) {
    point[0] *= scaleRatio;
    point[1] *= scaleRatio;
    point[2] *= scaleRatio;
}
