import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Worker } from "./worker.model";
import { DelegationStatus } from "./_delegationStatus";
import { DelegationStatusChange } from "./delegationStatusChange.model";
import { DelegationReward } from "./delegationReward.model";
export declare class Delegation {
    constructor(props?: Partial<Delegation>);
    id: string;
    ownerId: string;
    worker: Relation_<Worker>;
    status: DelegationStatus;
    statusHistory: Relation_<DelegationStatusChange[]>;
    deposit: bigint;
    locked: boolean | undefined | null;
    lockStart: number | undefined | null;
    lockEnd: number | undefined | null;
    claimableReward: bigint;
    rewards: Relation_<DelegationReward[]>;
    claimedReward: bigint;
}
