-- +goose Up
-- Users table for Settings page
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Preferences / Settings
    notify_assessment_complete BOOLEAN DEFAULT 1,
    notify_regulatory_updates BOOLEAN DEFAULT 1,
    
    -- API Keys (simplified for single user)
    api_key_live TEXT,
    api_key_test TEXT
);

-- Seed default user
INSERT INTO users (email, first_name, last_name, api_key_live) 
VALUES ('user@entropy.energy', 'Demo', 'User', 'sk_live_51M3948q3');

-- Audit Logs for Activity Stream
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_identifier TEXT NOT NULL, -- e.g. "System", "Admin", or email
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- "crawling", "approval", "market", "creation"
    icon_type TEXT NOT NULL, -- Maps to frontend icons
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial activity
INSERT INTO audit_logs (user_identifier, action, entity_type, icon_type, created_at) VALUES 
('System', 'Automatic crawl of Frankfurt_DC_04 regulations updated.', 'crawling', 'globe', datetime('now', '-10 minutes')),
('Admin', 'Approved new conceptual design for Munich Alpha.', 'approval', 'shield', datetime('now', '-2 hours')),
('System', 'Energy price forecast updated from ENTSO-E.', 'market', 'trending_up', datetime('now', '-5 hours')),
('User_Demo', 'Created new assessment: Berlin Edge Node.', 'creation', 'clock', datetime('now', '-1 day'));
