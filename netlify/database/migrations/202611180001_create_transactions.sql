CREATE TABLE IF NOT EXISTS transactions (
 id TEXT PRIMARY KEY,
 type TEXT NOT NULL CHECK (type IN ('income','expense','saving')),
 date DATE NOT NULL,
 amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
 category TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions(date DESC);
