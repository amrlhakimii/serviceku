import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelectedVehicle } from '../context/CarContext'
import { useFuelRecords } from '../hooks/useFuelRecords'
import type { PetrolType } from '../types/fuelrecord'
import { PETROL_STATIONS } from '../types/fuelrecord'
import Card from '../components/Card'

const inputCls = "border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"

const PETROL_TYPES: { type: PetrolType; label: string; active: string; inactive: string }[] = [
  { type: 'RON95', label: 'RON 95', active: 'bg-green-500/80 text-white border-green-500', inactive: 'border-green-400/20 text-green-400' },
  { type: 'RON97', label: 'RON 97', active: 'bg-blue-500/80 text-white border-blue-500', inactive: 'border-blue-400/20 text-blue-400' },
  { type: 'Diesel', label: 'Diesel', active: 'bg-yellow-500/80 text-white border-yellow-500', inactive: 'border-yellow-400/20 text-yellow-400' },
]

export default function AddFuel() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedVehicle } = useSelectedVehicle()
  const { add } = useFuelRecords(selectedVehicle?.id)

  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [mileage, setMileage] = useState('')
  const [litres, setLitres] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [petrolType, setPetrolType] = useState<PetrolType>('RON95')
  const [station, setStation] = useState('')
  const [loading, setLoading] = useState(false)

  const pricePerLitre = litres && totalPrice
    ? (parseFloat(totalPrice) / parseFloat(litres)).toFixed(2) : null

  if (!selectedVehicle) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="text-center py-16">
          <p className="text-[#f8fafc] font-semibold">No Vehicle Selected</p>
          <p className="text-[#64748b] text-sm mt-1">Select a vehicle from the sidebar first</p>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      await add(user.uid, selectedVehicle.id, {
        date, mileage: parseInt(mileage),
        litres: parseFloat(litres),
        totalPrice: parseFloat(totalPrice),
        petrolType,
        station: station || undefined,
      })
      navigate('/fuel')
    } catch (e: unknown) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f8fafc]">Add Fuel Record</h2>
        <p className="text-[#64748b] text-sm mt-0.5">{selectedVehicle.brand} {selectedVehicle.model}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-4">Fuel Details</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#94a3b8]">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today} required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#94a3b8]">Mileage (km)</label>
                <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 45000" min={0} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#94a3b8]">Litres Filled</label>
                <input type="number" value={litres} onChange={e => setLitres(e.target.value)} placeholder="e.g. 40" min={0} step={0.01} required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#94a3b8]">Total Cost (RM)</label>
                <input type="number" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} placeholder="e.g. 120.00" min={0} step={0.01} required className={inputCls} />
              </div>
            </div>
            {pricePerLitre && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <span className="text-[#f1f5f9]">Price per litre: <strong className="text-accent">RM {pricePerLitre}</strong></span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-4">Petrol Type</h3>
          <div className="flex gap-2">
            {PETROL_TYPES.map(({ type, label, inactive, active }) => (
              <button key={type} type="button" onClick={() => setPetrolType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  petrolType === type ? active : `bg-white/[0.03] ${inactive} hover:opacity-80`
                }`}>
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-3">Petrol Station</h3>
          <div className="flex flex-wrap gap-2">
            {PETROL_STATIONS.map(s => (
              <button key={s} type="button" onClick={() => setStation(prev => prev === s ? '' : s)}
                className={`px-3.5 py-1.5 rounded-xl text-sm border transition-all font-medium ${
                  station === s ? 'bg-primary/15 text-primary border-primary/30' : 'border-white/[0.08] text-[#64748b] hover:border-white/20 hover:text-[#94a3b8]'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/fuel')}
            className="flex-1 border border-white/[0.1] text-[#94a3b8] font-medium rounded-xl py-3 text-sm hover:bg-white/[0.04] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Save Fuel Record'}
          </button>
        </div>
      </form>
    </div>
  )
}
