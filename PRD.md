Absolutely — here is the **full upgraded 10/10 PRD** in clean, copy-and-paste-ready text.

---

# **📘 PRODUCT REQUIREMENTS DOCUMENT (PRD) — EdgeMaster Blog (Cloudflare-Only, 10/10 Version)**

*A world-class, edge-native, multi-author publishing masterpiece.*

---

# **1. Objective & Vision**

Build the fastest, most elegant, Cloudflare-native, invite-only multi-author publishing platform ever made. The system must be ultra-responsive, beautifully designed, and fully monetizable with maximum owner control.

**Pillars:**

* Masterpiece frontend (completed 100% in Phase 1 before backend begins)
* Ultra-low latency via Cloudflare Workers + Pages + R2 + Images + Stream
* Monetization freedom: direct ads, affiliates, AdSense, paywalls, subscriptions
* Multi-author private platform with personal branding
* Fully documented architecture, data models, endpoints, and UI inventory
* Zero AI features (per requirement)

---

# **2. Scope & Constraints**

* Entire infra must run on Cloudflare (Pages, Workers, R2, D1, DO, KV, Images, Stream)
* Third-party monetization allowed (Stripe, AdSense, header bidding)
* Invite-only multi-author platform (you + small team)
* No public signup
* No AI tools/features
* Phase 1 = Full frontend completion (UI/UX + mock APIs)
* Phase 2+ = Backend, editor persistence, monetization, search

---

# **3. Success Metrics**

**Performance**

* FCP < 400ms
* LCP < 900ms on 4G
* TTI < 1000ms
* CLS < 0.05

**Search**

* < 200ms global average

**Operational**

* Worker error rate < 0.1%
* Ad impression discrepancy < 1%

---

# **4. User Personas**

1. **Owner/Admin** — ads, payouts, access, config
2. **Author** — writes, edits, uploads media
3. **Reader** — invite-only consumption
4. **Sponsor** — provides direct ad creatives

---

# **5. Core Features**

## **5.1 Authentication**

* Invite tokens (expirable)
* Magic-link login
* JWT (HTTP-only cookies)
* Roles: superadmin, admin, author, reader

## **5.2 Author Profiles**

* Avatar, banner, bio
* Accent color
* Stats (views, claps, followers)

## **5.3 Editor**

* Block-based (TipTap/ProseMirror)
* Blocks: text, heading, quote, list, image, video, embed, code, callout
* Drag & drop media
* Autosave → Durable Objects
* Publish → D1 metadata + R2 canonical HTML
* Revision history stored in R2

## **5.4 Media Pipeline**

* Worker-validated uploads → R2
* Image transforms via Cloudflare Images
* Video masters → Cloudflare Stream

## **5.5 Comments & Reactions**

* Threaded comments
* DO real-time channels
* Claps/reactions stored in DO counters

## **5.6 Search & Discovery**

* Tokenized inverted index (D1)
* DO shards for hot indexes
* Trending: recency + claps + views
* Basic personalized feed (followed authors + reading history)

## **5.7 Monetization**

* Direct ads (R2 creatives)
* Affiliate blocks
* AdSense / Prebid fallback
* Priority: Direct → Affiliate → Programmatic
* Signed impression receipts
* Payouts: Stripe Connect (optional)

## **5.8 Payments / Subscriptions**

* Stripe Checkout
* Webhook verification
* Paywall (preview mode vs full content)
* One-off unlock payments

## **5.9 Admin Console**

* Users, invites, posts
* Ads/campaigns
* Revenue analytics
* Moderation tools

## **5.10 Observability**

* Logpush → R2
* Synthetic monitors
* D1 snapshots to R2

---

# **6. System Architecture (Cloudflare)**

**Frontend:**

* Cloudflare Pages (React/Svelte)
* Fully hydration-optimized
* Edge SSR (Pages Functions)

**Backend (Workers):**

* Auth flows
* Publishing pipeline
* Ad decisioning engine
* Search API
* Stripe webhooks
* Media uploads
* Preview/full article rendering

**Storage:**

* **D1** — relational
* **R2** — HTML, images, creatives, attachments
* **Durable Objects** — autosave sessions, real-time channels
* **KV** — flags, configs
* **Images API** — responsive images
* **Stream** — video playback

---

# **7. Data Model (Key Tables)**

## `users`

id, email, name, role, avatar_r2_key, banner_r2_key, accent_color, stripe_customer_id

## `posts`

id, author_id, title, slug, excerpt, canonical_r2_key, tags[], status, paywall, published_at

## `revisions`

post_id, revision_id, r2_key, metadata

## `comments`

id, post_id, author_id, parent_id, body, created_at

## `ads`

id, type, creative_r2_key, targeting_json, priority, budget, start_at, end_at

## `impressions`

slot_id, post_id, ts, signature, user_id

## `subscriptions`

user_id, stripe_subscription_id, status, current_period_end

---

# **8. API Surface**

### **Auth**

POST /auth/invite
POST /auth/magic-link
GET /auth/magic-link

### **Posts**

GET /posts
GET /posts/:slug
POST /posts
PUT /posts/:id
POST /posts/:id/publish

### **Editor Sessions (Durable Objects)**

GET /editor/session/:id
POST /editor/session/:id

### **Ads**

GET /ads/decision
POST /ads
POST /ads/impression

### **Search**

GET /search?q=

### **Payments**

POST /payments/checkout
POST /payments/webhook

---

# **9. UI / UX Requirements**

## **Design Principles**

* Medium-quality typography
* Perfect spacing rhythm
* Smooth microinteractions
* Zero clutter
* Responsive < 320px → ultra-wide
* Per-author branding tokens

## **Design Tokens**

* Typography scale
* Color palette
* Spacing units
* Author accent variables
* Motion tokens (duration, easing)

## **Components**

* Header / Nav
* Article Shell
* Editor Blocks
* Comments
* Author Cards
* Ad Slot Wrapper
* Search Bar
* Campaign Forms
* Payout Table

## **Microinteractions**

* Clap animation
* Comment expansion
* Block selection hover
* Publish flow transitions

---

# **10. Editor Requirements**

* Rich block-based editing
* Drag & drop media
* Autosave every 3-5 seconds
* LocalStorage failover
* Preview = final rendered HTML
* Revision diffs stored in R2

---

# **11. Media Pipeline**

**Images:**
Worker → R2 (original) → CF Images transforms → CDN cache

**Videos:**
R2 master → Stream → playback embed

---

# **12. Search & Discovery**

* Index tokens on publish
* DO shard caching
* Ranking: match score + recency + interactions
* <200ms lookup

---

# **13. Monetization Engine**

**Priority logic:**

1. Direct R2 creative
2. Affiliate card
3. AdSense (or Prebid)

**Impression Protection:**

* Server-signed receipt
* Replay prevention (rand)
* D1 deduplication

**Payouts:**

* Stripe Connect supported
* Splits stored in D1

---

# **14. Payment System**

* Stripe Checkout sessions
* Secure webhook → Worker → D1
* Paywall protection logic
* Unlock tokens stored in D1

---

# **15. Security**

* JWT (HttpOnly)
* Signed upload URLs
* Rate limiting in Workers
* Webhook signature verification
* Invite token expiration
* Content moderation rules in Admin

---

# **16. Observability**

* Event logs → Logpush → R2
* Synthetic latency probes
* D1 → R2 snapshot every 24h
* Error dashboards

---

# **17. Performance Requirements**

* Critical CSS inline
* Bundle < 40KB initial
* Images lazy-loaded & responsive
* Workers compute < 5ms for ads
* Stale-while-revalidate caching

---

# **18. Acceptance Criteria**

* Frontend 100% complete (Phase 1)
* All pages responsive and pixel-perfect
* Accessibility: WCAG 2.1 AA
* Lighthouse: 95+ performance
* Search <200ms
* Editor autosave stable
* Stripe payment success updates <10s
* Ad decision order always correct

---

# **19. CI/CD**

* Pages preview deployments
* Worker deploy pipeline
* Lighthouse CI tests
* Schema migration pipeline
* Mock server for Phase 1

---

# **20. Roadmap**

## **PHASE 1 — FRONTEND ONLY (NO BACKEND)**

This phase must be 100% complete before backend starts.

* Full UI kit
* Typography + tokens
* All pages: Article, Editor UI, Profiles, Discover, Admin (mocked)
* All components functional with mock API
* Full responsiveness
* Animations + microinteractions
* Lighthouse + Accessibility complete
* Mock API server powering all UI

**Backend must NOT begin until Phase 1 is formally approved.**

---

## **PHASE 2 — Core Backend**

* Auth system
* Publishing pipeline
* Editor autosave → DO
* R2 media uploads
* Search indexing engine
* Ad decision engine
* Stripe Checkout + webhooks

---

## **PHASE 3 — Real-time & Monetization**

* Real-time comments
* Collaborative editing
* Impression verification
* Revenue dashboards
* Payout automation
* Synthetic monitoring
* Backup automation

---

## **PHASE 4 — Hardening**

* WAF configurations
* Bot detection rules
* Caching optimization
* Cost optimization
* Performance polishing

---

# **21. Risks & Mitigations**

* Worker CPU cost → caching in DO
* R2 egress cost → Stream + quotas
* Fill rate → hybrid monetization
* Over-engineering → strict phase boundaries

---

# **22. Runbooks**

* Worker rollback
* Stripe webhook recovery
* Ad discrepancy investigation
* R2 → D1 restore
* Cron-based indexing repair

---

# **23. Deliverables for AI Coding Agent**

### **Phase 1**

* Full frontend repo
* Complete UI components
* Fully functional editor UI (mocked)
* Mock API server
* Design token system
* Critical CSS pipeline
* Accessibility and Lighthouse tests

### **Phase 2**

* Auth Workers
* D1 schema + migrations
* Durable Objects (editor + real-time)
* Media uploads → R2
* Stripe flows
* Ad decisioning engine
* Search indexing + API

### **Phase 3**

* Realtime comments
* OT collaboration
* Payouts
* Event logging + Logpush
* Monitoring scripts

---

# **24. UI Component Inventory (Full)**

### **Layout**

* Header
* Footer
* Sidebar
* ArticleShell
* ReaderModeToggle
* Grid + Container components

### **Content**

* ParagraphBlock
* HeadingBlock
* QuoteBlock
* CodeBlock
* CalloutBlock
* ImageBlock
* VideoBlock
* EmbedBlock
* GalleryBlock

### **Media**

* ResponsiveImage
* StreamVideoPlayer
* Lightbox

### **Engagement**

* ClapButton
* CommentThread
* FollowButton

### **Search**

* SearchInput
* FilterChips
* ResultsList

### **Admin**

* UserTable
* PostTable
* CampaignForm
* PayoutDashboard
* AnalyticsCharts

### **System**

* Modal
* Toast
* Tabs
* Dropdown
* Skeleton Loaders

---

# **25. User Stories & Acceptance Tests**

### **Author**

**Story:** As an author, I can create/edit drafts.
**Acceptance:** Autosave works every 3s and survives page reload.

**Story:** I can upload images/videos.
**Acceptance:** Image preview appears instantly; upload under 2s for <1MB.

**Story:** I can publish posts.
**Acceptance:** Publish writes HTML to R2 + metadata to D1.

---

### **Reader**

**Story:** I can read posts instantly.
**Acceptance:** LCP < 900ms.

**Story:** I can comment.
**Acceptance:** Comment posts without page reload.

**Story:** I can subscribe or unlock.
**Acceptance:** Stripe checkout works and unlocks content immediately after webhook.

---

### **Admin**

**Story:** I can create ads.
**Acceptance:** New campaigns appear in system and are selected by ad decision engine when matched.

**Story:** I can view analytics.
**Acceptance:** Logpush events appear in dashboard charts.

---

# **26. Page-level UX Blueprints**

### **Article Page**

* Hero: title, subtitle, cover image
* Body: rich blocks + inline ads
* Author bio
* Related posts
* Comment thread

### **Editor Page**

* Center writing pane
* Left block toolbar
* Right meta sidebar
* Top publish bar

### **Admin Page**

* Navigation sidebar
* Tables (posts, users, campaigns)
* Detail forms
* Analytics charts

---

# **27. Dataflow Diagram (Text Version)**

**Editor → Durable Object autosave → D1 (metadata) → R2 (canonical HTML) → Worker SSR → Reader**
Impressions → Worker verify → D1 record → Logpush export.

---

# **28. Acceptance Matrix Highlights**

* Ad priority order correctly respected
* Search relevance accurate under load
* Stripe updates subscription state under 10 seconds
* Editor never loses work on reload

---

