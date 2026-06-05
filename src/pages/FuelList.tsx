import { Link } from 'react-router-dom'
import { useSelectedVehicle } from '../context/CarContext'
import { useFuelRecords } from '../hooks/useFuelRecords'
import { calculateConsumption, efficiencyRating } from '../utils/fuelCalculator'
import Card from '../components/Card'
import { formatDate } from '../utils/dateHelper'

const PETROL_CONFIG: Record<string, { badge: string; dot: string }> = {
  RON95: { badge: 'bg-green-400/10 text-green-400 border-green-400/20', dot: 'bg-green-400' },
  RON97: { badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20', dot: 'bg-blue-400' },
  Diesel: { badge: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', dot: 'bg-yellow-400' },
}

export default function FuelList() {
  const { selectedVehicle } = useSelectedVehicle()
  const { records, loading, remove } = useFuelRecords(selectedVehicle?.id)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this fuel record?')) return
    await remove(id)
  }

  const totalLitres = records.reduce((s, r) => s + Number(r.litres), 0)
  const totalCost = records.reduce((s, r) => s + Number(r.totalPrice), 0)
  const avgPrice = totalLitres > 0 ? totalCost / totalLitres : 0
  const totalKm = records.length >= 2 ? records[0].mileage - records[records.length - 1].mileage : 0

  if (!selectedVehicle) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center py-16">
          <p className="text-[#f8fafc] font-semibold">No Vehicle Selected</p>
          <p className="text-[#64748b] text-sm mt-1">Select a vehicle from the sidebar first</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#f8fafc]">Fuel Tracker</h2>
          <p className="text-[#64748b] text-sm mt-0.5">{selectedVehicle.brand} {selectedVehicle.model}</p>
        </div>
        <Link to="/fuel/add" className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
          Add Fuel
        </Link>
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Spent', value: `RM ${totalCost.toFixed(2)}` },
            { label: 'Total Litres', value: `${totalLitres.toFixed(1)} L` },
            { label: 'Avg Price/L', value: `RM ${avgPrice.toFixed(2)}` },
            { label: 'Tracked KM', value: totalKm > 0 ? `${totalKm.toLocaleString()}` : 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-white/[0.06] rounded-2xl p-3.5">
              <p className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1">{label}</p>
              <p className="text-lg font-bold text-[#f8fafc]">{value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748b] text-sm">Loading...</p>
        </div>
      ) : records.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 10h12M17 6h.01M19 10v4M17 10h4a1 1 0 011 1v5a1 1 0 01-1 1h-1" />
            </svg>
          </div>
          <p className="text-[#f8fafc] font-semibold">No Fuel Records</p>
          <p className="text-[#64748b] text-sm mt-1 mb-5">Start tracking your petrol expenses</p>
          <Link to="/fuel/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add First Record
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((r, idx) => {
            const prev = records[idx + 1]
            const consumption = prev ? calculateConsumption(r.mileage, prev.mileage, r.litres) : null
            const efficiency = consumption ? efficiencyRating(consumption, selectedVehicle.type) : null
            const config = PETROL_CONFIG[r.petrolType] ?? { badge: 'bg-white/5 text-[#94a3b8] border-white/10', dot: 'bg-white/30' }

            return (
              <Card key={r.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${config.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${config.badge}`}>
                          {r.petrolType}
                        </span>
                        <span className="font-bold text-[#f8fafc]">{r.litres} L</span>
                        <span className="font-bold text-primary text-sm">RM {Number(r.totalPrice).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-[#64748b] mb-2">
                        {formatDate(r.date)} · {Number(r.mileage).toLocaleString()} km{r.station ? ` · ${r.station}` : ''}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[#64748b] bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">
                          RM {(r.totalPrice / r.litres).toFixed(2)}/L
                        </span>
                        {consumption && efficiency && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            efficiency.label === 'Excellent' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                            efficiency.label === 'Good' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                            efficiency.label === 'Average' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                            'bg-red-400/10 text-red-400 border-red-400/20'
                          }`}>
                            {consumption.toFixed(1)} km/L · {efficiency.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r.id)}
                    className="shrink-0 p-2 border border-white/[0.06] rounded-xl text-[#64748b] hover:text-red-400 hover:border-red-400/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
