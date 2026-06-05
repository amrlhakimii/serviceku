import {
  collection, doc, getDocs, addDoc, deleteDoc,
  query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import type { ServiceRecord } from '../types/servicerecord'

const col = collection(db, 'serviceRecords')

function toServiceRecord(id: string, data: Record<string, unknown>): ServiceRecord {
  return {
    id,
    userId: data.userId as string,
    vehicleId: data.vehicleId as string,
    date: data.date as string,
    mileage: data.mileage as number,
    workshop: data.workshop as string,
    totalCost: data.totalCost as number,
    notes: data.notes as string | undefined,
    receiptUrl: data.receiptUrl as string | undefined,
    reminderMonths: data.reminderMonths as number | undefined,
    items: (data.items as ServiceRecord['items']) ?? [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string ?? new Date().toISOString()),
  }
}

export async function getServiceRecords(vehicleId: string): Promise<ServiceRecord[]> {
  const snap = await getDocs(query(col, where('vehicleId', '==', vehicleId)))
  return snap.docs
    .map(d => toServiceRecord(d.id, d.data()))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function addServiceRecord(
  userId: string,
  vehicleId: string,
  data: Omit<ServiceRecord, 'id' | 'userId' | 'vehicleId' | 'createdAt'>,
  receiptFile?: File
): Promise<ServiceRecord> {
  let receiptUrl = data.receiptUrl
  if (receiptFile) {
    const sRef = storageRef(storage, `receipts/${userId}/${Date.now()}_${receiptFile.name}`)
    const snap = await uploadBytes(sRef, receiptFile)
    receiptUrl = await getDownloadURL(snap.ref)
  }
  const payload = { ...data, receiptUrl, userId, vehicleId, createdAt: serverTimestamp() }
  const docRef = await addDoc(col, payload)
  return { id: docRef.id, userId, vehicleId, ...data, receiptUrl, createdAt: new Date().toISOString() }
}

export async function deleteServiceRecord(id: string, receiptUrl?: string): Promise<void> {
  if (receiptUrl) {
    try { await deleteObject(storageRef(storage, receiptUrl)) } catch { /* ignore */ }
  }
  await deleteDoc(doc(db, 'serviceRecords', id))
}
