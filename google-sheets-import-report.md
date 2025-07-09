# Google Sheets Import Report
Generated: January 9, 2025

## Summary
- Total Explorer Camp (7-13) registrations: ~30+
- Total Mini Camp (3-6) registrations: ~15+
- Duplicates found that need review

## Duplicates Found

### Explorer Camp (7-13) - Duplicates
**Email Duplicates:**
1. **jiaolei1986@gmail.com** (2 registrations)
   - Could be siblings or different week selections
   
2. **assafster@gmail.com** (4 registrations)
   - Multiple children from same family
   
3. **nikizhang112233@gmail.com** (3 registrations)
   - Multiple registrations
   
4. **moorelin520@gmail.com** (2 registrations)
5. **ivyyezi0430@gmail.com** (2 registrations)
6. **18349397868@163.com** (2 registrations)
7. **youzisenlin0714@163.com** (2 registrations)

**Child Name Duplicates:**
- Tom Cohen (2 entries)
- Ariel Cohen (2 entries)
- Jinglai Jiang / Jiang jing lai (2 entries - possibly same child)

### Mini Camp (3-6) - Duplicates
**Email Duplicates:**
1. **assafster@gmail.com** (2 registrations)
   - Same family as Explorer camp
   
2. **nikizhang112233@gmail.com** (4 registrations)
   - Multiple children
   
3. **annamelman3@gmail.com** (3 registrations)
   - Multiple children/weeks
   
4. **claudegod716@gmail.com** (2 registrations)
5. **18349397868@163.com** (2 registrations)
6. **sugarnes@gmail.com** (2 registrations)
7. **valeriagarciaorellana@gmail.com** (2 registrations)

**Family Groups Identified:**
- **Cohen Family**: Multiple children (Ellie, Michael, Arielle, Albie, Leon)
- Appears to be siblings registered by same parents

## Data Quality Issues to Address

### Missing Required Fields
Some registrations may have:
- Missing phone numbers (using WeChat/WhatsApp only)
- Missing second parent information
- Incomplete health/allergy information

### Date Format Variations
- Some dates in MM/DD/YYYY format
- Some dates in DD/MM/YYYY format
- Will need careful parsing

### Payment Status
- Many show "sent" for payment request but no payment recorded
- Some have payment amounts but no payment dates
- Need to determine how to handle partial payments

### File Migration Challenges
- Google Drive links require authentication
- Some links may be expired or restricted
- Files include passports and insurance documents (sensitive data)

## Recommendations

1. **Handle Duplicates**: 
   - Import all registrations but flag duplicates
   - Admin can review and merge/delete as needed
   - Keep all data for now to avoid losing information

2. **Payment Status Logic**:
   - If "Payment Received" has date → status = 'paid'
   - If "Payment Request Sent" = 'sent' but no payment → status = 'pending'
   - Otherwise → status = 'pending'

3. **File Handling**:
   - For initial import, store Google Drive URLs as-is
   - Create separate process to download/migrate files later
   - This avoids blocking import on file access issues

4. **Data Validation**:
   - Set reasonable defaults for missing fields
   - Log all validation issues for admin review
   - Don't skip registrations with minor issues

## Next Steps

1. **Immediate**: Import all data with Google Drive links preserved
2. **Follow-up**: Create admin tool to review duplicates
3. **Later**: Batch download and migrate files from Google Drive
4. **Future**: Add deduplication logic to prevent future duplicates