-- name: ListHeatSinks :many
SELECT * FROM heat_sinks
ORDER BY name
LIMIT ? OFFSET ?;

-- name: CountHeatSinks :one
SELECT COUNT(*) FROM heat_sinks;

-- name: GetHeatSink :one
SELECT * FROM heat_sinks
WHERE id = ?
LIMIT 1;

-- name: CreateHeatSink :one
INSERT INTO heat_sinks (
    name,
    location_lat,
    location_lng,
    address,
    sink_type,
    capacity_mw,
    current_demand_mw,
    temperature_requirement_c,
    seasonal_factor,
    connection_cost_per_km,
    heat_price_per_mwh,
    operating_hours_year
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateHeatSink :one
UPDATE heat_sinks
SET
    name = COALESCE(?, name),
    location_lat = COALESCE(?, location_lat),
    location_lng = COALESCE(?, location_lng),
    address = COALESCE(?, address),
    sink_type = COALESCE(?, sink_type),
    capacity_mw = COALESCE(?, capacity_mw),
    current_demand_mw = COALESCE(?, current_demand_mw),
    temperature_requirement_c = COALESCE(?, temperature_requirement_c),
    seasonal_factor = COALESCE(?, seasonal_factor),
    connection_cost_per_km = COALESCE(?, connection_cost_per_km),
    heat_price_per_mwh = COALESCE(?, heat_price_per_mwh),
    operating_hours_year = COALESCE(?, operating_hours_year)
WHERE id = ?
RETURNING *;

-- name: DeleteHeatSink :exec
DELETE FROM heat_sinks
WHERE id = ?;
