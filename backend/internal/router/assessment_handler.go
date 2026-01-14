package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	db "github.com/pyrecycleheat/backend/internal/database"
)

// AssessmentHandler handles HTTP requests for feasibility assessments
type AssessmentHandler struct {
	queries *db.Queries
}

func NewAssessmentHandler(queries *db.Queries) *AssessmentHandler {
	return &AssessmentHandler{queries: queries}
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(assessment)
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
	case strings.HasPrefix(path, "/api/v1/assessments/") && r.Method == http.MethodGet:
		h.Get(w, r)
	default:
		http.Error(w, "Not found", http.StatusNotFound)
	}
}
