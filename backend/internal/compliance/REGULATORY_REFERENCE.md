# Regulatory Reference: Compliance Engine Traceability

This document maps every threshold and rule coded in the compliance engine to its authoritative legal source. It exists so a legal reviewer can verify the code against the law, and so future contributors know exactly what to update when regulations change.

**Last verified: 2026-01-29**

---

## How to use this document

1. Each row maps a coded threshold to a specific legal provision.
2. The "Confidence" column is honest about how directly the threshold maps to the source text.
3. When a regulation changes, update the code, this table, and the "Last verified" date.
4. If a threshold is a *proxy* (e.g. converting kW to kWh/yr), that's noted explicitly.

---

## Germany: Energieeffizienzgesetz (EnEfG)

**Full text:** https://www.gesetze-im-internet.de/enefg/
**Came into force:** 18 November 2023
**Code file:** `rules_de.go`

| Coded threshold / rule | Code value | Legal source | Source text (paraphrased) | Confidence | Notes |
|---|---|---|---|---|---|
| Scope: minimum capacity | >= 300 kW | §11(1) EnEfG | "Data centres with a non-redundant nominal connected load of 300 kW or more" | HIGH | Confirmed by BMWK, White & Case, Bird & Bird |
| Registry: large DC deadline | >= 500 kW, by 15.08.2024 | §13 EnEfG | "Operators of data centres with a redundant nominal connected load of 500 kW or higher must submit data by 15.08.2024" | HIGH | Taylor Wessing confirms |
| Registry: small DC deadline | 300-500 kW, by 01.07.2025 | §13 EnEfG | "Smaller data centres with a nominal connected load between 300 kW and 500 kW have a deadline of 01.07.2025" | HIGH | Taylor Wessing confirms |
| EMS/UMS required | All >= 300 kW, by 01.07.2025 | §12 EnEfG | "Data center operators are required to establish an energy or environmental management system by July 1, 2025" | HIGH | White & Case confirms |
| EMS/UMS certification | >= 1 MW, from 01.01.2026 | §12 EnEfG | "From a non-redundant nominal connection capacity of 1 MW, there is also an obligation to validate or certify this system from January 1, 2026" | HIGH | White & Case confirms |
| ERF target: 10% | Commissioned >= 01.07.2026 | §11(2) EnEfG | "Starting July 1, 2026, new data centers must provide proof and utilize at least 10% of their generated waste heat" | HIGH | Multiple law firm analyses confirm |
| ERF target: 15% | Commissioned >= 01.07.2027 | §11(2) EnEfG | "This percentage increases to 15% in 2027" | HIGH | White & Case, Bird & Bird |
| ERF target: 20% | Commissioned >= 01.07.2028 | §11(2) EnEfG | "at least 20% in 2028" | HIGH | White & Case, Bird & Bird |
| ERF compliance window | Within 2 years of commissioning | §11(2) sentence 2 EnEfG | "These requirements must be met on a permanent basis no later than two years after commissioning on an annual average" | HIGH | Bird & Bird confirms |
| PUE maximum | <= 1.2 | §11(2) EnEfG | "must achieve an energy efficiency value (PUE) of no more than 1.2" | HIGH | Multiple sources confirm |
| Exemption (a): no-fault | Operator not at fault | §11(3) sentence 1(a) EnEfG | "The proportion of reused waste heat no longer meets the requirements after commissioning due to subsequent events and through no fault of the operator" | HIGH | Bird & Bird confirms |
| Exemption (b): 10-year agreement | Written agreement with municipality/heat network operator | §11(3) sentence 1(b) EnEfG | "An agreement on waste heat utilisation with a neighbouring municipality or a heating network operator with a concrete intention to fulfil the requirements within ten years" | HIGH | Bird & Bird confirms |
| Exemption (c): 6-month rejection | Heat network operator rejects offer | §11(3) sentence 1(c) EnEfG | "The operator of a heat network located in the vicinity does not accept an offer to use reused energy at prime cost within six months" | HIGH | Bird & Bird confirms |
| Renewable electricity: 50% | From 01.01.2024 | §11(5) EnEfG | "at least 50 percent of the electricity consumed by each data center must come from renewable sources" | HIGH | White & Case confirms |
| Renewable electricity: 100% | From 01.01.2027 | §11(5) EnEfG | "rising to 100 percent by January 1, 2027" | HIGH | White & Case confirms |
| General waste heat avoidance | > 2.5 GWh/yr consumption | §16(1)-(2) EnEfG | "Businesses with an annual average energy consumption of more than 2.5 GWh are obliged to avoid waste heat... insofar as this is possible and reasonable" | HIGH | Bird & Bird confirms |
| Waste heat reporting | Annually by 31 March, from 01.01.2025 | §17(2), §20(4) EnEfG | "reporting obligation... in force since 1 January 2025... submitted annually by 31 March" | HIGH | Taylor Wessing confirms |
| Penalties | Up to EUR 50,000 or EUR 100,000 | §18 EnEfG | "administrative offense... sanctioned with a fine of up to EUR 50,000 or EUR 100,000, depending on the violation" | HIGH | White & Case confirms |

### What we explicitly do NOT code (and why)

| Previously coded (now removed) | Why it was wrong |
|---|---|
| 5-year payback = economic exemption | EnEfG does not specify a payback threshold. §11(3) lists three specific exemptions (see above), none of which reference payback period. |
| > 5 km distance = automatic exemption | EnEfG uses "in the vicinity" (in der Nähe) without defining a distance. No km threshold exists in the law. |
| Fixed 10%/20% without timeline | The old code had flat targets without the phased 10%/15%/20% timeline tied to commissioning date. |

### Sources used for verification

- [White & Case — Data center requirements under EnEfG](https://www.whitecase.com/insight-alert/data-center-requirements-under-new-german-energy-efficiency-act)
- [Bird & Bird — Rechenzentren und Abwärme](https://www.twobirds.com/en/insights/2024/germany/rechenzentren-und-abwaerme-ein-ueberblick-ueber-die-gesetzlichen-vorgaben-zur-abwaermenutzung)
- [Taylor Wessing — Waste heat reporting obligations](https://www.taylorwessing.com/en/insights-and-events/insights/2025/01/abwaerme-von-rechenzentren)
- [A&O Shearman — Germany tightens efficiency requirements](https://www.aoshearman.com/en/insights/update-germany-tightens-energy-efficiency-requirements-for-companies-and-data-centers)
- [Columbia Law — From EU Framework to National Action](https://blogs.law.columbia.edu/climatechange/2025/10/24/from-eu-framework-to-national-action-how-germany-regulates-data-center-energy-use/)

---

## EU: Energy Efficiency Directive (EU) 2023/1791

**Full text:** https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng
**Came into force:** 10 October 2023
**Transposition deadline:** 11 October 2025
**Code file:** `rules_eu.go`

| Coded threshold / rule | Code value | Legal source | Source text (paraphrased) | Confidence | Notes |
|---|---|---|---|---|---|
| Reporting: IT power threshold | >= 500 kW installed IT power demand | Article 12 | "owners and operators of data centres with a power demand of the installed information technology of at least 500 kW" | HIGH | Delegated Regulation 2024/1364 confirms |
| Reporting: Member State flexibility | MS may lower threshold | Article 12 | "Member States may lower the 500kW threshold, but not raise it" | HIGH | Multiple analyses confirm |
| Reporting: KPIs | PUE, WUE, ERF, REF | Article 12 + Del. Reg. 2024/1364, Annex II | "report... energy performance... key sustainability indicators Power Usage Effectiveness (PUE), Water Usage Effectiveness (WUE), Energy Reuse Factor (ERF) and Renewable Energy Factor (REF)" | HIGH | CMS Law-Now confirms |
| Reporting: first deadline | Calendar year 2023, by 15.09.2024 | Article 12 | "reports on the calendar year 2023 must be communicated to the European database by 15 September 2024" | HIGH | Energimyndigheten confirms |
| Reporting: annual deadline | By 15 May each year from 2025 | Article 12 | "From 2025 onwards, reports covering the preceding calendar year shall be transmitted by 15 May" | HIGH | Multiple sources confirm |
| Waste heat: capacity threshold | > 1 MW total rated energy input | Article 26(6) | "Member States must ensure waste heat utilisation in data centres with total rated energy input > 1 MW" | HIGH | White & Case confirms |
| Waste heat: feasibility exception | CBA must show infeasibility | Article 26(7)-(8) | "unless the operator demonstrates that this is not technically or economically feasible" via CBA | HIGH | Directive text |
| CBA methodology | Installation-level, no fixed payback | Article 26(7)-(8) | "Installation-level cost-benefit analysis required for new or substantially refurbished facilities" | HIGH | No payback threshold in directive text |

### What we explicitly do NOT code (and why)

| Previously coded (now removed) | Why it was wrong |
|---|---|
| 7-year payback = exemption | EED does not specify any payback threshold. Feasibility is determined by a full CBA, not a simple payback test. |
| 2.5 MW = mandatory (separate from 1 MW) | The directive uses 1 MW for waste heat (Art. 26(6)) and 500 kW for reporting (Art. 12). There is no separate 2.5 MW threshold in the EED itself. |

### Important: Directive vs. National Law

The EED is a **directive**, not a regulation. It must be transposed into national law by each Member State, which may impose stricter requirements. The EU check in the engine should only be used when no national transposition is available. For Germany, use DE (EnEfG). For the Netherlands, use NL.

### Sources used for verification

- [EUR-Lex — Directive (EU) 2023/1791 full text](https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng)
- [EUR-Lex — Delegated Regulation (EU) 2024/1364](https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng)
- [EUR-Lex — Commission Recommendation (EU) 2024/2395](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024H2395)
- [White & Case — Data centres and energy consumption: EU outlook 2026](https://www.whitecase.com/insight-alert/data-centres-and-energy-consumption-evolving-eu-regulatory-landscape-and-outlook-2026)
- [CMS Law-Now — European publication obligations for data centres](https://cms-lawnow.com/en/ealerts/2024/06/specification-of-the-european-publication-obligations-for-data-centres)
- [EUDCA — Energy Efficiency Directive](https://www.eudca.org/energy-efficiency-directive)

---

## Netherlands: Omgevingswet / Besluit activiteiten leefomgeving

**Effective date:** 01 January 2024 (replacing Activiteitenbesluit)
**Code file:** `rules_nl.go`

| Coded threshold / rule | Code value | Legal source | Source text (paraphrased) | Confidence | Notes |
|---|---|---|---|---|---|
| Energy Saving Obligation threshold | >= 50,000 kWh/yr electricity OR >= 25,000 m3/yr gas | Omgevingswet / Bal | "Business locations consuming >= 50,000 kWh/yr electricity or >= 25,000 m3/yr natural gas must implement energy saving measures" | HIGH | RVO.nl confirms |
| Proxy: 50 kW IT load | Code uses >= 50 kW as proxy | *Derived* | 50 kW * 8760 hrs = 438,000 kWh/yr >> 50,000 kWh threshold | MEDIUM | This is an engineering proxy, not a legal threshold. The actual trigger is energy consumption, not IT load. |
| Payback threshold for measures | <= 5 years | Omgevingswet / Bal (EML) | "All energy saving measures with a payback period of 5 years or less must be implemented" | HIGH | RVO.nl confirms |
| Alternative: EML compliance | Implement all EML measures | Erkende Maatregelenlijst | "Alternatively, implement all applicable measures from the EML, with equivalent alternatives for any not taken" | HIGH | RVO.nl confirms |
| CO2 reduction measures | Mandatory if payback <= 5 years | Omgevingswet (updated) | "Measures that reduce CO2 or replace fossil energy carriers are also mandatory if payback <= 5 years" | HIGH | Business.gov.nl confirms |
| Planned payback extension | 7 years from 2027 | Government plan (not yet law) | "The government plans to extend the payback threshold to 7 years from 2027" | MEDIUM | Announced but not enacted. Code mentions it as future change. |
| Notification obligation | Every 4 years | Informatieplicht | "Report energy-saving measures to the competent authority every 4 years via RVO's digital portal" | HIGH | RVO.nl confirms |
| Investigation obligation threshold | >= 10,000,000 kWh/yr (10 GWh) | Omgevingswet / Bal | "Locations consuming >= 10 GWh/yr must investigate process-level energy savings" | HIGH | RVO.nl confirms |
| Proxy: 10 MW IT load for investigation | Code uses >= 10,000 kW | *Derived* | 10 MW * 8760 hrs = 87.6 GWh/yr >> 10 GWh threshold | MEDIUM | Conservative proxy. Real trigger is metered consumption. |
| Amsterdam moratorium | No new DCs or expansions | Amsterdam municipal policy (April 2025) | "Amsterdam does not allow new data centres or expansions in the municipality" | HIGH | NL Times, DCD confirm |
| Haarlemmermeer capacity cap | 550 MVA total until 2030, 70 MVA/yr | Haarlemmermeer local policy | "Haarlemmermeer allows moderate growth with 550 MVA until 2030, 70 MVA/yr cap" | HIGH | DDA, DCD confirm |

### What we explicitly flag as limitations

| Limitation | Explanation |
|---|---|
| Location not captured in input | The compliance request doesn't include city/municipality. Amsterdam/Haarlemmermeer warnings are shown to all NL facilities >= 1 MW as informational notices. |
| Energy consumption is proxied | The Dutch threshold is based on metered kWh/yr, not IT load in kW. The code converts using 8760 hrs/yr, which is conservative (DCs don't always run at rated load). |
| EML is not enumerated | The code does not list specific EML measures for data centres. It references the EML framework. A legal reviewer or RVO consultation is needed to identify applicable measures. |

### Sources used for verification

- [RVO — What is the Energy Saving Obligation](https://english.rvo.nl/topics/energy-saving-obligation/what-energy-saving-obligation)
- [RVO — Energy Saving Notification Obligation](https://english.rvo.nl/topics/energy-saving-obligation/energy-saving-notification-obligation)
- [RVO — Energy Saving Investigation Obligation](https://english.rvo.nl/energy-saving-investigation-obligation)
- [Business.gov.nl — Taking measures to save energy](https://business.gov.nl/regulations/taking-measures-to-save-energy/)
- [DLA Piper — Data centers in the Netherlands](https://www.dlapiper.com/en/insights/publications/real-estate-gazette/real-estate-gazette-data-centers/data-centers-in-the-netherlands-a-shifting-landscape)
- [Dutch Data Center Association](https://www.dutchdatacenters.nl/en/)
- [DCD — Impact of Amsterdam's data center moratorium](https://www.datacenterdynamics.com/en/analysis/the-ongoing-impact-of-amsterdams-data-center-moratorium/)

---

## Maintenance checklist

When updating this document:

- [ ] Verify the current law text hasn't been amended (EnEfG, EED, Omgevingswet)
- [ ] Check for new delegated/implementing acts at EU level
- [ ] Check for new BAFA guidance or BfEE publications (Germany)
- [ ] Check for updated EML lists at RVO.nl (Netherlands)
- [ ] Check for municipal policy changes (Amsterdam, Haarlemmermeer, etc.)
- [ ] Update the "Last verified" date at the top
- [ ] Update the code if any thresholds or dates have changed
- [ ] Run `go build ./...` and `go test ./...` after code changes
