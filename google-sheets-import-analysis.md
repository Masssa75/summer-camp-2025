# Google Sheets Import Analysis

## Overview
We need to import registrations from two Google Sheets into our Supabase database:
1. **Explorer Camp (7-13)**: ~30+ registrations
2. **Mini Camp (3-6)**: ~15+ registrations

## Column Mapping

### Direct Mappings (Same in both sheets)
| Google Sheets Column | Database Field | Notes |
|---------------------|----------------|-------|
| Email Address | email | Direct copy |
| Child Name | child_name | Direct copy |
| Nick Name | nick_name | Direct copy |
| Gender | gender | Direct copy |
| Date of birth | date_of_birth | Parse date format |
| Current School | current_school | Direct copy |
| Nationality and Language | nationality_language | Direct copy |
| Child's English Level | english_level | Direct copy |
| Parent Name 1 | parent_name_1 | Direct copy |
| Parent Name 2 | parent_name_2 | Direct copy |
| Emergency Contact | emergency_contact | Direct copy |
| Child's Allergies | allergies | Direct copy |
| Health Conditions | health_behavioral_conditions | Direct copy |
| Photo Permission | photo_permission | Convert to boolean |
| How They Found Out | how_did_you_find | Direct copy |

### Derived Fields
| Database Field | Source | Logic |
|----------------|--------|-------|
| age_group | Calculated | 'mini' for 3-6 sheet, 'explorer' for 7-13 sheet |
| weeks_selected | "Weeks to Join" column | Parse text to array of numbers |
| has_insurance | "Insurance Policy Link" | True if link exists |
| terms_acknowledged | "Confirmation/Acceptance" | True if has value |
| all_statements_true | "Confirmation/Acceptance" | True if has value |

### Payment Fields (from Google Sheets admin columns)
| Google Sheets Column | Database Field | Notes |
|---------------------|----------------|-------|
| Payment Received | payment_date | Parse date, set payment_status to 'paid' if exists |
| Payment Amount | payment_amount | Parse currency amount |
| Payment Request Sent | - | Not stored, but indicates pending if no payment |
| Confirmation Email Sent | - | Not stored in our schema |

### Contact Information Mapping
The sheets have slightly different formats:
- **Explorer Camp**: Has separate phone fields
- **Mini Camp**: Has combined contact fields

We'll need to parse and extract:
- Mobile phone numbers → mobile_phone_1, mobile_phone_2
- WeChat/WhatsApp IDs → wechat_whatsapp_1, wechat_whatsapp_2

### Document URLs
Google Sheets stores document links. We'll need to:
1. Extract the Google Drive file ID from each link
2. Download the file
3. Upload to Supabase Storage
4. Store the new URL in database

Fields affected:
- child_passport_url
- parent_passport_1_url
- parent_passport_2_url

## Data Transformation Requirements

### 1. Week Parsing
Google Sheets format: "Week 1, Week 2, Week 3" or "Week 1-3"
Database format: [1, 2, 3]

### 2. Date Parsing
Google Sheets format: Various (MM/DD/YYYY, DD/MM/YYYY)
Database format: YYYY-MM-DD

### 3. Payment Amount
Google Sheets format: "฿10,000" or "10000 THB"
Database format: Decimal (10000.00)

### 4. Boolean Conversion
Google Sheets: "Yes", "No", "Granted", empty
Database: true/false

## Import Process

### Step 1: Data Validation
- Check for duplicate emails
- Validate required fields
- Ensure dates are parseable
- Verify age matches camp type

### Step 2: File Migration (Optional)
- Download passport/insurance documents from Google Drive
- Upload to Supabase Storage
- Update URLs in data

### Step 3: Data Import
- Transform each row according to mapping
- Insert into registrations table
- Log any errors or skipped rows

### Step 4: Post-Import
- Generate report of imported/skipped records
- Create audit log of import process
- Send notifications for new registrations

## Potential Issues

1. **Duplicate Registrations**: Same child registered multiple times
2. **Missing Required Fields**: Some rows might have incomplete data
3. **Date Format Inconsistencies**: Different date formats used
4. **File Access**: Google Drive files might have restricted access
5. **Payment Status**: Need to determine logic for partial payments

## Implementation Plan

```javascript
// Pseudo-code for import process
async function importRegistrations() {
  // 1. Fetch both sheets
  const explorerData = await fetchGoogleSheet(EXPLORER_SHEET_URL)
  const miniData = await fetchGoogleSheet(MINI_SHEET_URL)
  
  // 2. Transform data
  const explorerRegistrations = explorerData.map(row => ({
    ...transformBasicFields(row),
    age_group: 'explorer',
    weeks_selected: parseWeeks(row['Weeks to Join']),
    payment_status: row['Payment Received'] ? 'paid' : 'pending',
    // ... etc
  }))
  
  const miniRegistrations = miniData.map(row => ({
    ...transformBasicFields(row),
    age_group: 'mini',
    // ... etc
  }))
  
  // 3. Validate and insert
  const allRegistrations = [...explorerRegistrations, ...miniRegistrations]
  const results = await batchInsertRegistrations(allRegistrations)
  
  // 4. Generate report
  return generateImportReport(results)
}
```

## Next Steps

1. **Confirm mapping** - Review the column mappings above
2. **Handle edge cases** - Decide how to handle missing/invalid data
3. **Test with sample** - Import a few records first
4. **Full import** - Run complete import with logging
5. **Verify data** - Check imported records in admin panel