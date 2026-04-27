import { CommitmentRecipient } from "./_commitmentRecipient";
export declare class Commitment {
    constructor(props?: Partial<Commitment>);
    id: string;
    from: Date;
    fromBlock: number;
    to: Date;
    toBlock: number;
    recipients: (CommitmentRecipient)[];
}
