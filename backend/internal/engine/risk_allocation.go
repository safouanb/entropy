package engine

// RiskCategory represents the type of risk in heat reuse projects
type RiskCategory string

const (
	RiskSupplyVariability      RiskCategory = "SUPPLY_VARIABILITY"
	RiskDemandVariability      RiskCategory = "DEMAND_VARIABILITY"
	RiskLifetimeMismatch       RiskCategory = "LIFETIME_MISMATCH"
	RiskPerformanceDegradation RiskCategory = "PERFORMANCE_DEGRADATION"
	RiskRegulatoryChange       RiskCategory = "REGULATORY_CHANGE"
)

// RiskSeverity indicates the level of risk
type RiskSeverity string

const (
	RiskSeverityLow    RiskSeverity = "LOW"
	RiskSeverityMedium RiskSeverity = "MEDIUM"
	RiskSeverityHigh   RiskSeverity = "HIGH"
)

// RiskAllocation explicitly states who bears each risk
type RiskAllocation struct {
	Category            RiskCategory `json:"category"`
	Severity            RiskSeverity `json:"severity"`
	BearingParty        string       `json:"bearingParty"`        // "DC_OPERATOR", "OFFTAKER", "ESCO", "SHARED"
	MitigationMechanism string       `json:"mitigationMechanism"` // "BUYOUT", "REDEPLOYMENT", "WRITEOFF", "INSURANCE", "CONTRACT_CLAUSE"
	Notes               string       `json:"notes"`
}

// Stakeholders captures all parties involved in the decision record
type Stakeholders struct {
	DCOperator   string `json:"dcOperator"`
	HeatOfftaker string `json:"heatOfftaker"`
	Authority    string `json:"authority"`
	Integrator   string `json:"integrator"`
}

// AuditEntry represents a single change in the audit trail
type AuditEntry struct {
	Version       int      `json:"version"`
	Date          string   `json:"date"`
	ChangeSummary string   `json:"changeSummary"`
	Author        string   `json:"author"`
	SourcesUsed   []string `json:"sourcesUsed"`
}

// DetermineRiskAllocation generates the risk allocation matrix based on scenario and ownership
func DetermineRiskAllocation(scenario ReuseScenario, ownership string) []RiskAllocation {
	allocations := make([]RiskAllocation, 0, 5)

	switch scenario {
	case ScenarioNoReuse:
		// No reuse = all regulatory risk on DC operator
		allocations = append(allocations, RiskAllocation{
			Category:            RiskRegulatoryChange,
			Severity:            RiskSeverityHigh,
			BearingParty:        "DC_OPERATOR",
			MitigationMechanism: "NONE",
			Notes:               "Full regulatory exposure for non-compliance",
		})

	case ScenarioDirectReuse:
		// Direct reuse: risks depend on ownership model
		switch ownership {
		case "DC_OWNS":
			allocations = append(allocations,
				RiskAllocation{
					Category:            RiskSupplyVariability,
					Severity:            RiskSeverityMedium,
					BearingParty:        "DC_OPERATOR",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "DC bears supply fluctuation risk",
				},
				RiskAllocation{
					Category:            RiskDemandVariability,
					Severity:            RiskSeverityHigh,
					BearingParty:        "DC_OPERATOR",
					MitigationMechanism: "WRITEOFF",
					Notes:               "Stranded asset risk if offtaker defaults",
				},
				RiskAllocation{
					Category:            RiskLifetimeMismatch,
					Severity:            RiskSeverityHigh,
					BearingParty:        "DC_OPERATOR",
					MitigationMechanism: "BUYOUT",
					Notes:               "DC asset lifecycle may exceed heat demand contract",
				},
				RiskAllocation{
					Category:            RiskPerformanceDegradation,
					Severity:            RiskSeverityMedium,
					BearingParty:        "DC_OPERATOR",
					MitigationMechanism: "INSURANCE",
					Notes:               "Equipment performance guarantees on DC",
				},
				RiskAllocation{
					Category:            RiskRegulatoryChange,
					Severity:            RiskSeverityLow,
					BearingParty:        "SHARED",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "Compliance achieved; residual regulatory risk shared",
				},
			)

		case "UTILITY_OWNS":
			allocations = append(allocations,
				RiskAllocation{
					Category:            RiskSupplyVariability,
					Severity:            RiskSeverityLow,
					BearingParty:        "OFFTAKER",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "Utility accepts supply variability",
				},
				RiskAllocation{
					Category:            RiskDemandVariability,
					Severity:            RiskSeverityLow,
					BearingParty:        "OFFTAKER",
					MitigationMechanism: "INSURANCE",
					Notes:               "Utility manages demand-side risk",
				},
				RiskAllocation{
					Category:            RiskLifetimeMismatch,
					Severity:            RiskSeverityMedium,
					BearingParty:        "OFFTAKER",
					MitigationMechanism: "REDEPLOYMENT",
					Notes:               "Utility can repurpose infrastructure",
				},
				RiskAllocation{
					Category:            RiskPerformanceDegradation,
					Severity:            RiskSeverityMedium,
					BearingParty:        "OFFTAKER",
					MitigationMechanism: "INSURANCE",
					Notes:               "Utility responsible for equipment",
				},
				RiskAllocation{
					Category:            RiskRegulatoryChange,
					Severity:            RiskSeverityLow,
					BearingParty:        "DC_OPERATOR",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "DC retains compliance obligation",
				},
			)

		case "THIRD_PARTY":
			allocations = append(allocations,
				RiskAllocation{
					Category:            RiskSupplyVariability,
					Severity:            RiskSeverityLow,
					BearingParty:        "ESCO",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "ESCO contractually absorbs supply risk",
				},
				RiskAllocation{
					Category:            RiskDemandVariability,
					Severity:            RiskSeverityLow,
					BearingParty:        "ESCO",
					MitigationMechanism: "INSURANCE",
					Notes:               "ESCO manages demand portfolio",
				},
				RiskAllocation{
					Category:            RiskLifetimeMismatch,
					Severity:            RiskSeverityLow,
					BearingParty:        "ESCO",
					MitigationMechanism: "REDEPLOYMENT",
					Notes:               "ESCO can redeploy assets to other sites",
				},
				RiskAllocation{
					Category:            RiskPerformanceDegradation,
					Severity:            RiskSeverityLow,
					BearingParty:        "ESCO",
					MitigationMechanism: "INSURANCE",
					Notes:               "ESCO bears performance risk",
				},
				RiskAllocation{
					Category:            RiskRegulatoryChange,
					Severity:            RiskSeverityLow,
					BearingParty:        "SHARED",
					MitigationMechanism: "CONTRACT_CLAUSE",
					Notes:               "Compliance achieved; regulatory risk shared in contract",
				},
			)
		}

	case ScenarioReuseWithMitigation:
		// Mitigation (storage) reduces most risks
		allocations = append(allocations,
			RiskAllocation{
				Category:            RiskSupplyVariability,
				Severity:            RiskSeverityLow,
				BearingParty:        "SHARED",
				MitigationMechanism: "CONTRACT_CLAUSE",
				Notes:               "Storage buffers supply variations",
			},
			RiskAllocation{
				Category:            RiskDemandVariability,
				Severity:            RiskSeverityLow,
				BearingParty:        "SHARED",
				MitigationMechanism: "CONTRACT_CLAUSE",
				Notes:               "Storage decouples supply from demand timing",
			},
			RiskAllocation{
				Category:            RiskLifetimeMismatch,
				Severity:            RiskSeverityLow,
				BearingParty:        "SHARED",
				MitigationMechanism: "REDEPLOYMENT",
				Notes:               "Mobile storage can be redeployed if contract ends",
			},
			RiskAllocation{
				Category:            RiskPerformanceDegradation,
				Severity:            RiskSeverityMedium,
				BearingParty:        "SHARED",
				MitigationMechanism: "INSURANCE",
				Notes:               "Equipment warranties and insurance cover degradation",
			},
			RiskAllocation{
				Category:            RiskRegulatoryChange,
				Severity:            RiskSeverityLow,
				BearingParty:        "SHARED",
				MitigationMechanism: "CONTRACT_CLAUSE",
				Notes:               "Compliance achieved with mitigation; minimal residual risk",
			},
		)
	}

	return allocations
}
