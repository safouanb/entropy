# CTO Cheat Sheet - Quick Reference

## One-Page Overview

### What Is This?
District heating optimization platform: Connect data center waste heat → urban heat networks
Calculate ROI, NPV, IRR, carbon reduction for waste heat recovery projects

### Tech Stack at a Glance
```
Frontend:  React 18 + TypeScript + Vite + Tailwind + MapLibre GL
Backend:   Go 1.23 + ConnectRPC + SQLite + sqlc
API:       Protocol Buffers (gRPC-Web)
Deploy:    Docker + (not yet deployed to production)
```

### Architecture Pattern
Clean Architecture: Router → Service → Engine → Database
100% type-safe: Go + TypeScript + Protobuf

---

## Key Files to Know

### Backend (Go)
```
backend/
├── cmd/server/main.go                      # START HERE - Entry point
├── internal/
│   ├── service/prediction.go              # Core business logic
│   ├── engine/financial.go                # NPV, IRR calculations
│   ├── engine/geospatial.go               # Distance calculations
│   ├── router/prediction_handlers.go      # API handlers
│   └── database/schema/001_*.sql          # Database schema
└── Makefile                                # Build commands
```

### Frontend (React)
```
frontend/
├── src/
│   ├── App.tsx                            # START HERE - React app
│   ├── services/api.ts                    # API client
│   ├── components/
│   │   ├── SavingsPredictionDashboard.tsx # Main prediction UI
│   │   └── MapComponent.tsx               # Map visualization
│   └── pages/                             # Route pages
└── package.json                           # Dependencies
```

### Shared
```
shared/common/proto/pyrecycleheat/v1/
├── prediction_service.proto               # Prediction API contract
└── district_heating_service.proto         # District heating API contract
```

---

## Common Commands

### Development
```bash
# Backend
cd backend
make run              # Start server on :8080
make test             # Run tests
make build            # Build production binary

# Frontend
cd frontend
npm run dev           # Start dev server on :5173
npm run build         # Build for production
npm run lint          # Run linter

# Database
cd backend
make migrate-up       # Apply migrations
make migrate-down     # Rollback migrations
sqlite3 district_heating.db  # Open database CLI

# Code Generation
make sqlc-gen         # Generate SQL code from queries
make buf-gen          # Generate Protobuf code
```

### Testing
```bash
# Backend tests
cd backend
make test
go test -v ./...
go test -cover ./...

# Frontend tests (NOT YET IMPLEMENTED)
cd frontend
npm test              # Will need to set up first

# API testing
curl http://localhost:8080/health
curl http://localhost:8080/v1/data-centers
```

---

## Database Quick Reference

### 12 Tables

**District Heating:**
- `heat_centers` - Heat generation facilities
- `demand_sites` - Heat consumers
- `routes` - Pipeline connections
- `*_metrics` - Time-series operational data

**Prediction/Analytics:**
- `data_centers` - Data center facilities
- `heat_sinks` - Heat consumers (prediction targets)
- `carbon_credits` - Carbon offset projects
- `prediction_results` - Saved analysis results

### Key Queries
```sql
-- List all data centers
SELECT * FROM data_centers;

-- Find nearby heat sinks (5km radius)
SELECT * FROM heat_sinks WHERE (
  6371 * acos(cos(radians(?)) * cos(radians(location_lat)) *
  cos(radians(location_lng) - radians(?)) +
  sin(radians(?)) * sin(radians(location_lat)))
) <= 5;

-- View prediction results
SELECT * FROM prediction_results ORDER BY created_at DESC LIMIT 10;
```

---

## API Endpoints (Quick)

Base URL: `http://localhost:8080`

### Health & Monitoring
```
GET  /health          # Health check
GET  /metrics         # Prometheus metrics (port 9090)
```

### Data Centers
```
GET    /v1/data-centers           # List all
GET    /v1/data-centers/:id       # Get one
POST   /v1/data-centers           # Create
PUT    /v1/data-centers/:id       # Update
DELETE /v1/data-centers/:id       # Delete
```

### Predictions
```
POST /v1/predictions/calculate    # Run prediction
GET  /v1/predictions/:id          # Get result
```

### District Heating
```
GET  /v1/heat-centers             # List heat centers
GET  /v1/demand-sites             # List demand sites
GET  /v1/routes                   # List routes
```

---

## Key Calculations

### NPV (Net Present Value)
```
NPV = Σ [(Annual_Revenue - OPEX) / (1 + discount_rate)^year] - CAPEX

where:
  CAPEX = Pipeline_Cost_Per_Km × Distance
  Annual_Revenue = Heat_MW × Hours_Per_Year × Heat_Price_MWh
  OPEX = Maintenance + Pumping_Costs
```

### IRR (Internal Rate of Return)
```
IRR = Discount rate where NPV = 0
(Calculated via binary search in engine/financial.go)
```

### Carbon Reduction
```
CO2_Reduction = Heat_Delivered_MWh × Natural_Gas_Carbon_Intensity × Displacement_Factor
```

### Heat Recovery
```
Waste_Heat_MW = IT_Load_MW × (PUE - 1)
Recoverable_Heat = Waste_Heat_MW × Capture_Efficiency
```

---

## Critical Gaps (Must Fix)

1. **Authentication** ⚠️ CRITICAL - No user auth system
2. **Testing** ⚠️ CRITICAL - 15% backend, 0% frontend coverage
3. **CI/CD** - No automated testing/deployment
4. **Monitoring** - No dashboards, no alerts
5. **Backups** - No automated database backups

See [09-technical-debt.md](09-technical-debt.md) for details

---

## Environment Variables

### Backend
```bash
# Database
DATABASE_DSN="district_heating.db?_foreign_keys=1"
DATABASE_MAX_OPEN_CONNS=25
DATABASE_MAX_IDLE_CONNS=10

# Server
SERVER_ADDRESS=":8080"
SERVER_READ_TIMEOUT="15s"
SERVER_WRITE_TIMEOUT="15s"

# Observability
ENABLE_METRICS=true
METRICS_ADDR=":9090"
ENABLE_OTEL=false
SERVICE_NAME="pyrecycleheat"
```

### Frontend
```bash
# API endpoint
VITE_API_BASE_URL=http://localhost:8080

# Google Maps (optional)
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -ti:8080 | xargs kill -9

# Verify Go installation
go version  # Should be 1.23+

# Check database
ls -lh district_heating.db
sqlite3 district_heating.db ".tables"

# Rebuild
make clean
make build
```

### Frontend won't start
```bash
# Clear and reinstall
rm -rf node_modules
npm install

# Check API connection
curl http://localhost:8080/health

# Verify .env file
cat .env
# Should have: VITE_API_BASE_URL=http://localhost:8080
```

### Database issues
```bash
# Reset database
cd backend
make migrate-down
make migrate-up

# Check foreign keys are enabled
sqlite3 district_heating.db "PRAGMA foreign_keys;"
# Should return: 1
```

### Build errors
```bash
# Backend
cd backend
go mod tidy
go mod download

# Frontend
cd frontend
npm ci  # Clean install
```

---

## Performance Benchmarks

### Backend
- Cold start: <100ms
- Average API response: 5-50ms
- NPV calculation: <1ms
- 10 heat sink prediction: <10ms
- Concurrent connections: 10,000+

### Frontend
- Bundle size: ~500KB (150KB gzipped)
- First contentful paint: <1.5s
- Time to interactive: <3s

### Database (SQLite)
- Read queries: <1ms
- Write queries: <5ms
- Max writes/sec: ~1,000

---

## Decision Quick Reference

### When to migrate to PostgreSQL?
- Concurrent writes >100/sec
- Database size >2GB
- Need multi-server deployment
- Require replication

### When to add caching (Redis)?
- Same queries repeated frequently
- User count >500
- Response time >100ms

### When to scale horizontally?
- CPU usage >80% sustained
- Single server can't handle load
- Need high availability

---

## Useful Links

**Documentation:**
- Project docs: `../docs/`
- Go package docs: https://pkg.go.dev
- React docs: https://react.dev
- ConnectRPC: https://connectrpc.com

**Tools:**
- SQLite viewer: https://sqlitebrowser.org/
- Protobuf editor: https://buf.build/studio
- API testing: Postman or Insomnia

**Community:**
- Go: https://go.dev/help
- React: https://react.dev/community
- TypeScript: https://www.typescriptlang.org/community

---

## Emergency Contacts (Update These!)

**Technical Issues:**
- Primary Engineer: [NAME] - [EMAIL]
- Backend Expert: [NAME] - [EMAIL]
- Frontend Expert: [NAME] - [EMAIL]

**Business:**
- Product Owner: [NAME] - [EMAIL]
- CEO/Founder: [NAME] - [EMAIL]

**Infrastructure:**
- DevOps: [NAME] - [EMAIL]
- Hosting Support: [PROVIDER] - [URL]

---

## Version History

- v1.0 (2025-12-05): Initial CTO onboarding package created
- [Future updates here]

---

**Keep this updated!** This should be your go-to reference.

**Print this page** and keep it on your desk for the first month.
