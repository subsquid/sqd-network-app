"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysSummaryResolver = exports.GatewaysSummary = void 0;
const assert_1 = __importDefault(require("assert"));
const graphql_server_1 = require("@subsquid/graphql-server");
const type_graphql_1 = require("type-graphql");
let GatewaysSummary = class GatewaysSummary {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.GatewaysSummary = GatewaysSummary;
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], GatewaysSummary.prototype, "totalGatewayStake", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], GatewaysSummary.prototype, "totalPortalPoolTvl", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], GatewaysSummary.prototype, "gatewayStakeCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], GatewaysSummary.prototype, "portalPoolCount", void 0);
exports.GatewaysSummary = GatewaysSummary = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], GatewaysSummary);
let GatewaysSummaryResolver = class GatewaysSummaryResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async gatewaysSummary() {
        const manager = await this.tx();
        return await manager
            .query(`
        SELECT
          COALESCE((SELECT SUM(amount) FROM gateway_stake), 0) as "totalGatewayStake",
          COALESCE((SELECT SUM(tvl_total) FROM portal_pool WHERE closed_at IS NULL), 0) as "totalPortalPoolTvl",
          COALESCE((SELECT COUNT(*) FROM gateway_stake), 0) as "gatewayStakeCount",
          COALESCE((SELECT COUNT(*) FROM portal_pool WHERE closed_at IS NULL), 0) as "portalPoolCount"
        `)
            .then((r) => {
            (0, assert_1.default)(r.length === 1);
            return new GatewaysSummary(r[0]);
        });
    }
};
exports.GatewaysSummaryResolver = GatewaysSummaryResolver;
__decorate([
    (0, type_graphql_1.Query)(() => GatewaysSummary),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GatewaysSummaryResolver.prototype, "gatewaysSummary", null);
exports.GatewaysSummaryResolver = GatewaysSummaryResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], GatewaysSummaryResolver);
//# sourceMappingURL=summary.js.map