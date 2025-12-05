# Quick Start Guide

## Prerequisites

### Required

**Backend:**
- Go 1.23 or later ([Download](https://go.dev/dl/))
- Make (usually pre-installed on macOS/Linux)
- GCC compiler (for SQLite CGO)
  - macOS: `xcode-select --install`
  - Linux: `sudo apt-get install build-essential`
  - Windows: Install MinGW

**Frontend:**
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or Bun package manager

**Verification:**
```bash
go version    # Should show go1.23 or later
make --version
gcc --version
node --version
npm --version
```

### Optional

- Docker Desktop (for containerized deployment)
- Buf CLI (for protobuf code generation)
- sqlc (for SQL code generation)

---

## First Time Setup

### 1. Clone and Navigate

```bash
cd /Users/safouan/Downloads/pyrecycleheat-zac-betav2
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Download Go dependencies
go mod download

# Verify dependencies
go mod tidy

# Generate SQL code (if needed)
make sqlc-gen

# Run database migrations (creates district_heating.db)
make migrate-up

# Seed initial data (optional)
# Note: Check if seed script exists
make seed || echo "No seed script available"
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Or if using Bun:
bun install

# Create environment file
cp .env.example .env

# Edit .env and set:
# VITE_API_BASE_URL=http://localhost:8080
```

---

## Running the Application

### Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
make run
```

**Expected Output:**
```
2025/12/05 10:30:45 INFO starting pyrecycleheat backend version=0.1.0
2025/12/05 10:30:45 INFO observability initialized
2025/12/05 10:30:45 INFO migrations complete version=1
2025/12/05 10:30:45 INFO server listening addr=:8080 protocol=h2c
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.4.19  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Access the Application:**
- Frontend: http://localhost:5173
- Backend Health Check: http://localhost:8080/health
- Backend Metrics: http://localhost:9090/metrics (if enabled)

---

## Verifying the Installation

### 1. Health Check

```bash
curl http://localhost:8080/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-05T10:30:45Z"
}
```

### 2. API Test (List Data Centers)

```bash
curl http://localhost:8080/v1/data-centers
```

**Expected Response:**
```json
{
  "dataCenters": []
}
```

### 3. Frontend Access

1. Open http://localhost:5173 in your browser
2. You should see the PyRecycleHeat dashboard
3. Map should load (may require internet for tiles)
4. Forms should be interactive

---

## Common Issues & Solutions

### Backend Won't Start

**Issue: "sqlite3: cannot open database"**
```bash
# Solution: Ensure migrations ran
cd backend
make migrate-up
```

**Issue: "gcc: command not found"**
```bash
# macOS:
xcode-select --install

# Linux:
sudo apt-get install build-essential

# Windows:
# Install MinGW from https://www.mingw-w64.org/
```

**Issue: "port 8080 already in use"**
```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in backend/internal/config/config.go
```

### Frontend Won't Start

**Issue: "Cannot find module"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Issue: "API calls failing (CORS errors)"**
```bash
# Check backend is running on :8080
curl http://localhost:8080/health

# Check frontend .env file
cat .env
# Should have: VITE_API_BASE_URL=http://localhost:8080
```

**Issue: "Map not loading"**
```bash
# Check internet connection (MapLibre needs tile server)
# Or configure offline tile server in map component
```

### Build Issues

**Issue: "make: command not found"**
```bash
# macOS:
brew install make

# Linux:
sudo apt-get install make

# Windows:
# Install Make from http://gnuwin32.sourceforge.net/packages/make.htm
```

**Issue: "go: module not found"**
```bash
cd backend
go mod download
go mod tidy
```

---

## Development Workflow

### Making Backend Changes

1. **Edit Go code** in `backend/internal/`
2. **Stop server** (Ctrl+C in Terminal 1)
3. **Restart server:** `make run`
4. **Test changes**

**Hot Reload (optional):**
```bash
# Install Air for live reload
go install github.com/cosmtrek/air@latest

# Run with hot reload
air
```

### Making Frontend Changes

1. **Edit TypeScript/React code** in `frontend/src/`
2. **Save file** - Vite automatically hot reloads
3. **See changes instantly** in browser

### Database Changes

**Add New Migration:**
```bash
cd backend/internal/database/schema

# Create new migration files
touch 002_add_new_table.up.sql
touch 002_add_new_table.down.sql

# Edit files with SQL
# Then run:
cd ../../..
make migrate-up
```

**Modify Queries:**
```bash
# Edit backend/internal/database/queries/*.sql
# Then regenerate code:
make sqlc-gen
```

### API Changes (Protobuf)

```bash
# Edit shared/common/proto/**/*.proto
# Then regenerate code:
make buf-gen

# This updates:
# - Backend Go code
# - Frontend TypeScript types
```

---

## Building for Production

### Backend

**Build Binary:**
```bash
cd backend
make build

# Binary created at: ./bin/server
# Run it:
./bin/server
```

**Build Docker Image:**
```bash
cd backend
docker build -t pyrecycleheat-backend:latest .

# Run container:
docker run -p 8080:8080 \
  -v $(pwd)/data:/data \
  -e DATABASE_DSN=/data/district_heating.db \
  pyrecycleheat-backend:latest
```

### Frontend

**Build Static Files:**
```bash
cd frontend
npm run build

# Output in: dist/
# Deploy to:
# - Vercel
# - Netlify
# - S3 + CloudFront
# - Any static host
```

**Preview Production Build:**
```bash
npm run preview
# Access at http://localhost:4173
```

---

## Useful Commands Reference

### Backend (Makefile)

```bash
make run              # Run dev server
make build            # Build production binary
make test             # Run unit tests
make test-verbose     # Run tests with verbose output
make sqlc-gen         # Generate SQL code
make buf-gen          # Generate protobuf code
make migrate-up       # Apply migrations
make migrate-down     # Rollback migrations
make migrate-status   # Show migration status
make proto-lint       # Lint protobuf files
make smoke-test       # Run integration tests
make clean            # Clean build artifacts
```

### Frontend (npm scripts)

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript compiler (check only)
```

### Database (via Go)

```bash
# Access SQLite CLI
sqlite3 backend/district_heating.db

# Useful SQL commands:
sqlite> .tables                    # List tables
sqlite> .schema heat_centers       # Show table schema
sqlite> SELECT * FROM heat_centers;# Query data
sqlite> .exit                      # Exit
```

---

## Testing the Full Stack

### Manual Testing Flow

1. **Start both servers** (backend + frontend)

2. **Create a Data Center:**
   - Navigate to http://localhost:5173
   - Fill in data center form:
     - Name: "SF Data Center 1"
     - IT Load: 10 MW
     - PUE: 1.4
     - Location: San Francisco (lat/lng)
   - Click "Save"

3. **Create a Heat Sink:**
   - Add heat consumer:
     - Name: "Residential Block A"
     - Demand: 2 MW
     - Location: Nearby coordinates

4. **Run Prediction:**
   - Go to Prediction Dashboard
   - Select data center
   - Set parameters:
     - Heat price: $30/MWh
     - Pipeline cost: $2000/m
     - Discount rate: 8%
     - Project lifetime: 25 years
   - Click "Calculate"

5. **View Results:**
   - NPV, IRR, Payback period
   - Carbon reduction
   - Map showing connection

### API Testing (curl)

```bash
# Create data center
curl -X POST http://localhost:8080/v1/data-centers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test DC",
    "locationLat": 37.7749,
    "locationLng": -122.4194,
    "itLoadMw": 10,
    "pue": 1.4
  }'

# List data centers
curl http://localhost:8080/v1/data-centers

# Get specific data center
curl http://localhost:8080/v1/data-centers/1

# Calculate prediction
curl -X POST http://localhost:8080/v1/predictions/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "dataCenterId": 1,
    "heatPriceMwh": 30,
    "pipelineCostPerKm": 2000000,
    "discountRate": 0.08,
    "projectLifetimeYears": 25
  }'
```

---

## Next Steps

Now that you have the app running:

1. **Explore the codebase:**
   - Read [06-code-walkthrough.md](06-code-walkthrough.md)
   - Review key files mentioned in architecture docs

2. **Understand the business logic:**
   - Read algorithm docs in `/docs/algorithms/`
   - Review [02-business-domain.md](02-business-domain.md)

3. **Check technical debt:**
   - Read [09-technical-debt.md](09-technical-debt.md)
   - Review [11-action-items.md](11-action-items.md)

4. **Make your first change:**
   - Pick a small improvement
   - Follow the development workflow above
   - Test thoroughly

---

## Getting Help

**Documentation:**
- `/docs` folder - 17+ technical documents
- This onboarding folder - CTO-specific guides
- Inline code comments

**Debugging:**
- Backend logs: Check terminal output (structured JSON)
- Frontend logs: Browser console (F12)
- Database: `sqlite3 backend/district_heating.db`

**Common Resources:**
- Go docs: https://pkg.go.dev
- React docs: https://react.dev
- ConnectRPC: https://connectrpc.com
- TanStack Query: https://tanstack.com/query

**Project Specific:**
- README.md in project root
- Existing documentation in /docs
- Code comments in critical files
