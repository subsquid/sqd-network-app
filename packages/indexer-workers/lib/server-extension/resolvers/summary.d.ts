import { EntityManager } from 'typeorm';
export declare class AprSnapshot {
    timestamp: Date;
    stakerApr: number;
    workerApr: number;
    constructor({ timestamp, ...props }: AprSnapshot);
}
export declare class WorkersSummary {
    workerApr: number;
    stakerApr: number;
    storedData: bigint;
    queries24Hours: bigint;
    queries90Days: bigint;
    servedData24Hours: bigint;
    servedData90Days: bigint;
    workersCount: number;
    onlineWorkersCount: number;
    totalBond: bigint;
    totalDelegation: bigint;
    lastBlock: number;
    lastBlockTimestamp: Date;
    blockTime: number;
    lastBlockL1: number;
    lastBlockTimestampL1: Date;
    blockTimeL1: number;
    aprs: AprSnapshot[];
    constructor({ aprs, ...props }: Partial<WorkersSummary>);
}
export declare class WorkersSummaryResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    workersSummary(): Promise<WorkersSummary>;
}
