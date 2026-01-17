# Fleet Management & Smart Driver Digital Log Application

## Overview
A comprehensive full-stack fleet management system with mobile app, admin web portal, finance portal, and compliance dashboard. Built with Next.js 16, Supabase, and Tailwind CSS.

> **Note**: For a detailed concept note and implementation roadmap, please refer to [CONCEPT_NOTE.md](./CONCEPT_NOTE.md).

## Features

### Mobile App (Driver Interface)
- **Authentication**: Secure login/signup with Supabase Auth
- **Home Dashboard**: Real-time active trip tracking, pending inspections, driver statistics
- **Bookings**: Create, view, and manage vehicle bookings with cost center assignment
- **Trip Logging**: Start, pause, and end trips with mileage tracking
- **Inspections**: Pre-trip and post-trip vehicle inspection checklists
- **Profile**: Driver profile management with license verification

### Admin Web Portal (Fleet Managers)
- **Dashboard**: Real-time metrics, charts, vehicle status, driver compliance
- **Bookings Management**: Approve/reject bookings with driver and vehicle details
- **Vehicles**: Fleet inventory with status tracking
- **Drivers**: Driver profiles, license status, violation points
- **Incidents**: Track accidents, violations, and breaches

### Finance Portal
- **Dashboard**: Financial metrics and cost analysis
- **Analytics**: Fuel spend trends, cost-per-km analysis
- **Reports**: Cost center breakdown and financial reports

### Compliance Portal
- **Dashboard**: Compliance metrics, violation tracking
- **Violations**: Violation management and investigation workflow
- **License Expiry**: License expiration tracking and alerts

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Server Actions, API Routes
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (Email/Password)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd fleet-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Run database migrations**
   - Execute SQL scripts in `/scripts` folder on Supabase SQL Editor
   - Scripts: `001_create_tables.sql`, `002_seed_data.sql`, `003_create_demo_user.sql`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Login Credentials
- **Email**: driver@fleet.com
- **Password**: demo123
- **Role**: driver

## File Structure
\`\`\`
app/
├── page.tsx              # Root page
├── auth/                 # Authentication pages
│   ├── login/
│   ├── signup/
│   └── signup-success/
├── mobile/               # Mobile app portal
├── admin/                # Admin portal
├── finance/              # Finance portal
└── compliance/           # Compliance portal

lib/
├── supabase/             # Supabase clients
├── actions/              # Server actions
│   ├── auth.ts
│   ├── bookings.ts
│   ├── trips.ts
│   ├── vehicles.ts
│   └── incidents.ts
└── utils.ts

scripts/
├── 001_create_tables.sql
├── 002_seed_data.sql
└── 003_create_demo_user.sql
\`\`\`

## Database Schema
- **users**: Driver and staff profiles
- **vehicles**: Fleet vehicles
- **bookings**: Vehicle booking requests
- **trips**: Trip logs with mileage tracking
- **inspections**: Pre/post-trip inspections
- **incidents**: Accidents and violations

## Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Managers have elevated access
- Session management via middleware
- Secure authentication with Supabase Auth

## API Routes
All data operations are handled via Server Actions in `/lib/actions/`:
- Bookings: CRUD operations
- Trips: Start, end, track trips
- Vehicles: List available vehicles
- Incidents: Create and retrieve incidents
- Auth: Login, signup, logout

## Deployment
Deploy to Vercel:
\`\`\`bash
npm run build
vercel deploy
\`\`\`

Ensure all environment variables are set in Vercel project settings.

## Mobile Deployment (Capacitor)

The mobile application is built using Capacitor to wrap the Next.js web application for native platforms.

### Android Setup

1. **Prerequisites**: Install Android Studio and the Android SDK.
2. **Run with Live Reload** (for development):
   ```bash
   npm run mobile
   ```
   *Note: Ensure your development server is running on `npm run dev`.*
3. **Open in Android Studio**:
   ```bash
   npm run cap:open
   ```
4. **Sync Project**:
   ```bash
   npm run cap:sync
   ```

### Configuration
- **Capacitor Config**: `capacitor.config.json`
- **Native Project**: `/android` folder

## License
MIT
