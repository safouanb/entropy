# CTO Onboarding Guide - PyRecycleHeat

Welcome! This folder contains everything you need to understand and take ownership of the PyRecycleHeat codebase.

## Reading Order

Read these documents in the following order for the best onboarding experience:

### Day 1: Understanding the Business & Product
1. **[01-executive-overview.md](01-executive-overview.md)** - What is PyRecycleHeat? Why does it exist?
2. **[02-business-domain.md](02-business-domain.md)** - The domain problem, user workflows, and key metrics
3. **[10-quick-start.md](10-quick-start.md)** - Get the project running locally (do this hands-on!)

### Day 2: Technical Architecture
4. **[03-technology-stack.md](03-technology-stack.md)** - Tech stack deep dive and architectural decisions
5. **[04-system-architecture.md](04-system-architecture.md)** - How everything fits together
6. **[05-database-guide.md](05-database-guide.md)** - Data model and database design

### Day 3: Code Deep Dive
7. **[06-code-walkthrough.md](06-code-walkthrough.md)** - Critical code paths and important files
8. **[07-api-contracts.md](07-api-contracts.md)** - How frontend and backend communicate

### Day 4: Operations & Planning
9. **[08-deployment-operations.md](08-deployment-operations.md)** - Running in production, monitoring, and scaling
10. **[09-technical-debt.md](09-technical-debt.md)** - Current limitations and areas needing attention
11. **[11-action-items.md](11-action-items.md)** - Your first 30/60/90 day priorities

## Quick Reference

**Project Root:** `/Users/safouan/Downloads/pyrecycleheat-zac-betav2`

**Key Directories:**
- `backend/` - Go microservice (production target)
- `frontend/` - React/TypeScript SPA
- `docs/` - Existing technical documentation (17+ files)
- `shared/` - Protobuf API contracts

**Start the app:**
```bash
# Terminal 1 - Backend
cd backend
make run

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**Visit:** http://localhost:5173

## Getting Help

- **Existing docs:** Check `/docs` folder for algorithm specs and architecture
- **Code questions:** Most services have inline comments
- **Build issues:** Check the Makefile in `backend/` and package.json in `frontend/`

## Document Status

Created: 2025-12-05
Status: Complete
Maintainer: CTO
