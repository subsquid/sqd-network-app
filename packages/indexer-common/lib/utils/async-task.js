"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncTask = void 0;
class AsyncTask {
    constructor() {
        this._result = { state: 'pending' };
    }
    get() {
        return this._result;
    }
    static start(fn) {
        const task = new AsyncTask();
        fn().then((value) => {
            task._result = { state: 'fulfilled', value };
        }, (error) => {
            task._result = { state: 'rejected', error };
        });
        return task;
    }
}
exports.AsyncTask = AsyncTask;
//# sourceMappingURL=async-task.js.map