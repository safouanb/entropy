-- name: ListDataCenters :many
SELECT * FROM data_centers
ORDER BY name
LIMIT ? OFFSET ?;

-- name: CountDataCenters :one
SELECT COUNT(*) FROM data_centers;

-- name: GetDataCenter :one
SELECT * FROM data_centers
WHERE id = ?
LIMIT 1;

-- name: CreateDataCenter :one
INSERT INTO data_centers (
    name,
    location_lat,
    location_lng,
    address,
    dc_type,
    total_it_load_kw,
    pue,
    utilization_percent,
    cooling_type,
    energy_source,
    renewable_percent,
    electricity_cost_kwh,
    operating_hours_year,
    heat_recovery_enabled
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateDataCenter :one
UPDATE data_centers
SET
    name = COALESCE(?, name),
    location_lat = COALESCE(?, location_lat),
    location_lng = COALESCE(?, location_lng),
    address = COALESCE(?, address),
    dc_type = COALESCE(?, dc_type),
    total_it_load_kw = COALESCE(?, total_it_load_kw),
    pue = COALESCE(?, pue),
    utilization_percent = COALESCE(?, utilization_percent),
    cooling_type = COALESCE(?, cooling_type),
    energy_source = COALESCE(?, energy_source),
    renewable_percent = COALESCE(?, renewable_percent),
    electricity_cost_kwh = COALESCE(?, electricity_cost_kwh),
    operating_hours_year = COALESCE(?, operating_hours_year),
    heat_recovery_enabled = COALESCE(?, heat_recovery_enabled)
WHERE id = ?
RETURNING *;

-- name: DeleteDataCenter :exec
DELETE FROM data_centers
WHERE id = ?;


