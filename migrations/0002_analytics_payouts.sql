-- Migration 0002: Analytics & Payouts

-- Analytics Events Table (High Volume)
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- pageview, impression, click
    post_id TEXT,
    user_id TEXT, -- Optional (logged in user)
    visitor_id TEXT, -- Fingerprint/Cookie ID
    meta TEXT, -- JSON (referrer, device, etc.)
    created_at INTEGER
);

-- Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- pending, processing, paid, failed
    period_start INTEGER,
    period_end INTEGER,
    stripe_transfer_id TEXT,
    created_at INTEGER,
    processed_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ledger Table (Transaction History)
CREATE TABLE IF NOT EXISTS ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- earning, withdrawal, adjustment
    amount REAL NOT NULL,
    description TEXT,
    reference_id TEXT, -- e.g., payout_id or post_id
    balance_after REAL,
    created_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Wallet Balance in Users Table (Add column if not exists - SQLite doesn't support IF NOT EXISTS for columns easily, so we assume it's new or handle in app logic)
-- For D1/SQLite, we usually do this:
ALTER TABLE users ADD COLUMN wallet_balance REAL DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_account_id TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_post ON analytics_events(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_time ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_payouts_user ON payouts(user_id);
