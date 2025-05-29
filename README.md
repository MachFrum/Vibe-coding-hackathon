
# MaliTrack - Empowering Small Businesses 🚀

**MaliTrack is a modern web application designed to simplify small business management, offering intuitive tools for bookkeeping, inventory tracking, local networking, and AI-powered insights.**

## Overview

In today's fast-paced market, small business owners need efficient tools to stay organized and competitive. MaliTrack provides a comprehensive suite of features to manage core business operations, from tracking finances and inventory to customizing a public-facing portfolio and gaining valuable business advice through AI. Built with a modern tech stack, MaliTrack aims to be the go-to platform for entrepreneurs looking to streamline their workflow and grow their business.

## ✨ Key Features

*   **📊 Interactive Dashboard:** Get an at-a-glance overview of your business's financial health with key metrics, dynamic revenue vs. expense charts (daily, weekly, monthly views), and a summary of recent activities.
*   **📦 Inventory Management:**
    *   Easily add, edit, and track inventory items.
    *   Upload item images (stored in the cloud).
    *   Set quantities, unit prices, and low-stock thresholds.
    *   View and manage your current stock in a filterable, sortable table.
*   **📒 Digital Ledger:**
    *   Record all income and expenses with detailed descriptions, categories, and dates.
    *   Maintain accurate financial records effortlessly.
*   **💸 Transaction Logging:**
    *   Log sales and purchases with party details (customer/supplier).
    *   Attach receipt images (uploaded to cloud storage) for better record-keeping.
    *   Quickly add transactions via manual input, with UI hints for future camera/voice input.
*   **🤝 Supplier & Business Directories:**
    *   Discover and manage a list of suppliers with their contact information and items supplied.
    *   Explore a directory of other local businesses (simulated for demo).
    *   Filter and search to find the connections you need.
*   **🎨 Your Business Portfolio:**
    *   Create and customize a public-facing page for your business.
    *   Upload a business banner and logo (cloud-stored).
    *   Set business name, description, and location.
    *   Showcase featured items, best sellers, and items on sale from your inventory.
    *   Configure (simulated) payment methods like Stripe, PayPal, Visa, M-Pesa.
*   **📈 Reports & Analytics:**
    *   Visualize sales overview, expense breakdowns (pie chart), and inventory turnover rates with interactive charts.
    *   Toggle data views between daily, weekly, and monthly periods.
*   **💡 AI-Powered Business Tips:**
    *   Leverage Genkit AI to receive personalized business advice.
    *   Input summaries of your ledger and inventory data, along with your business type, to get actionable tips and key metrics to monitor.
*   **🔒 Secure User Authentication:**
    *   Robust sign-up and sign-in functionality using Firebase Authentication.
    *   Supports email/password and Google Sign-In.
*   **🎨 Theme Customization:**
    *   Personalize your app experience with a floating theme switcher button.
    *   Cycle through multiple pre-defined color themes.
    *   Advanced settings allow users to pick custom colors for UI elements, save custom palettes, and share them.
*   **☁️ Cloud-Synced Data:**
    *   User accounts, profile information, and business data (like inventory items and uploaded images) are synced with Firebase (Authentication, Firestore, Storage).

## 🛠️ How It Works (Tech Stack)

MaliTrack is built using a modern, robust, and scalable technology stack:

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [ShadCN UI](https://ui.shadcn.com/) (Component Library)
    *   [Tailwind CSS](https://tailwindcss.com/) (Styling)
*   **Backend & Cloud Services:**
    *   [Firebase](https://firebase.google.com/):
        *   **Authentication:** For user sign-up, sign-in, and session management.
        *   **Firestore:** As the NoSQL database for storing structured data (user profiles, business details, inventory, ledger entries, etc.).
        *   **Cloud Storage:** For storing user-uploaded files like profile pictures, inventory item images, and receipts.
*   **Artificial Intelligence:**
    *   [Genkit (by Firebase)](https://firebase.google.com/docs/genkit): For integrating generative AI features, such as the AI Business Tips.

## 🚀 Getting Started

This project is a comprehensive prototype. To run it locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MachFrum/Vibe-coding-hackathon.git
    cd MaliTrack
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Firebase:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable Authentication (Email/Password and Google Sign-In).
    *   Set up Firestore Database.
    *   Set up Cloud Storage.
    *   Register a Web App in your Firebase project settings and get your Firebase configuration credentials.
4.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the root of the project.
    *   Copy the contents of `.env.example` into `.env.local`.
    *   Fill in your Firebase project credentials (API Key, Auth Domain, Project ID, etc.) in `.env.local`.
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        # ... and other Firebase config values
        ```
5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser.

## 📱 Future Development

MaliTrack is an evolving platform with exciting plans for the future:

*   **Native Mobile Application:** Development of an Android application is currently in progress to bring MaliTrack's powerful features to users on the go.
*   **Enhanced Real-time Sync:** Implementing deeper real-time data synchronization across all connected devices using Firestore listeners.
*   **Advanced Analytics & Reporting:** More sophisticated reporting tools and customizable dashboards.
*   **Direct Payment Integrations:** Moving beyond simulated payment setup to integrate with actual payment gateways.
*   **Community & Networking Features:** Tools to help businesses connect, collaborate, and share opportunities within the MaliTrack ecosystem.
*   **Automated Workflows:** Using Cloud Functions for more backend automation, such as generating activity logs and data validation.

We are committed to continuously improving MaliTrack and providing small businesses with the tools they need to succeed!

To live test the app visit : https://studio--malitrack.us-central1.hosted.app/
