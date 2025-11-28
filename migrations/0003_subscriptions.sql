-- Migration 0003: Subscription System

-- Subscribers Table (for premium readers - NO passwords/accounts)
CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    subscription_tier TEXT, -- 'newsletter' or 'premium'
    subscription_status TEXT, -- 'active', 'canceled', 'past_due', 'unpaid'
    stripe_subscription_id TEXT,
    current_period_end INTEGER, -- Unix timestamp
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Magic Links Table (for subscriber authentication)
CREATE TABLE IF NOT EXISTS magic_links (
    token TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0, -- 0 = not used, 1 = used
    created_at INTEGER NOT NULL,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

-- Add is_premium column to posts
ALTER TABLE posts ADD COLUMN is_premium INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer ON subscribers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_subscriber ON magic_links(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_posts_premium ON posts(is_premium);
