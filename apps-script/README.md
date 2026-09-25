# Bedside Dashboard Calendar Backend

This Google Apps Script web app reads the deploying user's default Google Calendar and returns today's events to the Bedside Dashboard.

## Setup

1. Open https://script.google.com and create a new project.
2. Replace `Code.gs` with the contents of this folder's `Code.gs`.
3. In **Project Settings**, enable **Show `appsscript.json` manifest file in editor** if needed, then replace the manifest with this folder's `appsscript.json`.
4. In **Project Settings → Script Properties**, add:
   - Property: `DASHBOARD_KEY`
   - Value: a long random secret string.
5. Run any Calendar-using function once (or deploy) and approve the requested Google Calendar read-only permission.
6. Choose **Deploy → New deployment → Web app**.
7. Configure the web app to **Execute as: Me** and allow access to **Anyone** (including anonymous access, when shown by the UI), then deploy.
8. Copy the `/exec` Web App URL.
9. In the iPad Dashboard, open **Calendar 設定**, paste the Web App URL and the same `DASHBOARD_KEY`, then choose **儲存並測試**.

After this one-time setup, the Dashboard automatically fetches today's events whenever it opens and every five minutes while visible. The browser no longer needs to obtain or refresh a Google OAuth token.

## Security

Do not commit the real `DASHBOARD_KEY` to this public repository. Keep it only in Apps Script Script Properties and on your iPad. Anyone who has both the Web App URL and the key can read the event fields returned by this script.
