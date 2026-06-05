import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import Card from '../components/Card'
import { formatDate, daysUntil, expiryStatus } from '../utils/dateHelper'
import type { Vehicle } from '../types/vehicle'

function ExpiryRow({ label, date, vehicleId }: {
  label: string
  date?: string
  vehicleId: string
}) {
  const status = expiryStatus(date)
  const days = date ? daysUntil(date) : null

  const cfg = {
    expired: { icon: '🔴', text: 'text-red-400', msg: 'EXPIRED', bg: 'bg-danger/10 border-danger/20' },
    soon: { icon: '🟡', text: 'text-yellow-400', msg: `${days}d left`, bg: 'bg-warning/10 border-warning/20' },
    valid: { icon: '🟢', text: 'text-green-400', msg: `${days}d left`, bg: 'bg-success/10 border-success/20' },
    unknown: { icon: '⚪', text: 'text-[#64748b]', msg: 'Not set', bg: 'bg-white/[0.04] border-white/[0.06]' },
  }

  const c = cfg[status]

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${c.bg}`}>
      <div className="flex items-center gap-2.5">
        <span className="text-base">{c.icon}</span>
        <div>
          <p className="text-sm font-medium text-[#f1f5f9]">{label}</p>
          {date && <p className="text-xs text-[#64748b]">{formatDate(date)}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${c.text}`}>{c.msg}</span>
        <Link to={`/vehicles/edit/${vehicleId}`}
          className="text-xs text-[#64748b] hover:text-primary border border-white/[0.08] hover:border-primary/30 px-2.5 py-1 rounded-lg transition-colors">
          Edit
        </Link>
      </div>
    </div>
  )
}

function VehicleDocCard({ vehicle }: { vehicle: Vehicle }) {
  const taxStatus = expiryStatus(vehicle.roadTaxExpiry)
  const insStatus = expiryStatus(vehicle.insuranceExpiry)
  const hasAlert = taxStatus === 'expired' || taxStatus === 'soon' || insStatus === 'expired' || insStatus === 'soon'

  return (
    <Card className={hasAlert ? 'border-warning/20' : ''}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          vehicle.type === 'motorcycle' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
        }`}>
          <span className="text-xl">{vehicle.type === 'motorcycle' ? '🏍️' : '🚗'}</span>
        </div>
        <div>
          <p className="font-semibold text-[#f8fafc]">{vehicle.brand} {vehicle.model}</p>
          <p className="text-xs text-[#64748b]">{vehicle.year} · {vehicle.plateNumber || 'No plate'}</p>
        </div>
        {hasAlert && (
          <span className="ml-auto text-xs bg-warning/10 text-yellow-400 border border-warning/20 px-2 py-0.5 rounded-full">
            Action needed
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ExpiryRow label="Road Tax (Cukai Jalan)" date={vehicle.roadTaxExpiry} vehicleId={vehicle.id} />
        <ExpiryRow label="Insurance (Insurans)" date={vehicle.insuranceExpiry} vehicleId={vehicle.id} />
      </div>
    </Card>
  )
}

export default function Documents() {
  const { user } = useAuth()
  const { vehicles, loading } = useVehicles(user?.uid)

  const expiredCount = vehicles.filter(v =>
    expiryStatus(v.roadTaxExpiry) === 'expired' || expiryStatus(v.insuranceExpiry) === 'expired'
  ).length

  const soonCount = vehicles.filter(v =>
    expiryStatus(v.roadTaxExpiry) === 'soon' || expiryStatus(v.insuranceExpiry) === 'soon'
  ).length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#f8fafc]">Documents</h2>
          <p className="text-[#64748b] text-sm mt-0.5">Road tax & insurance expiry tracker</p>
        </div>
        <Link to="/vehicles/add" className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
          Add Vehicle
        </Link>
      </div>

      {vehicles.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Expired', count: expiredCount, cls: 'bg-danger/10 border-danger/20 text-red-400' },
            { label: 'Expiring Soon', count: soonCount, cls: 'bg-warning/10 border-warning/20 text-yellow-400' },
            { label: 'All Good', count: vehicles.length - expiredCount - soonCount, cls: 'bg-success/10 border-success/20 text-green-400' },
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
          <p className="text-[#64748b] text-sm">Loading...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" />
            </svg>
          </div>
          <p className="text-[#f8fafc] font-semibold">No Vehicles Yet</p>
          <p className="text-[#64748b] text-sm mt-1 mb-5">Add a vehicle to track road tax and insurance expiry</p>
          <Link to="/vehicles/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add Vehicle
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {vehicles.map(v => <VehicleDocCard key={v.id} vehicle={v} />)}
        </div>
      )}

      <div className="mt-6 p-4 bg-card border border-white/[0.06] rounded-2xl">
        <p className="text-sm font-medium text-[#f1f5f9] mb-1">How to update expiry dates</p>
        <p className="text-xs text-[#64748b]">
          Click "Edit" next to any document, or go to{' '}
          <Link to="/vehicles" className="text-primary hover:text-primary-hover">My Vehicles</Link>
          {' '}→ Edit vehicle → Documents & Expiry section.
        </p>
      </div>
    </div>
  )
}
