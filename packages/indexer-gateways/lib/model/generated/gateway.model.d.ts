import { GatewayStake } from "./gatewayStake.model";
import { GatewayStatus } from "./_gatewayStatus";
import { GatewayStatusChange } from "./gatewayStatusChange.model";
export declare class Gateway {
    constructor(props?: Partial<Gateway>);
    id: string;
    createdAt: Date;
    ownerId: string;
    stake: GatewayStake;
    status: GatewayStatus;
    statusHistory: GatewayStatusChange[];
    name: string | undefined | null;
    website: string | undefined | null;
    email: string | undefined | null;
    description: string | undefined | null;
    endpointUrl: string | undefined | null;
}
