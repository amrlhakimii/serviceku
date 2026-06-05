export interface ServiceItem {
  name: string
  price: number
}

export const CAR_SERVICE_ITEMS = [
  'Engine Oil', 'Oil Filter', 'Air Filter', 'Cabin Air Filter',
  'Brake Pad (Front)', 'Brake Pad (Rear)', 'Brake Fluid', 'Spark Plug',
  'Battery', 'Tyre (Front)', 'Tyre (Rear)', 'Coolant', 'Transmission Oil',
  'Power Steering Fluid', 'Timing Belt', 'Wiper Blade', 'Other',
]

export const MOTO_SERVICE_ITEMS = [
  'Engine Oil', 'Oil Filter', 'Air Filter', 'Spark Plug',
  'Chain & Sprocket', 'Chain Oil', 'Brake Pad (Front)', 'Brake Pad (Rear)',
  'Brake Fluid', 'Tyre (Front)', 'Tyre (Rear)', 'Battery', 'Coolant',
  'Drive Belt', 'Clutch Plate', 'Fork Oil', 'Other',
]

export interface ServiceRecord {
  id: string
  userId: string
  vehicleId: string
  date: string
  mileage: number
  workshop: string
  totalCost: number
  notes?: string
  receiptUrl?: string
  reminderMonths?: number
  items: ServiceItem[]
  createdAt: string
}
