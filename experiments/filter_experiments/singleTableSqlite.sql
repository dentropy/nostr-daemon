CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    raw_event TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    kind INTEGER NOT NULL,
    pubkey TEXT NOT NULL,
    sig TEXT NOT NULL,
    content TEXT NOT NULL,
    tags JSON
);
