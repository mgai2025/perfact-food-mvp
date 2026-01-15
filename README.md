# Perfact Food Marketplace MVP

This is the complete MVP for Perfact Food, built with Next.js 14, Tailwind CSS, and a Mock/Google Sheets Data Layer.

## features
- **Buyer Marketplace**: Search, Filter, Masked Results, "Time to Interest" flow.
- **Admin Dashboard**: Comprehensive management of Sellers, Buyers, Interests, QA, and Shipments.
- **Role-Based Access**: Secure Google Login for Admins.
- **Data Persistence**: Uses an in-memory Mock Database for instant demo, with optional Google Sheets sync.

## Getting Started

### 1. Install Dependencies
You seem to have an issue with `npm` in your path. Please ensure Node.js (v18+) is installed.
Once installed, run:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Admin Access
- Go to [http://localhost:3000/api/auth/signin](http://localhost:3000/api/auth/signin)
- **Demo Login**: Click "Login" with the pre-filled email (no password needed in demo mode).
- **Google Login**: Requires configuration (see below).

## Google Sheets Integration (Optional)

To enable real Google Sheets persistence:
1. Create a project in Google Cloud Console.
2. Enable the **Google Sheets API**.
3. Create a **Service Account** and download the JSON key.
4. Create a new Google Sheet.
5. Share the sheet with the Service Account email (Editor access).
6. Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@...
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   SHEET_ID=your-google-sheet-id
   GOOGLE_CLIENT_ID=... (For Google Login)
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_SECRET=random_string
   NEXTAUTH_URL=http://localhost:3000
   ```
7. Run the setup script to create columns:
   ```bash
   node scripts/setup-sheets.js
   ```

## Deployment
This project is ready for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (if using Google Sheets).
4. Deploy.

## Demo Flow to Test
1. **Buyer**: Go to Home. Search for "Rice", 500 MT. See "Supplier S001". Click "I'm Interested".
2. **Admin**: Log in. See "New Interests" count increase. Go to Interests, see the new entry.
3. **Tracking**: Go to Shipments to see real-time temp tracking mock.
