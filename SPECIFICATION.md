# PalmCar Rental – Project Specification

## Overview
Internal fleet management system for **PalmCar Rental**, built with Vite, React, and TypeScript. Clean, responsive UI with Tailwind CSS. Used by staff to manage vehicles, bookings, and operations.

## Tech Stack
- **Build:** Vite
- **Framework:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Core Features

### Phase 1 – Project Setup & Homepage
- Project scaffolding (Vite + React + TypeScript)
- Tailwind CSS setup
- **Navbar:** Logo, main links (Home, Cars, About, Contact), optional CTA
- **Hero section:** Headline, subtext, visual (image or gradient)
- **Car search form:** Pick-up / return location (or date), car type/category, search button
- Clean, modern UI (consistent spacing, typography, colors)

### Phase 2 – Car Browsing & Details ✅
- Car listing page with filters (grid/list, type, price)
- Car detail page (gallery, specs, book CTA)
- Booking flow (dates, summary, confirmation)

### Phase 3 – User & Admin ✅
- User auth (login/register, client-side mock with localStorage)
- My bookings page and profile (view/edit name, email)
- Admin panel (fleet table, all bookings table; admin-only)

### Phase 4 – Dashboard & Fleet Management ✅
- **Dashboard:** Home overview with fleet size, total bookings, upcoming rentals; quick links (View fleet, New rental, Admin).
- **Fleet CRUD:** Fleet stored in localStorage; admin can add, edit, and delete vehicles (full form: name, type, images, price, seats, transmission, fuel, AC, description).
- **Booking management:** Bookings have status (confirmed / completed / cancelled); admin can change status; My Bookings shows status badge.

### Phase 5 – Reports & Export ✅
- **Reports page (admin):** Booking summary (counts by status: confirmed, completed, cancelled); revenue from completed bookings; fleet by type (count per category).
- **Export:** Download fleet as CSV and bookings as CSV (admin-only, from Reports).

### Phase 6 – Polish ✅
- **Document titles:** Each page sets a descriptive `document.title` (e.g. "Fleet | PalmCar Rental") via `useDocumentTitle` hook.
- **Footer:** Site footer with logo, tagline, Fleet/Admin/Reports links (Reports for admin), and copyright.
- **Accessibility:** Skip-to-main-content link (visible on focus); loading state with spinner and `aria-label`; focus-visible styles on footer links.
- **Loading state:** Protected routes show a spinner and "Loading..." instead of plain text.
- **Images:** `loading="lazy"` on fleet listing and detail gallery (eager for first gallery image).
- **Empty states:** Fleet listing shows distinct message and link when fleet is empty vs. when filters match nothing.

## Design Principles
- Mobile-first, responsive layout
- Accessible (semantic HTML, focus states)
- Fast load and smooth interactions
- Consistent design system (colors, fonts, components)

## Out of Scope (for initial phases)
- Backend API (use mock data or static content initially)
- Payment integration
- Real inventory/availability
