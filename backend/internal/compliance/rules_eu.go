package compliance

type EURules struct{}

// Check implements the EED logic.
// Ref: EU Energy Efficiency Directive (Recast) - Data Centers > 500kW (reporting) / > set thresholds for reuse.
// For MVP, we assume a threshold of 2.5MW for strong mandates.
func (r *EURules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "EU Energy Efficiency Directive (EED)",
		Reasoning:     []string{},
	}

	// Thresholds based on EED Recast 2023
	// > 500kW: Reporting obligation (often ignored for pure "heat reuse" mandate, but relevant for compliance)
	// > 1MW - 2.5MW: Feasibility Study standard

	if req.TotalITLoadKW >= 500 {
		res.Reasoning = append(res.Reasoning, "IT Load exceeds 500kW: You must report performance data to the European Database.")
	}

	if req.TotalITLoadKW >= 2500 {
		res.Status = StatusMandatory
		res.Reasoning = append(res.Reasoning, "IT Load exceeds 2.5MW: Feasibility study for heat reuse is likely MANDATORY under EED Art. 25.")
		res.RemediationSteps = append(res.RemediationSteps, "Conduct a Cost-Benefit Analysis (CBA) compliant with Annex X.", "Assess nearby district heating networks.")
	} else if req.TotalITLoadKW >= 1000 {
		res.Status = StatusMandatory // Or "Conditional"
		res.Reasoning = append(res.Reasoning, "IT Load exceeds 1MW: Heat reuse feasibility study is strongly recommended/required by Member State implementation.")
	} else {
		res.Status = StatusVoluntary
		res.Reasoning = append(res.Reasoning, "Below 1MW threshold: Heat reuse is voluntary but encouraged.")
	}

	return res
}
