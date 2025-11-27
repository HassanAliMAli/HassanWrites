-- Migration 0001: Initial Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'reader', -- reader, author, admin
    avatar_r2_key TEXT,
    bio TEXT,
    created_at INTEGER,
    last_login INTEGER
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    canonical_r2_key TEXT, -- HTML content stored in R2
    cover_image TEXT,
    tags TEXT, -- JSON array
    status TEXT DEFAULT 'draft', -- draft, published, archived
    published_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Ads Table (Phase 2 Foundation)
CREATE TABLE IF NOT EXISTS ads (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- direct, affiliate, programmatic
    creative_r2_key TEXT,
    target_url TEXT,
    priority INTEGER DEFAULT 0,
    impressions_limit INTEGER,
    impressions_count INTEGER DEFAULT 0,
    start_at INTEGER,
    end_at INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
