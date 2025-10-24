-- Financial Planner Table
CREATE TABLE IF NOT EXISTS financial_planner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  time_range text NOT NULL DEFAULT 'quarter',
  scenario text NOT NULL DEFAULT 'likely',
  filters jsonb NOT NULL DEFAULT '{"income": true, "expense": true}'::jsonb,
  next_id integer NOT NULL DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE financial_planner ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own financial data"
  ON financial_planner FOR SELECT
  USING (true);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own financial data"
  ON financial_planner FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own financial data"
  ON financial_planner FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR auth.role() = 'anon');

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS financial_planner_user_id_idx ON financial_planner(user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_financial_planner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_financial_planner_updated_at
  BEFORE UPDATE ON financial_planner
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_planner_updated_at();
