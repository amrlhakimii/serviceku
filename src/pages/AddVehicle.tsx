import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import { useSelectedVehicle } from '../context/CarContext'
import Card from '../components/Card'
import { CAR_BRANDS, MOTO_BRANDS, MOTO_TYPES, type VehicleType } from '../types/vehicle'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#94a3b8]">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"
const selectCls = inputCls + " cursor-pointer"

export default function AddVehicle() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user } = useAuth()
  const { vehicles, add, update } = useVehicles(user?.uid)
  const { setSelectedVehicle } = useSelectedVehicle()

  const existing = isEdit ? vehicles.find(v => v.id === id) : undefined

  const [type, setType] = useState<VehicleType>('car')
  const [brand, setBrand] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [mileage, setMileage] = useState('')
  const [plate, setPlate] = useState('')
  const [color, setColor] = useState('')
  const [engineCC, setEngineCC] = useState('')
  const [motoType, setMotoType] = useState('')
  const [roadTaxExpiry, setRoadTaxExpiry] = useState('')
  const [insuranceExpiry, setInsuranceExpiry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setType(existing.type)
      setBrand(existing.brand)
      setModel(existing.model)
      setYear(existing.year.toString())
      setMileage(existing.currentMileage.toString())
      setPlate(existing.plateNumber ?? '')
      setColor(existing.color ?? '')
      setEngineCC(existing.engineCC?.toString() ?? '')
      setMotoType(existing.motorcycleType ?? '')
      setRoadTaxExpiry(existing.roadTaxExpiry ?? '')
      setInsuranceExpiry(existing.insuranceExpiry ?? '')
    }
  }, [existing])

  const brands = type === 'motorcycle' ? MOTO_BRANDS : CAR_BRANDS
  const finalBrand = brand === 'Other' ? customBrand : brand

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)
    try {
      const data = {
        type,
        brand: finalBrand,
        model,
        year: parseInt(year),
        currentMileage: parseInt(mileage),
        plateNumber: plate.trim().toUpperCase(),
        color: color.trim() || undefined,
        engineCC: engineCC ? parseInt(engineCC) : undefined,
        motorcycleType: (type === 'motorcycle' && motoType) ? motoType as Vehicle['motorcycleType'] : undefined,
        roadTaxExpiry: roadTaxExpiry || undefined,
        insuranceExpiry: insuranceExpiry || undefined,
      } as const

      if (isEdit && id) {
        await update(id, data)
      } else {
        const newV = await add(data)
        setSelectedVehicle(newV)
      }
      navigate('/vehicles')
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#f8fafc]">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
        <p className="text-[#64748b] text-sm mt-0.5">Fill in your vehicle details</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Vehicle Type */}
        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-4">Vehicle Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['car', 'motorcycle'] as VehicleType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setBrand('') }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  type === t ? 'border-primary bg-primary/10 text-primary' : 'border-white/[0.08] text-[#64748b] hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{t === 'car' ? '🚗' : '🏍️'}</span>
                <span className="text-sm font-medium capitalize">{t === 'motorcycle' ? 'Motorcycle' : 'Car'}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-4">Vehicle Info</h3>
          {error && <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-red-400">{error}</div>}

          <div className="flex flex-col gap-4">
            <Field label="Brand">
              <select value={brand} onChange={e => setBrand(e.target.value)} required className={selectCls}>
                <option value="">Select brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>

            {brand === 'Other' && (
              <Field label="Brand Name">
                <input value={customBrand} onChange={e => setCustomBrand(e.target.value)} placeholder="Enter brand name" required className={inputCls} />
              </Field>
            )}

            <Field label="Model">
              <input value={model} onChange={e => setModel(e.target.value)} placeholder={type === 'motorcycle' ? 'e.g. Wave 125, NMAX, Ninja 400' : 'e.g. Myvi, Vios, Civic'} required className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Year">
                <input type="number" value={year} onChange={e => setYear(e.target.value)} min={1990} max={new Date().getFullYear() + 1} required className={inputCls} />
              </Field>
              <Field label="Engine CC">
                <input type="number" value={engineCC} onChange={e => setEngineCC(e.target.value)} placeholder={type === 'motorcycle' ? 'e.g. 125' : 'e.g. 1500'} min={0} className={inputCls} />
              </Field>
            </div>

            {type === 'motorcycle' && (
              <Field label="Motorcycle Type">
                <select value={motoType} onChange={e => setMotoType(e.target.value)} className={selectCls}>
                  <option value="">Select type (optional)</option>
                  {MOTO_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Current Mileage (km)">
                <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 25000" min={0} required className={inputCls} />
              </Field>
              <Field label="Plate Number">
                <input value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} placeholder="e.g. WXX 1234" className={inputCls} />
              </Field>
            </div>

            <Field label="Color (optional)">
              <input value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. Midnight Black" className={inputCls} />
            </Field>
          </div>
        </Card>

        {/* Documents */}
        <Card>
          <h3 className="font-semibold text-[#f8fafc] mb-1">Documents & Expiry</h3>
          <p className="text-[#64748b] text-xs mb-4">Set expiry dates to get alerts before they're due</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Road Tax Expiry">
              <input type="date" value={roadTaxExpiry} onChange={e => setRoadTaxExpiry(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Insurance Expiry">
              <input type="date" value={insuranceExpiry} onChange={e => setInsuranceExpiry(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Card>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/vehicles')}
            className="flex-1 border border-white/[0.1] text-[#94a3b8] font-medium rounded-xl py-3 text-sm hover:bg-white/[0.04] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
            ) : (isEdit ? 'Save Changes' : 'Add Vehicle')}
          </button>
        </div>
      </form>
    </div>
  )
}

import type { Vehicle } from '../types/vehicle'
