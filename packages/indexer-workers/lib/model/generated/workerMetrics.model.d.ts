import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Worker } from "./worker.model";
export declare class WorkerMetrics {
    constructor(props?: Partial<WorkerMetrics>);
    id: string;
    worker: Relation_<Worker>;
    timestamp: Date;
    uptime: number;
    pings: number;
    storedData: bigint;
    queries: number;
    servedData: bigint;
    scannedData: bigint;
}
