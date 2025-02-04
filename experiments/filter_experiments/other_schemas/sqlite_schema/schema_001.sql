CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    kind INTEGER,
    event JSONB
);

CREATE TABLE IF NOT EXISTS tags (
    event_id TEXT NOT NULL,
    kind INTEGER NOT NULL,
    tag JSONB NOT NULL,
    tag_index_0 TEXT NOT NULL,
    tag_index_1 TEXT,
    tag_index_2 TEXT,
    tag_index_3 TEXT,
    PRIMARY KEY (event_id, kind, tag)
);
