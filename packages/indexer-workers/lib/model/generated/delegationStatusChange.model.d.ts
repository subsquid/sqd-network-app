import { Relation as Relation_ } from "@subsquid/typeorm-store";
import { Delegation } from "./delegation.model";
import { DelegationStatus } from "./_delegationStatus";
export declare class DelegationStatusChange {
    constructor(props?: Partial<DelegationStatusChange>);
    id: string;
    delegation: Relation_<Delegation>;
    status: DelegationStatus;
    timestamp: Date | undefined | null;
    blockNumber: number;
    pending: boolean;
}
