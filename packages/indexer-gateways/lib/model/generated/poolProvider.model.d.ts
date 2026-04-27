import { PortalPool } from "./portalPool.model";
export declare class PoolProvider {
    constructor(props?: Partial<PoolProvider>);
    id: string;
    pool: PortalPool;
    providerId: string;
    deposited: bigint;
}
