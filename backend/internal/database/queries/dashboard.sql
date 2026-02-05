-- name: GetUser :one
SELECT * FROM users
WHERE email = ? LIMIT 1;

-- name: UpdateUser :one
UPDATE users
SET first_name = ?,
    last_name = ?,
    notify_assessment_complete = ?,
    notify_regulatory_updates = ?
WHERE email = ?
RETURNING *;

-- name: ListAuditLogs :many
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- name: CreateAuditLog :one
INSERT INTO audit_logs (user_identifier, action, entity_type, icon_type)
VALUES (?, ?, ?, ?)
RETURNING *;

-- name: GetDashboardStats :one
SELECT 
    (SELECT COUNT(*) FROM data_centers) as active_sites,
    (SELECT COUNT(*) FROM audit_logs) as total_activities, -- specialized query might be better but this works for now
    -- Compliance % is dynamically calculated in code usually, but we can grab raw counts
    (SELECT COUNT(*) FROM feasibility_assessments WHERE status = 'completed') as completed_assessments
;
