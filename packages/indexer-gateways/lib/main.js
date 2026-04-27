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
let _sqd_shared_lib_abi_GatewayRegistry = require("@sqd/shared/lib/abi/GatewayRegistry");
_sqd_shared_lib_abi_GatewayRegistry = __toESM(_sqd_shared_lib_abi_GatewayRegistry);
let _sqd_shared_lib_abi_PortalPoolFactory = require("@sqd/shared/lib/abi/PortalPoolFactory");
_sqd_shared_lib_abi_PortalPoolFactory = __toESM(_sqd_shared_lib_abi_PortalPoolFactory);
let _sqd_shared_lib_abi_PortalPoolImplementation = require("@sqd/shared/lib/abi/PortalPoolImplementation");
_sqd_shared_lib_abi_PortalPoolImplementation = __toESM(_sqd_shared_lib_abi_PortalPoolImplementation);
let _subsquid_evm_stream = require("@subsquid/evm-stream");
let _subsquid_util_internal = require("@subsquid/util-internal");
let __model = require("./model");
let assert = require("assert");
assert = __toESM(assert);
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
}).setBlockRange(_sqd_shared.network.range);
if (process.env.PORTAL_ENDPOINT) builder.setPortal({
	url: (0, _subsquid_util_internal.assertNotNull)(process.env.PORTAL_ENDPOINT),
	minBytes: 40 * 1024 * 1024
});
builder.addLog({
	range: _sqd_shared.network.contracts.GatewayRegistry.range,
	where: {
		address: [_sqd_shared.network.contracts.GatewayRegistry.address],
		topic0: [
			_sqd_shared_lib_abi_GatewayRegistry.events.Registered.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.Unregistered.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.Staked.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.MetadataChanged.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionEnabled.topic,
			_sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionDisabled.topic
		]
	},
	include: { transaction: true }
});
builder.addLog({
	range: _sqd_shared.network.contracts.PortalPoolFactory.range,
	where: {
		address: [_sqd_shared.network.contracts.PortalPoolFactory.address],
		topic0: [_sqd_shared_lib_abi_PortalPoolFactory.events.PoolCreated.topic]
	},
	include: { transaction: true }
});
builder.addLog(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.contracts.PortalPoolFactory.range.from },
	where: { topic0: [
		_sqd_shared_lib_abi_PortalPoolImplementation.events.Deposited.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.Withdrawn.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitRequested.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsToppedUp.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsClaimed.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.CapacityUpdated.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.DistributionRateChanged.topic,
		_sqd_shared_lib_abi_PortalPoolImplementation.events.PoolClosed.topic
	] },
	include: { transaction: true }
});
const processor = builder.build();
//#endregion
//#region src/handlers/gateway/StakeUnlock.queue.ts
const STAKE_UNLOCK_QUEUE = "stake-unlock";
async function ensureGatewayStakeUnlockQueue(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, STAKE_UNLOCK_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.GatewayStake, task.id);
}
async function addToGatewayStakeUnlockQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, STAKE_UNLOCK_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function removeFromGatewayStakeUnlockQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, STAKE_UNLOCK_QUEUE);
	queue.tasks = queue.tasks.filter((task) => task.id !== id);
}
async function processGatewayStakeUnlockQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, STAKE_UNLOCK_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const stake = await ctx.store.getOrFail(__model.GatewayStake, task.id);
		(0, assert.default)(stake.locked, `stake(${stake.id}) already unlocked`);
		if (stake.lockEnd && stake.lockEnd > block.l1BlockNumber) {
			tasks.push(task);
			continue;
		}
		stake.locked = false;
		processed++;
		ctx.log.info(`stake(${stake.id}) unlocked`);
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`stake-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/helpers.ts
function createGatewayStake(id, ownerId) {
	return new __model.GatewayStake({
		id,
		ownerId,
		autoExtension: false,
		amount: 0n,
		computationUnits: 0n,
		locked: false
	});
}
//#endregion
//#region src/handlers/gateway/StakeApply.queue.ts
const STAKE_APPLY_QUEUE = "stake-apply";
async function ensureGatewayStakeApplyQueue(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, STAKE_APPLY_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.GatewayStake, task.id);
}
async function addToGatewayStakeApplyQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, STAKE_APPLY_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function processGatewayStakeApplyQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, STAKE_APPLY_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const stake = await ctx.store.getOrFail(__model.GatewayStake, task.id);
		if (stake.lockStart && stake.lockStart > block.l1BlockNumber) {
			tasks.push(task);
			continue;
		}
		(0, assert.default)(stake.computationUnitsPending != null, `pending computation units is equal to ${stake.computationUnitsPending}`);
		stake.computationUnits = stake.computationUnitsPending;
		stake.computationUnitsPending = null;
		processed++;
		ctx.log.info(`stake(${stake.id}) applied`);
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`stake-apply queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/handlers/gateway/Staked.handler.ts
const INT32_MAX = 2147483647;
const gatewayStakedHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.Staked.is(item.value)) return;
	const log = item.value;
	const event = _sqd_shared_lib_abi_GatewayRegistry.events.Staked.decode(log);
	const ownerId = (0, _sqd_shared.createAccountId)(event.gatewayOperator);
	const stakeId = (0, _sqd_shared.createGatewayOperatorId)(event.gatewayOperator);
	ctx.store.defer(__model.GatewayStake, stakeId);
	const poolDeferred = ctx.store.defer(__model.PortalPool, ownerId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		if (await poolDeferred.get()) {
			ctx.log.info(`skipped Staked: operator ${ownerId} is a portal pool (${elapsed()}ms)`);
			return;
		}
		const stake = await ctx.store.getOrCreate(__model.GatewayStake, stakeId, (id) => createGatewayStake(id, ownerId));
		stake.amount += event.amount;
		stake.computationUnitsPending = event.computationUnits;
		stake.lockStart = Number(event.lockStart);
		stake.lockEnd = event.lockEnd > 2147483647 ? INT32_MAX : Number(event.lockEnd);
		stake.locked = true;
		ctx.log.info(`operator(${ownerId}) staked ${(0, _sqd_shared.toHumanSQD)(stake.amount)} for [${stake.lockStart}, ${stake.lockEnd}] (${elapsed()}ms)`);
		await addToGatewayStakeApplyQueue(ctx, stake.id);
		await addToGatewayStakeUnlockQueue(ctx, stake.id);
	});
});
//#endregion
//#region src/handlers/gateway/AutoExtensionChanged.handler.ts
const autoExtensionChangedHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionEnabled.is(item.value) && !_sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionDisabled.is(item.value)) return;
	const log = item.value;
	let gatewayOperator, lockEnd, autoExtension;
	if (_sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionEnabled.is(log)) {
		gatewayOperator = _sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionEnabled.decode(log).gatewayOperator;
		lockEnd = INT32_MAX;
		autoExtension = true;
	} else {
		const data = _sqd_shared_lib_abi_GatewayRegistry.events.AutoextensionDisabled.decode(log);
		gatewayOperator = data.gatewayOperator;
		lockEnd = Number(data.lockEnd);
		autoExtension = false;
	}
	const stakeId = (0, _sqd_shared.createGatewayOperatorId)(gatewayOperator);
	const stakeDeferred = ctx.store.defer(__model.GatewayStake, stakeId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const stake = await stakeDeferred.get();
		if (!stake) {
			ctx.log.info(`skipped AutoExtensionChanged: no stake for operator ${stakeId} (${elapsed()}ms)`);
			return;
		}
		stake.autoExtension = autoExtension;
		stake.locked = true;
		stake.lockEnd = lockEnd;
		if (lockEnd) {
			await removeFromGatewayStakeUnlockQueue(ctx, stake.id);
			ctx.log.info(`stake(${stake.id}) auto-extension enabled (${elapsed()}ms)`);
		} else {
			await addToGatewayStakeUnlockQueue(ctx, stake.id);
			ctx.log.info(`stake(${stake.id}) auto-extension disabled [${stake.lockStart}, ${stake.lockEnd}] (${elapsed()}ms)`);
		}
	});
});
//#endregion
//#region src/handlers/gateway/MetadataChanged.handler.ts
const handleMetadataChanged = (0, _sqd_shared.createHandlerOld)({
	filter(_, item) {
		return (0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry) && (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_GatewayRegistry.events.MetadataChanged.is(item.value);
	},
	handle(ctx, { value: log }) {
		const event = _sqd_shared_lib_abi_GatewayRegistry.events.MetadataChanged.decode(log);
		const gatewayId = (0, _sqd_shared.parsePeerId)(event.peerId);
		const gatewayDeferred = ctx.store.defer(__model.Gateway, gatewayId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const gateway = await gatewayDeferred.getOrFail();
			const metadata = (0, _sqd_shared.parseGatewayMetadata)(ctx, event.metadata);
			gateway.name = metadata.name;
			gateway.website = metadata.website;
			gateway.description = metadata.description;
			gateway.email = metadata.email;
			gateway.endpointUrl = metadata.endpointUrl;
			ctx.log.info(`updated metadata of gateway(${gatewayId}) (${elapsed()}ms)`);
		});
	}
});
//#endregion
//#region src/handlers/gateway/Registered.handler.ts
const handleRegistered = (0, _sqd_shared.createHandlerOld)({
	filter(_, item) {
		return (0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry) && (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_GatewayRegistry.events.Registered.is(item.value);
	},
	handle(ctx, { value: log }) {
		const event = _sqd_shared_lib_abi_GatewayRegistry.events.Registered.decode(log);
		const ownerId = (0, _sqd_shared.createAccountId)(event.gatewayOperator);
		const stakeId = (0, _sqd_shared.createGatewayOperatorId)(event.gatewayOperator);
		ctx.store.defer(__model.GatewayStake, stakeId);
		const gatewayId = (0, _sqd_shared.parsePeerId)(event.peerId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const stake = await ctx.store.getOrCreate(__model.GatewayStake, stakeId, (id) => createGatewayStake(id, ownerId));
			const gateway = new __model.Gateway({
				id: gatewayId,
				status: __model.GatewayStatus.UNKNOWN,
				createdAt: new Date(log.block.timestamp),
				ownerId,
				stake,
				description: null,
				email: null,
				endpointUrl: null,
				name: null,
				website: null
			});
			const statusChange = new __model.GatewayStatusChange({
				id: (0, _sqd_shared.createWorkerStatusId)(gatewayId, log.block.l1BlockNumber),
				blockNumber: log.block.height,
				gateway,
				status: __model.GatewayStatus.REGISTERED,
				timestamp: new Date(log.block.timestamp)
			});
			await ctx.store.track(statusChange);
			gateway.status = statusChange.status;
			await ctx.store.track(gateway, { replace: true });
			ctx.log.info(`operator(${ownerId}) registered gateway(${gatewayId}) (${elapsed()}ms)`);
		});
	}
});
//#endregion
//#region src/handlers/gateway/Unregistered.handler.ts
const handleUnregistered = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.Unregistered.is(item.value)) return;
	const log = item.value;
	const gatewayId = (0, _sqd_shared.parsePeerId)(_sqd_shared_lib_abi_GatewayRegistry.events.Unregistered.decode(log).peerId);
	const gatewayDeferred = ctx.store.defer(__model.Gateway, gatewayId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const gateway = await gatewayDeferred.getOrFail();
		const statusChange = new __model.GatewayStatusChange({
			id: (0, _sqd_shared.createWorkerStatusId)(gatewayId, log.block.height),
			blockNumber: log.block.height,
			gateway,
			status: __model.GatewayStatus.DEREGISTERED,
			timestamp: new Date(log.block.timestamp)
		});
		await ctx.store.track(statusChange);
		gateway.status = statusChange.status;
		ctx.log.info(`gateway(${gatewayId}) deregistered (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/gateway/Unstaked.handler.ts
const handleUnstaked = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.is(item.value)) return;
	const log = item.value;
	const event = _sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.decode(log);
	const operatorId = (0, _sqd_shared.createGatewayOperatorId)(event.gatewayOperator);
	const stakeDeferred = ctx.store.defer(__model.GatewayStake, operatorId);
	const poolDeferred = ctx.store.defer(__model.PortalPool, operatorId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		if (await poolDeferred.get()) {
			ctx.log.info(`skipped Unstaked: operator ${operatorId} is a portal pool (${elapsed()}ms)`);
			return;
		}
		const stake = await stakeDeferred.getOrFail();
		stake.amount = 0n;
		stake.computationUnits = 0n;
		stake.lockStart = null;
		stake.lockEnd = null;
		stake.computationUnitsPending = null;
		ctx.log.info(`operator(${operatorId}) unstaked ${(0, _sqd_shared.toHumanSQD)(event.amount)} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/CapacityUpdated.handler.ts
const handleCapacityUpdated = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.CapacityUpdated.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.CapacityUpdated.decode(log);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		const change = new __model.PoolCapacityChange({
			id: `${log.getTransaction().hash}-${log.logIndex}`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			oldCapacity: event.oldCapacity,
			newCapacity: event.newCapacity
		});
		pool.capacity = event.newCapacity;
		await ctx.store.track(change);
		ctx.log.info(`portal_pool(${poolAddress}) capacity ${event.oldCapacity} -> ${event.newCapacity} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/Deposited.handler.ts
const handleDeposited = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.Deposited.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.Deposited.decode(log);
	const providerId = (0, _sqd_shared.createAccountId)(event.provider);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	const providerEntityId = `${poolAddress}-${providerId}`;
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		pool.tvlTotal += event.amount;
		pool.tvlStable += event.amount;
		const provider = await ctx.store.getOrCreate(__model.PoolProvider, providerEntityId, (id) => new __model.PoolProvider({
			id,
			pool,
			providerId,
			deposited: 0n
		}));
		provider.deposited += event.amount;
		const poolEvent = new __model.PoolEvent({
			id: `${log.getTransaction().hash}-${log.logIndex}`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			eventType: __model.PoolEventType.DEPOSIT,
			amount: event.amount,
			providerId
		});
		await ctx.store.track(poolEvent);
		ctx.log.info(`portal_pool(${poolAddress}) deposit by ${providerId} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/DistributionRateChanged.handler.ts
const handleDistributionRateChanged = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.DistributionRateChanged.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.DistributionRateChanged.decode(log);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		const change = new __model.PoolDistributionRateChange({
			id: `${log.getTransaction().hash}-${log.logIndex}`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			oldRate: event.oldRate,
			newRate: event.newRate
		});
		pool.rewardRate = event.newRate;
		await ctx.store.track(change);
		ctx.log.info(`portal_pool(${poolAddress}) rate ${event.oldRate} -> ${event.newRate} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/ExitClaimed.handler.ts
const handleExitClaimed = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.decode(log);
	const providerId = (0, _sqd_shared.createAccountId)(event.provider);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		pool.tvlTotal -= event.amount;
		const poolEvent = new __model.PoolEvent({
			id: `${log.getTransaction().hash}-${log.logIndex}-claim`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			eventType: __model.PoolEventType.WITHDRAWAL,
			amount: event.amount,
			providerId
		});
		await ctx.store.track(poolEvent);
		ctx.log.info(`portal_pool(${poolAddress}) exit claimed by ${providerId} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/ExitRequested.handler.ts
const handleExitRequested = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitRequested.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.ExitRequested.decode(log);
	const providerId = (0, _sqd_shared.createAccountId)(event.provider);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	const providerEntityId = `${poolAddress}-${providerId}`;
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		pool.tvlStable -= event.amount;
		const provider = await ctx.store.defer(__model.PoolProvider, providerEntityId).get();
		if (provider) provider.deposited -= event.amount;
		const poolEvent = new __model.PoolEvent({
			id: `${log.getTransaction().hash}-${log.logIndex}-request`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			eventType: __model.PoolEventType.EXIT,
			amount: event.amount,
			providerId
		});
		await ctx.store.track(poolEvent);
		ctx.log.info(`portal_pool(${poolAddress}) exit requested by ${providerId} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/PoolClosed.handler.ts
const handlePoolClosed = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.PoolClosed.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		pool.closedAt = new Date(log.block.timestamp);
		pool.closedAtBlock = log.block.height;
		ctx.log.info(`portal_pool(${poolAddress}) closed (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/PoolCreated.handler.ts
const handlePoolCreated = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (item.address !== _sqd_shared.network.contracts.PortalPoolFactory.address) return;
	if (!_sqd_shared_lib_abi_PortalPoolFactory.events.PoolCreated.is(item.value)) return;
	const log = item.value;
	const event = _sqd_shared_lib_abi_PortalPoolFactory.events.PoolCreated.decode(log);
	const portalAddress = (0, _sqd_shared.normalizeAddress)(event.portal);
	const operatorId = (0, _sqd_shared.createAccountId)(event.operator);
	const txHash = log.getTransaction().hash;
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const timestamp = new Date(log.block.timestamp);
		const blockNumber = log.block.height;
		let initialTopUpAmount = 0n;
		let initialTopUpLogIndex = null;
		const currentBlock = ctx.blocks.find((b) => b.logs.some((l) => l.getTransaction().hash === txHash));
		if (currentBlock) {
			for (const blockLog of currentBlock.logs) if (blockLog.getTransaction().hash === txHash && blockLog.logIndex < log.logIndex && blockLog.address.toLowerCase() === portalAddress && _sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsToppedUp.is(blockLog)) {
				initialTopUpAmount = _sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsToppedUp.decode(blockLog).toProviders;
				initialTopUpLogIndex = blockLog.logIndex;
				break;
			}
		}
		const pool = new __model.PortalPool({
			id: portalAddress,
			createdAt: timestamp,
			createdAtBlock: blockNumber,
			operator: operatorId,
			rewardToken: (0, _sqd_shared.normalizeAddress)(event.rewardToken),
			capacity: event.capacity,
			rewardRate: event.distributionRatePerSecond,
			totalRewardsToppedUp: initialTopUpAmount,
			tvlTotal: 0n,
			tvlStable: 0n,
			tokenSuffix: event.tokenSuffix,
			metadata: event.metadata || null
		});
		await ctx.store.track(pool);
		if (initialTopUpLogIndex != null && initialTopUpAmount > 0n) {
			const topUpEvent = new __model.PoolEvent({
				id: `${txHash}-${initialTopUpLogIndex}`,
				blockNumber,
				timestamp,
				txHash,
				pool,
				eventType: __model.PoolEventType.TOPUP,
				amount: initialTopUpAmount
			});
			await ctx.store.track(topUpEvent);
		}
		ctx.templates.add(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, portalAddress, blockNumber);
		ctx.log.info(`created portal_pool(${portalAddress}) by operator(${operatorId}) (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/RewardsClaimed.handler.ts
const handleRewardsClaimed = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsClaimed.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsClaimed.decode(log);
	const providerId = (0, _sqd_shared.createAccountId)(event.provider);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		const poolEvent = new __model.PoolEvent({
			id: `${log.getTransaction().hash}-${log.logIndex}`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			eventType: __model.PoolEventType.CLAIM,
			amount: event.amount,
			providerId
		});
		await ctx.store.track(poolEvent);
		ctx.log.info(`portal_pool(${poolAddress}) rewards claimed by ${providerId} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/pool/RewardsToppedUp.handler.ts
const handleRewardsToppedUp = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsToppedUp.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
	const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.RewardsToppedUp.decode(log);
	const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const pool = await poolDeferred.get();
		if (!pool) return;
		pool.totalRewardsToppedUp += event.toProviders;
		const poolEvent = new __model.PoolEvent({
			id: `${log.getTransaction().hash}-${log.logIndex}`,
			blockNumber: log.block.height,
			timestamp: new Date(log.block.timestamp),
			txHash: log.getTransaction().hash,
			pool,
			eventType: __model.PoolEventType.TOPUP,
			amount: event.toProviders
		});
		await ctx.store.track(poolEvent);
		ctx.log.info(`portal_pool(${poolAddress}) topped up ${event.toProviders} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/index.ts
const handlers = [
	handleRegistered,
	handleUnregistered,
	gatewayStakedHandler,
	handleUnstaked,
	handleMetadataChanged,
	autoExtensionChangedHandler,
	handlePoolCreated,
	handlePoolClosed,
	handleDeposited,
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.Withdrawn.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const log = item.value;
		const poolAddress = (0, _sqd_shared.normalizeAddress)(log.address);
		const event = _sqd_shared_lib_abi_PortalPoolImplementation.events.Withdrawn.decode(log);
		const providerId = (0, _sqd_shared.createAccountId)(event.provider);
		const poolDeferred = ctx.store.defer(__model.PortalPool, poolAddress);
		const providerEntityId = `${poolAddress}-${providerId}`;
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const pool = await poolDeferred.get();
			if (!pool) return;
			pool.tvlTotal -= event.amount;
			pool.tvlStable -= event.amount;
			const provider = await ctx.store.defer(__model.PoolProvider, providerEntityId).get();
			if (provider) provider.deposited -= event.amount;
			const poolEvent = new __model.PoolEvent({
				id: `${log.getTransaction().hash}-${log.logIndex}`,
				blockNumber: log.block.height,
				timestamp: new Date(log.block.timestamp),
				txHash: log.getTransaction().hash,
				pool,
				eventType: __model.PoolEventType.WITHDRAWAL,
				amount: event.amount,
				providerId
			});
			await ctx.store.track(poolEvent);
			ctx.log.info(`portal_pool(${poolAddress}) withdrawal by ${providerId} (${elapsed()}ms)`);
		});
	}),
	handleExitRequested,
	handleExitClaimed,
	handleRewardsToppedUp,
	handleRewardsClaimed,
	handleCapacityUpdated,
	handleDistributionRateChanged
];
//#endregion
//#region src/main.ts
const logger = (0, _subsquid_logger.createLogger)("sqd:gateways");
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
		await ensureGatewayStakeApplyQueue(ctx);
		await ensureGatewayStakeUnlockQueue(ctx);
	});
	let handlerTaskCount = 0;
	for (const block of ctx.blocks) {
		const items = (0, _sqd_shared.sortItems)(block);
		tasks.push(async () => {
			await processGatewayStakeApplyQueue(ctx, block.header);
			await processGatewayStakeUnlockQueue(ctx, block.header);
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