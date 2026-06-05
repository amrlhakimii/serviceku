import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Reminder } from '../types/reminder'

function toReminder(vehicleId: string, data: Record<string, unknown>): Reminder {
  return {
    vehicleId,
    userId: data.userId as string,
    lastServiceDate: data.lastServiceDate as string,
    nextServiceDate: data.nextServiceDate as string,
    intervalMonths: data.intervalMonths as number,
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string ?? new Date().toISOString()),
  }
}

export async function getReminder(vehicleId: string): Promise<Reminder | null> {
  const snap = await getDoc(doc(db, 'reminders', vehicleId))
  if (!snap.exists()) return null
  return toReminder(vehicleId, snap.data())
}

export async function upsertReminder(reminder: Omit<Reminder, 'updatedAt'>): Promise<void> {
  await setDoc(
    doc(db, 'reminders', reminder.vehicleId),
    { ...reminder, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export async function deleteReminder(vehicleId: string): Promise<void> {
  await deleteDoc(doc(db, 'reminders', vehicleId))
}
