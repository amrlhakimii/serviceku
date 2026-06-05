export type PetrolType = 'RON95' | 'RON97' | 'Diesel'

export const PETROL_STATIONS = ['Petronas', 'Shell', 'Petron', 'BHP', 'Caltex', 'Others']

export interface FuelRecord {
  id: string
  userId: string
  vehicleId: string
  date: string
  mileage: number
  litres: number
  totalPrice: number
  petrolType: PetrolType
  station?: string
  createdAt: string
}
