# SprintMyTrip ✈️

> Multi-stop AI-powered travel itinerary and route planning web application built with React, Vite, Tailwind CSS, and shadcn/ui.

SprintMyTrip - https://sprint-my-trip.vercel.app/

---

## 🧭 Overview

**SprintMyTrip** helps travelers generate custom, multi-stop itineraries in seconds. Supporting up to 5 destinations across multiple travel modes (Driving, Transit, Flight), it produces day-by-day schedules, dynamic packing checklists, and downloadable PDF summaries.

---

## ✨ Features

- **Multi-Stop Route Builder**: Input up to 5 destinations with interactive drag-and-drop reordering (`@hello-pangea/dnd`).
- **Multi-Modal Transit Support**: Plan routes specifically tailored for Driving, Public Transit, or Flights.
- **Day-by-Day AI Schedules**: Structured itinerary display with transit notes, stops, and visual highlights.
- **Interactive Checklists**: Categorized checklist (Essentials, Clothing, Documents) with state persisted directly to LocalStorage.
- **PDF Export**: Print-ready and downloadable PDF itinerary format powered by `react-to-print`.
- **Recent Trips History**: Quick access to previously generated routes without making redundant API calls.
- **Offline Detection**: Real-time network status indicator alerts users during connectivity drops.
- **Dark/Light Mode**: Full theme customization powered by `next-themes` and Tailwind CSS design tokens.
- **SEO & Schema Markup**: JSON-LD Structured Data integration (`WebSite`, `SoftwareApplication`, `WebApplication`).

---

## 🛠️ Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6/v7 with lazy loading and error boundaries)
- **UI & Styling**: Tailwind CSS, shadcn/ui primitives, Base UI, OKLCH color palettes
- **State & Storage**: React Hooks + Browser LocalStorage
- **Icons**: Lucide React & Tabler Icons
- **HTTP Client**: Axios
- **Exporting**: React-to-Print

---

## 📂 Project Structure

```text
src/
├── assets/                         # Static assets and media
├── components/
│   ├── ui/                         # shadcn/ui component primitives
│   ├── ErrorElement.jsx            # Custom route error boundary
│   ├── Footer.jsx                  # Application footer with socials
│   └── Navbar.jsx                  # Top navigation & theme switcher
├── hooks/                          # Custom utility hooks (e.g., online status, theme)
├── lib/                            # Utility functions (cn helper, formatters)
├── pages/
│   ├── Home.jsx                    # Landing page with interactive hero
│   ├── ItineraryDisplay.jsx        # Detailed itinerary & checklist view
│   ├── ItineraryGenerator.jsx      # Multi-stop planner form
│   ├── ItineraryGeneratorSkeleton.jsx # Route planner loading skeleton
│   └── RecentItineraries.jsx       # Saved itineraries view
├── App.jsx                         # Router configuration & providers
├── index.css                       # Global styles & Tailwind variables
└── main.jsx                        # React root entry point
```
