-- name: ListCarbonCredits :many
SELECT * FROM carbon_credits
ORDER BY project_name
LIMIT ? OFFSET ?;

-- name: CountCarbonCredits :one
SELECT COUNT(*) FROM carbon_credits;

-- name: GetCarbonCredit :one
SELECT * FROM carbon_credits
WHERE id = ?
LIMIT 1;

-- name: CreateCarbonCredit :one
INSERT INTO carbon_credits (
    project_name,
    credit_type,
    price_per_ton,
    available_tons,
    vintage_year,
    verification_standard,
    location,
    project_description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateCarbonCredit :one
UPDATE carbon_credits
SET
    project_name = COALESCE(?, project_name),
    credit_type = COALESCE(?, credit_type),
    price_per_ton = COALESCE(?, price_per_ton),
    available_tons = COALESCE(?, available_tons),
    vintage_year = COALESCE(?, vintage_year),
    verification_standard = COALESCE(?, verification_standard),
    location = COALESCE(?, location),
    project_description = COALESCE(?, project_description)
WHERE id = ?
RETURNING *;

-- name: DeleteCarbonCredit :exec
DELETE FROM carbon_credits
WHERE id = ?;
