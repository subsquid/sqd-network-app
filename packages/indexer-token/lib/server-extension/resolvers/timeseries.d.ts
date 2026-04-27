import { EntityManager } from 'typeorm';
declare enum TvlType {
    WORKER = "WORKER",
    DELEGATION = "DELEGATION",
    PORTAL = "PORTAL",
    PORTAL_POOL = "PORTAL_POOL"
}
declare class HoldersCountEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<HoldersCountEntry>);
}
declare class HoldersCountTimeseries {
    data: HoldersCountEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<HoldersCountTimeseries>);
}
export declare class HoldersCountTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    holdersCountTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<HoldersCountTimeseries>;
}
declare class TvlEntry {
    timestamp: Date;
    value: bigint | null;
    constructor(props: Partial<TvlEntry>);
}
declare class LockedValueTimeseries {
    data: TvlEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<LockedValueTimeseries>);
}
export declare class LockedValueTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    lockedValueTimeseries(fromArg?: Date, toArg?: Date, step?: string, type?: TvlType): Promise<LockedValueTimeseries>;
}
declare class TransferCountByTypeValue {
    deposit: number;
    withdraw: number;
    transfer: number;
    reward: number;
    release: number;
    constructor(props: Partial<TransferCountByTypeValue>);
}
declare class TransferCountByType {
    timestamp: Date;
    value: TransferCountByTypeValue | null;
    constructor(props: Partial<TransferCountByType>);
}
declare class TransfersByTypeTimeseries {
    data: TransferCountByType[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<TransfersByTypeTimeseries>);
}
export declare class TransfersByTypeTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    transfersByTypeTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<TransfersByTypeTimeseries>;
}
declare class UniqueAccountsEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<UniqueAccountsEntry>);
}
declare class UniqueAccountsTimeseries {
    data: UniqueAccountsEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<UniqueAccountsTimeseries>);
}
export declare class UniqueAccountsTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    uniqueAccountsTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<UniqueAccountsTimeseries>;
}
declare class AccountBalanceEntry {
    timestamp: Date;
    value: bigint | null;
    constructor(props: Partial<AccountBalanceEntry>);
}
declare class AccountBalanceTimeseries {
    data: AccountBalanceEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<AccountBalanceTimeseries>);
}
export declare class AccountBalanceTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    accountBalanceTimeseries(accountId: string, fromArg?: Date, toArg?: Date, step?: string): Promise<AccountBalanceTimeseries>;
}
export {};
