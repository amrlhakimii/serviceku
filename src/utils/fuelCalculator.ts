import type { VehicleType } from '../types/vehicle'

export function calculateConsumption(
  currentMileage: number,
  previousMileage: number,
  litresUsed: number
): number | null {
  if (litresUsed <= 0 || currentMileage <= previousMileage) return null
  return parseFloat(((currentMileage - previousMileage) / litresUsed).toFixed(2))
}

export function efficiencyRating(kmPerLitre: number, type: VehicleType = 'car'): {
  label: string
  color: string
} {
  if (type === 'motorcycle') {
    if (kmPerLitre >= 35) return { label: 'Excellent', color: 'text-green-400' }
    if (kmPerLitre >= 25) return { label: 'Good', color: 'text-blue-400' }
    if (kmPerLitre >= 18) return { label: 'Average', color: 'text-yellow-400' }
    return { label: 'Low', color: 'text-red-400' }
  }
  if (kmPerLitre >= 14) return { label: 'Excellent', color: 'text-green-400' }
  if (kmPerLitre >= 11) return { label: 'Good', color: 'text-blue-400' }
  if (kmPerLitre >= 8) return { label: 'Average', color: 'text-yellow-400' }
  return { label: 'Low', color: 'text-red-400' }
}
