#!/usr/bin/env node

/**
 * Process registrations into normalized parent/student structure
 * This script:
 * 1. Creates unique parent records (deduped by email)
 * 2. Creates unique student records (deduped by name + DOB)
 * 3. Links registrations to parents and students
 * 4. Creates enrollments for each week selected
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Track processing results
const results = {
  parents: { created: 0, existing: 0 },
  students: { created: 0, existing: 0 },
  enrollments: { created: 0, errors: 0 },
  errors: []
};

async function processRegistrations() {
  console.log('Processing registrations into normalized structure...\n');
  
  try {
    // First, create camp sessions for 2025
    await createCampSessions();
    
    // Get all registrations
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at');
    
    if (error) throw error;
    
    console.log(`Found ${registrations.length} registrations to process\n`);
    
    // Process each registration
    for (const reg of registrations) {
      try {
        console.log(`Processing: ${reg.child_name} (${reg.email})`);
        
        // 1. Create or get parent
        const parentId = await createOrGetParent(reg);
        
        // 2. Create or get student
        const studentId = await createOrGetStudent(reg);
        
        // 3. Link parent to student
        await linkParentStudent(parentId, studentId, true);
        
        // 4. Create enrollments for each week
        await createEnrollments(studentId, reg);
        
        // 5. Update registration with parent/student IDs (optional)
        await supabase
          .from('registrations')
          .update({ 
            admin_notes: `Linked to parent: ${parentId}, student: ${studentId}` 
          })
          .eq('id', reg.id);
          
      } catch (err) {
        console.error(`  Error: ${err.message}`);
        results.errors.push({
          registration: reg.child_name,
          error: err.message
        });
      }
    }
    
    // Print summary
    console.log('\n=== Processing Complete ===');
    console.log(`Parents: ${results.parents.created} created, ${results.parents.existing} existing`);
    console.log(`Students: ${results.students.created} created, ${results.students.existing} existing`);
    console.log(`Enrollments: ${results.enrollments.created} created`);
    console.log(`Errors: ${results.errors.length}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach(e => {
        console.log(`- ${e.registration}: ${e.error}`);
      });
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

async function createCampSessions() {
  console.log('Creating camp sessions for 2025...');
  
  const sessions = [
    { week: 1, name: 'Week 1 - Welcome to Summer', start: '2025-06-02', end: '2025-06-06' },
    { week: 2, name: 'Week 2 - Ocean Adventure', start: '2025-06-09', end: '2025-06-13' },
    { week: 3, name: 'Week 3 - Nature Explorer', start: '2025-06-16', end: '2025-06-20' },
    { week: 4, name: 'Week 4 - Arts & Crafts', start: '2025-06-23', end: '2025-06-27' },
    { week: 5, name: 'Week 5 - Sports Week', start: '2025-06-30', end: '2025-07-04' },
    { week: 6, name: 'Week 6 - Science Fun', start: '2025-07-07', end: '2025-07-11' },
    { week: 7, name: 'Week 7 - Grand Finale', start: '2025-07-14', end: '2025-07-18' }
  ];
  
  for (const session of sessions) {
    const { error } = await supabase
      .from('camp_sessions')
      .upsert({
        year: 2025,
        week_number: session.week,
        session_name: session.name,
        start_date: session.start,
        end_date: session.end,
        mini_camp_price: 5000,
        explorer_camp_price: 5000
      }, {
        onConflict: 'year,week_number'
      });
    
    if (error && !error.message.includes('duplicate')) {
      console.error('Session creation error:', error);
    }
  }
}

async function createOrGetParent(registration) {
  // Check if parent exists
  const { data: existing } = await supabase
    .from('parents')
    .select('id')
    .eq('email', registration.email)
    .single();
  
  if (existing) {
    results.parents.existing++;
    return existing.id;
  }
  
  // Create new parent
  const { data: newParent, error } = await supabase
    .from('parents')
    .insert({
      email: registration.email,
      full_name: registration.parent_name_1,
      phone_primary: registration.mobile_phone_1,
      phone_secondary: registration.mobile_phone_2,
      wechat_whatsapp: registration.wechat_whatsapp_1
    })
    .select('id')
    .single();
  
  if (error) throw error;
  
  results.parents.created++;
  return newParent.id;
}

async function createOrGetStudent(registration) {
  // Check if student exists (by name and DOB)
  const { data: existing } = await supabase
    .from('students')
    .select('id')
    .eq('full_name', registration.child_name)
    .eq('date_of_birth', registration.date_of_birth)
    .single();
  
  if (existing) {
    results.students.existing++;
    return existing.id;
  }
  
  // Create new student
  const { data: newStudent, error } = await supabase
    .from('students')
    .insert({
      full_name: registration.child_name,
      nick_name: registration.nick_name,
      gender: registration.gender,
      date_of_birth: registration.date_of_birth,
      current_school: registration.current_school,
      nationality: registration.nationality_language,
      english_level: registration.english_level,
      allergies: registration.allergies,
      medical_conditions: registration.health_behavioral_conditions,
      emergency_contact_name: registration.emergency_contact,
      photo_permission: registration.photo_permission,
      passport_url: registration.child_passport_url,
      insurance_policy_url: registration.insurance_policy_url
    })
    .select('id')
    .single();
  
  if (error) throw error;
  
  results.students.created++;
  return newStudent.id;
}

async function linkParentStudent(parentId, studentId, isPrimary = true) {
  // Check if link exists
  const { data: existing } = await supabase
    .from('parent_student')
    .select('id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();
  
  if (!existing) {
    const { error } = await supabase
      .from('parent_student')
      .insert({
        parent_id: parentId,
        student_id: studentId,
        relationship: 'parent',
        is_primary: isPrimary
      });
    
    if (error && !error.message.includes('duplicate')) {
      throw error;
    }
  }
}

async function createEnrollments(studentId, registration) {
  // Get session IDs for the selected weeks
  const { data: sessions } = await supabase
    .from('camp_sessions')
    .select('id, week_number')
    .eq('year', 2025)
    .in('week_number', registration.weeks_selected);
  
  if (!sessions) return;
  
  // Create enrollment for each week
  for (const session of sessions) {
    const { error } = await supabase
      .from('enrollments')
      .insert({
        student_id: studentId,
        session_id: session.id,
        registration_id: registration.id,
        camp_type: registration.age_group,
        payment_status: registration.payment_status,
        payment_amount: registration.payment_amount,
        payment_date: registration.payment_date,
        payment_method: registration.payment_method,
        payment_reference: registration.payment_reference
      });
    
    if (error) {
      if (!error.message.includes('duplicate')) {
        console.error(`  Enrollment error for week ${session.week_number}:`, error.message);
        results.enrollments.errors++;
      }
    } else {
      results.enrollments.created++;
    }
  }
}

// Run the processing
processRegistrations();