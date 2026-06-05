import { useState, useEffect } from 'react'
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../services/vehicleService'
import type { Vehicle } from '../types/vehicle'

export function useVehicles(userId?: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) { setVehicles([]); return }
    setLoading(true)
    getVehicles(userId)
      .then(setVehicles)
      .finally(() => setLoading(false))
  }, [userId])

  const add = async (data: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) throw new Error('Not authenticated')
    const v = await addVehicle(userId, data)
    setVehicles(prev => [...prev, v])
    return v
  }

  const update = async (id: string, data: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>) => {
    await updateVehicle(id, data)
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v))
  }

  const remove = async (id: string) => {
    await deleteVehicle(id)
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  return { vehicles, loading, add, update, remove, setVehicles }
}
