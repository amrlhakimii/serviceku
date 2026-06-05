import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import { getReminder } from '../services/reminderservice'
import type { Reminder } from '../types/reminder'
import type { Vehicle } from '../types/vehicle'
import Card from '../components/Card'
import { formatDate, daysUntil, isOverdue } from '../utils/dateHelper'

interface ReminderWithVehicle extends Reminder {
  vehicle: Vehicle
}

function ReminderCard({ r }: { r: ReminderWithVehicle }) {
  const days = daysUntil(r.nextServiceDate)
  const over = days < 0
  const soon = !over && days <= 30
  const v = r.vehicle

  const c = over
    ? { card: 'border-danger/20 bg-danger/5', badge: 'bg-red-400/15 text-red-400', prog: 'bg-danger' }
    : soon
    ? { card: 'border-warning/20 bg-warning/5', badge: 'bg-yellow-400/15 text-yellow-400', prog: 'bg-warning' }
    : { card: 'border-success/20 bg-success/5', badge: 'bg-green-400/15 text-green-400', prog: 'bg-success' }

  const progressPct = over ? 100 : Math.max(0, Math.min(100, 100 - (days / (r.intervalMonths * 30)) * 100))

  return (
    <div className={`p-4 rounded-2xl border ${c.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{v.type === 'motorcycle' ? '🏍️' : '🚗'}</span>
          <div>
            <p className="font-bold text-[#f8fafc]">{v.brand} {v.model}</p>
            {v.plateNumber && <p className="text-xs text-[#64748b] tracking-widest">{v.plateNumber}</p>}
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${c.badge}`}>
          {over ? `${Math.abs(days)}d overdue` : `${days}d left`}
        </span>
      </div>

      <div className="my-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${c.prog}`} style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b]">
        <span>Last: <strong className="text-[#f1f5f9]">{formatDate(r.lastServiceDate)}</strong></span>
        <span>Next: <strong className="text-[#f1f5f9]">{formatDate(r.nextServiceDate)}</strong></span>
        <span>Every <strong className="text-[#f1f5f9]">{r.intervalMonths}</strong> months</span>
      </div>

      {(over || soon) && (
        <Link to="/service/add" className="mt-3 block w-full text-center text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-[#f1f5f9] py-2 rounded-xl transition-colors border border-white/[0.06]">
          Book Service Now →
        </Link>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const { user } = useAuth()
  const { vehicles } = useVehicles(user?.uid)
  const [reminders, setReminders] = useState<ReminderWithVehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (vehicles.length === 0) { setLoading(false); return }
    Promise.all(vehicles.map(v => getReminder(v.id).then(r => r ? { ...r, vehicle: v } : null)))
      .then(results => {
        const valid = results.filter(Boolean) as ReminderWithVehicle[]
        setReminders(valid.sort((a, b) => a.nextServiceDate.localeCompare(b.nextServiceDate)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [vehicles])

  const overdue = reminders.filter(r => isOverdue(r.nextServiceDate))
  const soon = reminders.filter(r => !isOverdue(r.nextServiceDate) && daysUntil(r.nextServiceDate) <= 30)
  const upcoming = reminders.filter(r => !isOverdue(r.nextServiceDate) && daysUntil(r.nextServiceDate) > 30)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f8fafc]">Service Calendar</h2>
        <p className="text-[#64748b] text-sm mt-0.5">Upcoming service reminders for all your vehicles</p>
      </div>

      {reminders.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Overdue', count: overdue.length, cls: 'text-red-400 bg-danger/10 border-danger/20' },
            { label: 'Due Soon', count: soon.length, cls: 'text-yellow-400 bg-warning/10 border-warning/20' },
            { label: 'On Track', count: upcoming.length, cls: 'text-green-400 bg-success/10 border-success/20' },
          ].map(({ label, count, cls }) => (
            <div key={label} className={`${cls} border rounded-2xl p-3 text-center`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748b] text-sm">Loading reminders...</p>
        </div>
      ) : reminders.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          </div>
          <p className="text-[#f8fafc] font-semibold">No Reminders Set</p>
          <p className="text-[#64748b] text-sm mt-1 mb-5">Add a service record to set reminders</p>
          <Link to="/service/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add Service Record
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {overdue.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-danger rounded-full" />
                <h3 className="font-bold text-red-400 text-sm uppercase tracking-widest">Overdue ({overdue.length})</h3>
              </div>
              <div className="flex flex-col gap-2">{overdue.map(r => <ReminderCard key={r.vehicleId} r={r} />)}</div>
            </section>
          )}
          {soon.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <h3 className="font-bold text-yellow-400 text-sm uppercase tracking-widest">Due Within 30 Days ({soon.length})</h3>
              </div>
              <div className="flex flex-col gap-2">{soon.map(r => <ReminderCard key={r.vehicleId} r={r} />)}</div>
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-success rounded-full" />
                <h3 className="font-bold text-green-400 text-sm uppercase tracking-widest">Upcoming ({upcoming.length})</h3>
              </div>
              <div className="flex flex-col gap-2">{upcoming.map(r => <ReminderCard key={r.vehicleId} r={r} />)}</div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
