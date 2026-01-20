# Entropy Frontend — Wireframes

---

## Screen 1: Landing Page

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ENTROPY                                    [View Records]   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│                                                                    │
│                                                                    │
│           ┌─────────────────────────────────────────┐             │
│           │                                         │             │
│           │   The decision authority for            │             │
│           │   heat reuse compliance.                │             │
│           │                                         │             │
│           │   ─────────────────────────────────     │             │
│           │                                         │             │
│           │   We determine what is defensible,      │             │
│           │   not what must be built.               │             │
│           │                                         │             │
│           │        ┌─────────────────────────┐      │             │
│           │        │  Create Decision Record │      │             │
│           │        └─────────────────────────┘      │             │
│           │                                         │             │
│           └─────────────────────────────────────────┘             │
│                                                                    │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                                                             │  │
│  │   What is a Decision Record?                                │  │
│  │                                                             │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │
│  │   │Scenarios│  │ Risks   │  │Compliance│ │ Verdict │       │  │
│  │   │ A/B/C   │  │ Table   │  │ Outcome  │ │ Final   │       │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘       │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Entropy © 2026 — The decision layer for infrastructure    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Design Notes:
- **Minimal navigation** — Only "View Records" in header
- **Single CTA** — "Create Decision Record" is the only action
- **No marketing fluff** — Statement of purpose, not sales pitch
- **Black/white dominant** — Color reserved for status only

---

## Screen 2: Assessment Intake

```
┌────────────────────────────────────────────────────────────────────┐
│  ENTROPY                                         [Cancel] [Save]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   New Decision Record                                        │ │
│  │   ─────────────────────                                      │ │
│  │                                                              │ │
│  │   ENTROPY-REC-2026-XXX                                       │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ 1. PROJECT CONTEXT ─────────────────────────────────────────┐ │
│  │                                                              │ │
│  │  Project Name        [________________________________]      │ │
│  │                                                              │ │
│  │  Location            [________] Lat  [________] Lng         │ │
│  │                                                              │ │
│  │  Jurisdiction        [▼ Select ─────────────────────]       │ │
│  │                      │ DE - Germany                 │       │ │
│  │                      │ NL - Netherlands             │       │ │
│  │                      │ EU - European Union          │       │ │
│  │                      └──────────────────────────────┘       │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ 2. THERMAL PARAMETERS ──────────────────────────────────────┐ │
│  │                                                              │ │
│  │  Thermal Load (kW)                                           │ │
│  │                                                              │ │
│  │     Min [_______]        Max [_______]                       │ │
│  │                                                              │ │
│  │     ├────────●────────────────●────────┤                     │ │
│  │     0                                 50,000                 │ │
│  │                                                              │ │
│  │  Distance to Offtaker (km)                                   │ │
│  │                                                              │ │
│  │     [_______] km                                             │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ 3. ASSUMPTIONS ─────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │  Supply Temp Required   [____] °C                            │ │
│  │  Time Horizon           [____] years                         │ │
│  │  Availability Profile   ○ Baseload  ○ Peak                   │ │
│  │  Investment Willingness ○ Low  ○ Medium  ○ High              │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│                          ┌──────────────────────────┐             │
│                          │   Generate Decision      │             │
│                          │        Record            │             │
│                          └──────────────────────────┘             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Design Notes:
- **Progressive disclosure** — Sections expand/collapse
- **Range inputs** — Always capture min/max for uncertainty
- **Minimal dropdowns** — No overwhelming options
- **Single action** — "Generate Decision Record"

---

## Screen 3: Decision Record View (Core Product)

```
┌────────────────────────────────────────────────────────────────────┐
│  ENTROPY                               [Finalize] [Download PDF]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   HEAT REUSE DECISION & COMPLIANCE RECORD                    │ │
│  │   ════════════════════════════════════════                   │ │
│  │                                                              │ │
│  │   ENTROPY-REC-2026-001              Version 1                │ │
│  │   Frankfurt Hyperscale DC           2026-01-20               │ │
│  │                                                              │ │
│  │   ┌─────────────────────────────────────────────────────┐   │ │
│  │   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │ │
│  │   │                                                     │   │ │
│  │   │   VERDICT: COMPLIANT                                │   │ │
│  │   │   via Scenario C: Reuse + Mitigation                │   │ │
│  │   │                                                     │   │ │
│  │   │   Confidence: MEDIUM                                │   │ │
│  │   │                                                     │   │ │
│  │   └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ SCENARIOS ──────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│  │  │ A: NO REUSE  │ │ B: DIRECT    │ │ C: MITIGATION│         │ │
│  │  │              │ │              │ │              │         │ │
│  │  │  ┌────────┐  │ │  ┌────────┐  │ │  ┌────────┐  │         │ │
│  │  │  │   ❌   │  │ │  │   ⚠️   │  │ │  │   ✅   │  │         │ │
│  │  │  └────────┘  │ │  └────────┘  │ │  └────────┘  │         │ │
│  │  │              │ │              │ │              │         │ │
│  │  │ NON-COMPLIANT│ │ CONDITIONAL  │ │  COMPLIANT   │         │ │
│  │  │              │ │              │ │              │         │ │
│  │  │  €0          │ │  €1.5-2.9M   │ │  €1.5-3.0M   │         │ │
│  │  │  Regulatory  │ │  4.2-8.5 yrs │ │  4.5-9.0 yrs │         │ │
│  │  │  exposure    │ │              │ │              │         │ │
│  │  │              │ │              │ │              │         │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘         │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ RISK ALLOCATION ────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   Category              │ Party        │ Mitigation          │ │
│  │  ─────────────────────────────────────────────────────────   │ │
│  │   Supply Variability    │ SHARED       │ Storage buffer      │ │
│  │   Demand Variability    │ SHARED       │ Contract clause     │ │
│  │   Lifetime Mismatch     │ SHARED       │ Redeployable        │ │
│  │   Performance Risk      │ SHARED       │ Insurance           │ │
│  │   Regulatory Change     │ DC OPERATOR  │ Contract clause     │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ AUDIT TRAIL ────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   v1  │  2026-01-20  │  Initial record  │  Entropy           │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   Entropy determines what is defensible,                     │ │
│  │   not what must be built.                                    │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Design Notes:
- **Verdict is hero** — Largest element, immediately visible
- **Scenarios as cards** — Visual comparison, not a table
- **Status colors only** — Green/amber/red reserved for compliance
- **Risk table is prominent** — This is what contracts reference
- **Audit trail visible** — Accountability is core

---

## Screen 4: Finalized Record

```
┌────────────────────────────────────────────────────────────────────┐
│  ENTROPY                                        [Download PDF]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │ ░                                                           ░ │ │
│  │ ░   🔒 FINALIZED                                            ░ │ │
│  │ ░   This record has been locked and cannot be modified.     ░ │ │
│  │ ░                                                           ░ │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │                                                              │ │
│  │   HEAT REUSE DECISION & COMPLIANCE RECORD                    │ │
│  │   ════════════════════════════════════════                   │ │
│  │                                                              │ │
│  │   ...rest of record content...                               │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Design Notes:
- **Finalize button removed** — Only download remains
- **Lock banner** — Black, prominent, immutable feel
- **No edit actions** — Read-only enforced visually

---

## Screen 5: Records Archive

```
┌────────────────────────────────────────────────────────────────────┐
│  ENTROPY                                    [+ New Record]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   Decision Records                                           │ │
│  │   ═════════════════                                          │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │   ┌────────────────────────────────────────────────────────┐│ │
│  │   │ ENTROPY-REC-2026-001                                   ││ │
│  │   │ Frankfurt Hyperscale DC                   🔒 FINALIZED ││ │
│  │   │                                                        ││ │
│  │   │ ✅ COMPLIANT via Scenario C          2026-01-20       ││ │
│  │   └────────────────────────────────────────────────────────┘│ │
│  │                                                              │ │
│  │   ┌────────────────────────────────────────────────────────┐│ │
│  │   │ ENTROPY-REC-2026-002                                   ││ │
│  │   │ Amsterdam Edge DC                              DRAFT   ││ │
│  │   │                                                        ││ │
│  │   │ ⚠️ CONDITIONAL via Scenario B        2026-01-19       ││ │
│  │   └────────────────────────────────────────────────────────┘│ │
│  │                                                              │ │
│  │   ┌────────────────────────────────────────────────────────┐│ │
│  │   │ ENTROPY-REC-2026-003                                   ││ │
│  │   │ Berlin Colocation                              DRAFT   ││ │
│  │   │                                                        ││ │
│  │   │ ❌ NON-COMPLIANT                     2026-01-18       ││ │
│  │   └────────────────────────────────────────────────────────┘│ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Design Notes:
- **List not grid** — Documents, not apps
- **Status prominent** — Compliance outcome visible immediately
- **Lock badge** — Finalized records clearly marked
- **Minimal metadata** — Record ID, name, status, date

---

## Next Document
See [components.md](./components.md) for component specifications.
