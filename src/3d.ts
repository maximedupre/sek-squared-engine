import { data, Origin, Point } from './data.js';

export function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function facesOrigin2dTranslation(newOrigin: Origin) {
    for (let face of data.INITIAL_FACES) {
        for (let point of face.points) {
            for (let i = 0; i < 2; i++) {
                point[i] += newOrigin[i] - data.INITIAL_ORIGIN[i];
            }
        }
    }

    data.INITIAL_ORIGIN = [newOrigin[0], newOrigin[1], data.INITIAL_ORIGIN[2]];
}

export function pointMatrixRotationX(point: Point, tethaDelta: number) {
    const radians = degreesToRadians(tethaDelta);
    const [originX, originY, originZ] = data.INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x = realX * 1 + realY * 0 + realZ * 0;
    const y =
        realX * 0 + realY * Math.cos(radians) + realZ * -Math.sin(radians);
    const z = realX * 0 + realY * Math.sin(radians) + realZ * Math.cos(radians);

    return [x + originX, y + originY, z + originZ];
}

export function pointMatrixRotationY(point: Point, tethaDelta: number) {
    const radians = degreesToRadians(tethaDelta);
    const [originX, originY, originZ] = data.INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x = realX * Math.cos(radians) + realY * 0 + realZ * Math.sin(radians);
    const y = realX * 0 + realY * 1 + realZ * 0;
    const z =
        realX * -Math.sin(radians) + realY * 0 + realZ * Math.cos(radians);

    return [x + originX, y + originY, z + originZ];
}

export function pointMatrixRotationZ(point: Point, degrees: number) {
    const radians = degreesToRadians(degrees);
    const [originX, originY, originZ] = data.INITIAL_ORIGIN;
    const realX = point[0] - originX;
    const realY = point[1] - originY;
    const realZ = point[2] - originZ;

    const x =
        realX * Math.cos(radians) + realY * -Math.sin(radians) + realZ * 0;
    const y = realX * Math.sin(radians) + realY * Math.cos(radians) + realZ * 0;
    const z = realX * 0 + realY * 0 + realZ * 1;

    return [x + originX, y + originY, z + originZ];
}

export function pointMatrixScaleZ(point: Point, scaleRatio: number) {
    const [originX, originY, originZ] = data.INITIAL_ORIGIN;
    let realX = point[0] - originX;
    let realY = point[1] - originY;
    let realZ = point[2] - originZ;

    realX *= scaleRatio;
    realY *= scaleRatio;
    realZ *= scaleRatio;

    return [realX + originX, realY + originY, realZ + originZ];
}
