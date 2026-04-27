import { PortalPool } from "./portalPool.model";
export declare class PoolDistributionRateChange {
    constructor(props?: Partial<PoolDistributionRateChange>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    txHash: string;
    pool: PortalPool;
    oldRate: bigint;
    newRate: bigint;
}
