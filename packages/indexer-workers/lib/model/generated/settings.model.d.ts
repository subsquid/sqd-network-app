import { Contracts } from "./_contracts";
export declare class Settings {
    constructor(props?: Partial<Settings>);
    id: string;
    bondAmount: bigint | undefined | null;
    delegationLimitCoefficient: number;
    epochLength: number | undefined | null;
    minimalWorkerVersion: string | undefined | null;
    recommendedWorkerVersion: string | undefined | null;
    lockPeriod: number | undefined | null;
    contracts: Contracts;
    currentEpoch: number | undefined | null;
    utilizedStake: bigint;
    baseApr: number;
    statsChunkCursor: Date | undefined | null;
}
