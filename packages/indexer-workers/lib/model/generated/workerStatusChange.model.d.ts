import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Worker } from "./worker.model";
import { WorkerStatus } from "./_workerStatus";
export declare class WorkerStatusChange {
    constructor(props?: Partial<WorkerStatusChange>);
    id: string;
    worker: Relation_<Worker>;
    status: WorkerStatus;
    timestamp: Date | undefined | null;
    blockNumber: number;
    pending: boolean;
}
