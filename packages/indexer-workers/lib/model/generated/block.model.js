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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
let Block = class Block {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Block = Block;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Block.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Block.prototype, "hash", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], Block.prototype, "height", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Block.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Block.prototype, "l1BlockNumber", void 0);
exports.Block = Block = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Block);
//# sourceMappingURL=block.model.js.map