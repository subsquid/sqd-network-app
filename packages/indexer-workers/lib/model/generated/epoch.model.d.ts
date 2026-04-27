import { EpochStatus } from "./_epochStatus";
export declare class Epoch {
    constructor(props?: Partial<Epoch>);
    id: string;
    number: number;
    start: number;
    startedAt: Date | undefined | null;
    end: number;
    endedAt: Date | undefined | null;
    status: EpochStatus;
    activeWorkerIds: (string)[] | undefined | null;
}
