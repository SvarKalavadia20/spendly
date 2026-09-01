# Spendly — AI-Powered Natural Language Expense Tracker

Spendly is a production-grade personal financial tracking application built with React, Vite, Tailwind CSS, and Google Firebase (Authentication & Cloud Firestore). It enables ultra-fast expense tracking via natural language and speech recognition, complete with zero-unconfirmed-logging safety, automated categorization learning, and monthly analytics.

---

## 1. Prerequisites & Firebase Setup

### 1.1 Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `spendly-app`.
3. Enable **Google Analytics** (optional) and complete creation.

### 1.2 Enable Firebase Authentication
1. In the Firebase Sidebar, navigate to **Build > Authentication**.
2. Click **Get Started**, select **Google** under Additional Providers, and enable it.
3. Choose your project support email and click **Save**.

### 1.3 Provision Cloud Firestore
1. Navigate to **Build > Firestore Database**.
2. Click **Create database**, choose your nearest region, and start in **Production mode**.
3. Deploy the provided `firestore.rules` file to enforce strict user data isolation.

### 1.4 Register Web App
1. In your Firebase Project Overview, click the **Web (</>)** icon.
2. Register the app as `spendly-web`.
3. Copy the `firebaseConfig` keys into your local `.env` file.

---

## 2. Local Installation & Startup

```bash
# 1. Install dependencies
npm install

# 2. Configure Environment Variables
cp .env.example .env
# Paste your Firebase project keys into .env

# 3. Start local development server
npm run dev

# 4. Run test suite
npm run test