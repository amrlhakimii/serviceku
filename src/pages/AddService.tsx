import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelectedVehicle } from '../context/CarContext'
import { useServiceRecords } from '../hooks/useServiceRecords'
import { upsertReminder } from '../services/reminderservice'
import { calculateNextServiceDate } from '../utils/reminderCalculator'
import { CAR_SERVICE_ITEMS, MOTO_SERVICE_ITEMS } from '../types/servicerecord'
import Card from '../components/Card'

const inputCls = "border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#94a3b8]">{label}</label>
      {children}
    </div>
  )
}

export default function AddService() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedVehicle } = useSelectedVehicle()
  const { add } = useServiceRecords(selectedVehicle?.id)

  const today = new Date().toISOString().split('T')[0]
  const serviceItems = selectedVehicle?.type === 'motorcycle' ? MOTO_SERVICE_ITEMS : CAR_SERVICE_ITEMS

  const [date, setDate] = useState(today)
  const [mileage, setMileage] = useState('')
  const [workshop, setWorkshop] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({})
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [intervalMonths, setIntervalMonths] = useState(6)
  const [loading, setLoading] = useState(false)

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

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
      const items = selectedItems.map(name => ({
        name,
        price: parseFloat(itemPrices[name] || '0') || 0,
      }))
      await add(user.uid, selectedVehicle.id, {
        date, mileage: parseInt(mileage), workshop,
        totalCost: parseFloat(cost),
        notes: notes.trim() || undefined,
        reminderMonths: intervalMonths,
        items,
      }, receiptFile ?? undefined)

      const nextServiceDate = calculateNextServiceDate(date, intervalMonths)
      await upsertReminder({
        vehicleId: selectedVehicle.id,
        userId: user.uid,
        lastServiceDate: date,
        nextServiceDate,
        intervalMonths,
      })

      navigate('/service')
    } catch (e: unknown) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f8fafc]">Add Service Record</h2>
        <p className="text-[#64748b] text-sm mt-0.5">
          {selectedVehicle.brand} {selectedVehicle.model} · {selectedVehicle.type === 'motorcycle' ? '🏍️' : '🚗'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-4">Service Details</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service Date">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today} required className={inputCls} />
              </Field>
              <Field label="Mileage (km)">
                <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 45000" min={0} required className={inputCls} />
              </Field>
            </div>
            <Field label="Workshop Name">
              <input value={workshop} onChange={e => setWorkshop(e.target.value)} placeholder="e.g. Perodua Service Centre" required className={inputCls} />
            </Field>
            <Field label="Total Cost (RM)">
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="e.g. 250.00" min={0} step={0.01} required className={inputCls} />
            </Field>
            <Field label="Notes (optional)">
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes..." rows={2} className={inputCls + " resize-none"} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#f8fafc]">Parts Changed</h3>
            {selectedItems.length > 0 && (
              <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">{selectedItems.length} selected</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {serviceItems.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedItems.includes(item)
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'border-white/[0.08] text-[#64748b] hover:border-white/20 hover:text-[#94a3b8]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <p className="text-xs text-[#64748b] mb-1">Part prices (optional)</p>
              {selectedItems.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-xs text-[#94a3b8] flex-1">{item}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#64748b]">RM</span>
                    <input
                      type="number"
                      value={itemPrices[item] ?? ''}
                      onChange={e => setItemPrices(prev => ({ ...prev, [item]: e.target.value }))}
                      placeholder="0"
                      min={0} step={0.01}
                      className="w-20 border border-white/[0.08] bg-white/[0.04] text-[#f1f5f9] rounded-lg px-2 py-1 text-xs outline-none focus:border-primary/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-3">Receipt (optional)</h3>
          <input type="file" accept="image/*" onChange={e => setReceiptFile(e.target.files?.[0] ?? null)}
            className="text-sm text-[#64748b] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-primary/15 file:text-primary file:rounded-lg file:text-xs file:font-medium file:cursor-pointer hover:file:bg-primary/25 transition-all" />
          {receiptFile && <p className="text-xs text-green-400 mt-2">✓ {receiptFile.name}</p>}
        </Card>

        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-3">Service Reminder</h3>
          <div className="flex gap-2 flex-wrap mb-3">
            {[3, 6, 12].map(m => (
              <button key={m} type="button" onClick={() => setIntervalMonths(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  intervalMonths === m ? 'bg-primary/15 text-primary border-primary/30' : 'border-white/[0.08] text-[#64748b] hover:border-white/20'
                }`}>
                {m} months
              </button>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748b]">Custom:</span>
              <input type="number" value={intervalMonths} onChange={e => setIntervalMonths(parseInt(e.target.value) || 6)}
                min={1} max={24} className="w-14 border border-white/[0.08] bg-white/[0.04] text-[#f1f5f9] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary/40 text-center" />
              <span className="text-xs text-[#64748b]">mo</span>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            <p className="text-sm text-[#f1f5f9]">Next service: <strong className="text-primary">{calculateNextServiceDate(date, intervalMonths)}</strong></p>
          </div>
        </Card>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/service')}
            className="flex-1 border border-white/[0.1] text-[#94a3b8] font-medium rounded-xl py-3 text-sm hover:bg-white/[0.04] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Save Service Record'}
          </button>
        </div>
      </form>
    </div>
  )
}
