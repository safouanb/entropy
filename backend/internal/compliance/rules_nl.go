package compliance

type DutchRules struct{}

const (
	nlDisclaimer = "This assessment is an automated interpretation of Dutch energy efficiency regulations " +
		"(Omgevingswet, Besluit activiteiten leefomgeving) and does not constitute legal advice. " +
		"Local municipal policies (e.g. Amsterdam, Haarlemmermeer) may impose additional restrictions " +
		"not fully captured here. Consult RVO.nl and the relevant competent authority (municipality or province)."

	rvoEnergyURL     = "https://english.rvo.nl/topics/energy-saving-obligation/what-energy-saving-obligation"
	rvoInfoplichtURL = "https://english.rvo.nl/topics/energy-saving-obligation/energy-saving-notification-obligation"
	rvoInvestURL     = "https://english.rvo.nl/energy-saving-investigation-obligation"
	omgevingswetURL  = "https://business.gov.nl/regulations/taking-measures-to-save-energy/"
)

// Check implements Dutch energy efficiency compliance logic.
//
// Key regulatory references:
//   - Omgevingswet (Environment and Planning Act): Comprehensive environmental
//     framework effective 01.01.2024, replacing the Activiteitenbesluit.
//   - Besluit activiteiten leefomgeving (Bal): Environmental Activities Decree,
//     containing the energy saving rules under the Omgevingswet.
//   - Energy Saving Obligation (Energiebesparingsplicht): Business locations
//     consuming >= 50,000 kWh/yr electricity OR >= 25,000 m3/yr natural gas
//     must implement all energy saving measures with payback <= 5 years, OR
//     implement all applicable measures from the Recognised Energy Saving
//     Measures List (Erkende Maatregelenlijst, EML).
//   - Energy Saving Notification Obligation (Informatieplicht): Same threshold
//     — must report energy-saving measures to the competent authority every 4 years.
//   - Energy Saving Investigation Obligation: Locations consuming >= 10,000,000 kWh/yr
//     electricity must investigate additional process-level energy savings. The EML
//     does not apply to these processes; a custom investigation is required.
//   - CO2 reduction measures: Under the updated Omgevingswet, measures that reduce
//     CO2 or replace fossil energy carriers are also mandatory if payback <= 5 years.
//     The government plans to extend this to 7 years from 2027.
//   - Amsterdam/Haarlemmermeer: Local moratorium — no new data centres or expansions
//     allowed in Amsterdam as of April 2025. Haarlemmermeer limits growth to 550 MVA
//     until 2030 with a 70 MVA/yr cap.
//
// Sources:
//   - RVO Energy Saving Obligation: https://english.rvo.nl/topics/energy-saving-obligation/what-energy-saving-obligation
//   - RVO Notification Obligation: https://english.rvo.nl/topics/energy-saving-obligation/energy-saving-notification-obligation
//   - RVO Investigation Obligation: https://english.rvo.nl/energy-saving-investigation-obligation
//   - Business.gov.nl: https://business.gov.nl/regulations/taking-measures-to-save-energy/
//   - Dutch Data Center Association: https://www.dutchdatacenters.nl/
func (r *DutchRules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "Omgevingswet / Besluit activiteiten leefomgeving (Energy Saving Obligation)",
		Reasoning:     []string{},
		Citations:     []RegulatoryReference{},
		Disclaimer:    nlDisclaimer,
	}

	// Energy Saving Obligation threshold: >= 50,000 kWh/yr or >= 25,000 m3 gas/yr.
	// A data centre with >= 50 kW IT load running 8760 hrs/yr consumes ~438,000 kWh,
	// which far exceeds the 50,000 kWh threshold. Even at lower utilisation, any
	// data centre above ~6 kW continuous would likely trigger this.
	// We use 50 kW as a conservative proxy where the threshold is almost certainly met.
	isSubjectToSavingDuty := req.TotalITLoadKW >= 50

	if !isSubjectToSavingDuty {
		res.Status = StatusVoluntary
		res.Reasoning = append(res.Reasoning,
			"IT load below 50 kW: annual electricity consumption may be below the 50,000 kWh/yr threshold. "+
				"Verify actual consumption — if it exceeds 50,000 kWh/yr, the Energy Saving Obligation applies.",
		)
		return res
	}

	// Facility is subject to the Energy Saving Obligation.
	res.Status = StatusMandatory
	res.Reasoning = append(res.Reasoning,
		"Estimated annual electricity consumption exceeds 50,000 kWh/yr: the Energy Saving Obligation "+
			"(Energiebesparingsplicht) applies under the Omgevingswet / Besluit activiteiten leefomgeving.",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Omgevingswet / Besluit activiteiten leefomgeving",
		Section: "Energy Saving Obligation",
		Summary: "Business locations consuming >= 50,000 kWh/yr electricity or >= 25,000 m3/yr gas must take energy saving measures with payback <= 5 years.",
		URL:     rvoEnergyURL,
	})

	// Core obligation: implement all measures with payback <= 5 years.
	res.Reasoning = append(res.Reasoning,
		"All energy saving measures with a payback period of 5 years or less MUST be implemented. "+
			"Alternatively, all applicable measures from the Recognised Energy Saving Measures List "+
			"(Erkende Maatregelenlijst, EML) must be taken. For any recognised measure not taken, "+
			"an alternative measure saving at least the same amount of energy must be in place.",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Omgevingswet / Besluit activiteiten leefomgeving",
		Section: "Erkende Maatregelenlijst (EML)",
		Summary: "Companies can comply by implementing all measures with <= 5 year payback, or by adopting all applicable EML measures (with equivalent alternatives for any skipped).",
		URL:     rvoEnergyURL,
	})

	// CO2 / energy carrier replacement measures.
	res.Reasoning = append(res.Reasoning,
		"Under the updated Omgevingswet, measures that reduce CO2 emissions or replace fossil "+
			"energy carriers are also mandatory if payback is <= 5 years. The government plans to "+
			"extend the payback threshold to 7 years from 2027.",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Omgevingswet (updated energy saving rules)",
		Section: "CO2 reduction and energy carrier replacement",
		Summary: "Mandatory CO2 reduction and fossil fuel replacement measures with payback <= 5 years (planned extension to 7 years from 2027).",
		URL:     omgevingswetURL,
	})

	// Notification obligation (Informatieplicht).
	res.Reasoning = append(res.Reasoning,
		"The Energy Saving Notification Obligation (Informatieplicht) requires reporting "+
			"energy-saving measures to the competent authority (municipality or province) every 4 years, "+
			"via RVO's digital portal.",
	)
	res.RemediationSteps = append(res.RemediationSteps,
		"Report implemented energy-saving measures via the RVO eLoket portal (Informatieplicht).",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Omgevingswet / Besluit activiteiten leefomgeving",
		Section: "Informatieplicht energiebesparing",
		Summary: "Mandatory reporting of energy-saving measures every 4 years to the competent authority.",
		URL:     rvoInfoplichtURL,
	})

	// Investigation obligation for very large consumers.
	if req.TotalITLoadKW >= 10000 {
		// 10 MW * 8760h = 87.6 GWh >> 10 GWh threshold.
		res.Reasoning = append(res.Reasoning,
			"Estimated annual consumption exceeds 10,000,000 kWh/yr (10 GWh): the Energy Saving "+
				"Investigation Obligation applies. A custom investigation into process-level energy "+
				"savings is required. The EML does not apply to processes covered by this investigation.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Omgevingswet / Besluit activiteiten leefomgeving",
			Section: "Energy Saving Investigation Obligation",
			Summary: "Locations consuming >= 10 GWh/yr must conduct a custom investigation into process-level energy savings.",
			URL:     rvoInvestURL,
		})
		res.RemediationSteps = append(res.RemediationSteps,
			"Commission an energy saving investigation covering process-level measures per the Investigation Obligation.",
		)
	}

	// Heat reuse as a recognised measure.
	if req.BestPaybackYears != nil && *req.BestPaybackYears <= 5.0 {
		res.Reasoning = append(res.Reasoning,
			"Waste heat reuse payback estimated at <= 5 years: implementation is MANDATORY under "+
				"the Energy Saving Obligation. Heat reuse qualifies as an energy-saving / CO2 reduction measure.",
		)
	} else if req.BestPaybackYears != nil && *req.BestPaybackYears > 5.0 {
		res.Reasoning = append(res.Reasoning,
			"Waste heat reuse payback estimated at > 5 years: not mandatory under current Energy "+
				"Saving Obligation. Note: the payback threshold is planned to increase to 7 years from 2027, "+
				"which could make this measure mandatory in the future.",
		)
	} else {
		res.Reasoning = append(res.Reasoning,
			"Waste heat reuse payback has not been assessed. If payback is <= 5 years, "+
				"implementation is mandatory under the Energy Saving Obligation.",
		)
	}

	res.RemediationSteps = append(res.RemediationSteps,
		"Assess waste heat reuse payback period using the legally prescribed methodology.",
		"If payback <= 5 years, implement heat reuse or demonstrate an equivalent alternative measure.",
		"Review the Erkende Maatregelenlijst (EML) for data centre-specific measures.",
	)

	// Amsterdam / Haarlemmermeer local restrictions.
	// Note: We cannot determine location from IT load alone. This is an informational warning.
	if req.TotalITLoadKW >= 1000 {
		res.Reasoning = append(res.Reasoning,
			"Local policy warning: if this facility is located in Amsterdam, note that as of April 2025 "+
				"the municipality does not allow new data centres or expansions. Haarlemmermeer limits "+
				"new data centre capacity to 550 MVA total until 2030 (70 MVA/yr cap). These local "+
				"restrictions apply in addition to national energy saving obligations.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Amsterdam municipal policy (Duurzaam Digitaal)",
			Section: "Data centre moratorium",
			Summary: "Amsterdam: no new data centres or expansions as of April 2025. Haarlemmermeer: 550 MVA cap until 2030, 70 MVA/yr limit.",
			URL:     "https://www.dutchdatacenters.nl/en/",
		})
	}

	return res
}
