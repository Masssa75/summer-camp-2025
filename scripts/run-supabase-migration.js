#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const PROJECT_REF = 'xunccqdrybxpwcvafvag'

async function runMigration(migrationFile) {
  try {
    // Check if migration file is provided
    if (!migrationFile) {
      console.error('Usage: node run-supabase-migration.js <migration-file>')
      console.error('Example: node run-supabase-migration.js supabase/migrations/20241103_create_camp_settings.sql')
      process.exit(1)
    }

    // Check if file exists
    const migrationPath = path.join(process.cwd(), migrationFile)
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath)
      process.exit(1)
    }

    // Read the migration file
    const sql = fs.readFileSync(migrationPath, 'utf8')
    console.log(`Running migration: ${migrationFile}...`)

    // Use the Supabase Management API to execute SQL
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    })

    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('Migration failed with error:', responseText)
      
      // Try to parse error for better display
      try {
        const errorData = JSON.parse(responseText)
        console.error('\nError details:', errorData.message)
      } catch (e) {
        console.error('\nRaw error:', responseText)
      }
      
      console.log('\n=== MANUAL MIGRATION INSTRUCTIONS ===')
      console.log('Please run this SQL manually in your Supabase dashboard:')
      console.log(`1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`)
      console.log('2. Copy and paste the SQL from:', migrationFile)
      console.log('3. Click "Run" to execute the migration')
      process.exit(1)
    }

    // Parse result
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      result = responseText
    }

    console.log('✅ Migration completed successfully!')
    if (result && result.length > 0) {
      console.log('Result:', result)
    }
    
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

// Get migration file from command line arguments
const migrationFile = process.argv[2]
runMigration(migrationFile)