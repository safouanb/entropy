-- name: ListDemandSites :many
SELECT * FROM demand_sites
ORDER BY name
LIMIT ? OFFSET ?;

-- name: CountDemandSites :one
SELECT COUNT(*) FROM demand_sites;

-- name: GetDemandSite :one
SELECT * FROM demand_sites
WHERE id = ?
LIMIT 1;

-- name: CreateDemandSite :one
INSERT INTO demand_sites (
    name,
    location_lat,
    location_lng,
    address,
    site_type,
    peak_demand_mw,
    current_demand_mw,
    annual_consumption_mwh,
    is_connected,
    connection_date,
    priority_level,
    floor_area_sqm,
    building_age_years,
    insulation_rating,
    description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateDemandSite :one
UPDATE demand_sites
SET
    name = COALESCE(?, name),
    location_lat = COALESCE(?, location_lat),
    location_lng = COALESCE(?, location_lng),
    address = COALESCE(?, address),
    site_type = COALESCE(?, site_type),
    peak_demand_mw = COALESCE(?, peak_demand_mw),
    current_demand_mw = COALESCE(?, current_demand_mw),
    annual_consumption_mwh = COALESCE(?, annual_consumption_mwh),
    is_connected = COALESCE(?, is_connected),
    connection_date = COALESCE(?, connection_date),
    priority_level = COALESCE(?, priority_level),
    floor_area_sqm = COALESCE(?, floor_area_sqm),
    building_age_years = COALESCE(?, building_age_years),
    insulation_rating = COALESCE(?, insulation_rating),
    description = COALESCE(?, description),
    updated_at = datetime('now')
WHERE id = ?
RETURNING *;

-- name: DeleteDemandSite :exec
DELETE FROM demand_sites
WHERE id = ?;


