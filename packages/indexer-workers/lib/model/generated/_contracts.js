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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const marshal = __importStar(require("./marshal"));
class Contracts {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._router = json.router == null ? undefined : marshal.string.fromJSON(json.router);
            this._networkController = json.networkController == null ? undefined : marshal.string.fromJSON(json.networkController);
            this._staking = json.staking == null ? undefined : marshal.string.fromJSON(json.staking);
            this._workerRegistration = json.workerRegistration == null ? undefined : marshal.string.fromJSON(json.workerRegistration);
            this._rewardTreasury = json.rewardTreasury == null ? undefined : marshal.string.fromJSON(json.rewardTreasury);
            this._distributedRewardsDistribution = json.distributedRewardsDistribution == null ? undefined : marshal.string.fromJSON(json.distributedRewardsDistribution);
            this._gatewayRegistry = json.gatewayRegistry == null ? undefined : marshal.string.fromJSON(json.gatewayRegistry);
            this._rewardCalculation = json.rewardCalculation == null ? undefined : marshal.string.fromJSON(json.rewardCalculation);
            this._softCap = json.softCap == null ? undefined : marshal.string.fromJSON(json.softCap);
            this._vestingFactory = json.vestingFactory == null ? undefined : marshal.string.fromJSON(json.vestingFactory);
            this._temporaryHoldingFactory = json.temporaryHoldingFactory == null ? undefined : marshal.string.fromJSON(json.temporaryHoldingFactory);
            this._portalPoolFactory = json.portalPoolFactory == null ? undefined : marshal.string.fromJSON(json.portalPoolFactory);
        }
    }
    get router() {
        return this._router;
    }
    set router(value) {
        this._router = value;
    }
    get networkController() {
        return this._networkController;
    }
    set networkController(value) {
        this._networkController = value;
    }
    get staking() {
        return this._staking;
    }
    set staking(value) {
        this._staking = value;
    }
    get workerRegistration() {
        return this._workerRegistration;
    }
    set workerRegistration(value) {
        this._workerRegistration = value;
    }
    get rewardTreasury() {
        return this._rewardTreasury;
    }
    set rewardTreasury(value) {
        this._rewardTreasury = value;
    }
    get distributedRewardsDistribution() {
        return this._distributedRewardsDistribution;
    }
    set distributedRewardsDistribution(value) {
        this._distributedRewardsDistribution = value;
    }
    get gatewayRegistry() {
        return this._gatewayRegistry;
    }
    set gatewayRegistry(value) {
        this._gatewayRegistry = value;
    }
    get rewardCalculation() {
        return this._rewardCalculation;
    }
    set rewardCalculation(value) {
        this._rewardCalculation = value;
    }
    get softCap() {
        return this._softCap;
    }
    set softCap(value) {
        this._softCap = value;
    }
    get vestingFactory() {
        return this._vestingFactory;
    }
    set vestingFactory(value) {
        this._vestingFactory = value;
    }
    get temporaryHoldingFactory() {
        return this._temporaryHoldingFactory;
    }
    set temporaryHoldingFactory(value) {
        this._temporaryHoldingFactory = value;
    }
    get portalPoolFactory() {
        return this._portalPoolFactory;
    }
    set portalPoolFactory(value) {
        this._portalPoolFactory = value;
    }
    toJSON() {
        return {
            router: this.router,
            networkController: this.networkController,
            staking: this.staking,
            workerRegistration: this.workerRegistration,
            rewardTreasury: this.rewardTreasury,
            distributedRewardsDistribution: this.distributedRewardsDistribution,
            gatewayRegistry: this.gatewayRegistry,
            rewardCalculation: this.rewardCalculation,
            softCap: this.softCap,
            vestingFactory: this.vestingFactory,
            temporaryHoldingFactory: this.temporaryHoldingFactory,
            portalPoolFactory: this.portalPoolFactory,
        };
    }
}
exports.Contracts = Contracts;
//# sourceMappingURL=_contracts.js.map