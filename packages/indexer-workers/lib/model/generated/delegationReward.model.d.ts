import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Delegation } from "./delegation.model";
export declare class DelegationReward {
    constructor(props?: Partial<DelegationReward>);
    id: string;
    blockNumber: number;
    timestamp: Date;
    delegation: Relation_<Delegation>;
    amount: bigint;
    apr: number;
}
