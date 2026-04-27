import { Gateway } from "./gateway.model";
import { GatewayStatus } from "./_gatewayStatus";
export declare class GatewayStatusChange {
    constructor(props?: Partial<GatewayStatusChange>);
    id: string;
    gateway: Gateway;
    status: GatewayStatus;
    timestamp: Date | undefined | null;
    blockNumber: number;
}
