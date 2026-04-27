import { PoolProvider } from "./poolProvider.model";
import { PoolEvent } from "./poolEvent.model";
import { PoolDistributionRateChange } from "./poolDistributionRateChange.model";
import { PoolCapacityChange } from "./poolCapacityChange.model";
export declare class PortalPool {
    constructor(props?: Partial<PortalPool>);
    id: string;
    createdAt: Date;
    createdAtBlock: number;
    closedAt: Date | undefined | null;
    closedAtBlock: number | undefined | null;
    operator: string;
    rewardToken: string;
    tokenSuffix: string;
    metadata: string | undefined | null;
    capacity: bigint;
    rewardRate: bigint;
    totalRewardsToppedUp: bigint;
    tvlTotal: bigint;
    tvlStable: bigint;
    providers: PoolProvider[];
    events: PoolEvent[];
    distributionRateHistory: PoolDistributionRateChange[];
    capacityHistory: PoolCapacityChange[];
}
