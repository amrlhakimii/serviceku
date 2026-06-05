import {
  collection, doc, getDocs, addDoc, deleteDoc,
  query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { FuelRecord } from '../types/fuelrecord'

const col = collection(db, 'fuelRecords')

function toFuelRecord(id: string, data: Record<string, unknown>): FuelRecord {
  return {
    id,
    userId: data.userId as string,
    vehicleId: data.vehicleId as string,
    date: data.date as string,
    mileage: data.mileage as number,
    litres: data.litres as number,
    totalPrice: data.totalPrice as number,
    petrolType: data.petrolType as FuelRecord['petrolType'],
    station: data.station as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string ?? new Date().toISOString()),
  }
}

export async function getFuelRecords(vehicleId: string): Promise<FuelRecord[]> {
  const snap = await getDocs(query(col, where('vehicleId', '==', vehicleId)))
  return snap.docs
    .map(d => toFuelRecord(d.id, d.data()))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function addFuelRecord(
  userId: string,
  vehicleId: string,
  data: Omit<FuelRecord, 'id' | 'userId' | 'vehicleId' | 'createdAt'>
): Promise<FuelRecord> {
  const ref = await addDoc(col, { ...data, userId, vehicleId, createdAt: serverTimestamp() })
  return { id: ref.id, userId, vehicleId, ...data, createdAt: new Date().toISOString() }
}

export async function deleteFuelRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, 'fuelRecords', id))
}
