export declare class Queue<T = unknown> {
    constructor(props?: Partial<Queue<T>>);
    id: string;
    tasks: T[];
}
