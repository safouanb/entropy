# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          React Frontend (TypeScript)               │    │
│  │  ┌──────────┐  ┌─────────┐  ┌────────────────┐   │    │
│  │  │  Pages   │  │ Components │  │ MapLibre GL  │   │    │
│  │  └──────────┘  └─────────┘  └────────────────┘   │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │      TanStack Query (Client Cache)       │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │   ConnectRPC Client (Protobuf)           │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/2 (gRPC-Web)
                            │ Protocol Buffers
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Go Backend Server                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │              HTTP/2 Server (h2c)                   │    │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │ CORS Filter  │→ │  ConnectRPC Handlers     │   │    │
│  │  └──────────────┘  └──────────────────────────┘   │    │
│  └──────────────────────────┬─────────────────────────────  │
│                             ↓                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Router Layer (internal/router/)           │   │
│  │  - District Heating Handlers                        │   │
│  │  - Prediction Handlers                              │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Service Layer (internal/service/)           │   │
│  │  - Business Logic                                   │   │
│  │  - Validation                                       │   │
│  │  - Orchestration                                    │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Calculation Engine (internal/engine/)         │   │
│  │  - Financial (NPV, IRR, Payback)                   │   │
│  │  - Energy (IT Load, PUE, Heat Recovery)            │   │
│  │  - Carbon (CO2 Reduction)                          │   │
│  │  - Geospatial (Haversine Distance)                 │   │
│  │  - Sensitivity Analysis                             │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Database Layer (internal/database/)           │   │
│  │  - sqlc Generated Queries (Type-safe)              │   │
│  │  - Database Queries (*.sql files)                  │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Observability (internal/observability/)            │   │
│  │  - Structured Logging (slog)                        │   │
│  │  - Prometheus Metrics                               │   │
│  │  - OpenTelemetry Tracing                            │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                           │
│  - heat_centers, demand_sites, routes                       │
│  - data_centers, heat_sinks, carbon_credits                 │
│  - prediction_results, prediction_scenarios                 │
│  - Metrics tables (time-series data)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow: Complete Example

### Example: Calculate Heat Recovery Prediction

**User Action:** Enter data center details and click "Calculate Savings"

**1. Frontend Initiation**
```typescript
// File: frontend/src/components/SavingsPredictionDashboard.tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['prediction', dataCenterId],
  queryFn: async () => {
    return api.predictions.calculateSavings(dataCenterData)
  }
})
```

**2. API Client Call**
```typescript
// File: frontend/src/services/api.ts
export const api = {
  predictions: {
    calculateSavings: async (data: DataCenterInput) => {
      const response = await fetch(`${BASE_URL}/predictions/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return response.json()
    }
  }
}
```

**3. HTTP/2 Transport**
- Request serialized as Protocol Buffer message
- Sent over HTTP/2 connection (persistent)
- CORS headers validated
- gRPC-Web framing applied

**4. Backend Router**
```go
// File: backend/internal/router/prediction_handlers.go
func (h *PredictionHandlers) CalculateSavings(
  ctx context.Context,
  req *connect.Request[v1.CalculateSavingsRequest],
) (*connect.Response[v1.PredictionResult], error) {
  // Log request
  slog.Info("calculate savings", "data_center_id", req.Msg.DataCenterId)

  // Call service layer
  result, err := h.predictionService.CalculateSavings(ctx, req.Msg)
  if err != nil {
    return nil, connect.NewError(connect.CodeInternal, err)
  }

  return connect.NewResponse(result), nil
}
```

**5. Service Layer - Orchestration**
```go
// File: backend/internal/service/prediction.go
func (s *PredictionService) CalculateSavings(
  ctx context.Context,
  req *v1.CalculateSavingsRequest,
) (*v1.PredictionResult, error) {
  // 1. Fetch data center from database
  dc, err := s.queries.GetDataCenter(ctx, req.DataCenterId)
  if err != nil {
    return nil, fmt.Errorf("get data center: %w", err)
  }

  // 2. Find nearby heat sinks
  heatSinks, err := s.queries.FindNearbyHeatSinks(ctx, database.FindNearbyHeatSinksParams{
    Lat: dc.LocationLat,
    Lng: dc.LocationLng,
    RadiusKm: 5.0,
  })
  if err != nil {
    return nil, fmt.Errorf("find heat sinks: %w", err)
  }

  // 3. Calculate energy metrics
  energyMetrics := engine.CalculateEnergyMetrics(dc.ItLoadMw, dc.Pue, dc.Utilization)

  // 4. For each heat sink, calculate financial metrics
  var predictions []*v1.HeatSinkPrediction
  for _, sink := range heatSinks {
    // Calculate distance
    distance := engine.HaversineDistance(
      dc.LocationLat, dc.LocationLng,
      sink.LocationLat, sink.LocationLng,
    )

    // Calculate CAPEX (pipeline cost)
    capex := engine.CalculateCAPEX(distance, req.PipelineCostPerKm)

    // Calculate annual revenue
    annualRevenue := engine.CalculateAnnualRevenue(
      energyMetrics.RecoverableHeatMw,
      req.HeatPriceMwh,
      8760, // hours per year
    )

    // Calculate NPV
    npv := engine.CalculateNPV(
      capex,
      annualRevenue,
      req.OperatingCostPerYear,
      req.DiscountRate,
      req.ProjectLifetimeYears,
    )

    // Calculate IRR
    irr := engine.CalculateIRR(capex, annualRevenue, req.OperatingCostPerYear)

    // Calculate carbon reduction
    carbonReduction := engine.CalculateCarbonReduction(
      energyMetrics.RecoverableHeatMw,
      req.CarbonIntensity,
    )

    predictions = append(predictions, &v1.HeatSinkPrediction{
      HeatSinkId: sink.ID,
      DistanceKm: distance,
      Npv: npv,
      Irr: irr,
      CarbonReductionKgYear: carbonReduction,
      // ... more fields
    })
  }

  // 5. Save results to database
  resultID, err := s.queries.SavePredictionResult(ctx, ...)
  if err != nil {
    return nil, fmt.Errorf("save result: %w", err)
  }

  return &v1.PredictionResult{
    Id: resultID,
    Predictions: predictions,
  }, nil
}
```

**6. Engine Layer - Calculations**
```go
// File: backend/internal/engine/financial.go
func CalculateNPV(
  capex decimal.Decimal,
  annualRevenue decimal.Decimal,
  annualOpex decimal.Decimal,
  discountRate float64,
  years int,
) decimal.Decimal {
  npv := capex.Neg() // Start with negative CAPEX

  for year := 1; year <= years; year++ {
    cashFlow := annualRevenue.Sub(annualOpex)
    discountFactor := math.Pow(1 + discountRate, float64(year))
    presentValue := cashFlow.Div(decimal.NewFromFloat(discountFactor))
    npv = npv.Add(presentValue)
  }

  return npv
}
```

**7. Database Layer**
```go
// File: backend/internal/database/queries/prediction.sql (SQL)
-- name: FindNearbyHeatSinks :many
SELECT * FROM heat_sinks
WHERE (
  6371 * acos(
    cos(radians(@lat)) * cos(radians(location_lat)) *
    cos(radians(location_lng) - radians(@lng)) +
    sin(radians(@lat)) * sin(radians(location_lat))
  )
) <= @radius_km
ORDER BY distance ASC
LIMIT 10;

// File: backend/internal/database/prediction.sql.go (Generated by sqlc)
func (q *Queries) FindNearbyHeatSinks(
  ctx context.Context,
  arg FindNearbyHeatSinksParams,
) ([]HeatSink, error) {
  rows, err := q.db.QueryContext(ctx, findNearbyHeatSinks, arg.Lat, arg.Lng, arg.RadiusKm)
  // ... type-safe row scanning
}
```

**8. Response Path**
- Database returns rows
- sqlc converts to Go structs (type-safe)
- Engine performs calculations
- Service layer assembles response
- Router converts to Protobuf message
- HTTP/2 sends response to frontend
- Frontend updates UI

**9. Frontend Updates**
```typescript
// TanStack Query automatically:
// - Caches the result (queryKey)
// - Updates loading state
// - Handles errors
// - Triggers re-render

// Component renders results
{data?.predictions.map(pred => (
  <PredictionCard
    key={pred.heatSinkId}
    npv={pred.npv}
    irr={pred.irr}
    carbonReduction={pred.carbonReductionKgYear}
  />
))}
```

**Total Time:** ~10-50ms (depending on number of heat sinks)

---

## Backend Architecture Layers

### 1. Entry Point Layer

**File:** `backend/cmd/server/main.go`

**Responsibilities:**
- Load configuration (Viper + environment)
- Initialize logger (slog with tint for dev, JSON for prod)
- Setup observability (OpenTelemetry, Prometheus)
- Open database connection (SQLite with pooling)
- Run migrations (goose)
- Initialize services
- Start HTTP/2 server
- Handle graceful shutdown

**Key Configuration:**
```go
type Config struct {
  Database struct {
    DSN             string        // "district_heating.db?_foreign_keys=1"
    MaxOpenConns    int           // 25
    MaxIdleConns    int           // 10
    ConnMaxLifetime time.Duration // 5m
  }
  Server struct {
    Address      string        // ":8080"
    ReadTimeout  time.Duration // 15s
    WriteTimeout time.Duration // 15s
    IdleTimeout  time.Duration // 60s
  }
  Observability struct {
    EnableMetrics   bool   // true
    MetricsAddr     string // ":9090"
    EnableOTEL      bool   // false (production: true)
    ServiceName     string // "pyrecycleheat"
    ServiceVersion  string // "0.1.0"
  }
}
```

### 2. Router Layer

**Location:** `backend/internal/router/`

**Files:**
- `connectrpc.go` - ConnectRPC service registration
- `prediction_handlers.go` - Prediction API handlers
- `district_heating_handlers.go` - District heating API handlers

**Responsibilities:**
- HTTP routing
- Request validation (Protobuf schemas)
- Error handling and HTTP status codes
- Logging request/response
- Metrics instrumentation

**Handler Pattern:**
```go
type PredictionHandlers struct {
  predictionService *service.PredictionService
  validator         *validator.Validate
}

func (h *PredictionHandlers) CreateDataCenter(
  ctx context.Context,
  req *connect.Request[v1.CreateDataCenterRequest],
) (*connect.Response[v1.DataCenter], error) {
  // 1. Validate request
  if err := h.validator.Struct(req.Msg); err != nil {
    return nil, connect.NewError(connect.CodeInvalidArgument, err)
  }

  // 2. Call service
  dc, err := h.predictionService.CreateDataCenter(ctx, req.Msg)
  if err != nil {
    return nil, handleServiceError(err)
  }

  // 3. Return response
  return connect.NewResponse(dc), nil
}
```

### 3. Service Layer

**Location:** `backend/internal/service/`

**Files:**
- `prediction.go` - Data center, heat sink, prediction logic
- `district_heating.go` - Heat center, demand site, route logic

**Responsibilities:**
- Business logic orchestration
- Transaction management
- Calling calculation engine
- Coordinating multiple database operations
- Complex validation rules

**Service Pattern:**
```go
type PredictionService struct {
  queries   *database.Queries
  validator *validator.Validate
}

func (s *PredictionService) CalculateSavings(
  ctx context.Context,
  req *CalculateSavingsRequest,
) (*PredictionResult, error) {
  // 1. Fetch dependencies from database
  // 2. Validate business rules
  // 3. Call calculation engine
  // 4. Save results
  // 5. Return response
}
```

### 4. Engine Layer (Calculation Core)

**Location:** `backend/internal/engine/`

**Files:**
- `energy.go` - Energy consumption, heat recovery
- `financial.go` - NPV, IRR, payback period
- `carbon.go` - CO2 reduction calculations
- `geospatial.go` - Haversine distance, proximity scoring
- `heat_recovery.go` - Waste heat capture modeling
- `sensitivity.go` - Scenario analysis

**Characteristics:**
- Pure functions (no side effects)
- Unit tested
- Uses `decimal.Decimal` for precision
- Documented with formulas

**Example:**
```go
// CalculateIRR calculates Internal Rate of Return
// IRR is the discount rate that makes NPV = 0
func CalculateIRR(
  capex decimal.Decimal,
  annualRevenue decimal.Decimal,
  annualOpex decimal.Decimal,
  years int,
) float64 {
  // Binary search for IRR between 0% and 100%
  low, high := 0.0, 1.0

  for i := 0; i < 100; i++ { // Max 100 iterations
    mid := (low + high) / 2.0
    npv := CalculateNPV(capex, annualRevenue, annualOpex, mid, years)

    if npv.GreaterThan(decimal.Zero) {
      low = mid
    } else {
      high = mid
    }

    if math.Abs(npv.InexactFloat64()) < 0.01 {
      return mid
    }
  }

  return (low + high) / 2.0
}
```

### 5. Database Layer

**Location:** `backend/internal/database/`

**Structure:**
```
database/
├── schema/
│   ├── 001_initial_schema.up.sql    # Create tables
│   └── 001_initial_schema.down.sql  # Drop tables
├── queries/
│   ├── district_heating.sql         # SQL queries
│   ├── prediction.sql
│   └── analytics.sql
├── district_heating.sql.go          # Generated by sqlc
├── prediction.sql.go
└── models.go                        # Generated structs
```

**sqlc Workflow:**
1. Write SQL queries in `queries/*.sql`
2. Annotate with `-- name: QueryName :one|:many|:exec`
3. Run `make sqlc-gen`
4. sqlc generates type-safe Go code

**Example Query:**
```sql
-- name: GetDataCenter :one
SELECT * FROM data_centers WHERE id = ?;

-- name: ListDataCenters :many
SELECT * FROM data_centers ORDER BY created_at DESC;

-- name: CreateDataCenter :one
INSERT INTO data_centers (
  name, location_lat, location_lng, it_load_mw, pue
) VALUES (?, ?, ?, ?, ?)
RETURNING *;
```

**Generated Code (type-safe):**
```go
func (q *Queries) GetDataCenter(ctx context.Context, id int64) (DataCenter, error)
func (q *Queries) ListDataCenters(ctx context.Context) ([]DataCenter, error)
func (q *Queries) CreateDataCenter(ctx context.Context, arg CreateDataCenterParams) (DataCenter, error)
```

### 6. Observability Layer

**Location:** `backend/internal/observability/`

**Components:**

**Logging:**
```go
slog.Info("processing prediction",
  "data_center_id", dcID,
  "heat_sinks_found", len(sinks),
  "duration_ms", duration.Milliseconds(),
)
```

**Metrics:**
```go
var (
  predictionsTotal = promauto.NewCounter(prometheus.CounterOpts{
    Name: "predictions_total",
    Help: "Total number of predictions calculated",
  })

  predictionDuration = promauto.NewHistogram(prometheus.HistogramOpts{
    Name: "prediction_duration_seconds",
    Help: "Prediction calculation duration",
    Buckets: prometheus.DefBuckets,
  })
)
```

**Tracing:**
```go
ctx, span := tracer.Start(ctx, "CalculateSavings")
defer span.End()

span.SetAttributes(
  attribute.Int64("data_center_id", dcID),
  attribute.Int("heat_sinks_count", len(sinks)),
)
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── Router
│   ├── Index Page (/)
│   │   ├── Header
│   │   ├── SavingsPredictionDashboard
│   │   │   ├── DataCenterInputForm
│   │   │   ├── CarbonCreditForm
│   │   │   └── SavingsPredictionResults
│   │   │       ├── FinancialChart (Recharts)
│   │   │       └── CarbonImpactCard
│   │   └── MapComponent
│   │       ├── MapLibre GL
│   │       ├── SearchBar
│   │       └── StatsSidebar
│   │
│   ├── Map Page (/map)
│   │   └── MapComponent (full-screen)
│   │
│   └── About Page (/about)
│
└── Providers
    ├── QueryClientProvider (TanStack Query)
    ├── TooltipProvider (Radix UI)
    └── Toaster (Sonner)
```

### State Management Strategy

**Server State:** TanStack Query
- API data (data centers, heat sinks, predictions)
- Automatic caching (query keys)
- Background refetching
- Optimistic updates

**Form State:** React Hook Form + Zod
- Form inputs and validation
- Error handling
- Submission state

**UI State:** React useState/useReducer
- Modal open/closed
- Selected map markers
- Filters and sorting
- Active tab

**URL State:** React Router
- Current page
- Query parameters (filters)

**No Global State Library Needed** - TanStack Query handles most state management

### API Integration Pattern

**File:** `frontend/src/services/api.ts`

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = {
  heatCenters: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/v1/heat-centers`)
      if (!res.ok) throw new ApiError(res.status, await res.text())
      return res.json()
    },
    get: async (id: number) => { /* ... */ },
    create: async (data: CreateHeatCenterRequest) => { /* ... */ },
    update: async (id: number, data: UpdateHeatCenterRequest) => { /* ... */ },
    delete: async (id: number) => { /* ... */ },
  },

  predictions: {
    calculate: async (data: CalculateSavingsRequest) => { /* ... */ },
    list: async () => { /* ... */ },
  },

  // ... more services
}
```

**Usage in Component:**
```typescript
function DataCenterList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data-centers'],
    queryFn: api.predictions.listDataCenters,
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorAlert error={error} />

  return <DataCenterGrid data={data} />
}
```

---

## Database Schema

### Tables Overview

**District Heating Network:**
1. `heat_centers` - Heat generation facilities (12 fields)
2. `demand_sites` - Heat consumers (14 fields)
3. `routes` - Pipeline connections (19 fields)
4. `heat_center_metrics` - Time-series operational data
5. `demand_site_metrics` - Time-series consumption data
6. `route_metrics` - Time-series flow data
7. `system_config` - Key-value configuration

**Prediction & Analytics:**
8. `data_centers` - Data center facilities (15 fields)
9. `carbon_credits` - Carbon offset projects (10 fields)
10. `heat_sinks` - Heat consumers (12 fields)
11. `prediction_results` - Saved analysis results (18 fields)
12. `prediction_scenarios` - Reusable scenario templates (12 fields)

### Key Relationships

```
heat_centers (1) ←→ (*) routes (*) ←→ (1) demand_sites
    │                                          │
    └─ heat_center_metrics              demand_site_metrics

data_centers (1) → (*) prediction_results (*) ← (1) heat_sinks
```

### Constraints & Validation

**Foreign Keys:**
- CASCADE on delete (delete route when heat center deleted)
- Enforced at database level (`PRAGMA foreign_keys = ON`)

**Check Constraints:**
```sql
CHECK (location_lat >= -90 AND location_lat <= 90)
CHECK (location_lng >= -180 AND location_lng <= 180)
CHECK (pue >= 1.0 AND pue <= 3.0)
CHECK (efficiency_percent >= 0 AND efficiency_percent <= 100)
```

**Unique Constraints:**
```sql
UNIQUE (heat_center_id, demand_site_id)  -- Prevent duplicate routes
```

---

## Deployment Architecture

### Local Development

```
┌─────────────────┐
│  Developer      │
└────────┬────────┘
         │
         ├─ Terminal 1: make run          (Backend :8080)
         └─ Terminal 2: npm run dev       (Frontend :5173)
                   │
                   ↓
         ┌─────────────────┐
         │  SQLite File    │
         │  district_      │
         │  heating.db     │
         └─────────────────┘
```

### Production (Docker)

```
┌──────────────────────────────────┐
│         Docker Container         │
│  ┌────────────────────────────┐ │
│  │   Go Binary                │ │
│  │   Port: 8080               │ │
│  └────────┬───────────────────┘ │
│           │                      │
│  ┌────────▼───────────────────┐ │
│  │   SQLite Database          │ │
│  │   (Volume Mount)           │ │
│  └────────────────────────────┘ │
│                                  │
│  Health: /health                 │
│  Metrics: /metrics (9090)        │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│   Prometheus (Metrics)           │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│   Grafana (Dashboards)           │
└──────────────────────────────────┘
```

---

**Next Document:** [05-database-guide.md](05-database-guide.md) - Deep dive into the data model
