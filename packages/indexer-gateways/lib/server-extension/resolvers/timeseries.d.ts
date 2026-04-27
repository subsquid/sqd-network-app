import { EntityManager } from 'typeorm';
declare class PoolTvlValue {
    tvlTotal: bigint;
    tvlStable: bigint;
    constructor(props: Partial<PoolTvlValue>);
}
declare class PoolTvlEntry {
    timestamp: Date;
    value: PoolTvlValue;
    constructor(props: Partial<PoolTvlEntry>);
}
declare class PoolTvlTimeseries {
    data: PoolTvlEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<PoolTvlTimeseries>);
}
export declare class PoolTvlTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    poolTvlTimeseries(fromArg?: Date, toArg?: Date, step?: string, poolId?: string): Promise<PoolTvlTimeseries>;
}
declare class PoolApyEntry {
    timestamp: Date;
    value: number;
    constructor(props: Partial<PoolApyEntry>);
}
declare class PoolApyTimeseries {
    data: PoolApyEntry[];
    step: number;
    from: Date;
    to: Date;
    constructor(props: Partial<PoolApyTimeseries>);
}
export declare class PoolApyTimeseriesResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    poolApyTimeseries(fromArg?: Date, toArg?: Date, step?: string, poolId?: string): Promise<PoolApyTimeseries>;
}
export {};
