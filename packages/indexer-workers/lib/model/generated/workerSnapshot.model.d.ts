import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Worker } from "./worker.model";
import { Epoch } from "./epoch.model";
export declare class WorkerSnapshot {
    constructor(props?: Partial<WorkerSnapshot>);
    id: string;
    worker: Relation_<Worker>;
    timestamp: Date;
    uptime: number;
    epoch: Relation_<Epoch>;
}
