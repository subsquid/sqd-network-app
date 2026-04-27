import { TransferType } from "./_transferType";
import { Account } from "./account.model";
export declare class Transfer {
    constructor(props?: Partial<Transfer>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    txHash: string;
    type: TransferType;
    from: Account;
    to: Account;
    amount: bigint;
    /**
     * String reference to delegation in workers indexer
     */
    delegationId: string | undefined | null;
    /**
     * String reference to worker in workers indexer
     */
    workerId: string | undefined | null;
    /**
     * String reference to gateway stake in gateways indexer
     */
    gatewayStakeId: string | undefined | null;
    /**
     * String reference to vesting account in accounts indexer
     */
    vestingId: string | undefined | null;
    /**
     * String reference to portal pool in gateways indexer
     */
    portalPoolId: string | undefined | null;
}
