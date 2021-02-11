export type Origin = [number, number, number];

export type Point = number[];

export interface Face {
    name: string;
    color: string;
    points: Point[];
}

export interface Data {
    INITIAL_ORIGIN: Origin;
    INITIAL_FACES: Face[];
}
