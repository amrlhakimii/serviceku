import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Vehicle } from '../types/vehicle'

const col = collection(db, 'vehicles')

function toVehicle(id: string, data: Record<string, unknown>): Vehicle {
  return {
    id,
    userId: data.userId as string,
    type: data.type as Vehicle['type'],
    brand: data.brand as string,
    model: data.model as string,
    year: data.year as number,
    plateNumber: data.plateNumber as string,
    currentMileage: data.currentMileage as number,
    color: data.color as string | undefined,
    engineCC: data.engineCC as number | undefined,
    motorcycleType: data.motorcycleType as Vehicle['motorcycleType'],
    roadTaxExpiry: data.roadTaxExpiry as string | undefined,
    insuranceExpiry: data.insuranceExpiry as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string ?? new Date().toISOString()),
  }
}

export async function getVehicles(userId: string): Promise<Vehicle[]> {
  const snap = await getDocs(query(col, where('userId', '==', userId)))
  return snap.docs
    .map(d => toVehicle(d.id, d.data()))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addVehicle(
  userId: string,
  data: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>
): Promise<Vehicle> {
  const ref = await addDoc(col, { ...data, userId, createdAt: serverTimestamp() })
  return { id: ref.id, userId, ...data, createdAt: new Date().toISOString() }
}

export async function updateVehicle(
  id: string,
  data: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'vehicles', id), data as Record<string, unknown>)
}

export async function deleteVehicle(id: string): Promise<void> {
  await deleteDoc(doc(db, 'vehicles', id))
}
