import { EntityManager } from 'typeorm';
export declare class WorkerSnapshotDay {
    timestamp: Date;
    uptime: number;
    constructor(props: Partial<WorkerSnapshotDay>);
}
export declare class DaysUptimeResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    workerSnapshotsByDay(workerId: string, from: Date, to?: Date): Promise<number>;
}
