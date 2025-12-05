-- name: ListPredictionResults :many
SELECT * FROM prediction_results
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- name: CountPredictionResults :one
SELECT COUNT(*) FROM prediction_results;

-- name: GetPredictionResult :one
SELECT * FROM prediction_results
WHERE id = ?
LIMIT 1;

-- name: CreatePredictionResult :one
INSERT INTO prediction_results (
    data_center_id,
    carbon_credit_id,
    heat_sink_id,
    scenario_name,
    analysis_years,
    total_capex,
    annual_opex,
    annual_savings,
    net_present_value,
    internal_rate_return,
    payback_period_years,
    investment_grade,
    annual_co2_reduction_kg,
    annual_heat_recovery_kwh,
    detailed_results
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetPredictionResultsByDataCenter :many
SELECT * FROM prediction_results
WHERE data_center_id = ?
ORDER BY created_at DESC;

-- name: GetPredictionResultsByScenario :many
SELECT * FROM prediction_results
WHERE scenario_name = ?
ORDER BY created_at DESC;

-- name: DeletePredictionResult :exec
DELETE FROM prediction_results
WHERE id = ?;

-- name: GetAnalyticsSummary :one
SELECT
    (SELECT COUNT(*) FROM heat_centers) AS total_heat_centers,
    (SELECT COUNT(*) FROM demand_sites) AS total_demand_sites,
    (SELECT COUNT(*) FROM routes) AS total_routes,
    (SELECT COUNT(*) FROM heat_centers WHERE is_active = 1) AS active_heat_centers,
    (SELECT COUNT(*) FROM demand_sites WHERE is_connected = 1) AS connected_demand_sites,
    (SELECT COALESCE(SUM(max_capacity_mw), 0.0) FROM heat_centers) AS total_capacity_mw,
    (SELECT COALESCE(SUM(current_output_mw), 0.0) FROM heat_centers) AS total_current_output_mw,
    (SELECT COALESCE(SUM(peak_demand_mw), 0.0) FROM demand_sites) AS total_demand_mw,
    (SELECT COUNT(*) FROM routes WHERE status = 'ACTIVE') AS total_active_routes;
