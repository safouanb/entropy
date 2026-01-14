# Decision Record 001: Data Foundation Strategy

## Context
We are building a Feasibility Assessment Platform. While the immediate value to the user is a regulatory compliance check and CBA generation, the long-term value for the platform is the aggregation of supply (Heat Sources) and demand (Heat Sinks) data.

## Decision
We will implement a **Data Foundation Strategy** where every user interaction captures persistent data nodes.

1.  **Supply Capture**: The "Regulatory Compliance Checker" will not just be an ephemeral calculator. It will include a "Save Project" action that persists the input data as a `DataCenter` entity in our database.
2.  **Demand Capture**: The "CBA Tool" will allow users to select existing sinks (validating our data) or define custom sinks (enriching our data).
3.  **Network Effect**: By capturing this data, we build the foundation for a future marketplace where we can proactively identify matches between captured Supply nodes and Demand nodes.

## Implementation Implications
- **Frontend**: UX must encourage saving. "Save to Dashboard" or "Proceed to CBA" (which auto-saves) should be prominent.
- **Backend**: API endpoints must support progressive data entry (e.g., creating a Data Center with just high-level compliance info first, then adding details later).
- **Privacy**: Data must be handled according to privacy standards, eventually requiring anonymization for public maps.
