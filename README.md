# Entropy Decision Engine

A decision support system for visualizing and analyzing district heating infrastructure and data center heat recovery options.

## Features

- **Interactive Map**: 3D visualization of infrastructure using MapLibre GL JS.
- **Real-time Analytics**: Dashboard for monitoring heat centers and demand sites.
- **Scenario Analysis**: Tools to evaluate heat recovery potential.

## Tech Stack

- **Backend**: Go (Golang)
- **Frontend**: Next.js (React/TypeScript)
- **Database**: SQLite (managed by the backend)

## Getting Started

### Prerequisites

- **Go**: Version 1.21 or later
- **Node.js**: Version 18 or later
- **npm**: Version 9 or later

### Quick Start

The project includes a startup script that launches both the backend and frontend services.

From the project root:

```bash
npm run dev
```

This command will:
1.  Check for port conflicts on 8080 (backend) and 3000 (frontend).
2.  Start the Go backend server.
3.  Start the Next.js frontend development server.
4.  Display the access URLs.

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

## Project Structure

```
.
├── backend/            # Go backend service
├── frontend-next/      # Next.js frontend application
├── shared/             # Shared resources (proto definitions, etc.)
├── start.sh            # Main startup script
└── package.json        # Root scripts
```

## Troubleshooting

If you encounter issues starting the application:

1.  **Ports in use**: The script attempts to free ports 8080 and 3000. If it fails, manually kill the processes:
    ```bash
    lsof -ti:8080 | xargs kill -9
    lsof -ti:3000 | xargs kill -9
    ```
2.  **Missing dependencies**: Ensure you have run `npm install` in `frontend-next` and `go mod download` in `backend` if manually setting up. The startup script assumes standard Go/Node environments.