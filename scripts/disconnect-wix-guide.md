# How to Disconnect waldorfphuket.com from WIX

Since you can't delete the A records and CNAME in GoDaddy, the domain is likely still connected to WIX. Here's how to disconnect it:

## Step 1: Disconnect from WIX Side

1. **Log into your WIX account** at https://www.wix.com

2. **Go to your Dashboard** → **Settings** → **Domains**

3. **Find waldorfphuket.com** in your domain list

4. **Click the three dots** (More Actions) next to the domain

5. Choose one of these options:
   - **"Unassign from Site"** - If you just want to disconnect it from the website
   - **"Remove from Wix"** - If you want to completely remove it from WIX

6. **Confirm the disconnection**

## Step 2: Clean Up in GoDaddy (After WIX Disconnection)

Once WIX releases control, you should be able to:

1. **Delete the A records**:
   - 15.197.142.173
   - 3.33.152.147

2. **Delete the problematic www CNAME** that points to waldorfphuket.com

## Important Notes:

- **Email will still work** - The MX records you added will ensure email continues to function
- **Website will go offline** - waldorfphuket.com won't show any website (which is fine since you moved to bamboovalleyphuket.com)
- **This is safe** - You're not losing the domain, just disconnecting it from WIX

## If You Can't Find the Domain in WIX:

The domain might be connected through WIX's DNS service rather than your account. In this case:

1. **In GoDaddy**, check if the nameservers are pointing to WIX (like ns1.wixdns.net)
2. If yes, change them back to GoDaddy's default:
   - ns41.domaincontrol.com
   - ns42.domaincontrol.com

## Alternative: Keep the Records

If disconnecting from WIX is complicated, you can simply:
- **Leave the A records and CNAME as they are**
- Your email will still work fine with the MX records you added
- The website part just won't work (which doesn't matter since you're using bamboovalleyphuket.com now)

## Does WIX Have an API?

WIX does have APIs, but they don't provide domain management capabilities through their API. Domain disconnection must be done through their web interface.