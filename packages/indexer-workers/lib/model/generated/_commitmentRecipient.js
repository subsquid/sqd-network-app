"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitmentRecipient = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class CommitmentRecipient {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._workerId = marshal.id.fromJSON(json.workerId);
            this._workerReward = marshal.bigint.fromJSON(json.workerReward);
            this._workerApr = marshal.float.fromJSON(json.workerApr);
            this._stakerReward = marshal.bigint.fromJSON(json.stakerReward);
            this._stakerApr = marshal.float.fromJSON(json.stakerApr);
        }
    }
    get workerId() {
        (0, assert_1.default)(this._workerId != null, 'uninitialized access');
        return this._workerId;
    }
    set workerId(value) {
        this._workerId = value;
    }
    get workerReward() {
        (0, assert_1.default)(this._workerReward != null, 'uninitialized access');
        return this._workerReward;
    }
    set workerReward(value) {
        this._workerReward = value;
    }
    get workerApr() {
        (0, assert_1.default)(this._workerApr != null, 'uninitialized access');
        return this._workerApr;
    }
    set workerApr(value) {
        this._workerApr = value;
    }
    get stakerReward() {
        (0, assert_1.default)(this._stakerReward != null, 'uninitialized access');
        return this._stakerReward;
    }
    set stakerReward(value) {
        this._stakerReward = value;
    }
    get stakerApr() {
        (0, assert_1.default)(this._stakerApr != null, 'uninitialized access');
        return this._stakerApr;
    }
    set stakerApr(value) {
        this._stakerApr = value;
    }
    toJSON() {
        return {
            workerId: this.workerId,
            workerReward: marshal.bigint.toJSON(this.workerReward),
            workerApr: this.workerApr,
            stakerReward: marshal.bigint.toJSON(this.stakerReward),
            stakerApr: this.stakerApr,
        };
    }
}
exports.CommitmentRecipient = CommitmentRecipient;
//# sourceMappingURL=_commitmentRecipient.js.map