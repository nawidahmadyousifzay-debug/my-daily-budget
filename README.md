# My Daily Budget — Android + Windows application project

Personal finance tracker in AFN with English, Pashto and Dari interface. Features income, expenses, savings, monthly dashboard, expense-category charts, daily outcome calculations, printable monthly report, CSV export, online Netlify Postgres storage, and PIN-protected API access.

## Important architecture
- `public/` is the installable PWA (works on modern Android, Windows browsers, and iPhone browsers; the iPhone install step is Add to Home Screen).
- `electron/` and `electron-builder.yml` build the Windows desktop installer (.exe).
- `capacitor.config.json` is the Android wrapper configuration. Android project files are generated locally by Capacitor.
- Netlify Functions and the SQL migration provide online data storage. Deploy the backend before using the app with real records.

## 1. Deploy online backend and website
1. Create a GitHub repository and upload this project folder.
2. In Netlify, choose **Add new project → Import an existing project**, select the repository, and deploy.
3. Use Node.js 20.12.2 or newer for the build environment.
4. Add a strong secret environment variable named `BUDGET_PIN` in **Project configuration → Environment variables**. Scope it to Functions and builds if prompted. Do not put the PIN in HTML, JavaScript, Git, or a public document.
5. Enable/provision Netlify Database for the site under **Data & Storage → Database** if it is not already provisioned. The `@netlify/database` dependency and migration in `netlify/database/migrations/` are intended for Netlify's deployment migration workflow.
6. Trigger a new production deploy after adding the environment variable and database. Open the live site and enter the PIN when prompted.

If your Netlify account does not offer Netlify Database, the backend needs to be adapted to another hosted Postgres provider before production use. Do not use the app for important records until a test transaction survives refresh and is visible from another device.

## 2. Install as a PWA (no APK needed)
Open the deployed HTTPS website in Chrome or Edge. Use the browser's **Install app** control (or menu → Install app / Add to Home screen). On iPhone Safari, use **Share → Add to Home Screen**. This gives an app icon and standalone window.

## 3. Build Android APK
Requirements: Windows/macOS/Linux, Node.js 20+, Android Studio, Android SDK and a JDK version supported by the installed Android Gradle Plugin.

```bash
npm install
npx cap add android
```
Edit `capacitor.config.json` and set `server.url` to your deployed HTTPS Netlify URL for a cloud-backed Android build. Keep the `webDir` fallback for local preview. Then:

```bash
npx cap sync android
npx cap open android
```
In Android Studio, wait for Gradle sync, then choose **Build → Build Bundle(s) / APK(s) → Build APK(s)**. For Play Store distribution, create a signed Android App Bundle using **Build → Generate Signed Bundle / APK**. Never share your signing keystore or passwords.

## 4. Build Windows EXE
Requirements: Windows 10/11, Node.js 20+.

```powershell
npm install
Edit `electron/main.cjs` and replace `https://YOUR-SITE.netlify.app` with your actual deployed site URL, then run:

```powershell
npm run desktop:build
```
The installer is created in `dist/` or `release/` depending on electron-builder output. Use the actual URL of your deployed site. The EXE wrapper loads the hosted web app so records stay online and synchronized.

For local development of the backend:
```bash
npm install
npm run dev
```

## Financial calculations
- Available balance = total income − total expenses − savings contributions.
- Savings are shown separately, not double-counted as expenses.
- Average daily expense = selected month's expenses / number of calendar days in that month.
- Monthly report uses the selected month; CSV export exports that month's transactions.

## Security notes
This starter app uses a single shared PIN gate, not individual user accounts. Choose a long random PIN, keep the deployed site URL private if appropriate, and do not store highly sensitive financial details until you have tested deployment, backups, and access controls. Add proper user authentication and rate limiting before multi-user or public distribution. API requests are HTTPS on the Netlify domain.
