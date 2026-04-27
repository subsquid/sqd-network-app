import { EntityManager } from 'typeorm';
export declare function normalizeTimeRange(from?: Date, to?: Date): {
    from: Date;
    to: Date;
};
declare class ActiveWorkersEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<ActiveWorkersEntry>);
}
declare class ActiveWorkersTimeseries {
    data: ActiveWorkersEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<ActiveWorkersTimeseries>);
}
export declare class ActiveWorkersTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    activeWorkersTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<ActiveWorkersTimeseries>;
}
declare class OperatorsEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<OperatorsEntry>);
}
declare class UniqueOperatorsTimeseries {
    data: OperatorsEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<UniqueOperatorsTimeseries>);
}
export declare class UniqueOperatorsTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    uniqueOperatorsTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<UniqueOperatorsTimeseries>;
}
declare class DelegationsEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<DelegationsEntry>);
}
declare class DelegationsTimeseries {
    data: DelegationsEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<DelegationsTimeseries>);
}
export declare class DelegationsTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    delegationsTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<DelegationsTimeseries>;
}
declare class DelegatorsEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<DelegatorsEntry>);
}
declare class DelegatorsTimeseries {
    data: DelegatorsEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<DelegatorsTimeseries>);
}
export declare class DelegatorsTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    delegatorsTimeseries(fromArg?: Date, toArg?: Date, step?: string): Promise<DelegatorsTimeseries>;
}
declare class QueriesCountEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<QueriesCountEntry>);
}
declare class QueriesCountTimeseries {
    data: QueriesCountEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<QueriesCountTimeseries>);
}
export declare class QueriesCountTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    queriesCountTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<QueriesCountTimeseries>;
}
declare class ServedDataEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<ServedDataEntry>);
}
declare class ServedDataTimeseries {
    data: ServedDataEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<ServedDataTimeseries>);
}
export declare class ServedDataTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    servedDataTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<ServedDataTimeseries>;
}
declare class StoredDataEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<StoredDataEntry>);
}
declare class StoredDataTimeseries {
    data: StoredDataEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<StoredDataTimeseries>);
}
export declare class StoredDataTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    storedDataTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<StoredDataTimeseries>;
}
declare class UptimeEntry {
    timestamp: Date;
    value: number | null;
    constructor(props: Partial<UptimeEntry>);
}
declare class UptimeTimeseries {
    data: UptimeEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<UptimeTimeseries>);
}
export declare class UptimeTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    uptimeTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<UptimeTimeseries>;
}
declare class RewardValue {
    workerReward: bigint;
    stakerReward: bigint;
    constructor(props: Partial<RewardValue>);
}
declare class RewardEntry {
    timestamp: Date;
    value: RewardValue | null;
    constructor(props: Partial<RewardEntry>);
}
declare class RewardTimeseries {
    data: RewardEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<RewardTimeseries>);
}
export declare class RewardTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    rewardTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<RewardTimeseries>;
}
declare class AprValue {
    workerApr: number;
    stakerApr: number;
    constructor(props: Partial<AprValue>);
}
declare class AprEntry {
    timestamp: Date;
    value: AprValue | null;
    constructor(props: Partial<AprEntry>);
}
declare class AprTimeseries {
    data: AprEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<AprTimeseries>);
}
export declare class AprTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    aprTimeseries(fromArg?: Date, toArg?: Date, step?: string, workerId?: string): Promise<AprTimeseries>;
}
export {};
