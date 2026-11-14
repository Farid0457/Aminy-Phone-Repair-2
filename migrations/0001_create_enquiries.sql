-- Enquiries submitted through the website contact form (POST /api/contact).
-- Applied with: npx wrangler d1 migrations apply aminy-db --local   (or --remote)

CREATE TABLE enquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),  -- UTC
  updated_at   TEXT,

  first_name   TEXT    NOT NULL,
  last_name    TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  phone        TEXT    NOT NULL DEFAULT '',
  device       TEXT    NOT NULL,          -- "Device & Issue" field
  message      TEXT    NOT NULL DEFAULT '',

  -- Filled when the customer came from the instant-quote tool ("Book This Repair")
  quote_model  TEXT,
  quote_issue  TEXT,
  quote_total  INTEGER,                   -- AUD incl. GST

  -- Admin workflow
  status       TEXT    NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'booked', 'done', 'spam')),
  notes        TEXT    NOT NULL DEFAULT '',

  email_sent   INTEGER NOT NULL DEFAULT 0  -- 1 once the notification email was delivered
);

CREATE INDEX idx_enquiries_status_created ON enquiries (status, created_at DESC);
CREATE INDEX idx_enquiries_created        ON enquiries (created_at DESC);
