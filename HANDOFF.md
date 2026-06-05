# ServiceKu — Developer Handoff

Vehicle service, fuel, and document tracker for cars and motorcycles.

**Repo:** https://github.com/amrlhakimii/serviceku  
**Stack:** Vite 8 · React 19 · TypeScript 6 · TailwindCSS v4 · Firebase 12

---

## 1. First-time Setup

```bash
git clone https://github.com/amrlhakimii/serviceku.git
cd serviceku
npm install
```

Create a `.env` file in the root (never commit this):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Get these values from the owner — they share the same Firebase project, or you can create your own (see section 3).

```bash
npm run dev      # http://localhost:5173
npm run build    # production build (must pass tsc first)
```

---

## 2. Project Structure

```
src/
├── firebase/
│   └── config.ts          # Firebase init — exports auth, db, storage
├── types/
│   ├── vehicle.ts          # Vehicle interface + CAR_BRANDS, MOTO_BRANDS, etc.
│   ├── servicerecord.ts    # ServiceRecord + CAR_SERVICE_ITEMS, MOTO_SERVICE_ITEMS
│   ├── fuelrecord.ts       # FuelRecord + PETROL_STATIONS
│   └── reminder.ts         # Reminder interface
├── services/               # Firestore CRUD (one file per collection)
│   ├── vehicleService.ts
│   ├── fuelservice.ts
│   ├── servicerecordservice.ts
│   └── reminderservice.ts
├── hooks/                  # React hooks wrapping services
│   ├── useAuth.ts
│   ├── useVehicles.ts
│   ├── useFuelRecords.ts
│   └── useServiceRecords.ts
├── context/
│   └── CarContext.tsx      # Selected vehicle global state
├── pages/                  # One file per route
│   ├── Login.tsx / Register.tsx
│   ├── Dashboard.tsx
│   ├── Vehicles.tsx        # Vehicle list
│   ├── AddVehicle.tsx      # Add + Edit vehicle (shares route)
│   ├── ServiceList.tsx / AddService.tsx
│   ├── FuelList.tsx / AddFuel.tsx
│   ├── CalendarPage.tsx    # Service reminders
│   └── Documents.tsx       # Road tax + insurance expiry
├── components/
│   ├── Layout.tsx          # Sidebar + Navbar wrapper
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── Card.tsx
└── utils/
    ├── dateHelper.ts       # formatDate, daysUntil, expiryStatus
    └── fuelCalculator.ts   # efficiencyRating (car vs motorcycle thresholds)
```

---

## 3. Firebase Setup (if creating your own project)

1. Go to https://console.firebase.google.com → New project
2. **Authentication** → Sign-in method → Enable **Email/Password**
3. **Firestore Database** → Create database → Start in **production mode**
4. **Storage** → Get started
5. Project settings → Your apps → Add web app → copy the config into `.env`

### Firestore Security Rules

Paste this in Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicles/{docId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid)
        && (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
    match /serviceRecords/{docId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid)
        && (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
    match /fuelRecords/{docId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid)
        && (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
    match /reminders/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 4. Data Model

### `vehicles` collection

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Firebase Auth UID |
| `type` | `'car' \| 'motorcycle'` | Controls brand list, service items |
| `brand` | string | |
| `model` | string | |
| `year` | number | |
| `plateNumber` | string | |
| `currentMileage` | number | |
| `color` | string? | |
| `engineCC` | number? | |
| `motorcycleType` | string? | kapcai, scooter, sport, etc. |
| `roadTaxExpiry` | string? | ISO date `YYYY-MM-DD` |
| `insuranceExpiry` | string? | ISO date `YYYY-MM-DD` |
| `createdAt` | Timestamp | |

### `serviceRecords` collection

| Field | Type |
|---|---|
| `vehicleId` | string |
| `userId` | string |
| `date` | string |
| `mileage` | number |
| `items` | `{ name, cost }[]` |
| `totalCost` | number |
| `notes` | string? |
| `receiptUrl` | string? (Storage URL) |
| `nextServiceDate` | string? |
| `reminderMonths` | number? |

### `fuelRecords` collection

| Field | Type |
|---|---|
| `vehicleId` | string |
| `userId` | string |
| `date` | string |
| `litres` | number |
| `totalPrice` | number |
| `mileage` | number |
| `petrolType` | string |
| `station` | string? |

### `reminders` collection

Document ID = `vehicleId`

| Field | Type |
|---|---|
| `vehicleId` | string |
| `lastServiceDate` | string |
| `nextServiceDate` | string |
| `intervalMonths` | number |
| `updatedAt` | Timestamp |

---

## 5. Key Patterns

### Auth

```ts
const { user, loading, signIn, signUp, signOut } = useAuth()
// user is FirebaseUser — use user.uid, not user.id
```

### Fetching data

All hooks take an optional ID and skip the fetch if undefined:

```ts
const { vehicles, loading, add, update, remove } = useVehicles(user?.uid)
const { records, loading, add, remove } = useServiceRecords(vehicleId)
const { records, loading, add, remove } = useFuelRecords(vehicleId)
```

### Selected vehicle (global state)

```ts
const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle()
```

Set from `Sidebar.tsx` when user clicks a vehicle. Pages like `ServiceList` and `FuelList` read from this context.

### Vehicle type branching

```ts
import { CAR_SERVICE_ITEMS, MOTO_SERVICE_ITEMS } from '../types/servicerecord'
const items = selectedVehicle.type === 'motorcycle' ? MOTO_SERVICE_ITEMS : CAR_SERVICE_ITEMS
```

---

## 6. Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/vehicles` | Vehicle list |
| `/vehicles/add` | Add vehicle |
| `/vehicles/edit/:id` | Edit vehicle (same component as add) |
| `/service` | Service history (requires selected vehicle) |
| `/service/add` | Log service |
| `/fuel` | Fuel history |
| `/fuel/add` | Log fuel |
| `/calendar` | Service reminders across all vehicles |
| `/documents` | Road tax & insurance expiry tracker |
| `/login` | Login |
| `/register` | Register |

---

## 7. Design System

Dark theme, defined in `src/styles/globals.css`:

| Token | Value | Use |
|---|---|---|
| `bg-bg` | `#080b12` | Page background |
| `bg-surface` | `#0f1219` | Sidebar/panels |
| `bg-card` | `#141821` | Cards |
| `bg-primary` | `#f97316` | Orange — buttons, active states |
| `bg-accent` | `#06b6d4` | Cyan — charts, secondary |
| `bg-success` | `#22c55e` | Green |
| `bg-warning` | `#f59e0b` | Yellow |
| `bg-danger` | `#ef4444` | Red |

Font: **Inter** (loaded via Google Fonts in `index.html`)

---

## 8. Notes for Contributors

- **macOS filesystem is case-insensitive.** Some legacy files exist as lowercase (e.g. `src/components/addcar.tsx`) alongside PascalCase pages — these are old duplicates and can be ignored; the real pages are in `src/pages/`.
- **`AddVehicle.tsx` handles both add and edit.** It checks for `:id` param in the URL to switch modes.
- **Receipts** are uploaded to Firebase Storage under `receipts/{userId}/{filename}` then the URL is saved on the service record.
- **Road tax / insurance dates** are stored directly on the vehicle document (not a separate collection) for simplicity.
- Run `npm run build` before pushing — the TypeScript check runs as part of the build.
