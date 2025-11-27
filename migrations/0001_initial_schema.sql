-- Migration 0001: Initial Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'reader', -- 'superadmin', 'admin', 'author', 'reader'
    avatar_r2_key TEXT,
    banner_r2_key TEXT,
    accent_color TEXT,
    stripe_customer_id TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    canonical_r2_key TEXT, -- Path to HTML in R2
    tags TEXT, -- JSON array string
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    paywall BOOLEAN DEFAULT FALSE,
    published_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Revisions Table (for history)
CREATE TABLE IF NOT EXISTS revisions (
    post_id TEXT NOT NULL,
    revision_id TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    metadata TEXT, -- JSON
    created_at INTEGER DEFAULT (unixepoch()),
    PRIMARY KEY (post_id, revision_id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    parent_id TEXT, -- For threading
    body TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'direct', 'affiliate', 'programmatic'
    creative_r2_key TEXT,
    targeting_json TEXT,
    priority INTEGER DEFAULT 0,
    budget INTEGER, -- In cents
    start_at INTEGER,
    end_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Impressions Table (for ad verification)
CREATE TABLE IF NOT EXISTS impressions (
    slot_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    user_id TEXT,
    ts INTEGER DEFAULT (unixepoch()),
    signature TEXT NOT NULL -- Cryptographic proof
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT PRIMARY KEY,
    stripe_subscription_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'active', 'canceled', etc.
    current_period_end INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_ads_priority ON ads(priority);

-- Invites Table (Added for Phase 2 hardening)
CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'author',
    uses INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 1,
    expires_at INTEGER, -- Unix timestamp
    created_by TEXT, -- Admin ID who created it
    created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);
