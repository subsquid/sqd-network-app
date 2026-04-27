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
exports.SquidStatusResolver = exports.SquidStatus = void 0;
const assert_1 = __importDefault(require("assert"));
const type_graphql_1 = require("type-graphql");
let SquidStatus = class SquidStatus {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.SquidStatus = SquidStatus;
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], SquidStatus.prototype, "height", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], SquidStatus.prototype, "finalizedHeight", void 0);
exports.SquidStatus = SquidStatus = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], SquidStatus);
let SquidStatusResolver = class SquidStatusResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async squidStatus() {
        const manager = await this.tx();
        return await manager
            .query(`
        SELECT f.height AS "finalizedHeight",
            COALESCE(h.height, f.height) AS height
        FROM squid_processor.status AS f
        FULL JOIN
            (SELECT *
                FROM squid_processor.hot_block
                ORDER BY height DESC
                LIMIT 1) AS h ON TRUE
        WHERE f.id = 0
        `)
            .then((r) => {
            (0, assert_1.default)(r.length === 1);
            const height = parseInt(r[0].height);
            const finalizedHeight = parseInt(r[0].finalizedHeight);
            return new SquidStatus({ height, finalizedHeight });
        });
    }
};
exports.SquidStatusResolver = SquidStatusResolver;
__decorate([
    (0, type_graphql_1.Query)(() => SquidStatus),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SquidStatusResolver.prototype, "squidStatus", null);
exports.SquidStatusResolver = SquidStatusResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], SquidStatusResolver);
//# sourceMappingURL=squidStatus.js.map