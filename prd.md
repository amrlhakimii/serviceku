PRODUCT REQUIREMENT DOCUMENT (PRD)

Product Name

AutoLog MY

Track Car Service, Fuel & Expenses in One Place 🚗

⸻

1. Product Overview

Description

AutoLog MY is a web application that helps Malaysian car owners manage their vehicle maintenance and fuel expenses in one centralized system.

Users can:
	•	track service history
	•	record parts replaced
	•	track petrol usage and cost
	•	set reminders every 6 months
	•	view total car expenses
	•	store receipts digitally from only user inputs in text

The app reduces forgotten maintenance, improves financial planning, and prevents overpaying for vehicle services.

⸻

2. Problem Statement

Car owners in Malaysia commonly face these problems:
	1.	Cannot remember when last car service was done
	2.	Do not know what parts were replaced previously
	3.	Do not track petrol expenses monthly
	4.	Forget next service schedule
	5.	Lose receipts or maintenance records
	6.	Cannot estimate total cost of owning a car
	7.	Do not have centralized digital record

This results in:
	•	overspending
	•	missed service intervals
	•	unexpected breakdown cost
	•	poor financial planning

⸻

3. Objectives

The system aims to:
	•	provide digital service record
	•	track fuel expenses
	•	remind users when service is due
	•	show what parts were replaced
	•	estimate monthly car expenses
	•	centralize vehicle maintenance data
	•	provide simple UI for everyday users

⸻

4. Target Users

Primary users:
	•	Malaysian car owners
	•	university students with cars
	•	working adults
	•	fresh graduates
	•	first-time car owners

User characteristics:
	•	service car every 4–6 months
	•	refill petrol 2–4 times per month
	•	want simple expense tracking
	•	prefer mobile-friendly web apps

⸻

5. Features

Color Palette

#355872
#7AAACE
#9CD5FF
#F7F8F0
rgb(53, 88, 114)
rgb(122, 170, 206)
rgb(156, 213, 255)
rgb(247, 248, 240)

⸻

5.1 Authentication

Users create account and login.

Fields:
	•	email
	•	password

Functions:
	•	register
	•	login
	•	logout

⸻

5.2 Car Profile

Users can register vehicle.

Fields:
	•	car brand
	•	car model
	•	year
	•	current mileage
	•	plate number (optional)

Users can add multiple cars.

⸻

5.3 Service Record

Users can record maintenance.

Fields:
	•	service date
	•	mileage
	•	workshop name
	•	total cost
	•	notes
	•	receipt image

⸻

5.4 Parts Changed Checklist

Users select parts replaced. Also note where the car is service.

Examples:
	•	engine oil
	•	oil filter
	•	air filter
	•	brake pad
	•	spark plug
	•	battery
	•	tyre
	•	coolant
	•	transmission oil
	•	timing belt

Custom input allowed.

⸻

5.5 Calendar & Reminder (6 months)

Users can set recurring service interval.

Options:
	•	3 months
	•	6 months
	•	12 months
	•	custom date

System auto calculates next service.

Example:
last service: 1 Jan 2026
next service: 1 July 2026

Notification reminder displayed in dashboard.

⸻

5.6 Fuel Tracker

Users log petrol refill.

Fields:
	•	date
	•	mileage
	•	litre
	•	total price (RM)
	•	petrol type
	•	RON95
	•	RON97
	•	Diesel
	•	petrol station

⸻

5.7 Fuel Consumption Calculation

System calculates:

distance travelled ÷ litre used

Example:
480 km ÷ 40 litre = 12 km/L

⸻

5.8 Expense Dashboard

Dashboard shows:

summary cards:
	•	total service cost
	•	total fuel cost
	•	monthly expenses
	•	last service
	•	next service date

⸻

5.9 Receipt Storage

Users upload receipt image.

Purpose:
	•	proof
	•	reference
	•	record keeping

⸻

6. User Flow

Register account
→ add car
→ add service record
→ set 6-month reminder
→ add fuel record
→ view dashboard
→ receive reminder

⸻

7. Functional Requirements

FR1 user can register account
FR2 user can login/logout
FR3 user can add car
FR4 user can edit car
FR5 user can delete car

FR6 user can add service record
FR7 user can edit service record
FR8 user can delete service record

FR9 user can select parts changed

FR10 system stores service cost

FR11 user can upload receipt

FR12 system calculates next service date

FR13 system displays calendar schedule

FR14 user can add fuel record

FR15 system calculates fuel consumption

FR16 dashboard displays expense summary

FR17 system supports multiple vehicles

⸻

8. Non Functional Requirements

Performance:
load under 3 seconds

Usability:
simple UI

Security:
protected user data

Compatibility:
desktop and mobile browser

Availability:
24/7 online

⸻

9. System Architecture

Recommended because:
easy deploy with Netlify
minimal backend setup
good for FYP

⸻

Architecture Overview

Frontend:
React + Tailwind

Backend:
Supabase (recommended)

Database:
PostgreSQL (inside Supabase)

Storage:
Supabase storage (for receipts)

Hosting:
Netlify (frontend)

⸻

Why Supabase?

Advantages:
	•	easy setup
	•	free tier available
	•	built-in authentication
	•	database ready
	•	REST API auto generated
	•	file upload support
	•	similar to Firebase but SQL
	•	easy deploy

⸻

System Flow Diagram

User Browser
↓
Netlify (React App)
↓ API request
Supabase Backend
↓
Database (PostgreSQL)

⸻

10. Tech Stack

Frontend
React
TailwindCSS
React Router
Axios
React Hook Form

UI components
Tailwind UI
Headless UI

Calendar library
react-calendar

Charts
recharts

Backend
Supabase

Database
PostgreSQL

Hosting frontend
Netlify

Image storage
Supabase storage

⸻

11. Database Structure

⸻

Users
id
email
password

⸻

Cars
id
user_id
brand
model
year
mileage
plate_number

⸻

ServiceRecords
id
car_id
date
mileage
total_cost
workshop
notes
receipt_url

⸻

ServiceItems
id
service_id
item_name
price

⸻

FuelRecords
id
car_id
date
mileage
litre
total_price
petrol_type
station

⸻

Reminders
id
car_id
last_service_date
next_service_date
interval_month

⸻

12. Folder Structure (React)

src
│
├── components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── Card.tsx
│   ├── FormInput.tsx
│   ├── ServiceItemCheckbox.tsx
│   ├── FuelForm.tsx
│   ├── CalendarView.tsx
│
├── pages
│   ├── Dashboard.tsx
│   ├── Cars.tsx
│   ├── AddCar.tsx
│   ├── ServiceList.tsx
│   ├── AddService.tsx
│   ├── FuelList.tsx
│   ├── AddFuel.tsx
│   ├── CalendarPage.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│
├── types
│   ├── Car.ts
│   ├── ServiceRecord.ts
│   ├── FuelRecord.ts
│   ├── Reminder.ts
│   ├── User.ts
│
├── services
│   ├── supabaseClient.ts
│   ├── carService.ts
│   ├── serviceRecordService.ts
│   ├── fuelService.ts
│   ├── reminderService.ts
│
├── hooks
│   ├── useAuth.ts
│   ├── useCars.ts
│   ├── useServiceRecords.ts
│   ├── useFuelRecords.ts
│
├── utils
│   ├── dateHelper.ts
│   ├── fuelCalculator.ts
│   ├── reminderCalculator.ts
│
├── styles
│   ├── globals.css
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
⸻

13. UI Pages

Login page

Dashboard

Add Car page

Service History page

Add Service page

Fuel History page

Add Fuel page

Calendar page

⸻

14. Future AI Features

price prediction for service

detect overpriced service

predict next maintenance

car expense forecast

chatbot mechanic assistant

⸻

15. Deployment Flow

Frontend
push to github
connect repo to Netlify
auto deploy

Backend
create Supabase project
copy API key
connect to React app

⸻

16. Project Scope 

Week 1
UI design
database setup

Week 2
car CRUD
service CRUD

Week 3
fuel CRUD
dashboard

Week 4
calendar reminder

Optional
AI features
