export type VehicleType = 'car' | 'motorcycle'
export type MotorcycleType = 'kapcai' | 'scooter' | 'sport' | 'naked' | 'adventure' | 'cruiser' | 'touring'

export const CAR_BRANDS = [
  'Perodua', 'Proton', 'Toyota', 'Honda', 'Mazda', 'Nissan',
  'Hyundai', 'Kia', 'Mitsubishi', 'Suzuki', 'BMW', 'Mercedes-Benz',
  'Volkswagen', 'Ford', 'Volvo', 'Audi', 'Other',
]

export const MOTO_BRANDS = [
  'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Modenas', 'Demak',
  'SYM', 'Benelli', 'KTM', 'BMW', 'Ducati', 'Royal Enfield',
  'Harley-Davidson', 'Other',
]

export const MOTO_TYPES: { value: MotorcycleType; label: string }[] = [
  { value: 'kapcai', label: 'Kapcai / Underbone' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'sport', label: 'Sport / Superbike' },
  { value: 'naked', label: 'Naked / Street' },
  { value: 'adventure', label: 'Adventure / Dual-Sport' },
  { value: 'cruiser', label: 'Cruiser' },
  { value: 'touring', label: 'Touring' },
]

export interface Vehicle {
  id: string
  userId: string
  type: VehicleType
  brand: string
  model: string
  year: number
  plateNumber: string
  currentMileage: number
  color?: string
  engineCC?: number
  motorcycleType?: MotorcycleType
  roadTaxExpiry?: string
  insuranceExpiry?: string
  createdAt: string
}
