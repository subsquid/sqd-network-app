export declare class CommitmentRecipient {
    private _workerId;
    private _workerReward;
    private _workerApr;
    private _stakerReward;
    private _stakerApr;
    constructor(props?: Partial<Omit<CommitmentRecipient, 'toJSON'>>, json?: any);
    get workerId(): string;
    set workerId(value: string);
    get workerReward(): bigint;
    set workerReward(value: bigint);
    get workerApr(): number;
    set workerApr(value: number);
    get stakerReward(): bigint;
    set stakerReward(value: bigint);
    get stakerApr(): number;
    set stakerApr(value: number);
    toJSON(): object;
}
