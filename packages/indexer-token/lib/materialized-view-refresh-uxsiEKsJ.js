//#region src/materialized-view-refresh.ts
const MATERIALIZED_VIEWS = [
	"mv_holders_count_daily",
	"mv_locked_value_daily",
	"mv_transfers_by_type_daily",
	"mv_unique_accounts_daily"
];
const REFRESH_INTERVAL_MS = 3600 * 1e3;
async function startMaterializedViewRefresh(manager) {
	try {
		for (const viewName of MATERIALIZED_VIEWS) await manager.query(`REFRESH MATERIALIZED VIEW ${viewName}`);
		console.log("Materialized views refreshed successfully");
	} catch (e) {
		console.warn("Error refreshing materialized views:", e);
	}
	setTimeout(() => startMaterializedViewRefresh(manager), REFRESH_INTERVAL_MS);
}
//#endregion
exports.startMaterializedViewRefresh = startMaterializedViewRefresh;

//# sourceMappingURL=materialized-view-refresh-uxsiEKsJ.js.map