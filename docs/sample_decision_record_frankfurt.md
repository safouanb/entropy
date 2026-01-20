# Entropy — Heat Reuse Decision & Compliance Record

> **This is not a pitch. This is the product.**

---

**Record ID:** `ENTROPY-REC-2026-001`  
**Project Name:** Frankfurt Hyperscale DC  
**Site Location:** Frankfurt, Hessen, Germany  
**Jurisdiction(s):** DE (Germany)  
**Date Created:** 2026-01-20  
**Current Version:** 0.1

**Prepared by:** Entropy  
**Purpose:** Regulatory-grade feasibility and compliance determination for heat reuse

---

## 1. Project Context

### 1.1 Stakeholders

| Role | Entity |
|------|--------|
| Data Center Operator | HyperCloud GmbH |
| Heat Offtaker / Utility | Stadtwerke Frankfurt |
| Integrator | TBD |
| Relevant Authority | Bundesnetzagentur |

### 1.2 Project Description

A planned 50MW hyperscale data center in Frankfurt-Ost, adjacent to an existing district heating network operated by Stadtwerke Frankfurt. The site is currently under construction with commissioning expected Q3 2027. The operator has expressed willingness to explore heat reuse but has no prior experience with heat valorization.

---

## 2. Regulatory Framework

### 2.1 Applicable Regulation

| Regulation | Jurisdiction | Reference |
|------------|--------------|-----------|
| Energieeffizienzgesetz (EnEfG) | DE | §16 Heat Reuse Obligation |
| EU Energy Efficiency Directive (EED) | EU | Art. 26 |

### 2.2 Compliance Criteria

| Requirement | Type | Threshold | Source |
|-------------|------|-----------|--------|
| Heat reuse quota (new DC) | **Mandatory** | ≥10% (rising to 20% by 2028) | EnEfG §16 |
| Energy efficiency register entry | **Mandatory** | >300 kW | EnEfG §18 |
| Waste heat inquiry | Conditional | If no offtaker identified | EnEfG §17 |

**Interpretation:**  
As a new data center commissioning after July 2026 with IT load >300kW, this facility falls under the mandatory heat reuse requirements of EnEfG. The 10% heat reuse quota applies from commissioning, rising to 20% within 2 years.

---

## 3. Core Assumptions

### 3.1 Technical Assumptions

| Parameter | Min | Base | Max | Source/Date |
|-----------|-----|------|-----|-------------|
| Available thermal output | 8,000 | 12,000 | 15,000 | Operator estimate (2026-01) |
| Operating hours (hrs/year) | 8,000 | 8,500 | 8,760 | Industry standard |
| Supply temperature (°C) | 28 | 32 | 35 | Air cooling system spec |
| Distance to offtaker (km) | 1.2 | 1.2 | 1.2 | GIS measurement |

**Heat Quality Grade:** ☐ Low (<40°C) ☑ Medium (40-60°C with heat pump) ☐ High (>60°C)

### 3.2 Temporal Assumptions

| Parameter | Min | Expected | Max |
|-----------|-----|----------|-----|
| Project lifetime (years) | 15 | 20 | 25 |
| Heat supply contract (years) | 5 | 10 | 15 |
| Time to commissioning (months) | 18 | 24 | 30 |

**Horizon Mismatch:** ☐ None ☐ Minor (<3 years) ☑ Significant (>3 years)

### 3.3 Economic Assumptions

| Parameter | Low | Base | High | Source/Date |
|-----------|-----|------|------|-------------|
| Gas replacement price (€/kWh) | 0.06 | 0.08 | 0.12 | Market avg (2026-01) |
| Electricity price (€/kWh) | 0.12 | 0.15 | 0.20 | Operator contract |
| Discount rate (%) | 5 | 6 | 8 | Industry standard |

---

## 4. Scenarios Evaluated

---

### Scenario A — No Heat Reuse ❌

**Description:** Baseline case where no heat reuse is implemented.

| Metric | Value |
|--------|-------|
| Regulatory exposure | **Non-compliance with EnEfG §16**: fines, permit risk, reputational damage |
| Estimated baseline emissions | 2,100 - 3,150 t CO₂/year (gas heating equivalent) |
| Compliance status | ☐ Compliant ☑ Non-compliant ☐ Conditionally compliant |

**Key Rationale:**  
Data center commissioning after July 2026 with >300kW load is subject to mandatory 10% heat reuse. Failure to comply exposes operator to regulatory enforcement, potential fines, and inability to meet sustainability commitments to investors.

---

### Scenario B — Direct Heat Reuse ⚠️

**Description:** Direct connection to Stadtwerke Frankfurt district heating network via new pipeline.

**Infrastructure Required:**

| Type | Ownership | Permanence |
|------|-----------|------------|
| Heat exchanger (12MW capacity) | DC Operator | Permanent |
| Pipeline (1.2 km) | Shared | Permanent |
| Heat pump (boost to 65°C) | Utility | 15-year lease |

**Economics (Ranges):**

| Metric | Min | Max |
|--------|-----|-----|
| CAPEX (€) | 1,450,000 | 2,850,000 |
| OPEX (€/year) | 85,000 | 145,000 |
| Payback (years) | 4.2 | 8.5 |
| IRR (%) | 8.5 | 15.2 |

**Key Risks:**

| Risk | Severity | Owner |
|------|----------|-------|
| Time-horizon mismatch (DC 25yr vs contract 10yr) | ☐ Low ☐ Med ☑ High | DC Operator |
| Stranded asset risk (if utility exits) | ☐ Low ☑ Med ☐ High | DC Operator |
| Performance variability (heat demand seasonality) | ☑ Low ☐ Med ☐ High | Utility |

**Failure Mode:** Time-horizon mismatch between DC expected lifetime (25 years) and typical heat supply contract duration (10 years). If utility exits or demand shifts, DC bears stranded infrastructure risk.

**Compliance Outcome:** ☐ Compliant ☐ Non-compliant ☑ Conditionally compliant

---

### Scenario C — Heat Reuse with Mitigation ✅

**Description:** Direct heat reuse with thermal storage buffer to decouple supply/demand timing and provide contractual flexibility.

**Mitigation Type:** Mobile thermal storage (vendor-agnostic)

**Economic Impact:**

| Metric | vs. Scenario B |
|--------|---------------|
| Incremental CAPEX (€) | +50,000 - +100,000 |
| Incremental OPEX (€/year) | +1,500 - +3,000 |
| Risk reduction effect | Significant |

**Key Changes vs Scenario B:**
- ☑ Bounded downside exposure (storage redeployable if contract ends)
- ☑ Redeployability of mobile assets
- ☑ Compliance improvement (buffer enables guaranteed 10% delivery)

**Failure Mode:** Storage capacity undersizing or maintenance failure — mitigated by redundancy and service contracts.

**Compliance Outcome:** ☑ Compliant ☐ Non-compliant ☐ Conditionally compliant

---

## 5. Economic Boundaries

| Scenario | CAPEX Range | OPEX Range | Worst-Case IRR | Key Sensitivity |
|----------|-------------|------------|----------------|-----------------|
| A — No Reuse | €0 | €0 | N/A | Regulatory exposure |
| B — Direct | €1.45M - €2.85M | €85k - €145k/yr | 8.5% | Contract duration |
| C — With Mitigation | €1.50M - €2.95M | €87k - €148k/yr | 7.8% | Storage sizing |

> Entropy presents bounds, not promises.

---

## 6. Risk & Responsibility Allocation

| Risk Category | Bearing Party | Mitigation Mechanism | Notes |
|---------------|---------------|---------------------|-------|
| Supply variability | SHARED | Contract clause | Storage buffers fluctuations |
| Demand variability | SHARED | Contract clause | Seasonal modulation agreed |
| Asset lifetime mismatch | SHARED | ☑ Redeployment | Mobile storage can be moved |
| Performance degradation | SHARED | Insurance | Equipment warranties in place |
| Regulatory change | DC Operator | Contract clause | Compliance obligation remains with DC |

> [!CAUTION]
> This section is critical for contract and financing discussions. All allocations must be explicit.

---

## 7. Compliance Determination

### Summary Verdict

Based on the assumptions and scenarios evaluated:

- ☐ **Compliant** 
- ☐ **Conditionally Compliant**
- ☑ **Compliant via Scenario C**

**Confidence Level:** ☑ Medium  
*(Based on assumption variance and data quality)*

### Justification

Compliance with EnEfG §16 is achievable through Scenario C (Heat Reuse with Mitigation). This pathway:

1. Meets the 10% heat reuse quota from commissioning
2. Provides contractual flexibility through redeployable storage
3. Bounds downside risk for the DC operator
4. Creates defensible documentation for regulatory inquiry

Scenario B (Direct Reuse) is conditionally compliant but carries unmitigated time-horizon risk that may not satisfy investor requirements.

Scenario A (No Reuse) results in non-compliance and is not recommended.

---

## 8. Decision Summary

| Question | Answer |
|----------|--------|
| Scenarios that satisfy compliance | C: Reuse + Mitigation |
| Scenarios that fail (and why) | A: No Reuse (regulatory non-compliance) |
| Conditions required for compliance | Heat supply contract with Stadtwerke + storage buffer |
| Key assumptions driving the outcome | Distance (1.2km), existing DH infrastructure, operator willingness |

> **Entropy determines what is defensible, not what must be built.**

---

## 9. Audit Trail & Version History

| Version | Date | Change Summary | Author | Data Sources |
|---------|------|----------------|--------|--------------|
| 0.1 | 2026-01-20 | Initial record | Entropy | Operator intake, GIS, EnEfG |

> All changes preserved.

---

## 10. References & Sources

| Type | Reference | Quality |
|------|-----------|---------|
| Regulation | EnEfG (Energieeffizienzgesetz), Jul 2023 | ☑ Primary |
| Operator data | HyperCloud intake form | ☑ Verified |
| Distance measurement | Google Maps, confirmed via GIS | ☑ Verified |
| Economic assumptions | Industry benchmarks (Entropy) | ☐ Estimated |

---

**End of Record**

---

## Feedback Request

> **One Question:** Would this record be acceptable as a decision document for regulatory compliance?

**Categories for feedback:**
1. **Completeness** — Is anything missing that a regulator would expect?
2. **Clarity** — Is the language defensible and unambiguous?
3. **Structure** — Does the flow make sense for decision-making?
4. **Actionability** — Can this replace a €15-25k consultant feasibility study?

Please reply with your assessment.
