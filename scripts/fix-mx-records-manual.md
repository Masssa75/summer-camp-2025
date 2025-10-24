# Manual Steps to Fix waldorfphuket.com Email (MX Records)

## Quick Summary
Your emails to info@waldorfphuket.com aren't working because the MX records (which tell email where to go) are missing after you moved your website to bamboovalleyphuket.com. Here's how to fix it:

## Step-by-Step Instructions

### 1. Log into GoDaddy
- Go to https://www.godaddy.com
- Sign in with your account
- Click on "My Products" or "Domains"
- Find `waldorfphuket.com` and click "Manage" or "DNS"

### 2. Add Google Workspace MX Records
You need to add 5 MX records. For each one, click "Add" or "Add Record" and enter:

#### Record 1:
- Type: **MX**
- Name/Host: **@** (or leave blank)
- Points to/Value: **ASPMX.L.GOOGLE.COM**
- Priority: **1**
- TTL: **1 Hour** (or 3600)

#### Record 2:
- Type: **MX**
- Name/Host: **@** (or leave blank)
- Points to/Value: **ALT1.ASPMX.L.GOOGLE.COM**
- Priority: **5**
- TTL: **1 Hour** (or 3600)

#### Record 3:
- Type: **MX**
- Name/Host: **@** (or leave blank)
- Points to/Value: **ALT2.ASPMX.L.GOOGLE.COM**
- Priority: **5**
- TTL: **1 Hour** (or 3600)

#### Record 4:
- Type: **MX**
- Name/Host: **@** (or leave blank)
- Points to/Value: **ALT3.ASPMX.L.GOOGLE.COM**
- Priority: **10**
- TTL: **1 Hour** (or 3600)

#### Record 5:
- Type: **MX**
- Name/Host: **@** (or leave blank)
- Points to/Value: **ALT4.ASPMX.L.GOOGLE.COM**
- Priority: **10**
- TTL: **1 Hour** (or 3600)

### 3. Clean Up Old Records
Delete these problematic records if you see them:

#### A Records to Delete:
- Any A record with IP: **15.197.142.173**
- Any A record with IP: **3.33.152.147**

#### CNAME Record to Delete:
- The **www** CNAME that points to **waldorfphuket.com** (this creates a loop)

### 4. Save Changes
- Click "Save" or "Save All Records"
- Changes will take 1-48 hours to propagate (usually 1-4 hours)

## Testing
After 1-2 hours:
1. Send a test email to info@waldorfphuket.com from another email account
2. Check your Google Workspace inbox
3. If it doesn't work after 4 hours, double-check the MX records

## Troubleshooting
If emails still don't work after 24 hours:
1. Verify all 5 MX records are added correctly (no typos!)
2. Make sure no other MX records exist
3. Check Google Workspace Admin console to ensure waldorfphuket.com is verified
4. Contact Google Workspace support if needed

## Why This Happened
When you moved your website from waldorfphuket.com to bamboovalleyphuket.com on WIX, the DNS settings got reset, removing the MX records that tell email servers where to deliver your waldorfphuket.com emails.