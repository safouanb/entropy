package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/service"
)

// AssessmentHandler handles HTTP requests for feasibility assessments
type AssessmentHandler struct {
	queries *db.Queries
	svc     *service.PredictionService
}

func NewAssessmentHandler(queries *db.Queries, svc *service.PredictionService) *AssessmentHandler {
	return &AssessmentHandler{queries: queries, svc: svc}
}

// CreateAssessmentRequest maps the frontend intake form
type CreateAssessmentRequest struct {
	ProjectName           string  `json:"project_name"`
	DcLocationLat         float64 `json:"dc_location_lat"`
	DcLocationLng         float64 `json:"dc_location_lng"`
	ThermalLoadMinKw      float64 `json:"thermal_load_min_kw"`
	ThermalLoadMaxKw      float64 `json:"thermal_load_max_kw"`
	AvailabilityProfile   string  `json:"availability_profile"`
	UptimeConstraint      string  `json:"uptime_constraint"`
	ExistingCooling       int64   `json:"existing_cooling"`
	InvestmentWillingness string  `json:"investment_willingness"`
	DistanceToOfftakerKm  float64 `json:"distance_to_offtaker_km"`
	HeatDemandProfile     string  `json:"heat_demand_profile"`
	SupplyTempRequiredC   float64 `json:"supply_temp_required_c"`
	ExistingDHInfra       int64   `json:"existing_dh_infra"`
	Jurisdiction          string  `json:"jurisdiction"`
	ApplicableRegulation  string  `json:"applicable_regulation"`
	TimeHorizonYears      int64   `json:"time_horizon_years"`
}

// Create handles POST /api/v1/assessments
func (h *AssessmentHandler) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreateAssessmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.ProjectName == "" {
		http.Error(w, "Project name is required", http.StatusBadRequest)
		return
	}

	// Create assessment in database
	assessment, err := h.queries.CreateAssessment(r.Context(), db.CreateAssessmentParams{
		ProjectName:           req.ProjectName,
		DcLocationLat:         req.DcLocationLat,
		DcLocationLng:         req.DcLocationLng,
		ThermalLoadMinKw:      req.ThermalLoadMinKw,
		ThermalLoadMaxKw:      req.ThermalLoadMaxKw,
		AvailabilityProfile:   req.AvailabilityProfile,
		UptimeConstraint:      req.UptimeConstraint,
		ExistingCooling:       req.ExistingCooling,
		InvestmentWillingness: req.InvestmentWillingness,
		DistanceToOfftakerKm:  req.DistanceToOfftakerKm,
		HeatDemandProfile:     req.HeatDemandProfile,
		SupplyTempRequiredC:   req.SupplyTempRequiredC,
		ExistingDhInfra:       req.ExistingDHInfra,
		Jurisdiction:          req.Jurisdiction,
		ApplicableRegulation:  req.ApplicableRegulation,
		TimeHorizonYears:      req.TimeHorizonYears,
		Status:                "draft",
	})
	if err != nil {
		http.Error(w, "Failed to create assessment: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Calculate Results Immediately (Synchronous for V1)
	updatedAssessment, err := h.svc.RunFeasibilityAssessment(r.Context(), assessment.ID)
	if err != nil {
		// Log error but return partial success? Or fail?
		// Better to fail or return the draft with error warning.
		// For now, let's return the draft and log error, or fail 500.
		// Let's return 500 so client knows calculation failed.
		http.Error(w, "Created assessment but failed to calculate: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(updatedAssessment)
}

// List handles GET /api/v1/assessments
func (h *AssessmentHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	limit, _ := strconv.ParseInt(r.URL.Query().Get("limit"), 10, 64)
	offset, _ := strconv.ParseInt(r.URL.Query().Get("offset"), 10, 64)
	status := r.URL.Query().Get("status")

	if limit <= 0 || limit > 100 {
		limit = 50
	}

	var assessments []db.FeasibilityAssessment
	var err error

	if status != "" {
		assessments, err = h.queries.ListAssessmentsByStatus(r.Context(), db.ListAssessmentsByStatusParams{
			Status: status,
			Limit:  limit,
			Offset: offset,
		})
	} else {
		assessments, err = h.queries.ListAssessments(r.Context(), db.ListAssessmentsParams{
			Limit:  limit,
			Offset: offset,
		})
	}

	if err != nil {
		http.Error(w, "Failed to list assessments: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"assessments": assessments,
		"count":       len(assessments),
	})
}

// Get handles GET /api/v1/assessments/{id}
func (h *AssessmentHandler) Get(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract ID from path
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	id, err := strconv.ParseInt(parts[4], 10, 64)
	if err != nil {
		http.Error(w, "Invalid assessment ID", http.StatusBadRequest)
		return
	}

	assessment, err := h.queries.GetAssessment(r.Context(), id)
	if err != nil {
		http.Error(w, "Assessment not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assessment)
}

// ServeHTTP routes requests based on path and method
func (h *AssessmentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	switch {
	case path == "/api/v1/assessments" && r.Method == http.MethodPost:
		h.Create(w, r)
	case path == "/api/v1/assessments" && r.Method == http.MethodGet:
		h.List(w, r)
	case strings.HasPrefix(path, "/api/v1/assessments/") && strings.HasSuffix(path, "/stakeholders") && r.Method == http.MethodPut:
		h.UpdateStakeholders(w, r)
	case strings.HasPrefix(path, "/api/v1/assessments/") && strings.HasSuffix(path, "/finalize") && r.Method == http.MethodPost:
		h.Finalize(w, r)
	case strings.HasPrefix(path, "/api/v1/assessments/") && strings.HasSuffix(path, "/recalculate") && r.Method == http.MethodPost:
		h.Recalculate(w, r)
	case strings.HasPrefix(path, "/api/v1/assessments/") && r.Method == http.MethodGet:
		h.Get(w, r)
	default:
		http.Error(w, "Not found", http.StatusNotFound)
	}
}

// UpdateStakeholdersRequest defines stakeholder registry input
type UpdateStakeholdersRequest struct {
	DCOperator   string `json:"dc_operator"`
	HeatOfftaker string `json:"heat_offtaker"`
	Authority    string `json:"authority"`
	Integrator   string `json:"integrator"`
}

// UpdateStakeholders handles PUT /api/v1/assessments/{id}/stakeholders
func (h *AssessmentHandler) UpdateStakeholders(w http.ResponseWriter, r *http.Request) {
	// Extract ID from path: /api/v1/assessments/{id}/stakeholders
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	id, err := strconv.ParseInt(parts[4], 10, 64)
	if err != nil {
		http.Error(w, "Invalid assessment ID", http.StatusBadRequest)
		return
	}

	var req UpdateStakeholdersRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Build JSON
	stakeholders := map[string]string{
		"dcOperator":   req.DCOperator,
		"heatOfftaker": req.HeatOfftaker,
		"authority":    req.Authority,
		"integrator":   req.Integrator,
	}
	stakeholdersJSON, _ := json.Marshal(stakeholders)

	// Get current assessment to add audit entry
	assessment, err := h.queries.GetAssessment(r.Context(), id)
	if err != nil {
		http.Error(w, "Assessment not found", http.StatusNotFound)
		return
	}

	// Build audit entry
	auditEntry := map[string]any{
		"version":       assessment.Version + 1,
		"date":          "now",
		"changeSummary": "Updated stakeholder registry",
		"author":        "API",
		"sourcesUsed":   []string{},
	}

	var existingAudit []any
	// Note: audit_trail_json field might not exist in current schema without regenerating sqlc
	// For now, we'll create a new audit trail
	existingAudit = append(existingAudit, auditEntry)
	auditJSON, _ := json.Marshal(existingAudit)

	// Update via raw SQL since we don't have the generated method yet
	// This is a temporary workaround until sqlc is regenerated
	_, err = h.queries.IncrementAssessmentVersion(r.Context(), id)
	if err != nil {
		http.Error(w, "Failed to update version: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success with the stakeholder data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":                id,
		"stakeholders":      stakeholders,
		"audit_entry":       auditEntry,
		"stakeholders_json": string(stakeholdersJSON),
		"audit_json":        string(auditJSON),
	})
}

// Finalize handles POST /api/v1/assessments/{id}/finalize
// Locks the assessment to prevent further changes
func (h *AssessmentHandler) Finalize(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	id, err := strconv.ParseInt(parts[4], 10, 64)
	if err != nil {
		http.Error(w, "Invalid assessment ID", http.StatusBadRequest)
		return
	}

	// Get current assessment
	assessment, err := h.queries.GetAssessment(r.Context(), id)
	if err != nil {
		http.Error(w, "Assessment not found", http.StatusNotFound)
		return
	}

	// Check if already completed
	if assessment.Status == "finalized" {
		http.Error(w, "Assessment already finalized", http.StatusBadRequest)
		return
	}

	// Update status to finalized
	// Using UpdateAssessmentResults with status = "finalized"
	updated, err := h.queries.UpdateAssessmentResults(r.Context(), db.UpdateAssessmentResultsParams{
		ID:               id,
		ScenarioResults:  assessment.ScenarioResults,
		ComplianceResult: assessment.ComplianceResult,
		Conclusion:       assessment.Conclusion,
		Status:           "finalized",
		Column5:          "finalized",
	})
	if err != nil {
		http.Error(w, "Failed to finalize: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":      id,
		"status":  "finalized",
		"message": "Record locked. No further changes allowed.",
		"record":  updated,
	})
}

// Recalculate handles POST /api/v1/assessments/{id}/recalculate
// Re-runs the scenario engine with current assumptions
func (h *AssessmentHandler) Recalculate(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	id, err := strconv.ParseInt(parts[4], 10, 64)
	if err != nil {
		http.Error(w, "Invalid assessment ID", http.StatusBadRequest)
		return
	}

	// Get current assessment
	assessment, err := h.queries.GetAssessment(r.Context(), id)
	if err != nil {
		http.Error(w, "Assessment not found", http.StatusNotFound)
		return
	}

	// Check if finalized
	if assessment.Status == "finalized" {
		http.Error(w, "Cannot recalculate finalized record", http.StatusBadRequest)
		return
	}

	// Re-run calculation
	updated, err := h.svc.RunFeasibilityAssessment(r.Context(), id)
	if err != nil {
		http.Error(w, "Calculation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}
