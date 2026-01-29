package compliance

type EURules struct{}

const (
	eedDisclaimer = "This assessment is an automated interpretation of the EU Energy Efficiency Directive " +
		"(EU) 2023/1791 and does not constitute legal advice. The EED is a directive: Member States " +
		"transpose it into national law and may set stricter requirements. Always check the national " +
		"transposition applicable to the facility's location."

	eedDirectiveURL    = "https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng"
	eedGuidanceURL     = "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024H2395"
	eedDelegatedRegURL = "https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng"
)

// Check implements the EU Energy Efficiency Directive (Recast) 2023/1791 compliance logic.
//
// Key regulatory references:
//   - Article 12: Reporting obligations for data centres with installed IT power
//     demand >= 500 kW. Annual reporting of PUE, WUE, ERF, REF to the European
//     database. Member States may lower (but not raise) this threshold.
//   - Article 26(6): Member States must ensure waste heat utilisation in data
//     centres with total rated energy input > 1 MW, unless technically or
//     economically infeasible per a cost-benefit analysis (Article 26(7)-(8)).
//   - Article 26(7)-(8): Installation-level cost-benefit analysis (CBA) required
//     for new or substantially refurbished facilities. Technical feasibility
//     depends on characteristics and available technology; economic feasibility
//     means the project is economically viable/sustainable. No fixed payback
//     threshold is specified — feasibility is determined by the CBA.
//   - Commission Recommendation (EU) 2024/2395: Guidance on interpreting Art. 26.
//   - Delegated Regulation (EU) 2024/1364: Specifies KPIs and reporting methodology
//     for data centres under Article 12.
//
// Sources:
//   - Directive full text: https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng
//   - Commission Recommendation: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024H2395
//   - Delegated Regulation: https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng
//   - White & Case analysis: https://www.whitecase.com/insight-alert/data-centres-and-energy-consumption-evolving-eu-regulatory-landscape-and-outlook-2026
func (r *EURules) Check(req ComplianceRequest) ComplianceResult {
	res := ComplianceResult{
		Status:        StatusVoluntary,
		ApplicableLaw: "EU Energy Efficiency Directive (EU) 2023/1791",
		Reasoning:     []string{},
		Citations:     []RegulatoryReference{},
		Disclaimer:    eedDisclaimer,
	}

	// Article 12: Reporting obligation — installed IT power demand >= 500 kW.
	if req.TotalITLoadKW >= 500 {
		res.Reasoning = append(res.Reasoning,
			"Installed IT power demand >= 500 kW: annual reporting to the European database is mandatory "+
				"under Article 12. Data centres must report PUE, WUE, Energy Reuse Factor (ERF), and "+
				"Renewable Energy Factor (REF). Member States may set a lower threshold.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Directive (EU) 2023/1791",
			Section: "Article 12",
			Summary: "Data centres with installed IT power demand >= 500 kW must report energy performance and sustainability KPIs annually to the European database.",
			URL:     eedDirectiveURL,
		})
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Delegated Regulation (EU) 2024/1364",
			Section: "Annex II",
			Summary: "Specifies the KPIs and measurement methodology for Article 12 reporting (PUE, WUE, ERF, REF, etc.).",
			URL:     eedDelegatedRegURL,
		})
		res.RemediationSteps = append(res.RemediationSteps,
			"Register with the European database or national reporting platform.",
			"Implement continuous monitoring of PUE, WUE, ERF, and REF per Delegated Regulation (EU) 2024/1364.",
		)
	} else {
		res.Reasoning = append(res.Reasoning,
			"Installed IT power demand below 500 kW: Article 12 reporting obligation does not apply at the EU level. "+
				"Check national transposition — some Member States may set a lower threshold.",
		)
	}

	// Article 26(6): Waste heat utilisation obligation — total rated energy input > 1 MW.
	if req.TotalITLoadKW >= 1000 {
		res.Status = StatusMandatory

		res.Reasoning = append(res.Reasoning,
			"Total rated energy input exceeds 1 MW: under Article 26(6), Member States must ensure "+
				"waste heat utilisation or other waste heat recovery applications are implemented, "+
				"unless the operator demonstrates that this is not technically or economically feasible.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Directive (EU) 2023/1791",
			Section: "Article 26(6)",
			Summary: "Data centres with total rated energy input > 1 MW must utilise waste heat unless technically or economically infeasible per a CBA.",
			URL:     eedDirectiveURL,
		})

		// Article 26(7)-(8): CBA requirement.
		res.Reasoning = append(res.Reasoning,
			"A cost-benefit analysis (CBA) is required under Article 26(7)-(8) to assess the "+
				"technical and economic feasibility of waste heat utilisation. If the CBA demonstrates "+
				"infeasibility, the obligation is waived. No fixed payback threshold is specified in the "+
				"Directive — feasibility is determined case-by-case based on the CBA results.",
		)
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Directive (EU) 2023/1791",
			Section: "Article 26(7)-(8)",
			Summary: "Installation-level CBA required for new or substantially refurbished facilities. Feasibility determined by CBA, not a fixed payback threshold.",
			URL:     eedDirectiveURL,
		})
		res.Citations = append(res.Citations, RegulatoryReference{
			Law:     "Commission Recommendation (EU) 2024/2395",
			Section: "Section on Article 26",
			Summary: "Official Commission guidance on interpreting Article 26 obligations, including definitions of technical and economic feasibility.",
			URL:     eedGuidanceURL,
		})

		// Assess feasibility if payback data is available.
		if req.BestPaybackYears != nil {
			res.Reasoning = append(res.Reasoning,
				"Note: A payback estimate has been provided. The EED does not specify a fixed payback "+
					"threshold for exemption. The CBA must consider the full project economics including "+
					"externalities, not just simple payback. This assessment cannot determine CBA outcome — "+
					"a formal analysis per Article 26(7) methodology is required.",
			)
		}

		res.RemediationSteps = append(res.RemediationSteps,
			"Commission a formal cost-benefit analysis (CBA) compliant with Article 26(7)-(8).",
			"Assess technical feasibility: available technology, heat quality, and compatibility with primary operations.",
			"Assess economic feasibility: project viability considering capital costs, operating costs, revenue from heat sales, and externalities.",
			"Identify nearby district heating and cooling networks for potential waste heat offtake.",
			"If CBA shows infeasibility, document and retain the analysis as evidence of compliance.",
		)
	} else if req.TotalITLoadKW >= 500 {
		// Between 500 kW and 1 MW: reporting applies but waste heat mandate does not.
		res.Status = StatusVoluntary
		res.Reasoning = append(res.Reasoning,
			"Total rated energy input between 500 kW and 1 MW: Article 12 reporting applies, "+
				"but the Article 26(6) waste heat utilisation obligation (> 1 MW threshold) does not. "+
				"Heat reuse remains voluntary at the EU level but may be required by national transposition.",
		)
	} else {
		// Below 500 kW: minimal EU-level obligations.
		res.Status = StatusVoluntary
		res.Reasoning = append(res.Reasoning,
			"Below 500 kW: no specific EU-level data centre obligations apply. "+
				"Check national legislation for any additional requirements.",
		)
	}

	// Important note on national transposition.
	res.Reasoning = append(res.Reasoning,
		"The EED is a directive — Member States must transpose it into national law and may "+
			"impose stricter requirements. For facilities in Germany, use the DE (EnEfG) jurisdiction. "+
			"For the Netherlands, use the NL jurisdiction. Other Member States may have their own "+
			"transpositions not yet covered by this tool.",
	)

	return res
}
