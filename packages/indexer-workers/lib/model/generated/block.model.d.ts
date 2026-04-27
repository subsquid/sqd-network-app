export declare class Block {
    constructor(props?: Partial<Block>);
    id: string;
    hash: string;
    height: number;
    timestamp: Date;
    l1BlockNumber: number | undefined | null;
}
