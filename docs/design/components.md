# Entropy Frontend — Components

---

## Core Components

### 1. VerdictBanner

The hero element of every record. Communicates the definitive outcome.

```
┌─────────────────────────────────────────────────────────────┐
│ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ │
│                                                             │
│   VERDICT: COMPLIANT                                        │
│   via Scenario C: Reuse + Mitigation                        │
│                                                             │
│   Confidence: MEDIUM                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Props:
  verdict: "COMPLIANT" | "CONDITIONAL" | "NON_COMPLIANT"
  scenario: string
  confidence: "HIGH" | "MEDIUM" | "LOW"

Colors:
  COMPLIANT     → Emerald background, white text
  CONDITIONAL   → Amber background, black text  
  NON_COMPLIANT → Red background, white text
```

---

### 2. ScenarioCard

Displays one scenario with compliance status and key metrics.

```
┌──────────────────────────────────────┐
│  A: NO REUSE                    ❌   │
│                                      │
│  NON-COMPLIANT                       │
│                                      │
│  ────────────────────────────────    │
│                                      │
│  Regulatory exposure:                │
│  Non-compliance with EnEfG §16       │
│                                      │
│  CAPEX:      €0                      │
│  Payback:    N/A                     │
│  CO₂:        -2,100 t/yr             │
│                                      │
└──────────────────────────────────────┘

Props:
  scenario: "NO_REUSE" | "DIRECT_REUSE" | "REUSE_WITH_MITIGATION"
  status: "COMPLIANT" | "CONDITIONAL" | "NON_COMPLIANT"
  failureMode: string
  metrics: { capex, payback, irr, co2 }

Variants:
  - Collapsed (list view)
  - Expanded (detail view)
  
Border:
  Status color on left edge
```

---

### 3. RiskTable

Explicit risk allocation for contracts and financing.

```
┌─────────────────────────────────────────────────────────────┐
│  RISK & RESPONSIBILITY ALLOCATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Category              │ Party      │ Mitigation            │
│  ─────────────────────────────────────────────────────────  │
│  Supply Variability    │ SHARED     │ Storage buffer        │
│  Demand Variability    │ SHARED     │ Contract clause       │
│  Lifetime Mismatch     │ SHARED     │ Redeployable          │
│  Performance Risk      │ SHARED     │ Insurance             │
│  Regulatory Change     │ DC_OPERATOR│ Contract clause       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Props:
  allocations: RiskAllocation[]

Design:
  - Header row dark background
  - Alternating row colors subtle
  - Party names in monospace
```

---

### 4. AuditTrail

Version history with change tracking.

```
┌─────────────────────────────────────────────────────────────┐
│  AUDIT TRAIL                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  v1  │  2026-01-20  │  Initial record           │  Entropy │
│  v2  │  2026-01-21  │  Updated stakeholders     │  S. Ben  │
│  v3  │  2026-01-22  │  Finalized               │  System  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Props:
  entries: AuditEntry[]

Design:
  - Monospace for versions
  - Compressed rows
  - Link to previous versions (if unfinalzied)
```

---

### 5. RecordHeader

Identity stripe at top of every record.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HEAT REUSE DECISION & COMPLIANCE RECORD                    │
│  ════════════════════════════════════════                   │
│                                                             │
│  ENTROPY-REC-2026-001              Version 1    🔒          │
│  Frankfurt Hyperscale DC           2026-01-20               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Props:
  recordId: string
  projectName: string
  version: number
  date: Date
  finalized: boolean

Design:
  - Title in large serif or heavy sans
  - Record ID in monospace
  - Lock icon if finalized
```

---

### 6. FinalizeButton

The accountability action.

```
┌────────────────────────┐
│   Finalize Record      │
└────────────────────────┘

States:
  Default   → Black background, white text
  Hover     → Slight scale up
  Disabled  → Gray, cursor-not-allowed
  Confirmed → Locks with animation

Behavior:
  - Requires confirmation dialog
  - "This action cannot be undone. The record will be locked permanently."
  - On confirm: locks record, shows success banner
```

---

### 7. DownloadPDFButton

Export the official record.

```
┌────────────────────────┐
│  ↓  Download PDF       │
└────────────────────────┘

States:
  Default   → White background, black border
  Loading   → "Preparing..."
  Ready     → Triggers download
```

---

### 8. RecordCard (for Archive)

Compact representation in list.

```
┌────────────────────────────────────────────────────────────┐
│ ENTROPY-REC-2026-001                                       │
│ Frankfurt Hyperscale DC                       🔒 FINALIZED │
│                                                            │
│ ✅ COMPLIANT via Scenario C              2026-01-20        │
└────────────────────────────────────────────────────────────┘

Props:
  id: string
  name: string
  status: string
  verdict: string
  date: Date
  finalized: boolean

Behavior:
  - Click → Navigate to full record
  - Hover → Subtle elevation
```

---

## Interaction Patterns

### 1. Progressive Disclosure
- Intake form sections collapse/expand
- Details hidden until needed

### 2. Confirmation for Destructive Actions
- Finalize requires explicit "I understand" checkbox
- No quick-undo for locked records

### 3. Status as Primary Signal
- Color used only for compliance status
- Everything else is grayscale

### 4. Monospace for Machine-Readable
- Record IDs, versions, dates in mono
- Distinguishes from narrative text

---

## Next Document
See [implementation.md](./implementation.md) for technical implementation plan.
