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
let typeorm = require("typeorm");
let _sqd_shared = require("@sqd/shared");
let __model = require("./model");
let _sqd_shared_lib_abi_DistributedRewardsDistribution = require("@sqd/shared/lib/abi/DistributedRewardsDistribution");
_sqd_shared_lib_abi_DistributedRewardsDistribution = __toESM(_sqd_shared_lib_abi_DistributedRewardsDistribution);
let _sqd_shared_lib_abi_NetworkController = require("@sqd/shared/lib/abi/NetworkController");
_sqd_shared_lib_abi_NetworkController = __toESM(_sqd_shared_lib_abi_NetworkController);
let _sqd_shared_lib_abi_Router = require("@sqd/shared/lib/abi/Router");
_sqd_shared_lib_abi_Router = __toESM(_sqd_shared_lib_abi_Router);
let _sqd_shared_lib_abi_Staking = require("@sqd/shared/lib/abi/Staking");
_sqd_shared_lib_abi_Staking = __toESM(_sqd_shared_lib_abi_Staking);
let _sqd_shared_lib_abi_WorkerRegistration = require("@sqd/shared/lib/abi/WorkerRegistration");
_sqd_shared_lib_abi_WorkerRegistration = __toESM(_sqd_shared_lib_abi_WorkerRegistration);
let _subsquid_evm_stream = require("@subsquid/evm-stream");
let _subsquid_util_internal = require("@subsquid/util-internal");
let assert = require("assert");
assert = __toESM(assert);
let _subsquid_big_decimal = require("@subsquid/big-decimal");
let _subsquid_http_client = require("@subsquid/http-client");
let date_fns = require("date-fns");
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
}).setBlockRange({ from: _sqd_shared.network.range.from });
if (process.env.PORTAL_ENDPOINT) builder.setPortal({
	url: (0, _subsquid_util_internal.assertNotNull)(process.env.PORTAL_ENDPOINT),
	maxBytes: 100 * 1024 * 1024
});
builder.addLog({
	range: _sqd_shared.network.contracts.RewardsDistribution.range,
	where: {
		address: [_sqd_shared.network.contracts.RewardsDistribution.address],
		topic0: [_sqd_shared_lib_abi_DistributedRewardsDistribution.events.Claimed.topic, _sqd_shared_lib_abi_DistributedRewardsDistribution.events.Distributed.topic]
	}
});
builder.addLog({
	range: _sqd_shared.network.contracts.Router.range,
	where: {
		address: [_sqd_shared.network.contracts.Router.address],
		topic0: [
			_sqd_shared_lib_abi_Router.events.NetworkControllerSet.topic,
			_sqd_shared_lib_abi_Router.events.RewardCalculationSet.topic,
			_sqd_shared_lib_abi_Router.events.RewardTreasurySet.topic,
			_sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.topic,
			_sqd_shared_lib_abi_Router.events.StakingSet.topic
		]
	}
});
builder.addLog(_sqd_shared.STAKING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [
		_sqd_shared_lib_abi_Staking.events.Claimed.topic,
		_sqd_shared_lib_abi_Staking.events.Deposited.topic,
		_sqd_shared_lib_abi_Staking.events.Withdrawn.topic
	] }
});
builder.addLog(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerDeregistered.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.MetadataUpdated.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.ExcessiveBondReturned.topic
	] }
});
builder.addLog(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [
		_sqd_shared_lib_abi_NetworkController.events.BondAmountUpdated.topic,
		_sqd_shared_lib_abi_NetworkController.events.EpochLengthUpdated.topic,
		_sqd_shared_lib_abi_NetworkController.events.LockPeriodUpdated.topic
	] }
});
const processor = builder.build();
//#endregion
//#region src/handlers/network-controller/index.ts
const handlers$5 = [
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_NetworkController.events.BondAmountUpdated.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const { bondAmount } = _sqd_shared_lib_abi_NetworkController.events.BondAmountUpdated.decode(item.value);
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		return async () => {
			const settings = await settingsDeferred.getOrFail();
			settings.bondAmount = bondAmount;
			ctx.log.info(`set bond amount ${bondAmount}`);
		};
	}),
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_NetworkController.events.EpochLengthUpdated.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const event = _sqd_shared_lib_abi_NetworkController.events.EpochLengthUpdated.decode(item.value);
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		return async () => {
			const settings = await settingsDeferred.getOrFail();
			settings.epochLength = Number(event.epochLength);
			ctx.log.info(`set epoch length to ${settings.epochLength}`);
		};
	}),
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_NetworkController.events.LockPeriodUpdated.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const event = _sqd_shared_lib_abi_NetworkController.events.LockPeriodUpdated.decode(item.value);
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		return async () => {
			const settings = await settingsDeferred.getOrFail();
			settings.lockPeriod = Number(event.lockPeriod);
			ctx.log.info(`set lock period to ${settings.lockPeriod}`);
		};
	})
];
//#endregion
//#region src/handlers/rewards-distributor/Claimed.handler.ts
const handleRewardsClaimed = (0, _sqd_shared.createHandlerOld)({
	filter(_, item) {
		return (0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.RewardsDistribution) && (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_DistributedRewardsDistribution.events.Claimed.is(item.value);
	},
	handle(ctx, { value: log }) {
		const { worker: workerIndex, by: stakerAccount, amount } = _sqd_shared_lib_abi_DistributedRewardsDistribution.events.Claimed.decode(log);
		const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
		const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
		const workerDeferred = ctx.store.defer(__model.Worker, workerId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const worker = await workerDeferred.getOrFail();
			(0, assert.default)(worker.ownerId === accountId, `rewards claim for worker(${worker.id}): claimer ${accountId} != ownerId ${worker.ownerId}`);
			worker.claimableReward = 0n;
			worker.claimedReward += amount;
			ctx.log.info(`operator(${accountId}) claimed ${(0, _sqd_shared.toHumanSQD)(amount)} from worker(${worker.id}) (${elapsed()}ms)`);
		});
	}
});
//#endregion
//#region src/handlers/rewards-distributor/Distributed.handler.ts
const SHARE_SCALE = 10n ** 18n;
const rewardsDistributedHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.RewardsDistribution)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_DistributedRewardsDistribution.events.Distributed.is(item.value)) return;
	const log = item.value;
	const event = _sqd_shared_lib_abi_DistributedRewardsDistribution.events.Distributed.decode(log);
	const recipientIds = new Array(event.recipients.length);
	const payouts = /* @__PURE__ */ new Map();
	const workerIdsWithStakerReward = [];
	for (let i = 0; i < event.recipients.length; i++) {
		const workerId = (0, _sqd_shared.createWorkerId)(event.recipients[i]);
		const stakerReward = event.stakerRewards[i];
		recipientIds[i] = workerId;
		payouts.set(workerId, {
			workerId,
			workerReward: event.workerRewards[i],
			workerApr: 0,
			stakerReward,
			stakerApr: 0
		});
		if (stakerReward > 0n) workerIdsWithStakerReward.push(workerId);
	}
	const deferredRecipients = recipientIds.map((id) => ctx.store.defer(__model.Worker, id));
	return async () => {
		const sw = (0, _sqd_shared.stopwatch)();
		const normalizedInterval = getNormalizedInteval({
			fromBlock: Number(event.fromBlock),
			toBlock: Number(event.toBlock)
		});
		const [resolvedWorkers, fromBlockCandidate, toBlockCandidate, allDelegations] = await Promise.all([
			Promise.all(deferredRecipients.map((w) => w.get())),
			ctx.store.findOne(__model.Block, {
				where: { l1BlockNumber: (0, typeorm.LessThanOrEqual)(normalizedInterval.fromBlock) },
				order: { height: "DESC" }
			}),
			ctx.store.findOne(__model.Block, {
				where: { l1BlockNumber: (0, typeorm.LessThanOrEqual)(normalizedInterval.toBlock) },
				order: { height: "DESC" }
			}),
			workerIdsWithStakerReward.length > 0 ? ctx.store.find(__model.Delegation, {
				where: { worker: { id: (0, typeorm.In)(workerIdsWithStakerReward) } },
				relations: { worker: true }
			}) : Promise.resolve([])
		]);
		let fromBlock = fromBlockCandidate;
		if (!fromBlock) {
			fromBlock = await ctx.store.findOne(__model.Block, {
				where: {},
				order: { height: "ASC" }
			});
			(0, assert.default)(fromBlock);
		}
		const toBlock = toBlockCandidate ?? fromBlock;
		const knownWorkers = resolvedWorkers.filter((w) => w != null);
		const delegationsByWorker = /* @__PURE__ */ new Map();
		for (const d of allDelegations) {
			const wid = d.worker.id;
			let arr = delegationsByWorker.get(wid);
			if (!arr) {
				arr = [];
				delegationsByWorker.set(wid, arr);
			}
			arr.push(d);
		}
		const delegations = [];
		const rewards = [];
		const fromTs = fromBlock.timestamp.getTime();
		const toTs = toBlock.timestamp.getTime();
		const eventTs = new Date(log.block.timestamp);
		const eventHeight = log.block.height;
		for (const worker of knownWorkers) {
			if (worker.createdAt.getTime() >= toTs) continue;
			const payout = payouts.get(worker.id);
			const interval = toTs - Math.max(fromTs, worker.createdAt.getTime());
			if (interval > 0) {
				payout.workerApr = worker.bond ? (0, _sqd_shared.toPercent)((0, _subsquid_big_decimal.BigDecimal)(payout.workerReward).div(interval).mul(_sqd_shared.YEAR_MS).div(worker.bond).toNumber(), true) : 0;
				payout.stakerApr = worker.totalDelegation ? (0, _sqd_shared.toPercent)((0, _subsquid_big_decimal.BigDecimal)(payout.stakerReward).div(interval).mul(_sqd_shared.YEAR_MS).div(worker.totalDelegation).toNumber(), true) : payout.workerApr / 2;
			}
			if (payout.stakerReward > 0n) {
				const rewardsPerShare = worker.totalDelegation ? payout.stakerReward * SHARE_SCALE / worker.totalDelegation : 0n;
				const workerDelegations = delegationsByWorker.get(worker.id) ?? [];
				if (workerDelegations.length === 0) ctx.log.warn(`missing delegation for worker(${worker.id})`);
				const paddedWorkerId = worker.id.padStart(5, "0");
				for (let i = 0; i < workerDelegations.length; i++) {
					const delegation = workerDelegations[i];
					const amount = delegation.deposit * rewardsPerShare / SHARE_SCALE;
					delegation.claimableReward += amount;
					rewards.push(new __model.DelegationReward({
						id: `${log.id}-${paddedWorkerId}-${i.toString().padStart(5, "0")}`,
						blockNumber: eventHeight,
						timestamp: eventTs,
						delegation,
						amount,
						apr: payout.stakerApr
					}));
					delegations.push(delegation);
				}
			}
			worker.claimableReward += payout.workerReward;
			worker.totalDelegationRewards += payout.stakerReward;
			if (payout.workerReward > 0n) rewards.push(new __model.WorkerReward({
				id: `${log.id}-${worker.id.padStart(5, "0")}`,
				blockNumber: eventHeight,
				timestamp: eventTs,
				worker,
				amount: payout.workerReward,
				stakersReward: payout.stakerReward,
				apr: payout.workerApr,
				stakerApr: payout.stakerApr
			}));
		}
		await ctx.store.track(rewards);
		await ctx.store.track(new __model.Commitment({
			id: (0, _sqd_shared.createCommitmentId)(event.fromBlock, event.toBlock),
			from: fromBlock.timestamp,
			fromBlock: normalizedInterval.fromBlock,
			to: toBlock.timestamp,
			toBlock: normalizedInterval.toBlock,
			recipients: [...payouts.values()].map((p) => new __model.CommitmentRecipient(p))
		}));
		ctx.log.info(`rewarded ${recipientIds.length} workers and ${delegations.length} delegations (${sw.get()}ms)`);
	};
});
/**
* Expands the on-chain (fromBlock, toBlock) range to the actual L1 block interval
* the reward period covers. The off-chain reward calculator was changed over time
* to submit compressed block ranges (covering N epochs in a single commit), while
* the contract enforces contiguous `fromBlock == lastBlockRewarded + 1`. The
* multiplier compensates for this compression so the indexer can resolve the correct
* L1 Block entities and compute accurate time-weighted APR.
*
* If the reward calculator changes its epoch-packing strategy again, a new threshold
* and multiplier must be added here.
*/
function getNormalizedInteval(event) {
	let multiplier = 1;
	switch (_sqd_shared.network.name) {
		case "mainnet":
			if (event.fromBlock >= 21864988) multiplier = 4;
			else if (event.fromBlock >= 20677588) multiplier = 2;
			break;
		case "tethys":
			if (event.fromBlock >= 7636918) multiplier = 4;
			else if (event.fromBlock >= 6637998) multiplier = 2;
			break;
	}
	return {
		fromBlock: event.toBlock + 1 - (event.toBlock - event.fromBlock + 1) * multiplier,
		toBlock: event.toBlock
	};
}
//#endregion
//#region src/handlers/rewards-distributor/index.ts
const handlers$4 = [handleRewardsClaimed, rewardsDistributedHandler];
//#endregion
//#region src/handlers/router/NetworkController.handler.ts
const networkControllerSetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.NetworkControllerSet.is(item.value)) return;
	const log = item.value;
	const { networkController } = _sqd_shared_lib_abi_Router.events.NetworkControllerSet.decode(log);
	const blockHeight = item.value.block.height;
	const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	return async () => {
		const settings = await settingsDeferred.getOrFail();
		const oldAddress = settings.contracts.networkController;
		if (oldAddress) ctx.templates.remove(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, oldAddress, blockHeight);
		ctx.templates.add(_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, networkController, blockHeight);
		settings.contracts = new __model.Contracts(void 0, {
			...settings.contracts.toJSON(),
			networkController
		});
		ctx.log.info(`network controller contract address set to ${networkController}`);
	};
});
//#endregion
//#region src/handlers/router/RewardCalculation.handler.ts
const rewardCalculationSetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.RewardCalculationSet.is(item.value)) return;
	const { rewardCalculation } = _sqd_shared_lib_abi_Router.events.RewardCalculationSet.decode(item.value);
	const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	return async () => {
		const settings = await settingsDeferred.getOrFail();
		settings.contracts = new __model.Contracts(void 0, {
			...settings.contracts.toJSON(),
			rewardCalculation
		});
		ctx.log.info(`reward calculation contract address set to ${rewardCalculation}`);
	};
});
//#endregion
//#region src/handlers/router/RewardTreasury.handler.ts
const rewardTreasurySetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.RewardTreasurySet.is(item.value)) return;
	const log = item.value;
	const { rewardTreasury } = _sqd_shared_lib_abi_Router.events.RewardTreasurySet.decode(log);
	const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	return async () => {
		const settings = await settingsDeferred.getOrFail();
		settings.contracts = new __model.Contracts(void 0, {
			...settings.contracts.toJSON(),
			rewardTreasury
		});
		ctx.log.info(`reward treasury contract address set to ${rewardTreasury}`);
	};
});
//#endregion
//#region src/handlers/router/Staking.handler.ts
const stakingSetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.StakingSet.is(item.value)) return;
	const log = item.value;
	const { staking } = _sqd_shared_lib_abi_Router.events.StakingSet.decode(log);
	const blockHeight = item.value.block.height;
	const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	return async () => {
		const settings = await settingsDeferred.getOrFail();
		const oldAddress = settings.contracts.staking;
		if (oldAddress) ctx.templates.remove(_sqd_shared.STAKING_TEMPLATE_KEY, oldAddress, blockHeight);
		ctx.templates.add(_sqd_shared.STAKING_TEMPLATE_KEY, staking, blockHeight);
		settings.contracts = new __model.Contracts(void 0, {
			...settings.contracts.toJSON(),
			staking
		});
		ctx.log.info(`staking contract address set to ${staking}`);
	};
});
//#endregion
//#region src/handlers/router/index.ts
const handlers$3 = [
	networkControllerSetHandler,
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.is(item.value)) return;
		const log = item.value;
		const { workerRegistration } = _sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.decode(log);
		const blockHeight = item.value.block.height;
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		return async () => {
			const settings = await settingsDeferred.getOrFail();
			const oldAddress = settings.contracts.workerRegistration;
			if (oldAddress) ctx.templates.remove(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, oldAddress, blockHeight);
			ctx.templates.add(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, workerRegistration, blockHeight);
			settings.contracts = new __model.Contracts(void 0, {
				...settings.contracts.toJSON(),
				workerRegistration
			});
			ctx.log.info(`worker registration contract address set to ${workerRegistration}`);
		};
	}),
	rewardCalculationSetHandler,
	rewardTreasurySetHandler,
	stakingSetHandler
];
//#endregion
//#region src/handlers/staking/Claimed.handler.ts
const handleClaimed = (0, _sqd_shared.createHandlerOld)({
	filter(_, item) {
		return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_Staking.events.Claimed.is(item.value);
	},
	handle(ctx, { value: log }) {
		if (!ctx.templates.has(_sqd_shared.STAKING_TEMPLATE_KEY, log.address, log.block.height)) return;
		const { staker: stakerAccount, workerIds: workerIndexes } = _sqd_shared_lib_abi_Staking.events.Claimed.decode(log);
		const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
		const delegationsDeferred = workerIndexes.map((i) => (0, _sqd_shared.createWorkerId)(i)).map((workerId) => (0, _sqd_shared.createDelegationId)(workerId, accountId)).map((id) => ctx.store.defer(__model.Delegation, id));
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const delegations = await Promise.all(delegationsDeferred.map((d) => d.get())).then((ds) => ds.filter((d) => d != null));
			for (const delegation of delegations) {
				const amount = delegation.claimableReward;
				if (amount === 0n) continue;
				delegation.claimableReward = 0n;
				delegation.claimedReward += amount;
				ctx.log.info(`operator(${accountId}) claimed ${(0, _sqd_shared.toHumanSQD)(amount)} from delegation(${delegation.id})`);
			}
			ctx.log.info(`staking claims processed for operator(${accountId}) (${elapsed()}ms)`);
		});
	}
});
//#endregion
//#region src/helpers.ts
function createWorker(id, { ownerId, metadata, peerId, createdAt }) {
	const worker = new __model.Worker({
		id,
		bond: 0n,
		ownerId,
		peerId,
		createdAt,
		claimableReward: 0n,
		claimedReward: 0n,
		totalDelegation: 0n,
		delegationCount: 0,
		capedDelegation: 0n,
		totalDelegationRewards: 0n,
		status: __model.WorkerStatus.UNKNOWN,
		locked: null,
		lockStart: null,
		lockEnd: null,
		...metadata
	});
	resetWorkerStats(worker);
	return worker;
}
function resetWorkerStats(worker) {
	Object.assign(worker, {
		online: null,
		dialOk: null,
		jailed: null,
		storedData: null,
		queries24Hours: null,
		queries90Days: null,
		scannedData24Hours: null,
		scannedData90Days: null,
		servedData24Hours: null,
		servedData90Days: null,
		uptime24Hours: null,
		uptime90Days: null,
		version: null,
		apr: null,
		stakerApr: null
	});
}
function createDelegation(id, opts) {
	return new __model.Delegation({
		id,
		deposit: 0n,
		claimableReward: 0n,
		claimedReward: 0n,
		...opts
	});
}
function createSettings(id) {
	return new __model.Settings({
		id,
		utilizedStake: 0n,
		baseApr: 0,
		delegationLimitCoefficient: .2,
		bondAmount: 10n ** 23n
	});
}
function createBlock(block) {
	return new __model.Block({
		id: block.id,
		hash: block.hash,
		height: block.height,
		timestamp: new Date(block.timestamp),
		l1BlockNumber: block.l1BlockNumber ?? void 0
	});
}
//#endregion
//#region src/handlers/softcap.ts
/**
* Local TypeScript port of `SoftCap.capedStake` from the on-chain contracts.
*
*   cap(x)        = (2/3)^((x − 1)^4) − 2/3
*   stakingShare = stake / (stake + bond)
*   capedStake   = ⌊cap(stakingShare) · bond⌋
*
* where:
*   stake = router.staking().delegated(workerId)   ← `worker.totalDelegation`
*   bond  = router.networkController().bondAmount() ← `settings.bondAmount`
*
* The result is bounded by ~bond / 3.
*
* Computed off-chain to avoid an `eth_call` (and the multicall round-trip)
* per worker. `BigDecimal` is used only for the `stake / (stake + bond)`
* ratio to avoid precision loss from `Number(bigint)`; the rest of the math
* fits comfortably in IEEE-754 doubles since both `x` and `(x − 1)^4` lie
* in `[0, 1]`.
*
* Kept as a standalone module (no ORM imports) so it can be unit-tested
* against the Solidity reference without bootstrapping the schema.
*
* Reference: subsquid-network-contracts/packages/contracts/src/SoftCap.sol
*/
const CAP_BASE = 2 / 3;
function computeCapedDelegation(stake, bond) {
	if (bond <= 0n || stake <= 0n) return 0n;
	const total = stake + bond;
	const exponent = (1 - Number((0, _subsquid_big_decimal.BigDecimal)(stake).div(total).toString())) ** 4;
	const capValue = Math.pow(CAP_BASE, exponent) - CAP_BASE;
	if (capValue <= 0) return 0n;
	return BigInt((0, _subsquid_big_decimal.BigDecimal)(bond).mul(capValue).toFixed(0, 0));
}
//#endregion
//#region src/handlers/cap.ts
const log = (0, _subsquid_logger.createLogger)("sqd:workers:cap");
/**
* Set whenever any worker's `capedDelegation` is mutated to a new value, and
* cleared by `recalculateWorkerAprs`. Drives the per-batch `flushAprRecalc`
* in `complete()` so we run the network-wide APR rollup at most once per
* batch when any cap actually moved (instead of once per delegation event).
*
* A single cap change affects every active worker's APR via the shared
* `utilizedStake = Σ (bond + capedDelegation)` term in `dTraffic`, so the
* recalc must be network-wide.
*/
let aprDirty = false;
/**
* Recompute and assign `capedDelegation` for `worker` in place.
* Returns true iff the value actually changed.
*/
function refreshWorkerCap(worker, settings) {
	const newCap = computeCapedDelegation(worker.totalDelegation, settings.bondAmount ?? 0n);
	if (newCap === worker.capedDelegation) return false;
	log.debug(`worker(${worker.id}) cap ${worker.capedDelegation} → ${newCap} (stake ${worker.totalDelegation}, bond ${settings.bondAmount ?? 0n})`);
	worker.capedDelegation = newCap;
	aprDirty = true;
	return true;
}
/**
* Mark the APR rollup as dirty for the current batch. Use this from handlers
* that mutate inputs to `utilizedStake = Σ (bond + capedDelegation for active
* & live workers)` without going through `refreshWorkerCap` — status
* transitions (ACTIVE ↔ other), `worker.bond` changes on `ExcessiveBondReturned`,
* and `settings.bondAmount` updates (which shift every active worker's cap).
*/
function markAprDirty() {
	aprDirty = true;
}
/**
* Run `recalculateWorkerAprs` only if at least one cap changed since the last
* recalc. Cheap no-op otherwise. Intended to be called once at the end of a
* batch from `main.ts:complete`.
*/
async function flushAprRecalc(ctx) {
	if (!aprDirty) return;
	await recalculateWorkerAprs(ctx);
}
async function recalculateWorkerAprs(ctx) {
	aprDirty = false;
	const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
	const workers = await ctx.store.find(__model.Worker, { where: { status: __model.WorkerStatus.ACTIVE } });
	if (workers.length === 0) {
		settings.utilizedStake = 0n;
		return;
	}
	const baseApr = (0, _subsquid_big_decimal.BigDecimal)(settings.baseApr);
	const utilizedStake = workers.reduce((r, w) => w.liveness ? r + w.bond + w.capedDelegation : r, 0n);
	settings.utilizedStake = utilizedStake;
	log.debug(`recalculating APRs for ${workers.length} active workers (base APR ${settings.baseApr}, utilized stake ${utilizedStake})`);
	const ninetyDaysAgo = /* @__PURE__ */ new Date(Date.now() - 90 * _sqd_shared.DAY_MS);
	await ctx.store.sync();
	const aggregates = await ctx.store.em.query(`SELECT
            worker_id,
            COALESCE(SUM(apr), 0)        AS apr_sum,
            COALESCE(SUM(staker_apr), 0) AS staker_apr_sum,
            COUNT(*)                     AS n
        FROM worker_reward
        WHERE timestamp >= $1
        GROUP BY worker_id`, [ninetyDaysAgo]);
	const aggregateByWorker = new Map(aggregates.map((r) => [r.worker_id, r]));
	for (const worker of workers) {
		const supplyRatio = utilizedStake === 0n ? (0, _subsquid_big_decimal.BigDecimal)(0) : (0, _subsquid_big_decimal.BigDecimal)(worker.capedDelegation).add(worker.bond).div(utilizedStake);
		const dTraffic = supplyRatio.eq(0) ? 0 : Math.min((0, _subsquid_big_decimal.BigDecimal)(worker.trafficWeight || 0).div(supplyRatio).toNumber() ** .1, 1);
		const actualYield = baseApr.mul(worker.liveness || 0).mul(dTraffic).mul(worker.dTenure || 0);
		const currentApr = actualYield.mul(worker.bond + worker.capedDelegation / 2n).div(worker.bond).mul(100).toNumber();
		const stakerReward = actualYield.mul(worker.capedDelegation / 2n);
		const currentStakerApr = worker.totalDelegation ? stakerReward.div(worker.totalDelegation).mul(100).toNumber() : currentApr / 2;
		const agg = aggregateByWorker.get(worker.id);
		const historyCount = agg ? Number(agg.n) : 0;
		const aprSum = (agg ? Number(agg.apr_sum) : 0) + currentApr;
		const stakerAprSum = (agg ? Number(agg.staker_apr_sum) : 0) + currentStakerApr;
		const n = historyCount + 1;
		worker.apr = aprSum / n;
		worker.stakerApr = stakerAprSum / n;
	}
	log.info(`APRs recalculated for ${workers.length} active workers`);
}
//#endregion
//#region src/handlers/staking/DelegationUnlock.queue.ts
const DELEGATION_UNLOCK_QUEUE = "delegation-unlock";
async function ensureDelegationUnlockQueue(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, DELEGATION_UNLOCK_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.Delegation, task.id);
}
async function addToDelegationUnlockQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, DELEGATION_UNLOCK_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function processDelegationUnlockQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, DELEGATION_UNLOCK_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const delegation = await ctx.store.getOrFail(__model.Delegation, task.id);
		(0, assert.default)(delegation.lockEnd);
		if (delegation.lockEnd > block.l1BlockNumber) {
			tasks.push(task);
			continue;
		}
		delegation.locked = false;
		processed++;
		ctx.log.info(`delegation(${delegation.id}) unlocked`);
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`delegation-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/handlers/staking/Deposited.handler.ts
const handleDeposited = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Staking.events.Deposited.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const { worker: workerIndex, staker: stakerAccount, amount } = _sqd_shared_lib_abi_Staking.events.Deposited.decode(log);
	if (amount === 0n) return;
	const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
	const workerDeferred = ctx.store.defer(__model.Worker, workerId);
	const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
	const delegationId = (0, _sqd_shared.createDelegationId)(workerId, accountId);
	const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const settings = await settingsDeferred.getOrFail();
		const delegation = await ctx.store.getOrCreate(__model.Delegation, {
			id: delegationId,
			relations: { worker: true }
		}, async (id) => {
			const worker = await workerDeferred.getOrFail();
			ctx.log.info(`created delegation(${id})`);
			return createDelegation(id, {
				ownerId: accountId,
				worker
			});
		});
		delegation.deposit += amount;
		if (settings.epochLength) {
			delegation.locked = true;
			delegation.lockStart = (0, _sqd_shared.toNextEpochStart)(log.block.l1BlockNumber, settings.epochLength);
			delegation.lockEnd = delegation.lockStart + (settings.lockPeriod ?? settings.epochLength);
			await addToDelegationUnlockQueue(ctx, delegation.id);
		} else {
			delegation.locked = false;
			delegation.lockStart = log.block.l1BlockNumber;
			delegation.lockEnd = log.block.l1BlockNumber;
		}
		if (delegation.status !== __model.DelegationStatus.ACTIVE) {
			delegation.status = __model.DelegationStatus.ACTIVE;
			await ctx.store.track(new __model.DelegationStatusChange({
				id: (0, _sqd_shared.createDelegationStatusChangeId)(delegation.id, log.block.height),
				delegation,
				status: __model.DelegationStatus.ACTIVE,
				timestamp: new Date(log.block.timestamp),
				blockNumber: log.block.height,
				pending: false
			}));
		}
		const worker = delegation.worker;
		(0, assert.default)(worker.id === workerId);
		if (delegation.deposit === amount) worker.delegationCount += 1;
		worker.totalDelegation += amount;
		refreshWorkerCap(worker, settings);
		ctx.log.info(`operator(${accountId}) delegated ${(0, _sqd_shared.toHumanSQD)(amount)} to worker(${worker.id}) (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/staking/index.ts
const handlers$2 = [
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_Staking.events.Withdrawn.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const log = item.value;
		const { worker: workerIndex, staker: stakerAccount, amount } = _sqd_shared_lib_abi_Staking.events.Withdrawn.decode(log);
		const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
		const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
		const delegationId = (0, _sqd_shared.createDelegationId)(workerId, accountId);
		const delegationDeferred = ctx.store.defer(__model.Delegation, {
			id: delegationId,
			relations: { worker: true }
		});
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const settings = await settingsDeferred.getOrFail();
			const delegation = await delegationDeferred.getOrFail();
			delegation.deposit -= amount;
			if (delegation.deposit === 0n) {
				delegation.status = __model.DelegationStatus.WITHDRAWN;
				await ctx.store.track(new __model.DelegationStatusChange({
					id: (0, _sqd_shared.createDelegationStatusChangeId)(delegation.id, log.block.height),
					delegation,
					status: __model.DelegationStatus.WITHDRAWN,
					timestamp: new Date(log.block.timestamp),
					blockNumber: log.block.height,
					pending: false
				}));
			}
			const worker = delegation.worker;
			(0, assert.default)(worker.id === workerId);
			if (delegation.deposit === 0n) worker.delegationCount -= 1;
			worker.totalDelegation -= amount;
			refreshWorkerCap(worker, settings);
			ctx.log.info(`operator(${accountId}) undelegated ${(0, _sqd_shared.toHumanSQD)(amount)} from worker(${worker.id}) (${elapsed()}ms)`);
		});
	}),
	handleDeposited,
	handleClaimed
];
//#endregion
//#region src/handlers/worker/WorkerStatusApply.queue.ts
const WORKER_STATUS_APPLY_QUEUE = "worker-status-apply";
async function ensureWorkerStatusApplyQueue(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, WORKER_STATUS_APPLY_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.WorkerStatusChange, {
		id: task.id,
		relations: { worker: true }
	});
}
async function addToWorkerStatusApplyQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, WORKER_STATUS_APPLY_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function processWorkerStatusApplyQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, WORKER_STATUS_APPLY_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const statusChange = await ctx.store.getOrFail(__model.WorkerStatusChange, {
			id: task.id,
			relations: { worker: true }
		});
		(0, assert.default)(statusChange.pending, `status ${statusChange.id} is not pending`);
		if (statusChange.blockNumber > block.l1BlockNumber) {
			tasks.push(task);
			continue;
		}
		statusChange.pending = false;
		if (statusChange.blockNumber >= block.l1BlockNumber && statusChange.blockNumber < block.l1BlockNumber + 10) statusChange.timestamp = new Date(block.timestamp);
		const worker = statusChange.worker;
		const previousStatus = worker.status;
		worker.status = statusChange.status;
		if (worker.status === __model.WorkerStatus.DEREGISTERED) resetWorkerStats(worker);
		if (previousStatus !== worker.status && (previousStatus === __model.WorkerStatus.ACTIVE || worker.status === __model.WorkerStatus.ACTIVE)) markAprDirty();
		ctx.log.info(`status of worker(${worker.id}) changed to ${worker.status}`);
		processed++;
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`worker-status-apply queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/handlers/worker/WorkerUnlock.queue.ts
const WORKER_UNLOCK_QUEUE = "worker-unlock";
async function ensureWorkerUnlock(ctx) {
	const queue = await ctx.store.getOrCreate(__model.Queue, WORKER_UNLOCK_QUEUE, (id) => new __model.Queue({
		id,
		tasks: []
	}));
	for (const task of queue.tasks) ctx.store.defer(__model.Worker, task.id);
}
async function addToWorkerUnlockQueue(ctx, id) {
	const queue = await ctx.store.getOrFail(__model.Queue, WORKER_UNLOCK_QUEUE);
	if (queue.tasks.some((task) => task.id === id)) return;
	queue.tasks = [...queue.tasks, { id }];
}
async function processWorkerUnlockQueue(ctx, block) {
	const queue = await ctx.store.getOrFail(__model.Queue, WORKER_UNLOCK_QUEUE);
	if (queue.tasks.length === 0) return;
	const start = performance.now();
	const total = queue.tasks.length;
	let processed = 0;
	const tasks = [];
	for (const task of queue.tasks) {
		const worker = await ctx.store.getOrFail(__model.Worker, task.id);
		(0, assert.default)(worker.locked && worker.lockEnd, `worker(${worker.id}) is not locked`);
		if (worker.lockEnd > block.l1BlockNumber) {
			tasks.push(task);
			continue;
		}
		worker.locked = false;
		processed++;
		ctx.log.info(`worker(${worker.id}) unlocked`);
	}
	queue.tasks = tasks;
	if (processed > 0) ctx.log.info(`worker-unlock queue: processed ${processed}/${total} tasks (${(performance.now() - start).toFixed(1)}ms)`);
}
//#endregion
//#region src/handlers/worker/index.ts
const handlers$1 = [
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_WorkerRegistration.events.WorkerDeregistered.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const log = item.value;
		const { workerId: workerIndex, deregistedAt } = _sqd_shared_lib_abi_WorkerRegistration.events.WorkerDeregistered.decode(log);
		const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
		const workerDeferred = ctx.store.defer(__model.Worker, workerId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
			const worker = await workerDeferred.getOrFail();
			if (worker.status === __model.WorkerStatus.DEREGISTERING) return;
			if (worker.status === __model.WorkerStatus.ACTIVE) markAprDirty();
			const statusChange = new __model.WorkerStatusChange({
				id: (0, _sqd_shared.createWorkerStatusId)(workerId, log.block.l1BlockNumber),
				worker,
				blockNumber: log.block.l1BlockNumber,
				timestamp: new Date(log.block.timestamp),
				status: __model.WorkerStatus.DEREGISTERING,
				pending: false
			});
			await ctx.store.track(statusChange);
			worker.status = statusChange.status;
			if (settings.epochLength) {
				worker.locked = true;
				worker.lockEnd = Number(deregistedAt) + (settings.lockPeriod ?? settings.epochLength);
			} else {
				worker.locked = true;
				worker.lockEnd = Number(deregistedAt);
			}
			await addToWorkerUnlockQueue(ctx, worker.id);
			const pendingStatusChange = new __model.WorkerStatusChange({
				id: (0, _sqd_shared.createWorkerStatusId)(workerId, deregistedAt),
				worker,
				blockNumber: Number(deregistedAt),
				status: __model.WorkerStatus.DEREGISTERED,
				pending: true
			});
			await ctx.store.track(pendingStatusChange);
			await addToWorkerStatusApplyQueue(ctx, pendingStatusChange.id);
			ctx.log.info(`worker(${worker.id}) deregistered (${elapsed()}ms)`);
		});
	}),
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.ExcessiveBondReturned.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const { workerId: workerIndex, amount } = _sqd_shared_lib_abi_WorkerRegistration.events.ExcessiveBondReturned.decode(log);
			const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
			const workerDeferred = ctx.store.defer(__model.Worker, workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const worker = await workerDeferred.getOrFail();
				worker.bond -= amount;
				markAprDirty();
				ctx.log.info(`worker(${worker.id}) returned excessive bond ${(0, _sqd_shared.toHumanSQD)(amount)} (${elapsed()}ms)`);
			});
		}
	}),
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.MetadataUpdated.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const { workerId: workerIndex, metadata: metadataRaw } = _sqd_shared_lib_abi_WorkerRegistration.events.MetadataUpdated.decode(log);
			const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
			const workerDeferred = ctx.store.defer(__model.Worker, workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const metadata = (0, _sqd_shared.parseWorkerMetadata)(ctx, metadataRaw);
				const worker = await workerDeferred.getOrFail();
				worker.name = metadata.name;
				worker.description = metadata.description;
				worker.website = metadata.website;
				ctx.log.info(`updated metadata of worker(${worker.id}) (${elapsed()}ms)`);
			});
		}
	}),
	(0, _sqd_shared.createHandler)((ctx, item) => {
		if (!(0, _sqd_shared.isLog)(item)) return;
		if (!_sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.is(item.value)) return;
		if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, item.address, item.value.block.height)) return;
		const log = item.value;
		const event = _sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.decode(log);
		const ownerId = (0, _sqd_shared.createAccountId)(event.registrar);
		const workerId = (0, _sqd_shared.createWorkerId)(event.workerId);
		const settingsDeferred = ctx.store.defer(__model.Settings, _sqd_shared.network.name);
		const workerDeferred = ctx.store.defer(__model.Worker, workerId);
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const bond = (0, _subsquid_util_internal.assertNotNull)((await settingsDeferred.getOrFail()).bondAmount, `bond amount is not defined`);
			const metadata = (0, _sqd_shared.parseWorkerMetadata)(ctx, event.metadata);
			let worker = await workerDeferred.get();
			const isNewWorker = worker == null;
			if (worker != null) {
				worker.ownerId = ownerId;
				worker.peerId = (0, _sqd_shared.parsePeerId)(event.peerId);
				worker.name = metadata.name;
				worker.email = metadata.email;
				worker.website = metadata.website;
				worker.description = metadata.description;
			} else worker = createWorker(workerId, {
				ownerId,
				peerId: (0, _sqd_shared.parsePeerId)(event.peerId),
				createdAt: new Date(log.block.timestamp),
				metadata
			});
			const statusChange = new __model.WorkerStatusChange({
				id: (0, _sqd_shared.createWorkerStatusId)(workerId, log.block.l1BlockNumber),
				worker,
				blockNumber: log.block.l1BlockNumber,
				timestamp: new Date(log.block.timestamp),
				status: __model.WorkerStatus.REGISTERING,
				pending: false
			});
			await ctx.store.track(statusChange);
			worker.status = statusChange.status;
			worker.bond = bond;
			worker.locked = true;
			worker.lockStart = log.block.l1BlockNumber;
			if (isNewWorker) await ctx.store.track(worker);
			const pendingStatus = new __model.WorkerStatusChange({
				id: (0, _sqd_shared.createWorkerStatusId)(workerId, event.registeredAt),
				worker,
				blockNumber: Number(event.registeredAt),
				status: __model.WorkerStatus.ACTIVE,
				pending: true
			});
			await ctx.store.track(pendingStatus);
			await addToWorkerStatusApplyQueue(ctx, pendingStatus.id);
			ctx.log.info(`operator(${ownerId}) registered worker(${worker.id}), bonded ${(0, _sqd_shared.toHumanSQD)(worker.bond)} (${elapsed()}ms)`);
		});
	}),
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const { workerId: workerIndex } = _sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.decode(log);
			const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
			const workerDeferred = ctx.store.defer(__model.Worker, workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const worker = await workerDeferred.getOrFail();
				const statusChange = new __model.WorkerStatusChange({
					id: (0, _sqd_shared.createWorkerStatusId)(workerId, log.block.l1BlockNumber),
					worker,
					blockNumber: log.block.l1BlockNumber,
					timestamp: new Date(log.block.timestamp),
					status: __model.WorkerStatus.WITHDRAWN,
					pending: false
				});
				await ctx.store.track(statusChange);
				worker.status = statusChange.status;
				worker.bond = 0n;
				ctx.log.info(`worker(${worker.id}) withdrawn (${elapsed()}ms)`);
			});
		}
	})
];
//#endregion
//#region src/handlers/metrics.ts
const onlineLog = (0, _subsquid_logger.createLogger)("sqd:workers:metrics:online");
const statsLog = (0, _subsquid_logger.createLogger)("sqd:workers:metrics:stats");
const rewardsLog = (0, _subsquid_logger.createLogger)("sqd:workers:metrics:rewards");
const client = new _subsquid_http_client.HttpClient({
	baseUrl: process.env.NETWORK_STATS_URL,
	httpTimeout: 2 * _sqd_shared.MINUTE_MS
});
function formatTimestamp(ts) {
	return ts > 0 ? new Date(ts).toISOString() : "never";
}
const onlineUpdateInterval = 5 * _sqd_shared.MINUTE_MS;
let lastOnlineUpdateTimestamp = -1;
let onlineStartupLogged = false;
/** Background HTTP slot for online snapshot (`/workers/online/*`). */
let onlineFetchSlot = null;
async function fetchOnlineSnapshot(statsUrl, schedulerUrl) {
	const onlineStatus = await client.get((0, _sqd_shared.joinUrl)(statsUrl, "/workers/online/status")).then((r) => JSON.parse(r)).catch((e) => {
		onlineLog.warn(e);
	});
	if (!onlineStatus) {
		onlineLog.debug("no online snapshot status available");
		return null;
	}
	const snapshotTimestamp = new Date(onlineStatus.timestamp).getTime();
	onlineLog.debug(`server reports online snapshot from ${formatTimestamp(snapshotTimestamp)}`);
	const [workerStats, schedulerStatus] = await Promise.all([client.get((0, _sqd_shared.joinUrl)(statsUrl, "/workers/online/data")).then((r) => r.toString().split("\n").filter((line) => !!line).map((line) => JSON.parse(line))).catch((e) => {
		onlineLog.warn(e);
	}), schedulerUrl ? client.get((0, _sqd_shared.joinUrl)(schedulerUrl, "status.json")).catch((e) => {
		onlineLog.warn(e);
	}) : Promise.resolve(void 0)]);
	const workerStatsCount = workerStats ? `${workerStats.length} workers` : "unavailable";
	const schedulerCount = schedulerStatus ? `${schedulerStatus.workers.length} workers` : "unavailable";
	onlineLog.debug(`online snapshot loaded: stats from network (${workerStatsCount}), status from scheduler (${schedulerCount})`);
	return {
		snapshotTimestamp,
		workerStats,
		schedulerStatus
	};
}
async function updateWorkersOnline(ctx, block) {
	const statsUrl = process.env.NETWORK_STATS_URL;
	if (!statsUrl) return;
	const schedulerUrl = process.env.SCHEDULER_URL;
	if (!onlineStartupLogged) {
		onlineStartupLogged = true;
		onlineLog.debug(`online cursor not persisted; will refetch+re-apply the first snapshot after restart`);
	}
	if (onlineFetchSlot == null) {
		if (block.timestamp - onlineUpdateInterval < lastOnlineUpdateTimestamp) return;
		onlineLog.info(`fetching online workers snapshot (last applied: ${formatTimestamp(lastOnlineUpdateTimestamp)})`);
		onlineFetchSlot = _sqd_shared.AsyncTask.start(() => fetchOnlineSnapshot(statsUrl, schedulerUrl));
	}
	const result = onlineFetchSlot.get();
	if (result.state === "pending") return;
	if (result.state === "fulfilled") {
		onlineFetchSlot = null;
		const data = result.value;
		if (data == null) {
			onlineLog.debug("latest online fetch returned no data; nothing to apply");
			return;
		}
		if (data.snapshotTimestamp === lastOnlineUpdateTimestamp) {
			onlineLog.debug(`online snapshot from ${formatTimestamp(data.snapshotTimestamp)} is the same one we already applied; nothing to do`);
			return;
		}
		onlineLog.debug(`applying online snapshot from ${formatTimestamp(data.snapshotTimestamp)}`);
		await applyOnlineUpdate(ctx, data);
		lastOnlineUpdateTimestamp = data.snapshotTimestamp;
		return;
	}
	onlineLog.warn(result.error);
	onlineFetchSlot = _sqd_shared.AsyncTask.start(() => fetchOnlineSnapshot(statsUrl, schedulerUrl));
}
async function applyOnlineUpdate(ctx, data) {
	const activeWorkers = await ctx.store.find(__model.Worker, { where: { status: (0, typeorm.In)([__model.WorkerStatus.ACTIVE, __model.WorkerStatus.DEREGISTERING]) } });
	const activeWorkersMap = new Map(activeWorkers.map((w) => [w.peerId, w]));
	if (data.workerStats) {
		for (const worker of activeWorkers) {
			worker.online = null;
			worker.dialOk = null;
			worker.storedData = null;
			worker.version = null;
		}
		for (const stats of data.workerStats) {
			const worker = activeWorkersMap.get(stats.peerId);
			if (!worker) continue;
			worker.online = true;
			worker.dialOk = null;
			worker.storedData = BigInt(stats.storedBytes);
			worker.version = stats.version;
		}
	}
	if (data.schedulerStatus) {
		for (const worker of activeWorkers) {
			worker.jailed = null;
			worker.jailReason = null;
		}
		for (const d of data.schedulerStatus.workers) {
			const worker = activeWorkersMap.get(d.peer_id);
			if (!worker) continue;
			worker.jailed = d.status !== "online";
			worker.jailReason = worker.jailed ? d.status : null;
		}
		const { recommended_worker_versions: recommendedWorkerVersion, supported_worker_versions: minimalWorkerVersion } = data.schedulerStatus.config;
		const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
		settings.minimalWorkerVersion = minimalWorkerVersion || null;
		settings.recommendedWorkerVersion = recommendedWorkerVersion || null;
	}
	const onlineCount = activeWorkers.filter((w) => !!w.online).length;
	onlineLog.info(`online status updated: ${onlineCount} of ${activeWorkers.length} active workers are online (snapshot ${formatTimestamp(data.snapshotTimestamp)})`);
}
const metricsUpdateInterval = 30 * _sqd_shared.MINUTE_MS;
let lastMetricsFetchAt = -1;
let statsChunkCursor = -1;
let aggregatesPending = true;
/** True while we are chaining chunk downloads until caught_up (interval ignored). */
let metricsBurstActive = false;
/** Background HTTP slot for `/workers/stats/*` (one in-flight fetch at a time). */
let metricsFetchSlot = null;
async function refreshChunkCursor(ctx) {
	const dbTimestamp = (await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name)).statsChunkCursor?.getTime() ?? -1;
	if (dbTimestamp > statsChunkCursor) {
		statsLog.debug(`stats cursor restored from DB: ${formatTimestamp(dbTimestamp)} (was ${formatTimestamp(statsChunkCursor)})`);
		statsChunkCursor = dbTimestamp;
	}
}
async function persistChunkCursor(ctx, timestamp) {
	const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
	settings.statsChunkCursor = new Date(timestamp);
}
async function fetchNextStatsChunk(statsUrl, cursor) {
	const statsStatus = await client.get((0, _sqd_shared.joinUrl)(statsUrl, "/workers/stats/status")).then((r) => JSON.parse(r)).catch((e) => {
		statsLog.warn(e);
	});
	if (!statsStatus) {
		statsLog.debug("stats status endpoint returned no data");
		return null;
	}
	const sortedChunks = [...statsStatus.chunks].sort((a, b) => (0, date_fns.compareAsc)(a.timestamp, b.timestamp));
	const candidateIndex = sortedChunks.findIndex((c) => new Date(c.timestamp).getTime() >= cursor);
	if (candidateIndex < 0) {
		statsLog.debug(`no chunks at or after ${formatTimestamp(cursor)} (server snapshot at ${formatTimestamp(new Date(statsStatus.timestamp).getTime())})`);
		return { kind: "caught_up" };
	}
	const next = sortedChunks[candidateIndex];
	const isLatest = candidateIndex === sortedChunks.length - 1;
	const chunkTimestamp = new Date(next.timestamp).getTime();
	statsLog.debug(`downloading stats chunk ${next.name} for day ${formatTimestamp(chunkTimestamp)}` + (isLatest ? " (latest chunk — may be partial)" : ""));
	const data = await fetchMetricsChunk(statsUrl, next.name);
	if (data == null) return null;
	return {
		kind: "chunk",
		chunkTimestamp,
		chunkName: next.name,
		data,
		isLatest
	};
}
function fetchMetricsChunk(statsUrl, name) {
	return client.get((0, _sqd_shared.joinUrl)(statsUrl, `/workers/stats/${name}`)).then((r) => {
		const stats = r?.toString().split("\n").filter((line) => !!line).map((line) => JSON.parse(line)) ?? [];
		statsLog.debug(`stats chunk ${name} contains entries for ${stats.length} workers`);
		return stats;
	}).catch((e) => {
		statsLog.warn(e);
		return null;
	});
}
async function updateWorkersMetrics(ctx, block) {
	const statsUrl = process.env.NETWORK_STATS_URL;
	if (!statsUrl) return;
	if (metricsFetchSlot == null) {
		if (!metricsBurstActive && block.timestamp - lastMetricsFetchAt < metricsUpdateInterval) return;
		const syncingMoreChunks = metricsBurstActive;
		await refreshChunkCursor(ctx);
		if (!syncingMoreChunks) statsLog.info(`polling stats endpoint for chunks at or after ${formatTimestamp(statsChunkCursor)}`);
		else statsLog.info(`syncing stats: fetching next chunk at or after ${formatTimestamp(statsChunkCursor)}`);
		metricsBurstActive = true;
		metricsFetchSlot = _sqd_shared.AsyncTask.start(() => fetchNextStatsChunk(statsUrl, statsChunkCursor));
	}
	const result = metricsFetchSlot.get();
	if (result.state === "pending") return;
	if (result.state === "fulfilled") {
		metricsFetchSlot = null;
		const chunkResult = result.value;
		if (chunkResult == null) {
			metricsBurstActive = false;
			lastMetricsFetchAt = block.timestamp;
			return;
		}
		if (chunkResult.kind === "chunk") {
			await applyMetricsChunk(ctx, chunkResult.data, chunkResult.chunkTimestamp, chunkResult.chunkName);
			aggregatesPending = true;
			if (!chunkResult.isLatest) {
				const nextCursor = chunkResult.chunkTimestamp + _sqd_shared.DAY_MS;
				if (nextCursor > statsChunkCursor) {
					statsChunkCursor = nextCursor;
					await persistChunkCursor(ctx, statsChunkCursor);
				}
				metricsBurstActive = true;
				return;
			}
			metricsBurstActive = false;
			lastMetricsFetchAt = block.timestamp;
			if (aggregatesPending) {
				aggregatesPending = false;
				statsLog.info(`applied latest stats chunk ${chunkResult.chunkName} (day ${formatTimestamp(chunkResult.chunkTimestamp)}); recomputing 24h/90d aggregates`);
				await updateWorkerAggregatedMetrics(ctx);
			}
			return;
		}
		metricsBurstActive = false;
		lastMetricsFetchAt = block.timestamp;
		if (aggregatesPending) {
			aggregatesPending = false;
			statsLog.info(`no stats chunks to apply (cursor ${formatTimestamp(statsChunkCursor)}); recomputing 24h/90d aggregates`);
			await updateWorkerAggregatedMetrics(ctx);
		}
		return;
	}
	statsLog.warn(result.error);
	metricsBurstActive = false;
	metricsFetchSlot = _sqd_shared.AsyncTask.start(() => fetchNextStatsChunk(statsUrl, statsChunkCursor));
}
async function applyMetricsChunk(ctx, chunkData, chunkTimestamp, chunkName) {
	const workers = await ctx.store.find(__model.Worker, {
		where: {},
		cacheEntities: false
	});
	const workersMap = new Map(workers.map((w) => [w.peerId, w]));
	let beforeWorkerRegistration = 0;
	const workerMetrics = [];
	for (const stat of chunkData) {
		const worker = workersMap.get(stat.peerId);
		if (!worker) continue;
		for (let hour of stat.data) {
			hour = Array.isArray(hour) ? {
				timestamp: hour[0],
				pings: hour[1],
				storedBytes: hour[2],
				responseBytes: hour[3],
				readChunks: hour[4],
				queries: hour[5]
			} : hour;
			const hourTimestamp = new Date(hour.timestamp);
			if ((0, date_fns.compareAsc)(hourTimestamp, worker.createdAt) < 0) {
				beforeWorkerRegistration++;
				continue;
			}
			workerMetrics.push(new __model.WorkerMetrics({
				id: `${worker.id.padStart(5, "0")}-${Math.floor(hourTimestamp.getTime() / 1e3).toString().padStart(10, "0")}`,
				timestamp: hourTimestamp,
				pings: Number(hour.pings),
				uptime: (0, _sqd_shared.toPercent)(Number(hour.pings) / 30),
				storedData: BigInt(hour.storedBytes),
				servedData: BigInt(hour.responseBytes),
				scannedData: BigInt(hour.readChunks),
				queries: Number(hour.queries),
				worker
			}));
		}
	}
	await ctx.store.track(workerMetrics, { replace: true });
	const ignored = beforeWorkerRegistration ? `; ignored ${beforeWorkerRegistration} hours before worker registration` : "";
	statsLog.info(`upserted ${workerMetrics.length} hourly metrics from ${chunkData.length} workers (chunk ${chunkName}, day ${formatTimestamp(chunkTimestamp)})${ignored}`);
}
async function updateWorkerAggregatedMetrics(ctx) {
	const windowEnd = new Date((0, _sqd_shared.toStartOfHour)(Date.now()));
	const oneDayAgo = new Date(windowEnd.getTime() - _sqd_shared.DAY_MS);
	const ninetyDaysAgo = /* @__PURE__ */ new Date(windowEnd.getTime() - 90 * _sqd_shared.DAY_MS);
	await ctx.store.sync();
	const rows = await ctx.store["em"].query(`SELECT
      worker_id,
      COALESCE(SUM(queries)      FILTER (WHERE timestamp >= $1), 0) AS total_queries_24h,
      COALESCE(SUM(served_data)  FILTER (WHERE timestamp >= $1), 0) AS total_served_data_24h,
      COALESCE(SUM(scanned_data) FILTER (WHERE timestamp >= $1), 0) AS total_scanned_data_24h,
      COALESCE(SUM(uptime)       FILTER (WHERE timestamp >= $1), 0) AS uptime_sum_24h,
      COUNT(*)                   FILTER (WHERE timestamp >= $1)      AS uptime_count_24h,
      COALESCE(MAX(stored_data)  FILTER (WHERE timestamp >= $1), 0) AS max_stored_data_24h,
      COALESCE(SUM(queries), 0)                                      AS total_queries_90d,
      COALESCE(SUM(served_data), 0)                                  AS total_served_data_90d,
      COALESCE(SUM(scanned_data), 0)                                 AS total_scanned_data_90d,
      COALESCE(SUM(uptime), 0)                                       AS uptime_sum_90d,
      COUNT(*)                                                       AS uptime_count_90d
    FROM worker_metrics
    WHERE timestamp >= $2 AND timestamp < $3
    GROUP BY worker_id`, [
		oneDayAgo,
		ninetyDaysAgo,
		windowEnd
	]);
	const workers = await ctx.store.find(__model.Worker, { where: {} });
	const workerMap = new Map(workers.map((w) => [w.id, w]));
	const seenWorkerIds = /* @__PURE__ */ new Set();
	for (const row of rows) {
		const worker = workerMap.get(row.worker_id);
		if (!worker) continue;
		seenWorkerIds.add(worker.id);
		const count24h = Number(row.uptime_count_24h);
		const count90d = Number(row.uptime_count_90d);
		worker.storedData = count24h > 0 ? BigInt(row.max_stored_data_24h) : null;
		worker.queries24Hours = count24h > 0 ? BigInt(row.total_queries_24h) : null;
		worker.servedData24Hours = count24h > 0 ? BigInt(row.total_served_data_24h) : null;
		worker.scannedData24Hours = count24h > 0 ? BigInt(row.total_scanned_data_24h) : null;
		const expectedHours24h = Math.max(0, (windowEnd.getTime() - Math.max(worker.createdAt.getTime(), oneDayAgo.getTime())) / _sqd_shared.HOUR_MS);
		const expectedHours90d = Math.max(0, (windowEnd.getTime() - Math.max(worker.createdAt.getTime(), ninetyDaysAgo.getTime())) / _sqd_shared.HOUR_MS);
		worker.uptime24Hours = expectedHours24h > 0 ? Number(row.uptime_sum_24h) / expectedHours24h : null;
		worker.queries90Days = count90d > 0 ? BigInt(row.total_queries_90d) : null;
		worker.servedData90Days = count90d > 0 ? BigInt(row.total_served_data_90d) : null;
		worker.scannedData90Days = count90d > 0 ? BigInt(row.total_scanned_data_90d) : null;
		worker.uptime90Days = expectedHours90d > 0 ? Number(row.uptime_sum_90d) / expectedHours90d : null;
	}
	for (const worker of workers) {
		if (seenWorkerIds.has(worker.id)) continue;
		worker.storedData = null;
		worker.queries24Hours = null;
		worker.servedData24Hours = null;
		worker.scannedData24Hours = null;
		worker.uptime24Hours = null;
		worker.queries90Days = null;
		worker.servedData90Days = null;
		worker.scannedData90Days = null;
		worker.uptime90Days = null;
	}
	statsLog.info(`24h/90d aggregated metrics recomputed for ${workers.length} workers (chunk cursor ${formatTimestamp(statsChunkCursor)})`);
}
const rewardMetricsUpdateInterval = 30 * _sqd_shared.MINUTE_MS;
let lastRewardMetricsUpdateTimestamp = -1;
let rewardsStartupLogged = false;
let rewardCycleSnapshotTs = 0;
let rewardConfigSlot = null;
let rewardDataSlot = null;
function resetRewardPipeline() {
	rewardCycleSnapshotTs = 0;
	rewardConfigSlot = null;
	rewardDataSlot = null;
}
async function updateWorkerRewardStats(ctx, block) {
	const monitorUrl = process.env.REWARDS_MONITOR_API_URL;
	if (!monitorUrl) return;
	if (!rewardsStartupLogged) {
		rewardsStartupLogged = true;
		rewardsLog.debug(`reward cursor not persisted; will refetch+re-apply the first snapshot after restart`);
	}
	if (rewardDataSlot) {
		const result = rewardDataSlot.get();
		if (result.state === "pending") return;
		if (result.state === "fulfilled") {
			rewardDataSlot = null;
			const { rewards, apy } = result.value;
			rewardsLog.debug(`applying rewards snapshot for ${formatTimestamp(rewardCycleSnapshotTs)}: ${rewards.workers.length} workers in payload, base APR ${(apy.apy / 1e4).toFixed(4)}`);
			const workersStats = rewards.workers.reduce((r, w) => r.set(w.id, w), /* @__PURE__ */ new Map());
			const activeWorkers = await ctx.store.find(__model.Worker, { where: { status: (0, typeorm.In)([__model.WorkerStatus.ACTIVE, __model.WorkerStatus.DEREGISTERING]) } });
			const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
			settings.baseApr = apy.apy / 1e4;
			for (const worker of activeWorkers) {
				const d = workersStats.get(worker.peerId);
				worker.trafficWeight = d?.traffic.trafficWeight ?? null;
				worker.dTenure = d?.liveness.tenure ?? null;
				worker.liveness = d?.liveness.livenessCoefficient ?? null;
				refreshWorkerCap(worker, settings);
			}
			rewardsLog.info(`reward stats updated for ${activeWorkers.length} active workers (snapshot ${formatTimestamp(rewardCycleSnapshotTs)})`);
			await recalculateWorkerAprs(ctx);
			return;
		}
		const e = result.error;
		resetRewardPipeline();
		if (e instanceof _subsquid_http_client.HttpError || e instanceof _subsquid_http_client.HttpTimeoutError) {
			rewardsLog.warn(e);
			rewardCycleSnapshotTs = (0, _sqd_shared.toStartOfInterval)(block.timestamp, rewardMetricsUpdateInterval);
			rewardConfigSlot = _sqd_shared.AsyncTask.start(() => client.get((0, _sqd_shared.joinUrl)(monitorUrl, `/config`)));
			return;
		}
		throw e;
	}
	if (rewardConfigSlot) {
		const result = rewardConfigSlot.get();
		if (result.state === "pending") return;
		if (result.state === "fulfilled") {
			rewardConfigSlot = null;
			const config = result.value;
			const rewardEpochLength = config.rewardEpochLength * 2;
			rewardsLog.debug(`rewards config received: epoch length is ${config.rewardEpochLength} blocks (window size: ${rewardEpochLength} blocks)`);
			const endBlock = await ctx.store.findOne(__model.Block, {
				where: { timestamp: (0, typeorm.MoreThanOrEqual)(new Date(rewardCycleSnapshotTs)) },
				order: { id: "ASC" }
			});
			if (!endBlock?.l1BlockNumber) {
				rewardsLog.warn(`cannot compute rewards window: no L1 block at or after ${formatTimestamp(rewardCycleSnapshotTs)} yet`);
				resetRewardPipeline();
				return;
			}
			const startBlock = await ctx.store.findOne(__model.Block, {
				where: { l1BlockNumber: (0, typeorm.MoreThanOrEqual)(endBlock.l1BlockNumber - rewardEpochLength) },
				order: { id: "ASC" }
			});
			if (!startBlock?.l1BlockNumber) {
				rewardsLog.warn(`cannot compute rewards window: no L1 block ${rewardEpochLength} ahead of L1 ${endBlock.l1BlockNumber} yet`);
				resetRewardPipeline();
				return;
			}
			const confirmationOffset = 150;
			const startL1 = startBlock.l1BlockNumber - confirmationOffset;
			const endL1 = endBlock.l1BlockNumber - confirmationOffset;
			rewardsLog.debug(`downloading rewards and APY for L1 blocks ${startL1}..${endL1}`);
			rewardDataSlot = _sqd_shared.AsyncTask.start(async () => {
				const [rewards, apy] = await Promise.all([client.get((0, _sqd_shared.joinUrl)(monitorUrl, `/rewards/${startL1}/${endL1}`)), client.get((0, _sqd_shared.joinUrl)(monitorUrl, `/currentApy/${startL1}`))]);
				return {
					rewards,
					apy
				};
			});
			return;
		}
		const e = result.error;
		rewardConfigSlot = null;
		resetRewardPipeline();
		if (e instanceof _subsquid_http_client.HttpError || e instanceof _subsquid_http_client.HttpTimeoutError) {
			rewardsLog.warn(e);
			rewardCycleSnapshotTs = (0, _sqd_shared.toStartOfInterval)(block.timestamp, rewardMetricsUpdateInterval);
			rewardConfigSlot = _sqd_shared.AsyncTask.start(() => client.get((0, _sqd_shared.joinUrl)(monitorUrl, `/config`)));
			return;
		}
		throw e;
	}
	if (block.timestamp - rewardMetricsUpdateInterval <= lastRewardMetricsUpdateTimestamp) return;
	const snapshotTimestamp = (0, _sqd_shared.toStartOfInterval)(block.timestamp, rewardMetricsUpdateInterval);
	if (snapshotTimestamp > lastRewardMetricsUpdateTimestamp) lastRewardMetricsUpdateTimestamp = snapshotTimestamp;
	rewardCycleSnapshotTs = snapshotTimestamp;
	rewardsLog.info(`fetching workers rewards snapshot for ${formatTimestamp(snapshotTimestamp)}`);
	rewardConfigSlot = _sqd_shared.AsyncTask.start(() => client.get((0, _sqd_shared.joinUrl)(monitorUrl, `/config`)));
}
//#endregion
//#region src/handlers/index.ts
const handlers = [
	...handlers$5,
	...handlers$4,
	...handlers$2,
	...handlers$1,
	...handlers$3
];
//#endregion
//#region src/materialized-view-refresh.ts
const MATERIALIZED_VIEWS = [
	"mv_active_workers_daily",
	"mv_unique_operators_daily",
	"mv_delegations_daily",
	"mv_delegators_daily",
	"mv_queries_daily",
	"mv_served_data_daily",
	"mv_stored_data_daily",
	"mv_uptime_daily",
	"mv_reward_daily",
	"mv_apr_daily"
];
const REFRESH_INTERVAL_MS = 3600 * 1e3;
async function startMaterializedViewRefresh(manager) {
	console.log("Starting materialized view refresh");
	try {
		for (const viewName of MATERIALIZED_VIEWS) await manager.query(`REFRESH MATERIALIZED VIEW ${viewName}`);
		console.log("Materialized views refreshed successfully");
	} catch (e) {
		console.warn("Error refreshing materialized views:", e);
	}
	setTimeout(() => startMaterializedViewRefresh(manager), REFRESH_INTERVAL_MS);
}
//#endregion
//#region src/main.ts
const logger = (0, _subsquid_logger.createLogger)("sqd:workers");
let isMaterializedRefreshRunning = false;
(0, _subsquid_batch_processor.run)(processor, new _belopash_typeorm_store.TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
	const batchSw = (0, _sqd_shared.stopwatch)();
	const ctx = {
		..._ctx,
		blocks: _ctx.blocks.map(_subsquid_evm_objects.augmentBlock),
		log: logger
	};
	if (!isMaterializedRefreshRunning && ctx.isHead) {
		isMaterializedRefreshRunning = true;
		startMaterializedViewRefresh(ctx.store["em"].connection.manager);
	}
	const firstBlock = ctx.blocks[0].header;
	const lastBlock = (0, _sqd_shared.last)(ctx.blocks).header;
	const tasks = [];
	ctx.store.defer(__model.Settings, _sqd_shared.network.name);
	tasks.push(withBlockContext(ctx, firstBlock, () => init(ctx, firstBlock)));
	let handlerTaskCount = 0;
	for (const block of ctx.blocks) {
		const items = (0, _sqd_shared.sortItems)(block);
		tasks.push(withBlockContext(ctx, block.header, async () => {
			await ctx.store.track(createBlock(block.header));
			await processWorkerUnlockQueue(ctx, block.header);
			await processWorkerStatusApplyQueue(ctx, block.header);
			await processDelegationUnlockQueue(ctx, block.header);
		}));
		for (const item of items) for (const handler of handlers) {
			const task = handler(ctx, item);
			if (task) {
				tasks.push(withBlockContext(ctx, block.header, task));
				handlerTaskCount++;
			}
		}
		tasks.push(withBlockContext(ctx, block.header, async () => {
			await checkForNewEpoch(ctx, block.header);
		}));
	}
	tasks.push(withBlockContext(ctx, lastBlock, () => complete(ctx, lastBlock)));
	const prepTime = batchSw.get();
	for (const task of tasks) await task();
	const execTime = batchSw.get();
	ctx.log.debug(`batch ${firstBlock.height}..${lastBlock.height}: ${ctx.blocks.length} blocks, ${handlerTaskCount} handler tasks, ${prepTime + execTime}ms (prep: ${prepTime}ms, exec: ${execTime}ms)`);
});
/**
* Wraps a task so thrown errors carry the block number/hash they originated
* from. Matches the master-branch `withBlockContext` helper that was dropped
* during the monorepo split (and which made handler failures diagnosable in
* production logs).
*/
function withBlockContext(ctx, block, task) {
	return async () => {
		try {
			await task();
		} catch (err) {
			if (err instanceof Error && !err.__sqdBlock) {
				err.message = `at block ${block.height} (${block.hash}): ${err.message}`;
				err.__sqdBlock = true;
			}
			throw err;
		}
	};
}
async function init(ctx, block) {
	await ctx.store.getOrCreate(__model.Settings, _sqd_shared.network.name, (id) => {
		const settings = createSettings(id);
		settings.contracts = new __model.Contracts({
			gatewayRegistry: _sqd_shared.network.contracts.GatewayRegistry.address,
			distributedRewardsDistribution: _sqd_shared.network.contracts.RewardsDistribution.address,
			router: _sqd_shared.network.contracts.Router.address,
			temporaryHoldingFactory: _sqd_shared.network.contracts.TemporaryHoldingFactory.address,
			vestingFactory: _sqd_shared.network.contracts.VestingFactory.address,
			softCap: _sqd_shared.network.contracts.SoftCap.address,
			portalPoolFactory: _sqd_shared.network.contracts.PortalPoolFactory.address,
			networkController: _sqd_shared.network.defaultRouterContracts.networkController,
			rewardCalculation: _sqd_shared.network.defaultRouterContracts.rewardCalculation,
			rewardTreasury: _sqd_shared.network.defaultRouterContracts.rewardTreasury,
			staking: _sqd_shared.network.defaultRouterContracts.staking,
			workerRegistration: _sqd_shared.network.defaultRouterContracts.workerRegistration
		});
		return settings;
	});
	const defaults = [
		[_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.workerRegistration],
		[_sqd_shared.NETWORK_CONTROLLER_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.networkController],
		[_sqd_shared.STAKING_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.staking]
	];
	for (const [key, address] of defaults) if (!ctx.templates.has(key, address, _sqd_shared.network.range.from)) ctx.templates.add(key, address, _sqd_shared.network.range.from);
	await ensureWorkerUnlock(ctx);
	await ensureWorkerStatusApplyQueue(ctx);
	await ensureDelegationUnlockQueue(ctx);
}
let blocksPassed = Number.POSITIVE_INFINITY;
async function complete(ctx, block) {
	if (ctx.isHead) {
		await updateWorkersOnline(ctx, block);
		await updateWorkersMetrics(ctx, block);
		await updateWorkerRewardStats(ctx, block);
		await flushAprRecalc(ctx);
	}
	if (blocksPassed > 1e3 && block.l1BlockNumber) {
		const cutoff = block.l1BlockNumber - 5e4;
		const chunkSize = 1e4;
		while (true) {
			const batch = await ctx.store.find(__model.Block, {
				where: { l1BlockNumber: (0, typeorm.LessThanOrEqual)(cutoff) },
				order: { l1BlockNumber: "ASC" },
				take: chunkSize,
				cacheEntities: false
			});
			if (batch.length === 0) break;
			await ctx.store.remove(__model.Block, batch.map((b) => b.id));
			ctx.log.info(`pruned ${batch.length} old blocks`);
			if (batch.length < chunkSize) break;
		}
		blocksPassed = 0;
	}
	blocksPassed += ctx.blocks.length;
}
/**
* Advance `Settings.currentEpoch` and materialize any missing `Epoch` entities
* up to and including the epoch that contains `block.l1BlockNumber`.
*
* Invoked once per delivered block, **after** that block's log handlers (see
* task order in the batch loop). That way `Settings.epochLength` and other
* fields updated in the same block are visible before we align epoch 0 with
* `toEpochStart(block.l1BlockNumber, epochLength)`.
*
* The processor does not subscribe to every chain block (no `includeAllBlocks()`),
* so delivered blocks are a sparser set than every L1 block — the catch-up loop
* replays all boundaries between the previously recorded `currentEpoch` and
* this block.
*
* Boundary timestamps are attributed to the block that first carries us past
* them: the loop does not advance an epoch until a block's L1 number actually
* reaches `epoch.end + 1`, so `endedAt`/`startedAt` end up stamped with the
* earliest delivered block past each boundary. When several boundaries fall
* between two consecutive delivered blocks (e.g. after a network outage) they
* unavoidably share the same later timestamp — there is no finer-grained data
* to attribute them with.
*/
async function checkForNewEpoch(ctx, block) {
	if (block.height < _sqd_shared.network.epochsStart) return;
	if (!block.l1BlockNumber) return;
	const settings = await ctx.store.getOrFail(__model.Settings, _sqd_shared.network.name);
	const epochLength = settings.epochLength;
	if (epochLength == null) return;
	let currentEpoch;
	if (settings.currentEpoch != null) currentEpoch = await ctx.store.getOrFail(__model.Epoch, (0, _sqd_shared.createEpochId)(settings.currentEpoch));
	if (currentEpoch != null && block.l1BlockNumber <= currentEpoch.end) return;
	const timestamp = new Date(block.timestamp);
	let advanced = 0;
	while (true) {
		const epochStart = currentEpoch == null ? (0, _sqd_shared.toEpochStart)(block.l1BlockNumber, epochLength) : currentEpoch.end + 1;
		if (block.l1BlockNumber < epochStart) break;
		if (currentEpoch) {
			currentEpoch.status = __model.EpochStatus.ENDED;
			currentEpoch.endedAt = timestamp;
			ctx.log.info(`epoch ${currentEpoch.number} ended`);
		}
		const newEpochNumber = settings.currentEpoch == null ? 0 : settings.currentEpoch + 1;
		currentEpoch = new __model.Epoch({
			id: (0, _sqd_shared.createEpochId)(newEpochNumber),
			number: newEpochNumber,
			start: epochStart,
			end: epochStart + epochLength - 1,
			startedAt: timestamp,
			status: __model.EpochStatus.STARTED
		});
		await ctx.store.track(currentEpoch);
		ctx.log.info(`epoch ${currentEpoch.number} started [${currentEpoch.start}, ${currentEpoch.end}]`);
		settings.currentEpoch = currentEpoch.number;
		advanced++;
	}
	if (advanced > 1) ctx.log.debug(`epoch catch-up: advanced ${advanced} epochs at L1 block ${block.l1BlockNumber}`);
}
//#endregion

//# sourceMappingURL=main.js.map