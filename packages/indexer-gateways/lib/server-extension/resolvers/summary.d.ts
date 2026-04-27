import { EntityManager } from 'typeorm';
export declare class GatewaysSummary {
    totalGatewayStake: bigint;
    totalPortalPoolTvl: bigint;
    gatewayStakeCount: number;
    portalPoolCount: number;
    constructor(props: Partial<GatewaysSummary>);
}
export declare class GatewaysSummaryResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    gatewaysSummary(): Promise<GatewaysSummary>;
}
