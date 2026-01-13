package compliance

import (
	"time"
)

// Jurisdiction represents a legal territory with specific rules.
type Jurisdiction string

const (
	JurisdictionEU      Jurisdiction = "EU"
	JurisdictionGermany Jurisdiction = "DE"
	JurisdictionNL      Jurisdiction = "NL"
	// Add others as needed, e.g., JurisdictionUK
)

// ComplianceStatus indicates the result of an assessment.
type ComplianceStatus string

const (
	StatusMandatory ComplianceStatus = "MANDATORY"
	StatusVoluntary ComplianceStatus = "VOLUNTARY"
	StatusExempt    ComplianceStatus = "EXEMPT"
)

// ComplianceRequest captures the inputs required for a regulatory check.
type ComplianceRequest struct {
	Jurisdiction      Jurisdiction `json:"jurisdiction"`
	TotalITLoadKW     float64      `json:"totalItLoadKw"`     // Rated IT power
	PlanDate          time.Time    `json:"planDate"`          // When is the DC commissioning?
	HeatRecoveryReady bool         `json:"heatRecoveryReady"` // Is it already technically ready?
}

// ComplianceResult is the output of the engine.
type ComplianceResult struct {
	Status             ComplianceStatus `json:"status"`
	ApplicableLaw      string           `json:"applicableLaw"`
	ComplianceDeadline *time.Time       `json:"complianceDeadline,omitempty"`
	Reasoning          []string         `json:"reasoning"`
	RemediationSteps   []string         `json:"remediationSteps"`
}

// RuleEngine defines the interface for jurisdiction-specific logic.
type RuleEngine interface {
	Check(req ComplianceRequest) ComplianceResult
}

// Engine is the entry point for compliance checks.
type Engine struct {
	rules map[Jurisdiction]RuleEngine
}

func NewEngine() *Engine {
	return &Engine{
		rules: map[Jurisdiction]RuleEngine{
			JurisdictionEU:      &EURules{},
			JurisdictionGermany: &GermanRules{},
			JurisdictionNL:      &DutchRules{},
		},
	}
}

// Evaluate determines the compliance status for the given request.
// It defaults to EU rules if the jurisdiction is not explicitly supported.
func (e *Engine) Evaluate(req ComplianceRequest) ComplianceResult {
	rule, ok := e.rules[req.Jurisdiction]
	if !ok {
		// Fallback or default to EU if in Europe?
		// For now, if unknown, we use EU as a baseline or return generic.
		// Let's use EU as baseline for "Other".
		rule = &EURules{}
	}
	return rule.Check(req)
}
