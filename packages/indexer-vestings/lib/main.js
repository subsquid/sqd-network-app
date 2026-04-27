//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
require("dotenv/config");
let _belopash_typeorm_store = require("@belopash/typeorm-store");
let _subsquid_batch_processor = require("@subsquid/batch-processor");
let _subsquid_evm_objects = require("@subsquid/evm-objects");
let _subsquid_logger = require("@subsquid/logger");
let _sqd_shared = require("@sqd/shared");
let _sqd_shared_lib_abi_SubsquidVesting = require("@sqd/shared/lib/abi/SubsquidVesting");
_sqd_shared_lib_abi_SubsquidVesting = __toESM(_sqd_shared_lib_abi_SubsquidVesting);
let _sqd_shared_lib_abi_TemporaryHoldingFactory = require("@sqd/shared/lib/abi/TemporaryHoldingFactory");
_sqd_shared_lib_abi_TemporaryHoldingFactory = __toESM(_sqd_shared_lib_abi_TemporaryHoldingFactory);
let _sqd_shared_lib_abi_VestingFactory = require("@sqd/shared/lib/abi/VestingFactory");
_sqd_shared_lib_abi_VestingFactory = __toESM(_sqd_shared_lib_abi_VestingFactory);
let _subsquid_evm_stream = require("@subsquid/evm-stream");
let _subsquid_util_internal = require("@subsquid/util-internal");
let __model = require("./model");
//#region src/config/processor.ts
const builder = new _subsquid_evm_stream.DataSourceBuilder().setFields({
	block: {
		timestamp: true,
		l1BlockNumber: true
	},
	log: {
		address: true,
		topics: true,
		data: true,
		transactionHash: true
	}
}).setBlockRange(_sqd_shared.network.range).includeAllBlocks();
if (process.env.PORTAL_ENDPOINT) builder.setPortal({
	url: (0, _subsquid_util_internal.assertNotNull)(process.env.PORTAL_ENDPOINT),
	minBytes: 40 * 1024 * 1024
});
builder.addLog({
	range: _sqd_shared.network.contracts.VestingFactory.range,
	where: {
		address: [_sqd_shared.network.contracts.VestingFactory.address],
		topic0: [_sqd_shared_lib_abi_VestingFactory.events.VestingCreated.topic]
	}
});
builder.addLog({
	range: _sqd_shared.network.contracts.TemporaryHoldingFactory.range,
	where: {
		address: [_sqd_shared.network.contracts.TemporaryHoldingFactory.address],
		topic0: [_sqd_shared_lib_abi_TemporaryHoldingFactory.events.TemporaryHoldingCreated.topic]
	},
	include: { transaction: true }
});
if (_sqd_shared.network.name === "tethys") builder.addLog(_sqd_shared.VESTING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_SubsquidVesting.events.OwnershipTransferred.topic] }
});
builder.addLog(_sqd_shared.VESTING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_SubsquidVesting.events.ERC20Released.topic] }
});
const processor = builder.build();
//#endregion
//#region src/handlers/TemporaryHoldingCreated.handler.ts
const TEMPORARY_HOLDING_UNLOCK_QUEUE = "temporary-holding-unlock";
const handleTemporaryHoldingCreated = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (item.address !== _sqd_shared.network.contracts.TemporaryHoldingFactory.address) return;
	if (!_sqd_shared_lib_abi_TemporaryHoldingFactory.events.TemporaryHoldingCreated.is(item.value)) return;
	const { vesting: holdingAddress, beneficiaryAddress, admin: adminAddress, unlockTimestamp } = _sqd_shared_lib_abi_TemporaryHoldingFactory.events.TemporaryHoldingCreated.decode(item.value);
	const holdingId = (0, _sqd_shared.createAccountId)(holdingAddress);
	ctx.store.defer(__model.TemporaryHolding, holdingId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const holding = await ctx.store.getOrCreate(__model.TemporaryHolding, holdingId, (id) => {
			return new __model.TemporaryHolding({
				id,
				beneficiary: (0, _sqd_shared.createAccountId)(beneficiaryAddress),
				admin: (0, _sqd_shared.createAccountId)(adminAddress),
				unlockedAt: /* @__PURE__ */ new Date(Number(unlockTimestamp) * 1e3),
				locked: true
			});
		});
		ctx.log.info(`created temporary_holding(${holding.id}) for ${holding.beneficiary} (${elapsed()}ms)`);
		await addToTemporaryHoldingUnlockQueue(ctx, holding.id);
	});
});
async function addToTemporaryHoldingUnlockQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, TEMPORARY_HOLDING_UNLOCK_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function ensureTemporaryHoldingUnlockQueue(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, TEMPORARY_HOLDING_UNLOCK_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.TemporaryHolding, task.id);
}
async function processTemporaryHoldingUnlockQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, TEMPORARY_HOLDING_UNLOCK_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const holding = await ctx.store.getOrFail(__model.TemporaryHolding, task.id);
		if (holding.unlockedAt.getTime() > block.timestamp) {
			tasks.push(task);
			continue;
		}
		holding.locked = false;
		processed++;
		ctx.log.info(`temporary_holding(${holding.id}) unlocked`);
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`temporary-holding-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/handlers/index.ts
const handlers = [
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (item.address !== _sqd_shared.network.contracts.VestingFactory.address) return;
		if (!_sqd_shared_lib_abi_VestingFactory.events.VestingCreated.is(item.value)) return;
		const { vesting: vestingAddress, beneficiary: beneficiaryAddress } = _sqd_shared_lib_abi_VestingFactory.events.VestingCreated.decode(item.value);
		const vestingId = (0, _sqd_shared.createAccountId)(vestingAddress);
		ctx.store.defer(__model.Vesting, vestingId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const vesting = await ctx.store.getOrCreate(__model.Vesting, vestingId, (id) => {
				return new __model.Vesting({
					id,
					beneficiary: (0, _sqd_shared.createAccountId)(beneficiaryAddress),
					createdAt: new Date(item.value.block.timestamp)
				});
			});
			vesting.beneficiary = (0, _sqd_shared.createAccountId)(beneficiaryAddress);
			ctx.templates.add(_sqd_shared.VESTING_TEMPLATE_KEY, (0, _sqd_shared.normalizeAddress)(vestingAddress), item.value.block.height);
			ctx.log.info(`created vesting(${vesting.id}) for ${vesting.beneficiary} (${elapsed()}ms)`);
		});
	}),
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_SubsquidVesting.events.OwnershipTransferred.is(item.value)) return;
		if (item.value.topics.length !== 3) return;
		if (!ctx.templates.has(_sqd_shared.VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const { newOwner } = _sqd_shared_lib_abi_SubsquidVesting.events.OwnershipTransferred.decode(item.value);
		const vestingId = (0, _sqd_shared.createAccountId)(item.address);
		ctx.store.defer(__model.Vesting, vestingId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const vesting = await ctx.store.get(__model.Vesting, vestingId);
			if (!vesting) return;
			vesting.beneficiary = (0, _sqd_shared.createAccountId)(newOwner);
			ctx.log.info(`transferred vesting(${vesting.id}) to ${vesting.beneficiary} (${elapsed()}ms)`);
		});
	}),
	handleTemporaryHoldingCreated
];
//#endregion
//#region src/main.ts
const logger = (0, _subsquid_logger.createLogger)("sqd:vestings");
(0, _subsquid_batch_processor.run)(processor, new _belopash_typeorm_store.TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
	const batchSw = (0, _sqd_shared.stopwatch)();
	const ctx = {
		..._ctx,
		blocks: _ctx.blocks.map(_subsquid_evm_objects.augmentBlock),
		log: logger
	};
	const firstBlock = ctx.blocks[0].header;
	const lastBlock = (0, _sqd_shared.last)(ctx.blocks).header;
	const tasks = [];
	tasks.push(async () => {
		await ensureTemporaryHoldingUnlockQueue(ctx);
	});
	let handlerTaskCount = 0;
	for (const block of ctx.blocks) {
		const items = (0, _sqd_shared.sortItems)(block);
		tasks.push(async () => {
			await processTemporaryHoldingUnlockQueue(ctx, block.header);
		});
		for (const item of items) for (const handler of handlers) {
			const task = handler(ctx, item);
			if (task) {
				tasks.push(task);
				handlerTaskCount++;
			}
		}
	}
	const prepTime = batchSw.get();
	for (const task of tasks) await task();
	const execTime = batchSw.get();
	ctx.log.debug(`batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`);
});
//#endregion

//# sourceMappingURL=main.js.map