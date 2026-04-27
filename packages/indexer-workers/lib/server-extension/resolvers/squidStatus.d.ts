import { EntityManager } from 'typeorm';
export declare class SquidStatus {
    height: number;
    finalizedHeight: number;
    constructor(props: Partial<SquidStatus>);
}
export declare class SquidStatusResolver {
    private tx;
    constructor(tx: () => Promise<EntityManager>);
    squidStatus(): Promise<SquidStatus>;
}
