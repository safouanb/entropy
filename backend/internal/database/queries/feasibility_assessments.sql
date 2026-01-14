-- name: CreateAssessment :one
INSERT INTO feasibility_assessments (
    project_name,
    dc_location_lat,
    dc_location_lng,
    thermal_load_min_kw,
    thermal_load_max_kw,
    availability_profile,
    uptime_constraint,
    existing_cooling,
    investment_willingness,
    distance_to_offtaker_km,
    heat_demand_profile,
    supply_temp_required_c,
    existing_dh_infra,
    jurisdiction,
    applicable_regulation,
    time_horizon_years,
    status
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
) RETURNING *;

-- name: GetAssessment :one
SELECT * FROM feasibility_assessments WHERE id = ?;

-- name: ListAssessments :many
SELECT * FROM feasibility_assessments 
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- name: ListAssessmentsByStatus :many
SELECT * FROM feasibility_assessments 
WHERE status = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- name: UpdateAssessmentInputs :one
UPDATE feasibility_assessments SET
    project_name = ?,
    dc_location_lat = ?,
    dc_location_lng = ?,
    thermal_load_min_kw = ?,
    thermal_load_max_kw = ?,
    availability_profile = ?,
    uptime_constraint = ?,
    existing_cooling = ?,
    investment_willingness = ?,
    distance_to_offtaker_km = ?,
    heat_demand_profile = ?,
    supply_temp_required_c = ?,
    existing_dh_infra = ?,
    jurisdiction = ?,
    applicable_regulation = ?,
    time_horizon_years = ?,
    updated_at = datetime('now')
WHERE id = ?
RETURNING *;

-- name: UpdateAssessmentResults :one
UPDATE feasibility_assessments SET
    scenario_results = ?,
    compliance_result = ?,
    conclusion = ?,
    status = ?,
    updated_at = datetime('now'),
    completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END
WHERE id = ?
RETURNING *;

-- name: IncrementAssessmentVersion :one
UPDATE feasibility_assessments SET
    version = version + 1,
    scenario_results = NULL,
    compliance_result = NULL,
    conclusion = NULL,
    status = 'draft',
    updated_at = datetime('now'),
    completed_at = NULL
WHERE id = ?
RETURNING *;

-- name: DeleteAssessment :exec
DELETE FROM feasibility_assessments WHERE id = ?;

-- name: CountAssessments :one
SELECT COUNT(*) FROM feasibility_assessments;

-- name: CountAssessmentsByStatus :one
SELECT COUNT(*) FROM feasibility_assessments WHERE status = ?;

-- name: GetAssessmentsByJurisdiction :many
SELECT * FROM feasibility_assessments 
WHERE jurisdiction = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
