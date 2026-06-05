import { useState, useEffect } from 'react'
import { getServiceRecords, addServiceRecord, deleteServiceRecord } from '../services/servicerecordservice'
import type { ServiceRecord } from '../types/servicerecord'

export function useServiceRecords(vehicleId?: string) {
  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!vehicleId) { setRecords([]); return }
    setLoading(true)
    getServiceRecords(vehicleId)
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [vehicleId])

  const add = async (
    userId: string,
    vehicleId: string,
    data: Omit<ServiceRecord, 'id' | 'userId' | 'vehicleId' | 'createdAt'>,
    receiptFile?: File
  ) => {
    const r = await addServiceRecord(userId, vehicleId, data, receiptFile)
    setRecords(prev => [r, ...prev])
    return r
  }

  const remove = async (id: string, receiptUrl?: string) => {
    await deleteServiceRecord(id, receiptUrl)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return { records, loading, add, remove }
}
