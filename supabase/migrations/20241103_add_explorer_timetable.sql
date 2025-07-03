-- Add explorer timetable to camp_settings
INSERT INTO camp_settings (key, value)
VALUES ('explorer_timetable', '[
  {"id":"1","time":"8:00 - 8:45","monday":"Arrival & Morning Circle","tuesday":"Arrival & Morning Circle","wednesday":"Arrival & Morning Circle","thursday":"Arrival & Morning Circle","friday":"Arrival & Morning Circle"},
  {"id":"2","time":"8:45 - 10:15","monday":"STEM Activities","tuesday":"Arts & Crafts","wednesday":"Sports & Games","thursday":"Nature Exploration","friday":"Weekly Challenge"},
  {"id":"3","time":"10:15 - 10:45","monday":"Morning Snack","tuesday":"Morning Snack","wednesday":"Morning Snack","thursday":"Morning Snack","friday":"Morning Snack"},
  {"id":"4","time":"10:45 - 12:00","monday":"Adventure Activities","tuesday":"Drama & Theatre","wednesday":"Swimming","thursday":"Coding & Tech","friday":"Team Building"},
  {"id":"5","time":"12:00 - 1:00","monday":"Lunch","tuesday":"Lunch","wednesday":"Lunch","thursday":"Lunch","friday":"Lunch"},
  {"id":"6","time":"1:00 - 2:00","monday":"Quiet Time/Reading","tuesday":"Quiet Time/Reading","wednesday":"Quiet Time/Reading","thursday":"Quiet Time/Reading","friday":"Quiet Time/Reading"},
  {"id":"7","time":"2:00 - 3:30","monday":"Creative Workshop","tuesday":"Science Lab","wednesday":"Music & Dance","thursday":"Environmental Project","friday":"Showcase Prep"},
  {"id":"8","time":"3:30 - 4:00","monday":"Afternoon Snack","tuesday":"Afternoon Snack","wednesday":"Afternoon Snack","thursday":"Afternoon Snack","friday":"Afternoon Snack"},
  {"id":"9","time":"4:00 - 4:30","monday":"Reflection & Departure","tuesday":"Reflection & Departure","wednesday":"Reflection & Departure","thursday":"Reflection & Departure","friday":"Reflection & Departure"}
]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Rename existing timetable key to be more specific
UPDATE camp_settings 
SET key = 'mini_timetable' 
WHERE key = 'timetable';