# Westtamp Wellness Platform - Full Stack Walkthrough

The development of the Westtamp Wellness platform is fully complete based on the specifications (SRS V2.0), incorporating the requested UI assets as visual guidelines.

## Quick Start Configuration & Verification 🚀

The environment relies on completely dockerized services:
1. `westtamp_mysql`: MySQL Database on port `3306`.
2. `westtamp_backend`: Laravel 11 API Server running on port `8000`.
3. `westtamp_frontend`: React.js + Vite Server running on port `5173`.

**To access the platform locally:**
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard (Unified React SPA):** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API Base:** `http://localhost:8000/api`

---

## 📸 Completed Implementation Modules

### 1. Landing Page (Frontend)
- Extracted and ported HTML/Tailwind config from `./UI/westtamp_wellness_landing_page/*.html` into dynamic React JSX using `react-router-dom` in `LandingPage.jsx`.
- Utilized Tailwind CSS v4 variables with the exact brand kit colors specified in the prototypes.

### 2. Modul Pemesanan (Full Booking Flow)
- Dynamic logic in `BookingPage.jsx`.
- **Backend Sync:** Automatically pulls available Session limits directly from the DB (`TubingSession` Model) when users select a date. It strictly enforces the 100-slots-per-shift logic.
- **Midtrans Mock/Integrations:** The Midtrans flow uses the `midtrans/midtrans-php` SDK. It securely prepares orders and automatically generates Snap Tokens. If Sandbox keys are unavailable in `./backend/.env`, the system intelligently outputs a mock string to prevent blocking demo usage.

### 3. Dashboard Admin Pokdarwis
Located at the unified `/admin` route:
- **Revenue Stats:** Computes successful ticket revenue grouped by package directly from the Laravel SQL backend.
- **Scanner Simulator:** You can paste a simulated QR Code String (e.g., `WT-QR-XXXX`) to trigger the `verify-qr` validation API, fulfilling the scanner requirement.
- **Tombol Darurat (Emergency Cancellation):** When clicked, this queries the backend `weather-emergency` API route, which successfully releases slots, cancels the `TubingSession`, and triggers a "Mock Sending WhatsApp" system event for mass Reschedule Links propagation.

## Settings you can adjust later!

> [!TIP]
> Setting up your Midtrans and Fonnte/Twilio credentials is super simple! 
> Open `./backend/.env` and update `MIDTRANS_SERVER_KEY` to link directly with your payment production stream. You can also hook into Laravel's logging functionality in `app/Http/Controllers/BookingController.php` where the mock `Log::info("[TICKET SENT VIA WA]...")` is placed.
