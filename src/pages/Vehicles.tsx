import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import { useSelectedVehicle } from '../context/CarContext'
import Card from '../components/Card'
import { expiryStatus, daysUntil } from '../utils/dateHelper'
import type { Vehicle } from '../types/vehicle'

function VehicleIcon({ type }: { type: string }) {
  return type === 'motorcycle' ? (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6h-1L9 11H5.5a3.5 3.5 0 010-7H8m5-1l3 7M8 13l4-4"/>
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2"/>
      <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
    </svg>
  )
}

function ExpiryChip({ label, date }: { label: string; date?: string }) {
  if (!date) return null
  const status = expiryStatus(date)
  const days = daysUntil(date)
  const cfg = {
    expired: 'bg-danger/10 text-red-400 border-danger/20',
    soon: 'bg-warning/10 text-yellow-400 border-warning/20',
    valid: 'bg-success/10 text-green-400 border-success/20',
    unknown: 'bg-white/5 text-[#64748b] border-white/10',
  }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg[status]}`}>
      {label}: {status === 'expired' ? 'Expired' : `${days}d`}
    </span>
  )
}

export default function Vehicles() {
  const { user } = useAuth()
  const { vehicles, loading, remove } = useVehicles(user?.uid)
  const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle()

  const handleDelete = async (v: Vehicle) => {
    if (!confirm(`Delete ${v.brand} ${v.model} and all its records?`)) return
    await remove(v.id)
    if (selectedVehicle?.id === v.id) setSelectedVehicle(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#f8fafc]">My Vehicles</h2>
          <p className="text-[#64748b] text-sm mt-0.5">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link to="/vehicles/add" className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
          Add Vehicle
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748b] text-sm">Loading...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2"/>
              <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
            </svg>
          </div>
          <p className="text-[#f8fafc] font-semibold">No Vehicles Yet</p>
          <p className="text-[#64748b] text-sm mt-1 mb-5">Add your first car or motorcycle</p>
          <Link to="/vehicles/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add Vehicle
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {vehicles.map(v => {
            const isActive = selectedVehicle?.id === v.id
            return (
              <div key={v.id} className={`bg-card rounded-2xl border-2 p-5 transition-all duration-200 ${
                isActive ? 'border-primary/40' : 'border-white/[0.06] hover:border-white/[0.12]'
              }`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer ${
                      v.type === 'motorcycle' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}
                    onClick={() => setSelectedVehicle(v)}
                  >
                    <VehicleIcon type={v.type} />
                  </div>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedVehicle(v)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-[#f8fafc]">{v.brand} {v.model}</p>
                      {isActive && <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20">Active</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        v.type === 'motorcycle' ? 'bg-primary/10 text-primary/70' : 'bg-accent/10 text-accent/70'
                      }`}>
                        {v.type === 'motorcycle' ? '🏍️ Motorcycle' : '🚗 Car'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#64748b]">{v.year}</span>
                      {v.plateNumber && <><span className="text-white/10">·</span><span className="text-xs font-medium text-[#94a3b8] tracking-widest">{v.plateNumber}</span></>}
                      <span className="text-white/10">·</span>
                      <span className="text-xs text-[#64748b]">{v.currentMileage.toLocaleString()} km</span>
                      {v.engineCC && <><span className="text-white/10">·</span><span className="text-xs text-[#64748b]">{v.engineCC}cc</span></>}
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <ExpiryChip label="Road Tax" date={v.roadTaxExpiry} />
                      <ExpiryChip label="Insurance" date={v.insuranceExpiry} />
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Link to={`/vehicles/edit/${v.id}`}
                      className="p-2 border border-white/[0.08] rounded-xl text-[#64748b] hover:text-[#f1f5f9] hover:border-white/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <button onClick={() => handleDelete(v)}
                      className="p-2 border border-white/[0.06] rounded-xl text-[#64748b] hover:text-red-400 hover:border-red-400/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!isActive && (
                  <button onClick={() => setSelectedVehicle(v)}
                    className="mt-3 w-full text-xs border border-dashed border-white/[0.08] text-[#64748b] hover:text-primary hover:border-primary/30 rounded-xl py-1.5 transition-colors">
                    Set as active vehicle
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
