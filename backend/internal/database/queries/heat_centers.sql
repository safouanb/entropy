-- name: ListHeatCenters :many
SELECT * FROM heat_centers
ORDER BY name
LIMIT ? OFFSET ?;

-- name: CountHeatCenters :one
SELECT COUNT(*) FROM heat_centers;

-- name: GetHeatCenter :one
SELECT * FROM heat_centers
WHERE id = ?
LIMIT 1;

-- name: CreateHeatCenter :one
INSERT INTO heat_centers (
    name,
    location_lat,
    location_lng,
    address,
    max_capacity_mw,
    current_output_mw,
    efficiency_percent,
    fuel_type,
    is_active,
    commissioning_date,
    last_maintenance,
    description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateHeatCenter :one
UPDATE heat_centers
SET
    name = COALESCE(?, name),
    location_lat = COALESCE(?, location_lat),
    location_lng = COALESCE(?, location_lng),
    address = COALESCE(?, address),
    max_capacity_mw = COALESCE(?, max_capacity_mw),
    current_output_mw = COALESCE(?, current_output_mw),
    efficiency_percent = COALESCE(?, efficiency_percent),
    fuel_type = COALESCE(?, fuel_type),
    is_active = COALESCE(?, is_active),
    commissioning_date = COALESCE(?, commissioning_date),
    last_maintenance = COALESCE(?, last_maintenance),
    description = COALESCE(?, description),
    updated_at = datetime('now')
WHERE id = ?
RETURNING *;

-- name: DeleteHeatCenter :exec
DELETE FROM heat_centers
WHERE id = ?;


