export declare class WorkerDayUptime {
    private _timestamp;
    private _uptime;
    constructor(props?: Partial<Omit<WorkerDayUptime, 'toJSON'>>, json?: any);
    get timestamp(): Date;
    set timestamp(value: Date);
    get uptime(): number;
    set uptime(value: number);
    toJSON(): object;
}
