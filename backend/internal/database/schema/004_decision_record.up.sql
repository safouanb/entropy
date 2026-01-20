-- Migration: Decision Record Extensions for Entropy V1
-- Purpose: Add stakeholders, risk allocation, and audit trail for regulator-grade records

-- Add new columns for Decision Record format
ALTER TABLE feasibility_assessments ADD COLUMN stakeholders_json TEXT;
-- JSON: {dcOperator: string, heatOfftaker: string, authority: string, integrator: string}

ALTER TABLE feasibility_assessments ADD COLUMN risk_allocation_json TEXT;
-- JSON: [{category: string, bearingParty: string, mitigationMechanism: string, notes: string}]

ALTER TABLE feasibility_assessments ADD COLUMN audit_trail_json TEXT;
-- JSON: [{version: int, date: string, changeSummary: string, author: string, sourcesUsed: string[]}]

ALTER TABLE feasibility_assessments ADD COLUMN record_version TEXT DEFAULT '0.1';

ALTER TABLE feasibility_assessments ADD COLUMN prepared_by TEXT DEFAULT 'Entropy';

ALTER TABLE feasibility_assessments ADD COLUMN confidence_level TEXT DEFAULT 'MEDIUM' CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW'));

-- Index for decision record lookups
CREATE INDEX IF NOT EXISTS idx_assessments_record_version ON feasibility_assessments(record_version);
