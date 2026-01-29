package compliance

import "time"

type GermanRules struct{}

const (
	enefgDisclaimer = "This assessment is an automated interpretation of the Energieeffizienzgesetz (EnEfG) " +
		"and does not constitute legal advice. Consult qualified legal counsel and the Bundesamt " +
		"fuer Wirtschaft und Ausfuhrkontrolle (BAFA) for binding regulatory determinations."

	enefgBaseURL = "https://www.gesetze-im-internet.de/enefg/"
)

// Check implements Germany's Energieeffizienzgesetz (EnEfG) compliance logic.
//
// Key regulatory references:
//   - EnEfG §11(1): Scope — applies to data centres with non-redundant nominal
//     connected load >= 300 kW.
//   - EnEfG §11(2): Waste heat reuse targets (ERF) for new data centres
//     commissioned after 01.07.2026:
//     >= 10% from 01.07.2026, >= 15% from 01.07.2027, >= 20% from 01.07.2028.
//     PUE must not exceed 1.2. Targets must be achieved within 2 years of
//     commissioning on an annual average.
//   - EnEfG §11(3): Three exemption scenarios:
//     (a) Non-compliance after commissioning due to events beyond operator's control.
//     (b) Written agreement with municipality or heat network operator showing
//         intent to meet ERF within 10 years.
//     (c) Heat network operator does not accept waste heat offer at prime cost
//         within 6 months, despite operator providing necessary infrastructure.
//   - EnEfG §11(5): Renewable electricity — >= 50% from 01.01.2024, 100% from 01.01.2027.
//   - EnEfG §12: Energy/environmental management system required by 01.07.2025.
//     Certification required for >= 1 MW from 01.01.2026.
//   - EnEfG §13: Reporting to the Energy Efficiency Register. Data centres >= 500 kW
//     non-redundant nominal load must register. Smaller ones (300-500 kW) by 01.07.2025.
//   - EnEfG §16: General waste heat avoidance for businesses consuming > 2.5 GWh/yr.
//   - EnEfG §17(2): Annual waste heat reporting by 31 March (from 01.01.2025).
//
// Sources:
//   - EnEfG full text: https://www.gesetze-im-internet.de/enefg/
//   - White & Case analysis: https://www.whitecase.com/insight-alert/data-center-requirements-under-new-german-energy-efficiency-act
//   - Bird & Bird analysis: https://www.twobirds.com/en/insights/2024/germany/rechenzentren-und-abwaerme-ein-ueberblick-ueber-die-gesetzlichen-vorgaben-zur-abwaermenutzung
func (r *GermanRules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "Energieeffizienzgesetz (EnEfG)",
		Reasoning:     []string{},
		Citations:     []RegulatoryReference{},
		Disclaimer:    enefgDisclaimer,
	}

	// §11(1): EnEfG applies to data centres >= 300 kW non-redundant nominal connected load.
	if req.TotalITLoadKW < 300 {
		res.Status = StatusExempt
		res.Reasoning = []string{
			"Capacity below 300 kW non-redundant nominal connected load: outside the scope of EnEfG §11.",
		}
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Energieeffizienzgesetz (EnEfG)",
			Section: "§11(1)",
			Summary: "EnEfG data centre obligations apply to facilities with non-redundant nominal connected load of 300 kW or more.",
			URL:     enefgBaseURL,
		})
		return res
	}

	// Facility is in scope (>= 300 kW).
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Energieeffizienzgesetz (EnEfG)",
		Section: "§11(1)",
		Summary: "Facility meets the 300 kW threshold and falls within the scope of EnEfG data centre obligations.",
		URL:     enefgBaseURL,
	})

	// §13: Energy Efficiency Register reporting obligation.
	if req.TotalITLoadKW >= 500 {
		res.Reasoning = append(res.Reasoning,
			"Capacity >= 500 kW: registration in the Energy Efficiency Register (Energieeffizienzregister) is mandatory (deadline was 15.08.2024).",
		)
	} else {
		res.Reasoning = append(res.Reasoning,
			"Capacity 300-500 kW: registration in the Energy Efficiency Register is mandatory (deadline 01.07.2025).",
		)
	}
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Energieeffizienzgesetz (EnEfG)",
		Section: "§13",
		Summary: "Data centres >= 300 kW must register in the Energy Efficiency Register and report annually by 31 March.",
		URL:     enefgBaseURL,
	})

	// §12: Energy or environmental management system.
	emsDeadline := time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC)
	res.Reasoning = append(res.Reasoning,
		"An energy or environmental management system must be established by 01.07.2025 (EnEfG §12).",
	)
	if req.TotalITLoadKW >= 1000 {
		res.Reasoning = append(res.Reasoning,
			"Capacity >= 1 MW: the management system must be validated or certified from 01.01.2026 (EnEfG §12).",
		)
	}
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Energieeffizienzgesetz (EnEfG)",
		Section: "§12",
		Summary: "Energy/environmental management system required by 01.07.2025; certification for >= 1 MW from 01.01.2026.",
		URL:     enefgBaseURL,
	})
	_ = emsDeadline // deadline referenced in reasoning text

	// §11(2): Waste heat reuse (ERF) targets — only for new data centres.
	commissioningDate := req.PlanDate
	erfDeadline2026 := time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC)
	erfDeadline2027 := time.Date(2027, 7, 1, 0, 0, 0, 0, time.UTC)
	erfDeadline2028 := time.Date(2028, 7, 1, 0, 0, 0, 0, time.UTC)

	if commissioningDate.Before(erfDeadline2026) {
		// Existing / near-term data centre: no ERF quota applies.
		res.Reasoning = append(res.Reasoning,
			"Commissioning before 01.07.2026: no mandatory waste heat reuse quota (ERF) applies under §11(2). "+
				"However, the general waste heat avoidance obligation under §16 applies if annual consumption exceeds 2.5 GWh.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Energieeffizienzgesetz (EnEfG)",
			Section: "§11(2) / §16",
			Summary: "ERF targets apply only to facilities commissioned on or after 01.07.2026. General waste heat avoidance (§16) applies to all facilities consuming > 2.5 GWh/yr.",
			URL:     enefgBaseURL,
		})

		// §16: General obligation for large consumers.
		if req.TotalITLoadKW >= 2500 {
			// Rough proxy: 2.5 MW * 8760h = ~21.9 GWh >> 2.5 GWh threshold.
			res.Status = StatusMandatory
			res.Reasoning = append(res.Reasoning,
				"Estimated annual consumption well above 2.5 GWh: subject to the general waste heat avoidance and reuse obligation "+
					"under §16, insofar as technically and economically reasonable (zumutbar).",
			)
			res.RemediationSteps = append(res.RemediationSteps,
				"Conduct a waste heat assessment per §16 to determine technically unavoidable waste heat.",
				"Explore district heating feed-in or on-site reuse opportunities.",
			)
			res.Citations = append(res.Citations, RegulatoryReference{
				Law:     "Energieeffizienzgesetz (EnEfG)",
				Section: "§16(1)-(2)",
				Summary: "Businesses consuming > 2.5 GWh/yr must avoid waste heat and reuse it insofar as technically and economically reasonable.",
				URL:     enefgBaseURL,
			})
		} else {
			res.Status = StatusVoluntary
			res.Reasoning = append(res.Reasoning,
				"Existing data centre below estimated 2.5 GWh/yr threshold: waste heat reuse is encouraged but not mandatory under current law.",
			)
		}
	} else {
		// New data centre commissioned on or after 01.07.2026: ERF targets apply.
		res.Status = StatusMandatory

		var erfTarget string
		var deadlineRef time.Time
		switch {
		case !commissioningDate.Before(erfDeadline2028):
			erfTarget = "at least 20%"
			deadlineRef = erfDeadline2028
		case !commissioningDate.Before(erfDeadline2027):
			erfTarget = "at least 15%"
			deadlineRef = erfDeadline2027
		default:
			erfTarget = "at least 10%"
			deadlineRef = erfDeadline2026
		}

		res.Reasoning = append(res.Reasoning,
			"Commissioning on or after "+deadlineRef.Format("02.01.2006")+": "+
				"the data centre MUST achieve an Energy Reuse Factor (ERF) of "+erfTarget+
				" of generated waste heat, on an annual average, within two years of commissioning (EnEfG §11(2)).",
		)
		res.Reasoning = append(res.Reasoning,
			"The Power Usage Effectiveness (PUE) must not exceed 1.2 (EnEfG §11(2)).",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Energieeffizienzgesetz (EnEfG)",
			Section: "§11(2)",
			Summary: "New DCs commissioned from 01.07.2026 must meet ERF targets (10%/15%/20%) and PUE <= 1.2, achieved within 2 years of commissioning.",
			URL:     enefgBaseURL,
		})

		// §11(3): Exemption scenarios — note: these do NOT include a payback period
		// threshold or a distance threshold. The law uses three specific exemptions.
		res.Reasoning = append(res.Reasoning,
			"Exemptions under §11(3) are limited to three scenarios: "+
				"(a) non-compliance through no fault of the operator after commissioning; "+
				"(b) a written agreement with a nearby municipality or heat network operator showing intent to meet ERF within 10 years; "+
				"(c) the local heat network operator has not accepted a waste heat offer at prime cost within 6 months, "+
				"despite the operator providing necessary infrastructure (e.g. heat transfer station).",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Energieeffizienzgesetz (EnEfG)",
			Section: "§11(3)",
			Summary: "Three exemption scenarios: no-fault non-compliance, 10-year municipal agreement, or heat network operator rejection of offer within 6 months.",
			URL:     enefgBaseURL,
		})

		res.RemediationSteps = append(res.RemediationSteps,
			"Design for heat recovery readiness: install heat exchangers and connection points during construction.",
			"Engage nearby municipalities or heat network operators early to negotiate waste heat offtake agreements.",
			"If no offtaker is available, prepare documentation for a §11(3) exemption application, including evidence of outreach efforts.",
			"Ensure PUE design target is <= 1.2.",
		)
	}

	// §11(5): Renewable electricity requirements (applies to all in-scope DCs).
	res.Reasoning = append(res.Reasoning,
		"Renewable electricity requirement: >= 50% from 01.01.2024, rising to 100% from 01.01.2027 (EnEfG §11(5)).",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Energieeffizienzgesetz (EnEfG)",
		Section: "§11(5)",
		Summary: "Data centres must source >= 50% renewable electricity from 01.01.2024, and 100% from 01.01.2027.",
		URL:     enefgBaseURL,
	})

	// §17(2): Annual waste heat reporting.
	res.Reasoning = append(res.Reasoning,
		"Annual waste heat data must be reported by 31 March each year to the waste heat platform (EnEfG §17(2), effective from 01.01.2025).",
	)
	res.Citations = append(res.Citations, RegulatoryReference{
		Law:     "Energieeffizienzgesetz (EnEfG)",
		Section: "§17(2)",
		Summary: "Annual waste heat reporting by 31 March, effective from 01.01.2025.",
		URL:     enefgBaseURL,
	})

	// Penalties.
	res.Reasoning = append(res.Reasoning,
		"Non-compliance with §11 obligations may result in administrative fines of up to EUR 50,000 or EUR 100,000 depending on the violation.",
	)

	return res
}
