import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Worker } from "./worker.model";
export declare class WorkerReward {
    constructor(props?: Partial<WorkerReward>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    worker: Relation_<Worker>;
    amount: bigint;
    apr: number;
    stakersReward: bigint;
    stakerApr: number;
}
