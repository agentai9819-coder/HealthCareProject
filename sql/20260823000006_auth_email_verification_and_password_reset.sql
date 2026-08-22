-- Phase 3 Security Migration: Email Verification and Expiring Password Reset Tokens

-- 1. Add is_email_verified to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_evt_token_hash" ON email_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS "IDX_evt_expires_at" ON email_verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS "IDX_evt_customer_id" ON email_verification_tokens(customer_id);

-- 3. Create password_reset_tokens table (with strict 15-minute expiration)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_prt_token_hash" ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS "IDX_prt_expires_at" ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS "IDX_prt_customer_id" ON password_reset_tokens(customer_id);
