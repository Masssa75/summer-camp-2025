-- Create teacher recruitment contacts table
CREATE TABLE teacher_recruitment_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id text UNIQUE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  category text NOT NULL CHECK (category IN ('university', 'jobsite', 'network', 'school', 'social')),
  summary text,
  website text,
  email text,
  phone text,
  contact_info text,
  key_person text,
  groups text[],
  note text,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Index for efficient ordering
CREATE INDEX idx_teacher_contacts_sort_order ON teacher_recruitment_contacts(sort_order);
CREATE INDEX idx_teacher_contacts_category ON teacher_recruitment_contacts(category);
CREATE INDEX idx_teacher_contacts_priority ON teacher_recruitment_contacts(priority);

-- RLS policies
ALTER TABLE teacher_recruitment_contacts ENABLE ROW LEVEL SECURITY;

-- Allow read access to teacher contacts for everyone
CREATE POLICY "Allow read access to teacher contacts" ON teacher_recruitment_contacts
  FOR SELECT USING (true);

-- Allow authenticated users to manage teacher contacts (for now)
CREATE POLICY "Allow authenticated users to manage teacher contacts" ON teacher_recruitment_contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data with proper sort order
INSERT INTO teacher_recruitment_contacts (contact_id, name, location, priority, category, summary, website, email, phone, contact_info, key_person, groups, note, description, sort_order) VALUES

-- THAILAND ORGANIZATIONS (sort_order 1-12)
('rajabhat', 'Rajabhat University Phuket', 'Phuket', 'high', 'university', 'Local teacher training with progressive methods', 'http://pkru.ac.th', 'ece@pkru.ac.th', '076-211-959', 'Early Childhood Education Department', 'Head of Early Childhood Education Department', NULL, NULL, 'Local university training early childhood teachers with progressive methods. Graduates often stay in Phuket and seek innovative schools.', 1),

('alliance', 'Alternative Education Alliance Thailand', 'Thailand-wide', 'high', 'network', 'Coalition of all alternative schools in Thailand', NULL, NULL, NULL, 'Through member schools like Panyotai Waldorf', 'Contact conference organizers or Panyotai School for network access', NULL, NULL, 'Coalition of ALL alternative schools in Thailand. Annual gatherings where progressive teachers network and seek new positions.', 2),

('act', 'Asian College of Teachers (ACT)', 'Bangkok', 'high', 'university', 'Trains 50,000+ teachers in alternative methods', 'https://asiancollegeofteachers.com', 'info@asiancollegeofteachers.com', '+66 2 213 3939', NULL, 'Admissions Office for teacher placement partnerships', NULL, NULL, 'Trains 50,000+ teachers in Montessori and alternative methods. Fresh graduates seeking schools that match their progressive training.', 3),

('facebook', 'Facebook Groups', 'Online', 'high', 'social', 'Active communities of alternative education teachers', NULL, NULL, NULL, NULL, NULL, ARRAY['การศึกษาทางเลือก (Alternative Education Thailand)', 'Waldorf Education Thailand', 'Montessori Thailand Community'], NULL, 'Active Thai teachers already believing in alternative education. Post about outdoor learning and discovering children''s magic powers.', 4),

('panyotai', 'Panyotai Waldorf School', 'Bangkok', 'medium', 'school', 'Thailand''s first Waldorf school', 'https://panyotai.com', 'info@panyotai.com', '02-885-2670', NULL, 'School Director or HR Department', NULL, NULL, 'Thailand''s first Waldorf school. Experienced teachers who understand child development and may seek new adventures in Phuket.', 5),

('montessori-foundation', 'Thai Montessori Foundation', 'Thailand', 'medium', 'network', 'National Montessori teacher network', NULL, 'thaimontessorifoundation@gmail.com', NULL, 'Through member schools', 'Conference organizers or established Montessori schools', NULL, NULL, 'National Montessori network. Teachers here specifically interested in nature-based approaches to Montessori education.', 6),

('eef', 'Equitable Education Fund (EEF)', 'Bangkok', 'medium', 'network', 'Government fund connecting innovative educators', 'https://www.eef.or.th', 'contact@eef.or.th', '02-079-5475', NULL, NULL, NULL, NULL, 'Government fund connecting innovative educators. Their network includes teachers passionate about educational transformation.', 7),

('ajarn', 'Ajarn.com', 'Online', 'medium', 'jobsite', 'Thailand''s main teaching job board', 'https://www.ajarn.com', 'info@ajarn.com', NULL, NULL, NULL, NULL, NULL, 'Thailand''s main teaching job site. Teachers browsing here often seek escape from traditional schools.', 8),

('rainbow-montessori', 'Rainbow Montessori Phuket', 'Phuket (Competing School)', 'low', 'school', 'Local competing Montessori school', NULL, NULL, NULL, NULL, NULL, NULL, 'Competing Montessori school - unlikely to share teachers', 'Local Montessori school. While they won''t help with recruitment, knowing their approach helps position your unique outdoor offering.', 9),

('sunshine-village', 'Phuket Sunshine Village', 'Phuket (Competing School)', 'low', 'school', 'Local competing alternative school', NULL, NULL, NULL, NULL, NULL, NULL, 'Alternative school in Phuket - approach diplomatically', 'Another alternative school in Phuket. Unlikely to help with recruitment but worth understanding their approach.', 10),

('green-school', 'Green School Bali Network', 'Bali, Indonesia', 'low', 'school', 'Nature-based school alumni network', 'https://www.greenschool.org', 'info@greenschool.org', NULL, NULL, 'Alumni Relations Office', NULL, NULL, 'Nature-based school with teachers who already believe in outdoor learning. Many alumni seek tropical teaching positions.', 11),

('siratthaya', 'Siratthaya Waldorf Learning Center', 'Thailand', 'low', 'school', 'Waldorf learning center with heart-centered approach', NULL, NULL, NULL, 'Through Waldorf network', NULL, NULL, NULL, 'Waldorf teachers who believe in heart-centered education. Small community where everyone knows who''s looking for new opportunities.', 12),

-- SINGAPORE ORGANIZATIONS (sort_order 13-16)
('nie-singapore', 'NIE (National Institute of Education)', 'Singapore', 'high', 'university', 'Singapore''s only teacher training institute', 'https://www.nie.edu.sg', 'admissions@nie.edu.sg', NULL, 'Teacher Training Admissions Office', NULL, NULL, NULL, 'Singapore''s premier teacher training institution. Graduates are highly qualified and many seek international opportunities in progressive education settings.', 13),

('ecda-singapore', 'ECDA (Early Childhood Development Agency)', 'Singapore', 'high', 'network', 'Certifies all early childhood educators in Singapore', 'https://www.ecda.gov.sg', 'contact@ecda.gov.sg', NULL, 'Professional Development Division', NULL, NULL, NULL, 'Government agency that certifies early childhood teachers. Their certified teachers often seek new challenges in innovative international schools.', 14),

('relief-teacher-sg', 'Relief Teacher Singapore', 'Singapore', 'medium', 'social', '15,000+ member Facebook group of substitute teachers', NULL, NULL, NULL, 'Facebook Group', NULL, ARRAY['Relief Teacher Singapore (Facebook - 15,000+ members)'], NULL, 'Large community of relief teachers, many seeking full-time positions. Active group where teachers discuss opportunities and alternative education approaches.', 15),

('jobscentral-sg', 'JobsCentral Singapore', 'Singapore', 'medium', 'jobsite', 'Major job portal with education section', 'https://www.jobscentral.com.sg', 'employers@jobscentral.com.sg', NULL, NULL, NULL, NULL, NULL, 'Singapore''s leading job portal. Education section attracts teachers seeking new opportunities, including international positions.', 16),

-- MALAYSIA ORGANIZATIONS (sort_order 17-20)
('university-malaya', 'University of Malaya - Faculty of Education', 'Malaysia', 'high', 'university', 'Top education program in Malaysia', 'https://www.um.edu.my/faculties/faculty-of-education', 'education@um.edu.my', NULL, 'Faculty of Education Career Services', NULL, NULL, NULL, 'Malaysia''s premier education faculty. Graduates are well-trained and many seek international teaching opportunities in progressive schools.', 17),

('malaysian-kindergarten', 'Malaysian Association of Kindergartens', 'Malaysia', 'high', 'network', 'Direct access to trained early childhood teachers', NULL, NULL, NULL, 'Through member kindergartens', NULL, NULL, NULL, 'National association connecting kindergarten teachers. Members often seek new opportunities in innovative early childhood programs.', 18),

('montessori-malaysia', 'Montessori Malaysia Network', 'Malaysia', 'medium', 'network', 'Alternative education community', NULL, NULL, NULL, 'Through Montessori schools and training centers', NULL, NULL, NULL, 'Growing network of Montessori-trained teachers who understand child-centered education and nature-based learning approaches.', 19),

('teachformalaysia-alumni', 'TeachForMalaysia Alumni Network', 'Malaysia', 'medium', 'network', 'Passionate educators open to innovation', 'https://teachformalaysia.org', 'alumni@teachformalaysia.org', NULL, NULL, NULL, NULL, NULL, 'Network of passionate educators committed to educational transformation. Alumni often seek innovative teaching opportunities.', 20),

-- INDONESIA ORGANIZATIONS (sort_order 21-23)
('green-school-alumni', 'Green School Bali Alumni Network', 'Bali, Indonesia', 'high', 'school', 'Nature-based school alumni already aligned with outdoor learning', 'https://www.greenschool.org', 'alumni@greenschool.org', NULL, NULL, 'Alumni Relations Office', NULL, NULL, 'Network of teachers from the famous Green School Bali. Already believe in nature-based, outdoor learning and many seek similar opportunities in tropical locations.', 21),

('sekolah-alam-network', 'Sekolah Alam Network Indonesia', 'Indonesia', 'medium', 'network', '50+ nature schools across Indonesia', NULL, NULL, NULL, 'Through individual Sekolah Alam schools', NULL, NULL, NULL, 'Network of 50+ nature-based schools across Indonesia. Teachers here specifically believe in outdoor education and natural learning environments.', 22),

('guru-berbagi', 'Guru Berbagi (Teacher Share)', 'Indonesia', 'medium', 'social', 'Indonesia''s largest teacher community', NULL, NULL, NULL, 'Online platform and social media groups', NULL, NULL, NULL, 'Indonesia''s largest teacher sharing community. Platform where progressive teachers connect and share innovative teaching methods.', 23),

-- PHILIPPINES ORGANIZATIONS (sort_order 24-27)
('philippine-normal-university', 'Philippine Normal University', 'Philippines', 'high', 'university', 'Premier teacher training institution', 'https://www.pnu.edu.ph', 'info@pnu.edu.ph', NULL, 'Teacher Education Placement Office', NULL, NULL, NULL, 'Philippines'' premier teacher training university. Graduates are highly qualified and many seek international teaching opportunities.', 24),

('international-school-manila', 'International School Manila Network', 'Philippines', 'high', 'school', 'High-quality international teacher pool', NULL, NULL, NULL, 'Through international school networks in Manila', NULL, NULL, NULL, 'Network of international schools in Manila with experienced teachers who understand progressive education and may seek new opportunities.', 25),

('teach-philippines-alumni', 'Teach for the Philippines Alumni', 'Philippines', 'medium', 'network', 'Young, innovative educators', 'https://teachforthephilippines.org', 'alumni@teachforthephilippines.org', NULL, NULL, NULL, NULL, NULL, 'Network of passionate young educators committed to educational innovation. Alumni often seek opportunities in progressive international schools.', 26),

('edi-staffing', 'EDI Staffing (Education Dimensions Inc.)', 'Philippines', 'medium', 'jobsite', 'Specializes in placing Filipino teachers abroad', 'https://www.edi-staffing.com', 'placement@edi-staffing.com', NULL, NULL, NULL, NULL, NULL, 'Professional recruitment agency specializing in placing Filipino teachers in international schools. Established network of qualified candidates.', 27),

-- VIETNAM ORGANIZATIONS (sort_order 28-29)
('rmit-vietnam', 'RMIT Vietnam - Education Programs', 'Vietnam', 'medium', 'university', 'Western-standard teacher training', 'https://www.rmit.edu.vn', 'study@rmit.edu.vn', NULL, 'Education Faculty Career Services', NULL, NULL, NULL, 'International university offering Western-standard teacher training programs. Graduates seek opportunities in innovative international schools.', 28),

('saigon-teachers', 'Saigon International Teachers Network', 'Vietnam', 'medium', 'social', 'Facebook group with 8,000+ international teacher members', NULL, NULL, NULL, 'Facebook Group', NULL, ARRAY['Saigon International Teachers Network (Facebook - 8,000+ members)'], NULL, 'Large community of international teachers in Vietnam. Active networking group where teachers share opportunities and discuss progressive education.', 29),

-- REGIONAL PLATFORMS (sort_order 30-34)
('tes-jobs-asia', 'TES Jobs Asia', 'Regional (Southeast Asia)', 'high', 'jobsite', 'Premier international school job board', 'https://www.tes.com/jobs/browse/international', 'support@tes.com', NULL, NULL, NULL, NULL, NULL, 'Leading job board for international school positions across Asia. Teachers here specifically seek progressive, innovative school environments.', 30),

('search-associates', 'Search Associates', 'Regional (Southeast Asia)', 'high', 'jobsite', 'Premium teacher recruitment service', 'https://www.searchassociates.com', 'info@searchassociates.com', NULL, NULL, NULL, NULL, NULL, 'Premium recruitment firm for international schools. Worth the investment - they have access to highly qualified teachers seeking innovative opportunities.', 31),

('sea-international-teachers', 'SEA International Teachers', 'Regional (Southeast Asia)', 'medium', 'social', 'Facebook group with 25,000+ members across SEA', NULL, NULL, NULL, 'Facebook Group', NULL, ARRAY['SEA International Teachers (Facebook - 25,000+ members)'], NULL, 'Massive community of international teachers across Southeast Asia. Very active group for sharing opportunities and connecting with progressive educators.', 32),

('alternative-education-sea', 'Alternative Education Southeast Asia', 'Regional (Southeast Asia)', 'high', 'social', 'Facebook group with 12,000+ alternative education advocates', NULL, NULL, NULL, 'Facebook Group', NULL, ARRAY['Alternative Education Southeast Asia (Facebook - 12,000+ members)'], NULL, 'Community specifically focused on alternative education across SEA. Perfect match for teachers who believe in discovering children''s magic powers.', 33),

('teacher-horizons', 'Teacher Horizons', 'Regional (Southeast Asia)', 'medium', 'jobsite', 'Modern platform connecting international teachers', 'https://www.teacherhorizons.com', 'support@teacherhorizons.com', NULL, NULL, NULL, NULL, NULL, 'Modern recruitment platform specifically for international teachers. User-friendly interface attracts younger, tech-savvy educators seeking progressive opportunities.', 34);