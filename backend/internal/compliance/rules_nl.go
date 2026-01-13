package compliance

type DutchRules struct{}

// Check implements Dutch logic (Wet milieubeheer / Omgevingswet).
// Focus: Informatieplicht (Information Duty) & Taxonomy for valid measures.
func (r *DutchRules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "Omgevingswet / Activiteitenbesluit (Energy Saving Duty)",
		Reasoning:     []string{},
	}

	// In NL, companies consuming > 50,000 kWh electricity or > 25,000 m3 gas have an "Energy Saving Duty".
	// A DC with > 100kW IT load almost certainly exceeds this.
	// 100kW * 8760h = 876,000 kWh.

	isLargeConsumer := req.TotalITLoadKW >= 50 // Very low threshold for "Energy Saving Duty"

	if isLargeConsumer {
		res.Reasoning = append(res.Reasoning, "Consumption likely > 50,000 kWh/yr: Subject to Energy Saving Duty (Informatieplicht).")
		res.Status = StatusMandatory
	}

	// Specific Heat Reuse mandate
	// Currently, it's "Recognized Measure" (Erkende Maatregel) list.
	// If payback < 5 years, you MUST do it.

	if isLargeConsumer {
		res.RemediationSteps = append(res.RemediationSteps, "Report measures via RVO eLoket.", "If Payback Period < 5 years, implementation is MANDATORY.")
	}

	// Amsterdam / Haarlemmermeer specific strict policies (simplified for MVP as 'NL' general, but noted)
	if req.TotalITLoadKW >= 1000 {
		res.Reasoning = append(res.Reasoning, "Large consumer (>1MW): Likely subject to local municipal heat reuse strictures (e.g. Amsterdam default ban unless heat ready).")
	}

	return res
}
