import { Gateway } from "./gateway.model";
export declare class GatewayStake {
    constructor(props?: Partial<GatewayStake>);
    id: string;
    ownerId: string;
    autoExtension: boolean;
    gateways: Gateway[];
    amount: bigint;
    computationUnits: bigint;
    computationUnitsPending: bigint | undefined | null;
    locked: boolean;
    lockStart: number | undefined | null;
    lockEnd: number | undefined | null;
}
