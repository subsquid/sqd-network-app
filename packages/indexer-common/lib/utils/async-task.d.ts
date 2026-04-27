export type AsyncTaskResult<T> = {
    state: 'pending';
} | {
    state: 'fulfilled';
    value: T;
} | {
    state: 'rejected';
    error: unknown;
};
export declare class AsyncTask<T> {
    private _result;
    private constructor();
    get(): AsyncTaskResult<T>;
    static start<T>(fn: () => Promise<T>): AsyncTask<T>;
}
//# sourceMappingURL=async-task.d.ts.map