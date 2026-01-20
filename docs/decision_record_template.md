# Entropy — Heat Reuse Decision & Compliance Record

> **This is not a pitch. This is the product.**

---

**Record ID:** `ENTROPY-REC-XXXX`  
**Project Name:**  
**Site Location:**  
**Jurisdiction(s):**  
**Date Created:**  
**Current Version:** 0.1

**Prepared by:** Entropy  
**Purpose:** Regulatory-grade feasibility and compliance determination for heat reuse

---

## 1. Project Context

### 1.1 Stakeholders

| Role | Entity | Contact (Optional) |
|------|--------|-------------------|
| Data Center Operator | | |
| Heat Offtaker / Utility | | |
| Integrator (if applicable) | | |
| Relevant Authority / Regulator | | |

### 1.2 Project Description

Brief factual description of the site, operations, and proposed heat reuse context.  
*(No solution framing, no recommendations yet.)*

---

## 2. Regulatory Framework

### 2.1 Applicable Regulation

| Regulation | Jurisdiction | Reference |
|------------|--------------|-----------|
| EU Energy Efficiency Directive (EED) | EU | Art. 26 |
| Energieeffizienzgesetz (EnEfG) | DE | §16 |
| [Local requirement] | | |

### 2.2 Compliance Criteria

| Requirement | Type | Threshold | Source |
|-------------|------|-----------|--------|
| Heat reuse quota (new DC) | Mandatory | ≥10% (rising to 20%) | EnEfG §16 |
| Register entry | Mandatory | >300 kW | EnEfG §18 |
| Waste heat inquiry | Conditional | If no offtaker | EnEfG §17 |

**Interpretation statement:**  
*[Explain how these rules apply to this specific project.]*

---

## 3. Core Assumptions

> [!IMPORTANT]
> All assumptions must be **explicit**, **ranged**, and **dated**.

### 3.1 Technical Assumptions

| Parameter | Min | Base | Max | Source/Date |
|-----------|-----|------|-----|-------------|
| Available thermal output (kW) | | | | |
| Operating hours (hrs/year) | | | | |
| Heat quality / supply temp (°C) | | | | |
| Distance to offtaker (km) | | | | |

**Heat Quality Grade:** ☐ Low (<40°C) ☐ Medium (40-60°C) ☐ High (>60°C)

### 3.2 Temporal Assumptions

| Parameter | Min | Expected | Max |
|-----------|-----|----------|-----|
| Project lifetime (years) | | | |
| Contract horizon (years) | | | |
| Time to commissioning (months) | | | |

**Horizon Mismatch:** ☐ None ☐ Minor (<3 years) ☐ Significant (>3 years)

### 3.3 Economic Assumptions

| Parameter | Low | Base | High | Source/Date |
|-----------|-----|------|------|-------------|
| Gas replacement price (€/kWh) | | | | |
| Electricity price (€/kWh) | | | | |
| Discount rate (%) | | | | |

---

## 4. Scenarios Evaluated

Entropy evaluates feasibility and compliance across standardized scenarios.

---

### Scenario A — No Heat Reuse ❌

**Description:** Baseline case where no heat reuse is implemented.

| Metric | Value |
|--------|-------|
| Regulatory exposure | [Fine risk, reputational, permit risk] |
| Estimated emissions (t CO₂/year) | |
| Compliance status | ☐ Compliant ☐ Non-compliant ☐ Conditionally compliant |

**Key Rationale:**  
*[Why this scenario fails or succeeds compliance.]*

---

### Scenario B — Direct Heat Reuse ⚠️

**Description:** Direct connection between data center and heat offtaker without intermediate mitigation.

**Infrastructure Required:**

| Type | Ownership | Permanence |
|------|-----------|------------|
| Heat exchanger | | |
| Pipeline (x km) | | |
| Heat pump (if needed) | | |

**Economics (Ranges):**

| Metric | Min | Max |
|--------|-----|-----|
| CAPEX (€) | | |
| OPEX (€/year) | | |
| Payback (years) | | |
| IRR (%) | | |

**Key Risks:**

| Risk | Severity | Owner |
|------|----------|-------|
| Time-horizon mismatch | ☐ Low ☐ Med ☐ High | |
| Stranded asset risk | ☐ Low ☐ Med ☐ High | |
| Performance variability | ☐ Low ☐ Med ☐ High | |

**Failure Mode:** *[What breaks this scenario?]*

**Compliance Outcome:** ☐ Compliant ☐ Non-compliant ☐ Conditionally compliant

---

### Scenario C — Heat Reuse with Mitigation ✅

**Description:** Heat reuse enabled via mitigation of temporal or spatial constraints.

**Mitigation Type:** *[Abstracted — vendor-agnostic: e.g., "thermal storage", "demand aggregation"]*

**Economic Impact:**

| Metric | vs. Scenario B |
|--------|---------------|
| Incremental CAPEX (€) | |
| Incremental OPEX (€/year) | |
| Risk reduction effect | |

**Key Changes vs Scenario B:**
- ☐ Bounded downside exposure
- ☐ Redeployability of assets
- ☐ Compliance improvement

**Failure Mode:** *[What breaks this scenario?]*

**Compliance Outcome:** ☐ Compliant ☐ Non-compliant ☐ Conditionally compliant

---

## 5. Economic Boundaries

| Scenario | CAPEX Range | OPEX Range | Worst-Case IRR | Key Sensitivity |
|----------|-------------|------------|----------------|-----------------|
| A — No Reuse | €0 | €0 | N/A | Regulatory exposure |
| B — Direct | | | | |
| C — With Mitigation | | | | |

> Entropy presents bounds, not promises.

---

## 6. Risk & Responsibility Allocation

| Risk Category | Bearing Party | Mitigation Mechanism | Notes |
|---------------|---------------|---------------------|-------|
| Supply variability | | | |
| Demand variability | | | |
| Asset lifetime mismatch | | ☐ Buyout ☐ Redeployment ☐ Writeoff | |
| Performance degradation | | | |
| Regulatory change | | | |

> [!CAUTION]
> This section is critical for contract and financing discussions. All allocations must be explicit.

---

## 7. Compliance Determination

### Summary Verdict

Based on the assumptions and scenarios evaluated:

- ☐ **Compliant** — At least one scenario satisfies all requirements
- ☐ **Conditionally Compliant** — Compliance achievable under specific conditions
- ☐ **Non-Compliant** — No viable path to compliance under current assumptions

**Confidence Level:** ☐ High ☐ Medium ☐ Low  
*(Based on assumption variance and data quality)*

### Justification

*[Clear explanation referencing regulation, assumptions, and scenario outcomes.]*

*[No recommendations beyond defensibility.]*

---

## 8. Decision Summary

| Question | Answer |
|----------|--------|
| Scenarios that satisfy compliance | |
| Scenarios that fail (and why) | |
| Conditions required for compliance | |
| Key assumptions driving the outcome | |

> **Entropy determines what is defensible, not what must be built.**

---

## 9. Audit Trail & Version History

| Version | Date | Change Summary | Author | Data Sources |
|---------|------|----------------|--------|--------------|
| 0.1 | | Initial record | | |

> All changes preserved.

---

## 10. References & Sources (Optional)

| Type | Reference | Quality |
|------|-----------|---------|
| Policy document | | ☐ Primary ☐ Secondary |
| Data source | | ☐ Verified ☐ Estimated |
| External validation | | |

---

**End of Record**
