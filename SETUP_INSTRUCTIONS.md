# Fleet Management App - Setup Instructions

## Quick Start

### 1. Database Setup
Execute these SQL scripts in your Supabase SQL Editor in order:

**Step 1: Create Tables and RLS Policies**
- Open Supabase Dashboard → SQL Editor
- Copy content from `scripts/001_create_tables.sql`
- Execute the script

**Step 2: Seed Sample Data**
- Copy content from `scripts/002_seed_data.sql`
- Execute the script

**Step 3: Create Demo Users**
- Copy content from `scripts/003_create_demo_users.sql` 
- Execute the script

**Step 4: Create Additional Demo Users** (Optional)
- Copy content from `scripts/004_create_demo_users.sql`
- Execute the script

### 2. Test Accounts

Use these credentials to login and test different portals:

**Driver Account**
- Email: driver1@fleet.com
- Password: demo123
- Access: Mobile app at `/mobile`

**Manager Account**
- Email: manager@fleet.com
- Password: demo123
- Access: Admin portal at `/admin`

**Finance Account**
- Email: finance@fleet.com
- Password: demo123
- Access: Finance portal at `/finance`

**Compliance Account**
- Email: compliance@fleet.com
- Password: demo123
- Access: Compliance portal at `/compliance`

### 3. Navigation

- **Root path** `/`: Auto-redirects based on user role
- **Login**: `/auth/login`
- **Signup**: `/auth/signup`
- **Mobile App**: `/mobile` (for drivers)
- **Admin Portal**: `/admin` (for managers)
- **Finance Portal**: `/finance` (for finance officers)
- **Compliance Portal**: `/compliance` (for compliance officers)

### 4. Features

#### Mobile App (Driver)
- ✅ Login/Signup with authentication
- ✅ View active trips with real-time data
- ✅ Create bookings for vehicle requests
- ✅ View and manage trip history
- ✅ View pending inspections
- ✅ Driver profile with license info
- ✅ Logout functionality

#### Admin Portal
- ✅ Dashboard with real-time metrics
- ✅ Manage and approve bookings
- ✅ View vehicle fleet status
- ✅ Manage driver profiles
- ✅ Track incidents and violations
- ✅ Real-time trip monitoring
- ✅ Logout functionality

#### Finance Portal
- ✅ Financial analytics dashboard
- ✅ Fuel spend trends
- ✅ Cost breakdown by category
- ✅ Cost center analytics
- ✅ Financial reports

#### Compliance Portal
- ✅ Compliance rate tracking
- ✅ Violation trends
- ✅ License expiry monitoring
- ✅ Driver compliance summary
- ✅ Compliance reports

### 5. Database Schema

**users** - Driver and staff profiles
- id (UUID, PK)
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- role (TEXT): driver, manager, finance, compliance
- license_number (TEXT)
- license_expiry (DATE)

**vehicles** - Fleet vehicles
- id (UUID, PK)
- registration (TEXT, UNIQUE)
- make (TEXT)
- model (TEXT)
- year (INTEGER)
- status (TEXT): active, maintenance, retired

**bookings** - Vehicle booking requests
- id (UUID, PK)
- driver_id (UUID, FK)
- vehicle_id (UUID, FK)
- start_date (DATE)
- end_date (DATE)
- cost_center (TEXT)
- status (TEXT): pending, approved, rejected, completed

**trips** - Trip logs
- id (UUID, PK)
- driver_id (UUID, FK)
- vehicle_id (UUID, FK)
- booking_id (UUID, FK)
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- start_mileage (INTEGER)
- end_mileage (INTEGER)
- status (TEXT): active, completed, paused

**inspections** - Vehicle inspections
- id (UUID, PK)
- driver_id (UUID, FK)
- vehicle_id (UUID, FK)
- trip_id (UUID, FK)
- type (TEXT): pre_trip, post_trip
- status (TEXT): pending, completed
- checklist (JSONB)
- notes (TEXT)

**incidents** - Accidents and violations
- id (UUID, PK)
- driver_id (UUID, FK)
- vehicle_id (UUID, FK)
- trip_id (UUID, FK)
- type (TEXT): accident, violation, mechanical
- severity (TEXT): low, medium, high, critical
- description (TEXT)

### 6. API Endpoints & Server Actions

All data operations are handled via Server Actions in `/lib/actions/`:

**Authentication**
- `logout()` - Sign out user

**Bookings**
- `getBookings()` - Get user's bookings
- `createBooking()` - Create new booking
- `getAllBookings()` - Get all bookings (admin)
- `approveBooking()` - Approve booking (admin)

**Trips**
- `getActiveTrips()` - Get active trips for user
- `getAllTrips()` - Get all trips (admin)
- `startTrip()` - Start new trip
- `endTrip()` - End trip with mileage

**Vehicles**
- `getVehicles()` - Get available vehicles
- `getVehicleStats()` - Get vehicle statistics

**Incidents**
- `getAllIncidents()` - Get all incidents
- `createIncident()` - Create new incident

### 7. Security Features

✅ **Row Level Security (RLS)** - Enabled on all tables
✅ **Session Management** - Middleware handles token refresh
✅ **User Authentication** - Supabase Auth with email/password
✅ **Role-Based Access** - Different portals for different roles
✅ **Data Isolation** - Users see only their own data (except managers)

### 8. Troubleshooting

**Can't login?**
- Ensure user is created in `public.users` table
- Check email matches in both `auth.users` and `public.users`
- Verify RLS policies are correct

**Buttons not working?**
- Check browser console for errors
- Verify Supabase environment variables are set
- Ensure database migrations were executed

**Data not loading?**
- Check RLS policies for the user's role
- Verify user_id matches in tables
- Check Supabase logs for query errors

**Missing data?**
- Run seed script (002) to add sample vehicles
- Run demo users script (004) to add more test accounts

### 9. Production Deployment

Before going to production:

1. Update environment variables in Vercel
2. Create admin users with proper roles
3. Set up proper RLS policies for your use case
4. Enable email verification for signups
5. Set up backup and monitoring
6. Review security policies
