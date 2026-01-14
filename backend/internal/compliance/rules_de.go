package compliance

type GermanRules struct{}

// Check implements Germany's EnEfG logic.
// Key thresholds:
// 50% reuse for new DCs > X capacity (timeline dependent)
// 10% / 20% reuse requirements depending on commissioning date.
func (r *GermanRules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "Energieeffizienzgesetz (EnEfG)",
		Reasoning:     []string{},
	}

	// Simplified EnEfG Logic
	// New data centers (commissioned after July 2026, approx) -> 10% heat reuse initially, rising to 20%.

	// Assumption: If PlanDate is in the future (> 2026), stricter rules apply.
	isFutureBuild := req.PlanDate.Year() >= 2026

	if req.TotalITLoadKW >= 300 { // EnEfG affects >300kW connected load (roughly) for registries, strictly >1MW/2.5MW for reuse
		res.Reasoning = append(res.Reasoning, "Capacity > 300kW: Entry in the Energy Efficiency Register is mandatory.")
	}

	if isFutureBuild {
		res.Status = StatusMandatory
		res.Reasoning = append(res.Reasoning, "Commissioning after mid-2026: New data centers MUST utilize at least 10% of waste heat (rising to 20%).")

		// Economic Feasibility Check (Exemption Logic)
		if req.BestPaybackYears != nil && *req.BestPaybackYears > 5.0 {
			res.Status = StatusExempt
			res.Reasoning = append(res.Reasoning, "EXEMPTION: Investment is not economically feasible (Payback > 5 years). Requirement waived under EnEfG economic hardship clause.")
		} else if req.DistanceToNetworkKm != nil && *req.DistanceToNetworkKm > 5.0 && !req.HasHeatDemand {
			res.Status = StatusExempt
			res.Reasoning = append(res.Reasoning, "EXEMPTION: No nearby heating network or heat sink within reasonable distance (> 5km).")
		} else {
			res.RemediationSteps = append(res.RemediationSteps, "Plan for 10% heat reuse capability immediately.", "Secure a heat offtaker or justify exemption via 'Waste Heat Inquiry'.")
		}
	} else {
		// Existing or near-term checks
		if req.TotalITLoadKW >= 2500 {
			res.Status = StatusMandatory
			res.Reasoning = append(res.Reasoning, "Existing/Near-term DC > 2.5MW: Obligated to prioritize heat reuse where technically and economically feasible.")
		} else {
			res.Status = StatusVoluntary
			res.Reasoning = append(res.Reasoning, "Smaller/Existing DC: Reuse encouraged but specific quotas may not apply yet.")
		}
	}

	// Catch-all
	if req.TotalITLoadKW < 300 {
		res.Status = StatusExempt
		res.Reasoning = []string{"Capacity likely below regulatory threshold (< 300kW)."}
	}

	return res
}
