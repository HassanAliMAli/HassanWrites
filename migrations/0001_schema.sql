-- Migration number: 0001 	 2024-11-30T00:00:00.000Z
-- Schema for EdgeMaster Blog

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'reader', -- 'superadmin', 'admin', 'author', 'reader'
    avatar_r2_key TEXT,
    banner_r2_key TEXT,
    accent_color TEXT,
    stripe_customer_id TEXT,
    stripe_account_id TEXT,
    wallet_balance REAL DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    canonical_r2_key TEXT,
    tags TEXT, -- JSON array string
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    paywall BOOLEAN DEFAULT 0,
    published_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Revisions table (for history)
CREATE TABLE IF NOT EXISTS revisions (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    metadata TEXT, -- JSON string
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    parent_id TEXT,
    body TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'direct', 'affiliate', 'programmatic'
    creative_r2_key TEXT,
    targeting_json TEXT,
    priority INTEGER DEFAULT 0,
    budget INTEGER DEFAULT 0,
    start_at INTEGER,
    end_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Impressions table (for ad tracking)
CREATE TABLE IF NOT EXISTS impressions (
    id TEXT PRIMARY KEY,
    slot_id TEXT NOT NULL,
    post_id TEXT,
    user_id TEXT,
    signature TEXT,
    timestamp INTEGER DEFAULT (unixepoch())
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT PRIMARY KEY,
    stripe_subscription_id TEXT,
    status TEXT, -- 'active', 'canceled', 'past_due'
    current_period_end INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_ads_priority ON ads(priority);

-- Magic Links table
CREATE TABLE IF NOT EXISTS magic_links (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'paid', 'failed'
    period_start INTEGER,
    period_end INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ledger table (for wallet transactions)
CREATE TABLE IF NOT EXISTS ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'earning', 'withdrawal', 'adjustment'
    amount REAL NOT NULL,
    description TEXT,
    reference_id TEXT, -- e.g., payout_id
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add wallet_balance and stripe_account_id to users if not exists (SQLite doesn't support IF NOT EXISTS for columns easily, assuming fresh migration for now or we append)
-- Since this is a single migration file, we can add them to the CREATE TABLE users above.
