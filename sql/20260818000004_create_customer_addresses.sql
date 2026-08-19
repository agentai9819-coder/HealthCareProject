-- Phase 2E Migration: Create customer_addresses table for saved service care locations
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL DEFAULT 'Home',
  street VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "IDX_customer_addresses_customer_id" ON customer_addresses(customer_id);

-- Database-Level Invariant Protection: Enforce maximum 1 default address per customer
CREATE UNIQUE INDEX IF NOT EXISTS "UNIQ_customer_addresses_customer_default" 
ON customer_addresses (customer_id) 
WHERE is_default = TRUE;
