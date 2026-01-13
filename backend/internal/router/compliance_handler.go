package router

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/pyrecycleheat/backend/internal/compliance"
	"github.com/pyrecycleheat/backend/internal/service"
)

type ComplianceHandler struct {
	svc *service.PredictionService
}

func NewComplianceHandler(svc *service.PredictionService) *ComplianceHandler {
	return &ComplianceHandler{svc: svc}
}

func (h *ComplianceHandler) Check(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req compliance.ComplianceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate inputs lightly
	if req.TotalITLoadKW <= 0 {
		http.Error(w, "Total IT Load must be positive", http.StatusBadRequest)
		return
	}
	if req.PlanDate.IsZero() {
		req.PlanDate = time.Now() // Default to now if not provided
	}

	result, err := h.svc.CheckCompliance(r.Context(), req)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
