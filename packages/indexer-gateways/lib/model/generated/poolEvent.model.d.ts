import { PortalPool } from "./portalPool.model";
import { PoolEventType } from "./_poolEventType";
export declare class PoolEvent {
    constructor(props?: Partial<PoolEvent>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    txHash: string;
    pool: PortalPool;
    eventType: PoolEventType;
    amount: bigint;
    providerId: string | undefined | null;
}
