import { Data, Origin, Point } from './types.js';

export function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function cube(size: number, origin: Origin): Data {
    const colors = ['yellow', 'blue', 'green', 'pink', 'orange', 'black'];

    const generateRandomColor = () => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const index = colors.indexOf(color);

        colors.splice(index, 1);

        return color;
    };

    const faceInfo: any = [
        { name: 'front', color: generateRandomColor() },
        { name: 'top', color: generateRandomColor() },
        { name: 'back', color: generateRandomColor() },
        { name: 'bottom', color: generateRandomColor() },
        { name: 'left', color: generateRandomColor() },
        { name: 'right', color: generateRandomColor() },
    ];
    const faces: any[] = [];

    for (const i of faceInfo) {
        const face: any = {
            name: i.name,
            color: i.color,
            points: [],
        };
        const xNear = origin[0] - size / 2;
        const yNear = origin[1] - size / 2;
        const zNear = origin[2] - size / 2;
        const xFar = origin[0] + size / 2;
        const yFar = origin[1] + size / 2;
        const zFar = origin[2] + size / 2;

        if (i.name === 'front') {
            face.points = [
                [xNear, yNear, zNear],
                [xNear, yFar, zNear],
                [xFar, yFar, zNear],
                [xFar, yNear, zNear],
            ];
        } else if (i.name === 'top') {
            face.points = [
                [xNear, yNear, zNear],
                [xNear, yNear, zFar],
                [xFar, yNear, zFar],
                [xFar, yNear, zNear],
            ];
        } else if (i.name === 'back') {
            face.points = [
                [xNear, yFar, zFar],
                [xNear, yNear, zFar],
                [xFar, yNear, zFar],
                [xFar, yFar, zFar],
            ];
        } else if (i.name === 'bottom') {
            face.points = [
                [xNear, yFar, zFar],
                [xNear, yFar, zNear],
                [xFar, yFar, zNear],
                [xFar, yFar, zFar],
            ];
        } else if (i.name === 'left') {
            face.points = [
                [xNear, yFar, zFar],
                [xNear, yFar, zNear],
                [xNear, yNear, zNear],
                [xNear, yNear, zFar],
            ];
        } else if (i.name === 'right') {
            face.points = [
                [xFar, yFar, zFar],
                [xFar, yFar, zNear],
                [xFar, yNear, zNear],
                [xFar, yNear, zFar],
            ];
        }

        faces.push(face);
    }

    return {
        INITIAL_ORIGIN: origin,
        INITIAL_FACES: faces as any,
    };
}

export function facesOrigin2dTranslation(data: Data, newOrigin: Origin) {
    for (let face of data.INITIAL_FACES) {
        for (let point of face.points) {
            for (let i = 0; i < 3; i++) {
                point[i] += newOrigin[i] - data.INITIAL_ORIGIN[i];
            }
        }
    }

    data.INITIAL_ORIGIN = [newOrigin[0], newOrigin[1], newOrigin[2]];
}

export function pointMatrixRotationX(
    data: Data,
    point: Point,
    tethaDelta: number,
) {
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

export function pointMatrixRotationY(
    data: Data,
    point: Point,
    tethaDelta: number,
) {
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

export function pointMatrixRotationZ(
    data: Data,
    point: Point,
    degrees: number,
) {
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

export function pointMatrixScaleZ(
    data: Data,
    point: Point,
    scaleRatio: number,
) {
    const [originX, originY, originZ] = data.INITIAL_ORIGIN;
    let realX = point[0] - originX;
    let realY = point[1] - originY;
    let realZ = point[2] - originZ;

    realX *= scaleRatio;
    realY *= scaleRatio;
    realZ *= scaleRatio;

    return [realX + originX, realY + originY, realZ + originZ];
}

export function virtualPerspectiveCube(data: Data) {
    const clonedData: Data = JSON.parse(JSON.stringify(data));
    const [originX, originY, originZ] = clonedData.INITIAL_ORIGIN;
    const FIELD_OF_VIEW_DEGREES = 90;
    const d = 1 / Math.tan(degreesToRadians(FIELD_OF_VIEW_DEGREES / 2));

    console.log('cloneData.INITIAL_ORIGIN', clonedData.INITIAL_ORIGIN);
    console.log('d', d);

    for (let face of clonedData.INITIAL_FACES) {
        for (let point of face.points) {
            point[0] = ((point[0] - originX) / point[2]) * d * 100 + originX;
            point[1] = ((point[1] - originY) / point[2]) * d * 100 + originY;
            point[2] = point[2];
        }
    }

    return clonedData;
}
