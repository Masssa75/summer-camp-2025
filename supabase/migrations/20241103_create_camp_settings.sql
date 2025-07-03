-- Create camp_settings table for storing various camp configuration
CREATE TABLE IF NOT EXISTS camp_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE camp_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to settings
CREATE POLICY "Allow public read access to camp settings"
ON camp_settings
FOR SELECT
TO public
USING (true);

-- Only allow authenticated admin users to update settings
CREATE POLICY "Allow admin users to update camp settings"
ON camp_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.telegram_id = auth.uid()
  )
);

-- Insert default timetable
INSERT INTO camp_settings (key, value)
VALUES ('timetable', '[
  {"id":"1","time":"8:15 - 9:00","monday":"Arrival & Free Play","tuesday":"Arrival & Free Play","wednesday":"Arrival & Free Play","thursday":"Arrival & Free Play","friday":"Arrival & Free Play"},
  {"id":"2","time":"9:00 - 10:30","monday":"Handwork & Crafts","tuesday":"Cooking & Baking","wednesday":"Animal Care","thursday":"Sensory Play","friday":"Weekly Celebration"},
  {"id":"3","time":"10:30 - 11:00","monday":"Morning Snack","tuesday":"Morning Snack","wednesday":"Morning Snack","thursday":"Morning Snack","friday":"Morning Snack"},
  {"id":"4","time":"11:00 - 12:00","monday":"Outdoor Play","tuesday":"Nature Walk","wednesday":"Garden Work","thursday":"Outdoor Adventures","friday":"Free Choice Activities"},
  {"id":"5","time":"12:00 - 1:00","monday":"Lunch","tuesday":"Lunch","wednesday":"Lunch","thursday":"Lunch","friday":"Lunch"},
  {"id":"6","time":"1:00 - 2:00","monday":"Rest Time","tuesday":"Rest Time","wednesday":"Rest Time","thursday":"Rest Time","friday":"Rest Time"},
  {"id":"7","time":"2:00 - 3:30","monday":"Story & Music","tuesday":"Art & Painting","wednesday":"Puppetry & Drama","thursday":"Movement & Games","friday":"Week Review & Sharing"},
  {"id":"8","time":"3:30 - 4:00","monday":"Afternoon Snack","tuesday":"Afternoon Snack","wednesday":"Afternoon Snack","thursday":"Afternoon Snack","friday":"Afternoon Snack"},
  {"id":"9","time":"4:00 - 4:30","monday":"Departure","tuesday":"Departure","wednesday":"Departure","thursday":"Departure","friday":"Departure"}
]'::jsonb)
ON CONFLICT (key) DO NOTHING;