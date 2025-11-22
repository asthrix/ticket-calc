# 🚆 IRCTC Ticket Assistant

**Your Smart Railway Companion**

A modern, feature-rich web application designed to simplify the Indian Railway booking experience. From calculating precise Tatkal opening times to tracking live train status, this app provides a premium, intuitive interface for all your railway needs.

![Project Preview](https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=2000)

## ✨ Key Features

### 🗓️ Smart Booking Calculator
The crown jewel of the application. Never miss a booking window again.
- **Precision Timing**: accurately calculates opening dates for General (60 days) and Tatkal (1 day) quotas.
- **Time-Aware Status**: Dynamic status indicators ("OPEN NOW", "OPENS SOON", "CLOSED") based on real-time IST clock.
- **Smart Reminders**: One-click Google Calendar integration for:
    - **Preparation Reminder**: 1 day before (to update master list/wallet).
    - **Booking Reminder**: 10 minutes before the window opens.
- **Ticket-Style Info Grid**: A beautiful, mobile-optimized display of your journey details.

### ⚡ Quick Tools
- **PNR Status**: Check the current status of your booked tickets.
- **Live Train Status**: Track your train's real-time location and delays.
- **Train Search**: Find available trains between stations.

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, translucent aesthetics with subtle background glows.
- **Responsive Layout**: Flawless experience across Desktop, Tablet, and Mobile.
- **Dark Mode Ready**: Built with a theme-aware color palette.
- **Interactive Elements**: Smooth animations using Framer Motion.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Management**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/irctc-ticket-assistant.git
    cd irctc-ticket-assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000` to see the app in action.

## 📂 Project Structure

The codebase follows **DRY** and **SOLID** principles for maintainability:

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── booking/         # Booking Calculator sub-components
│   │   ├── BookingActions.tsx
│   │   ├── BookingInfoGrid.tsx
│   │   ├── BookingStatus.tsx
│   │   └── JourneyDetails.tsx
│   ├── home/            # Home page sections
│   │   ├── HeroSection.tsx
│   │   └── QuickTools.tsx
│   └── ui/              # Reusable UI components (Shadcn)
├── hooks/               # Custom hooks
│   └── useBookingStatus.ts  # Core booking logic
└── lib/                 # Utilities and constants
    └── booking-constants.ts # Centralized config
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Indian Railway Travellers.
