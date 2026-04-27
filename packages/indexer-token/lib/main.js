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
let _sqd_shared_lib_abi_DistributedRewardsDistribution = require("@sqd/shared/lib/abi/DistributedRewardsDistribution");
_sqd_shared_lib_abi_DistributedRewardsDistribution = __toESM(_sqd_shared_lib_abi_DistributedRewardsDistribution);
let _sqd_shared_lib_abi_GatewayRegistry = require("@sqd/shared/lib/abi/GatewayRegistry");
_sqd_shared_lib_abi_GatewayRegistry = __toESM(_sqd_shared_lib_abi_GatewayRegistry);
let _sqd_shared_lib_abi_PortalPoolFactory = require("@sqd/shared/lib/abi/PortalPoolFactory");
_sqd_shared_lib_abi_PortalPoolFactory = __toESM(_sqd_shared_lib_abi_PortalPoolFactory);
let _sqd_shared_lib_abi_PortalPoolImplementation = require("@sqd/shared/lib/abi/PortalPoolImplementation");
_sqd_shared_lib_abi_PortalPoolImplementation = __toESM(_sqd_shared_lib_abi_PortalPoolImplementation);
let _sqd_shared_lib_abi_RewardTreasury = require("@sqd/shared/lib/abi/RewardTreasury");
_sqd_shared_lib_abi_RewardTreasury = __toESM(_sqd_shared_lib_abi_RewardTreasury);
let _sqd_shared_lib_abi_Router = require("@sqd/shared/lib/abi/Router");
_sqd_shared_lib_abi_Router = __toESM(_sqd_shared_lib_abi_Router);
let _sqd_shared_lib_abi_SQD = require("@sqd/shared/lib/abi/SQD");
_sqd_shared_lib_abi_SQD = __toESM(_sqd_shared_lib_abi_SQD);
let _sqd_shared_lib_abi_Staking = require("@sqd/shared/lib/abi/Staking");
_sqd_shared_lib_abi_Staking = __toESM(_sqd_shared_lib_abi_Staking);
let _sqd_shared_lib_abi_SubsquidVesting = require("@sqd/shared/lib/abi/SubsquidVesting");
_sqd_shared_lib_abi_SubsquidVesting = __toESM(_sqd_shared_lib_abi_SubsquidVesting);
let _sqd_shared_lib_abi_VestingFactory = require("@sqd/shared/lib/abi/VestingFactory");
_sqd_shared_lib_abi_VestingFactory = __toESM(_sqd_shared_lib_abi_VestingFactory);
let _sqd_shared_lib_abi_WorkerRegistration = require("@sqd/shared/lib/abi/WorkerRegistration");
_sqd_shared_lib_abi_WorkerRegistration = __toESM(_sqd_shared_lib_abi_WorkerRegistration);
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
}).setBlockRange(_sqd_shared.network.range);
if (process.env.PORTAL_ENDPOINT) builder.setPortal({
	url: (0, _subsquid_util_internal.assertNotNull)(process.env.PORTAL_ENDPOINT),
	minBytes: 40 * 1024 * 1024
});
builder.addLog({
	range: _sqd_shared.network.contracts.SQD.range,
	where: {
		address: [_sqd_shared.network.contracts.SQD.address],
		topic0: [_sqd_shared_lib_abi_SQD.events.Transfer.topic]
	},
	include: { transaction: true }
});
builder.addLog({
	range: _sqd_shared.network.contracts.GatewayRegistry.range,
	where: {
		address: [_sqd_shared.network.contracts.GatewayRegistry.address],
		topic0: [_sqd_shared_lib_abi_GatewayRegistry.events.Staked.topic, _sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.topic]
	},
	include: { transaction: true }
});
builder.addLog({
	range: _sqd_shared.network.contracts.RewardsDistribution.range,
	where: {
		address: [_sqd_shared.network.contracts.RewardsDistribution.address],
		topic0: [_sqd_shared_lib_abi_DistributedRewardsDistribution.events.Claimed.topic]
	}
});
builder.addLog({
	range: _sqd_shared.network.contracts.Router.range,
	where: {
		address: [_sqd_shared.network.contracts.Router.address],
		topic0: [
			_sqd_shared_lib_abi_Router.events.StakingSet.topic,
			_sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.topic,
			_sqd_shared_lib_abi_Router.events.RewardTreasurySet.topic
		]
	}
});
builder.addLog(_sqd_shared.STAKING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_Staking.events.Deposited.topic, _sqd_shared_lib_abi_Staking.events.Withdrawn.topic] }
});
builder.addLog(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerDeregistered.topic,
		_sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.topic
	] }
});
builder.addLog(_sqd_shared.REWARD_TREASURY_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_RewardTreasury.events.Claimed.topic] }
});
builder.addLog({
	range: _sqd_shared.network.contracts.VestingFactory.range,
	where: {
		address: [_sqd_shared.network.contracts.VestingFactory.address],
		topic0: [_sqd_shared_lib_abi_VestingFactory.events.VestingCreated.topic]
	}
});
if (_sqd_shared.network.name === "tethys") builder.addLog(_sqd_shared.VESTING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_SubsquidVesting.events.OwnershipTransferred.topic] }
});
builder.addLog(_sqd_shared.VESTING_TEMPLATE_KEY, {
	range: { from: _sqd_shared.network.range.from },
	where: { topic0: [_sqd_shared_lib_abi_SubsquidVesting.events.ERC20Released.topic] }
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
		_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.topic
	] },
	include: { transaction: true }
});
const processor = builder.build();
//#endregion
//#region src/handlers/Transfer.handler.ts
const handleTransfer = (0, _sqd_shared.createHandlerOld)({
	filter(_, item) {
		return (0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.SQD) && (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_SQD.events.Transfer.is(item.value);
	},
	handle(ctx, { value: log }) {
		const event = _sqd_shared_lib_abi_SQD.events.Transfer.decode(log);
		const fromId = (0, _sqd_shared.createAccountId)(event.from);
		ctx.store.defer(__model.Account, fromId);
		const toId = (0, _sqd_shared.createAccountId)(event.to);
		ctx.store.defer(__model.Account, toId);
		ctx.store.defer(__model.Transfer, {
			id: log.id,
			relations: {
				from: true,
				to: true
			}
		});
		return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
			const transfer = await saveTransfer(ctx, {
				log,
				event
			});
			if (!transfer) return;
			const { from, to } = transfer;
			if (from.id !== to.id) {
				from.balance -= event.value;
				to.balance += event.value;
			}
			await ctx.store.track([new __model.AccountTransfer({
				id: `${transfer.id}-from`,
				direction: __model.TransferDirection.FROM,
				account: transfer.from,
				transfer,
				balance: from.balance
			}), new __model.AccountTransfer({
				id: `${transfer.id}-to`,
				direction: __model.TransferDirection.TO,
				account: transfer.to,
				transfer,
				balance: to.balance
			})]);
			ctx.log.info(`account(${transfer.from.id}) transferred ${(0, _sqd_shared.toHumanSQD)(transfer.amount)} to account(${transfer.to.id}) (${elapsed()}ms)`);
		});
	}
});
function createAccount$1(id, opts) {
	return new __model.Account({
		id,
		balance: 0n,
		claimableDelegationCount: 0,
		type: __model.AccountType.USER,
		...opts
	});
}
async function saveTransfer(ctx, { log, event }, extra) {
	if (event.value === 0n) return;
	let transfer = await ctx.store.get(__model.Transfer, {
		id: log.id,
		relations: {
			from: true,
			to: true
		}
	});
	if (!extra && transfer) return transfer;
	if (transfer) Object.assign(transfer, extra);
	else {
		const from = await ctx.store.getOrCreate(__model.Account, event.from, (id) => {
			ctx.log.info(`created account(${id})`);
			return createAccount$1(id, { type: __model.AccountType.USER });
		});
		const to = await ctx.store.getOrCreate(__model.Account, event.to, (id) => {
			ctx.log.info(`created account(${id})`);
			return createAccount$1(id, { type: __model.AccountType.USER });
		});
		transfer = new __model.Transfer({
			id: log.id,
			from,
			to,
			blockNumber: log.block.height,
			amount: event.value,
			timestamp: new Date(log.block.timestamp),
			txHash: log.transactionHash,
			type: __model.TransferType.TRANSFER,
			...extra
		});
		await ctx.store.track(transfer);
	}
	return transfer;
}
//#endregion
//#region src/handlers/DelegationStaking.handler.ts
const handleStakingDeposited = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Staking.events.Deposited.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const { worker: workerIndex, staker: stakerAccount, amount } = _sqd_shared_lib_abi_Staking.events.Deposited.decode(log);
	if (amount === 0n) return;
	const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
	const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
	const delegationId = (0, _sqd_shared.createDelegationId)(workerId, accountId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			from: accountId,
			to: log.address,
			amount,
			logIndex: log.logIndex - 1
		});
		if (!transfer) throw new Error(`transfer not found for delegation(${delegationId})`);
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.DEPOSIT,
			delegationId
		});
		ctx.log.info(`classified delegation(${delegationId}) deposit (${elapsed()}ms)`);
	});
});
const handleStakingWithdrawn = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Staking.events.Withdrawn.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.STAKING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const { worker: workerIndex, staker: stakerAccount, amount } = _sqd_shared_lib_abi_Staking.events.Withdrawn.decode(log);
	const workerId = (0, _sqd_shared.createWorkerId)(workerIndex);
	const accountId = (0, _sqd_shared.createAccountId)(stakerAccount);
	const delegationId = (0, _sqd_shared.createDelegationId)(workerId, accountId);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			to: accountId,
			from: log.address,
			amount,
			logIndex: log.logIndex - 1
		});
		if (!transfer) throw new Error(`transfer not found for delegation(${delegationId})`);
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.WITHDRAW,
			delegationId
		});
		ctx.log.info(`classified delegation(${delegationId}) withdrawal (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/GatewayStaking.handler.ts
const handleGatewayStaked = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.Staked.is(item.value)) return;
	const log = item.value;
	const event = _sqd_shared_lib_abi_GatewayRegistry.events.Staked.decode(log);
	const accountId = (0, _sqd_shared.createAccountId)(event.gatewayOperator);
	const gatewayStakeId = (0, _sqd_shared.createGatewayOperatorId)(event.gatewayOperator);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			to: _sqd_shared.network.contracts.GatewayRegistry.address,
			from: accountId,
			logIndex: log.logIndex - 1
		});
		if (!transfer) throw new Error(`transfer not found for gateway stake(${gatewayStakeId})`);
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.DEPOSIT,
			gatewayStakeId
		});
		ctx.log.info(`classified gateway stake(${gatewayStakeId}) deposit (${elapsed()}ms)`);
	});
});
const handleGatewayUnstaked = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.GatewayRegistry)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.is(item.value)) return;
	const log = item.value;
	const gatewayStakeId = (0, _sqd_shared.createGatewayOperatorId)(_sqd_shared_lib_abi_GatewayRegistry.events.Unstaked.decode(log).gatewayOperator);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			from: _sqd_shared.network.contracts.GatewayRegistry.address,
			to: gatewayStakeId,
			logIndex: log.logIndex - 1
		});
		if (!transfer) throw new Error(`transfer not found for gateway stake(${gatewayStakeId})`);
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.WITHDRAW,
			gatewayStakeId
		});
		ctx.log.info(`classified gateway stake(${gatewayStakeId}) withdrawal (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/PoolCreated.handler.ts
const handlePoolCreated = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (item.address !== _sqd_shared.network.contracts.PortalPoolFactory.address) return;
	if (!_sqd_shared_lib_abi_PortalPoolFactory.events.PoolCreated.is(item.value)) return;
	const log = item.value;
	const portalAddress = (0, _sqd_shared.normalizeAddress)(_sqd_shared_lib_abi_PortalPoolFactory.events.PoolCreated.decode(log).portal);
	return async () => {
		ctx.templates.add(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, portalAddress, log.block.height);
		ctx.log.info(`registered portal_pool template for ${portalAddress}`);
	};
});
//#endregion
//#region src/handlers/PortalPool.handler.ts
const handlePortalPoolDeposited = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.Deposited.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = item.address;
	const { provider, amount } = _sqd_shared_lib_abi_PortalPoolImplementation.events.Deposited.decode(log);
	const accountId = (0, _sqd_shared.createAccountId)(provider);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransferInTx)(log.transaction?.logs ?? [], {
			from: accountId,
			to: poolAddress,
			amount
		});
		if (!transfer) return;
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.DEPOSIT,
			portalPoolId: poolAddress
		});
		ctx.log.info(`classified portal_pool(${poolAddress}) deposit (${elapsed()}ms)`);
	});
});
const handlePortalPoolWithdrawn = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.Withdrawn.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = item.address;
	const { provider, amount } = _sqd_shared_lib_abi_PortalPoolImplementation.events.Withdrawn.decode(log);
	const accountId = (0, _sqd_shared.createAccountId)(provider);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransferInTx)(log.transaction?.logs ?? [], {
			to: accountId,
			amount
		});
		if (!transfer) return;
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.WITHDRAW,
			portalPoolId: poolAddress
		});
		ctx.log.info(`classified portal_pool(${poolAddress}) withdrawal (${elapsed()}ms)`);
	});
});
const handlePortalPoolExitClaimed = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.PORTAL_POOL_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const poolAddress = item.address;
	const { provider, amount } = _sqd_shared_lib_abi_PortalPoolImplementation.events.ExitClaimed.decode(log);
	const accountId = (0, _sqd_shared.createAccountId)(provider);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransferInTx)(log.transaction?.logs ?? [], {
			to: accountId,
			amount
		});
		if (!transfer) return;
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.WITHDRAW,
			portalPoolId: poolAddress
		});
		ctx.log.info(`classified portal_pool(${poolAddress}) exit claimed (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/RewardTreasury.handler.ts
const handleRewardTreasuryClaimed = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_RewardTreasury.events.Claimed.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.REWARD_TREASURY_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const log = item.value;
	const { receiver } = _sqd_shared_lib_abi_RewardTreasury.events.Claimed.decode(log);
	const accountId = (0, _sqd_shared.createAccountId)(receiver);
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			from: log.address,
			to: accountId,
			logIndex: log.logIndex - 1
		});
		if (!transfer) throw new Error(`transfer not found for reward treasury claim`);
		await saveTransfer(ctx, transfer, { type: __model.TransferType.CLAIM });
		ctx.log.info(`classified reward treasury claim for ${accountId} (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/Router.handler.ts
const stakingSetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.StakingSet.is(item.value)) return;
	const { staking } = _sqd_shared_lib_abi_Router.events.StakingSet.decode(item.value);
	const blockHeight = item.value.block.height;
	return async () => {
		ctx.templates.add(_sqd_shared.STAKING_TEMPLATE_KEY, staking, blockHeight);
		ctx.log.info(`token: staking contract set to ${staking}`);
	};
});
const workerRegistrationSetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.is(item.value)) return;
	const { workerRegistration } = _sqd_shared_lib_abi_Router.events.WorkerRegistrationSet.decode(item.value);
	const blockHeight = item.value.block.height;
	return async () => {
		ctx.templates.add(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, workerRegistration, blockHeight);
		ctx.log.info(`token: worker registration contract set to ${workerRegistration}`);
	};
});
const rewardTreasurySetHandler = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isContract)(item, _sqd_shared.network.contracts.Router)) return;
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_Router.events.RewardTreasurySet.is(item.value)) return;
	const { rewardTreasury } = _sqd_shared_lib_abi_Router.events.RewardTreasurySet.decode(item.value);
	const blockHeight = item.value.block.height;
	return async () => {
		ctx.templates.add(_sqd_shared.REWARD_TREASURY_TEMPLATE_KEY, rewardTreasury, blockHeight);
		ctx.log.info(`token: reward treasury contract set to ${rewardTreasury}`);
	};
});
//#endregion
//#region src/handlers/VestingCreated.handler.ts
function createAccount(id, opts) {
	return new __model.Account({
		id,
		balance: 0n,
		claimableDelegationCount: 0,
		type: __model.AccountType.USER,
		...opts
	});
}
const handleVestingCreated = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (item.address !== _sqd_shared.network.contracts.VestingFactory.address) return;
	if (!_sqd_shared_lib_abi_VestingFactory.events.VestingCreated.is(item.value)) return;
	const { vesting: vestingAddress, beneficiary: beneficiaryAddress } = _sqd_shared_lib_abi_VestingFactory.events.VestingCreated.decode(item.value);
	ctx.store.defer(__model.Account, (0, _sqd_shared.createAccountId)(beneficiaryAddress));
	ctx.store.defer(__model.Account, {
		id: (0, _sqd_shared.createAccountId)(vestingAddress),
		relations: { owner: true }
	});
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const owner = await ctx.store.getOrCreate(__model.Account, (0, _sqd_shared.createAccountId)(beneficiaryAddress), (id) => {
			ctx.log.info(`created account(${id})`);
			return createAccount(id, { type: __model.AccountType.USER });
		});
		const vesting = await ctx.store.getOrCreate(__model.Account, {
			id: (0, _sqd_shared.createAccountId)(vestingAddress),
			relations: { owner: true }
		}, (id) => {
			ctx.log.info(`created account(${id})`);
			return createAccount(id, {
				type: __model.AccountType.VESTING,
				owner
			});
		});
		if (vesting.type !== __model.AccountType.VESTING || vesting.owner?.id !== owner.id) {
			vesting.type = __model.AccountType.VESTING;
			vesting.owner = owner;
		}
		ctx.templates.add(_sqd_shared.VESTING_TEMPLATE_KEY, (0, _sqd_shared.normalizeAddress)(vestingAddress), item.value.block.height);
		ctx.log.info(`created vesting(${vesting.id}) for account(${owner.id}) (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/VestingRelease.handler.ts
const handleVestingReleased = (0, _sqd_shared.createHandler)((ctx, item) => {
	if (!(0, _sqd_shared.isLog)(item)) return;
	if (!_sqd_shared_lib_abi_SubsquidVesting.events.ERC20Released.is(item.value)) return;
	if (!ctx.templates.has(_sqd_shared.VESTING_TEMPLATE_KEY, item.address, item.value.block.height)) return;
	const { value: log } = item;
	const vestingId = (0, _sqd_shared.createAccountId)(log.address);
	const vestingDeferred = ctx.store.defer(__model.Account, {
		id: vestingId,
		relations: { owner: true }
	});
	return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
		const vesting = await vestingDeferred.getOrFail();
		const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
			from: vesting.id,
			to: vesting.owner?.id,
			logIndex: log.logIndex + 1
		});
		if (!transfer) return;
		await saveTransfer(ctx, transfer, {
			type: __model.TransferType.RELEASE,
			vestingId: vesting.id
		});
		ctx.log.info(`released vesting(${vesting.id}) to account(${vesting.owner?.id}) (${elapsed()}ms)`);
	});
});
//#endregion
//#region src/handlers/index.ts
const handlers = [
	handleTransfer,
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const event = _sqd_shared_lib_abi_WorkerRegistration.events.WorkerRegistered.decode(log);
			const ownerId = (0, _sqd_shared.createAccountId)(event.registrar);
			const workerId = (0, _sqd_shared.createWorkerId)(event.workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const transfer = (0, _sqd_shared.findTransfer)(log.getTransaction().logs, {
					from: ownerId,
					to: log.address,
					logIndex: log.logIndex - 1
				});
				if (!transfer) throw new Error(`transfer not found for worker(${workerId})`);
				await saveTransfer(ctx, transfer, {
					type: __model.TransferType.DEPOSIT,
					workerId
				});
				ctx.log.info(`classified worker(${workerId}) registration deposit (${elapsed()}ms)`);
			});
		}
	}),
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const workerId = (0, _sqd_shared.createWorkerId)(_sqd_shared_lib_abi_WorkerRegistration.events.WorkerWithdrawn.decode(log).workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
					from: log.address,
					logIndex: log.logIndex - 1
				});
				if (!transfer) throw new Error(`transfer not found for worker(${workerId}) withdrawal`);
				await saveTransfer(ctx, transfer, {
					type: __model.TransferType.WITHDRAW,
					workerId
				});
				ctx.log.info(`classified worker(${workerId}) withdrawal (${elapsed()}ms)`);
			});
		}
	}),
	(0, _sqd_shared.createHandlerOld)({
		filter(_, item) {
			return (0, _sqd_shared.isLog)(item) && _sqd_shared_lib_abi_WorkerRegistration.events.ExcessiveBondReturned.is(item.value);
		},
		handle(ctx, { value: log }) {
			if (!ctx.templates.has(_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, log.address, log.block.height)) return;
			const workerId = (0, _sqd_shared.createWorkerId)(_sqd_shared_lib_abi_WorkerRegistration.events.ExcessiveBondReturned.decode(log).workerId);
			return (0, _sqd_shared.timed)(ctx, async (elapsed) => {
				const transfer = (0, _sqd_shared.findTransfer)(log.transaction?.logs ?? [], {
					from: log.address,
					logIndex: log.logIndex - 1
				});
				if (!transfer) throw new Error(`transfer not found for worker(${workerId}) excessive bond return`);
				await saveTransfer(ctx, transfer, {
					type: __model.TransferType.WITHDRAW,
					workerId
				});
				ctx.log.info(`classified worker(${workerId}) excessive bond return (${elapsed()}ms)`);
			});
		}
	}),
	handleStakingDeposited,
	handleStakingWithdrawn,
	handleGatewayStaked,
	handleGatewayUnstaked,
	handlePoolCreated,
	handlePortalPoolDeposited,
	handlePortalPoolWithdrawn,
	handlePortalPoolExitClaimed,
	handleRewardTreasuryClaimed,
	stakingSetHandler,
	workerRegistrationSetHandler,
	rewardTreasurySetHandler,
	handleVestingCreated,
	handleVestingReleased
];
//#endregion
//#region src/main.ts
const logger = (0, _subsquid_logger.createLogger)("sqd:token");
let isMaterializedRefreshRunning = false;
(0, _subsquid_batch_processor.run)(processor, new _belopash_typeorm_store.TypeormDatabaseWithCache({ supportHotBlocks: true }), async (_ctx) => {
	if (!isMaterializedRefreshRunning) {
		isMaterializedRefreshRunning = true;
		const { startMaterializedViewRefresh } = await Promise.resolve().then(() => require("./materialized-view-refresh-uxsiEKsJ.js"));
		startMaterializedViewRefresh(_ctx.store.em.connection.manager);
	}
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
		const defaultFrom = _sqd_shared.network.range.from;
		const defaults = [
			[_sqd_shared.WORKER_REGISTRATION_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.workerRegistration],
			[_sqd_shared.STAKING_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.staking],
			[_sqd_shared.REWARD_TREASURY_TEMPLATE_KEY, _sqd_shared.network.defaultRouterContracts.rewardTreasury]
		];
		for (const [key, address] of defaults) if (!ctx.templates.has(key, address, defaultFrom)) ctx.templates.add(key, address, defaultFrom);
	});
	let handlerTaskCount = 0;
	for (const block of ctx.blocks) {
		const items = (0, _sqd_shared.sortItems)(block);
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