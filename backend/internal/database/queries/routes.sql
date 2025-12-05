-- name: ListRoutes :many
SELECT * FROM routes
ORDER BY id
LIMIT ? OFFSET ?;

-- name: CountRoutes :one
SELECT COUNT(*) FROM routes;

-- name: GetRoute :one
SELECT * FROM routes
WHERE id = ?
LIMIT 1;

-- name: CreateRoute :one
INSERT INTO routes (
    heat_center_id,
    demand_site_id,
    distance_km,
    pipe_diameter_mm,
    max_flow_capacity_mw,
    current_flow_mw,
    supply_temp_celsius,
    return_temp_celsius,
    pressure_bar,
    heat_loss_percent,
    installation_year,
    pipe_material,
    insulation_type,
    status,
    is_bidirectional,
    maintenance_due,
    construction_cost,
    annual_maintenance_cost
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateRoute :one
UPDATE routes
SET
    heat_center_id = COALESCE(?, heat_center_id),
    demand_site_id = COALESCE(?, demand_site_id),
    distance_km = COALESCE(?, distance_km),
    pipe_diameter_mm = COALESCE(?, pipe_diameter_mm),
    max_flow_capacity_mw = COALESCE(?, max_flow_capacity_mw),
    current_flow_mw = COALESCE(?, current_flow_mw),
    supply_temp_celsius = COALESCE(?, supply_temp_celsius),
    return_temp_celsius = COALESCE(?, return_temp_celsius),
    pressure_bar = COALESCE(?, pressure_bar),
    heat_loss_percent = COALESCE(?, heat_loss_percent),
    installation_year = COALESCE(?, installation_year),
    pipe_material = COALESCE(?, pipe_material),
    insulation_type = COALESCE(?, insulation_type),
    status = COALESCE(?, status),
    is_bidirectional = COALESCE(?, is_bidirectional),
    maintenance_due = COALESCE(?, maintenance_due),
    construction_cost = COALESCE(?, construction_cost),
    annual_maintenance_cost = COALESCE(?, annual_maintenance_cost),
    updated_at = datetime('now')
WHERE id = ?
RETURNING *;

-- name: DeleteRoute :exec
DELETE FROM routes
WHERE id = ?;


