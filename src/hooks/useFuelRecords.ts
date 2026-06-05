import { useState, useEffect } from 'react'
import { getFuelRecords, addFuelRecord, deleteFuelRecord } from '../services/fuelservice'
import type { FuelRecord } from '../types/fuelrecord'

export function useFuelRecords(vehicleId?: string) {
  const [records, setRecords] = useState<FuelRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!vehicleId) { setRecords([]); return }
    setLoading(true)
    getFuelRecords(vehicleId)
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [vehicleId])

  const add = async (
    userId: string,
    vehicleId: string,
    data: Omit<FuelRecord, 'id' | 'userId' | 'vehicleId' | 'createdAt'>
  ) => {
    const r = await addFuelRecord(userId, vehicleId, data)
    setRecords(prev => [r, ...prev])
    return r
  }

  const remove = async (id: string) => {
    await deleteFuelRecord(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return { records, loading, add, remove }
}
