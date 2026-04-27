import { PortalPool } from "./portalPool.model";
export declare class PoolCapacityChange {
    constructor(props?: Partial<PoolCapacityChange>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    txHash: string;
    pool: PortalPool;
    oldCapacity: bigint;
    newCapacity: bigint;
}
