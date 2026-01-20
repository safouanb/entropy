# Entropy Frontend — Design Vision

> **The interface for the decision authority layer.**

---

## Design Philosophy

Entropy is not a dashboard. It's not an analytics tool. It's the **system of record** for infrastructure decisions.

The UI must communicate:
1. **Authority** — This is definitive, not exploratory
2. **Clarity** — Every element has purpose, no decoration
3. **Trust** — Institutional-grade, regulator-ready
4. **Finality** — Decisions are locked, auditable, permanent

### Anti-Patterns to Avoid
- ❌ Colorful dashboards with 20 charts
- ❌ SaaS-style playful illustrations
- ❌ Feature-heavy navigation with 50 options
- ❌ "Get Started Free" startup vibes

### Patterns to Embrace
- ✅ Legal document precision
- ✅ Bloomberg terminal confidence
- ✅ Audit trail visibility
- ✅ Sparse, deliberate color use

---

## Color System

```
Primary:    #0A0A0A (Almost black — authority)
Secondary:  #18181B (Zinc 900 — depth)
Accent:     #3B82F6 (Blue 500 — action, sparse)
Surface:    #FAFAFA (Near white — clean)
Border:     #E4E4E7 (Zinc 200 — structure)

Status:
  Compliant:     #059669 (Emerald 600)
  Conditional:   #D97706 (Amber 600)  
  Non-Compliant: #DC2626 (Red 600)
  Finalized:     #0A0A0A (Black badge)
```

---

## Typography

```
Headers:    Inter, 600-700 weight, tight tracking
Body:       Inter, 400-500 weight
Monospace:  JetBrains Mono (for record IDs, versions)
```

Size scale:
- Hero: 48px
- H1: 32px
- H2: 24px
- H3: 18px
- Body: 14px
- Caption: 12px
- Micro: 10px

---

## Core Screens

### 1. Landing / Home
### 2. Assessment Intake
### 3. Decision Record View
### 4. Record Archive
### 5. PDF Export Preview

---

## Next Document
See [wireframes.md](./wireframes.md) for detailed screen layouts.
