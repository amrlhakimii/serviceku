export interface Reminder {
  vehicleId: string
  userId: string
  lastServiceDate: string
  nextServiceDate: string
  intervalMonths: number
  updatedAt: string
}
