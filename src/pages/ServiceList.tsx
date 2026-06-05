import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelectedVehicle } from '../context/CarContext'
import { useServiceRecords } from '../hooks/useServiceRecords'
import Card from '../components/Card'
import { formatDate } from '../utils/dateHelper'
import type { ServiceRecord } from '../types/servicerecord'

function ServiceCard({ r, onDelete }: { r: ServiceRecord; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const partsCount = r.items.length

  return (
    <div className="relative pl-5">
      <div className="absolute left-0 top-5 w-3 h-3 rounded-full bg-primary border-2 border-bg shadow-sm z-10" />
      <Card>
        <div className="flex items-center justify-between cursor-pointer gap-3" onClick={() => setExpanded(p => !p)}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-[#f8fafc]">{r.workshop}</p>
              <span className="text-xs bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                RM {Number(r.totalCost).toFixed(2)}
              </span>
              {partsCount > 0 && (
                <span className="text-xs bg-white/[0.06] text-[#94a3b8] px-2 py-0.5 rounded-full">
                  {partsCount} part{partsCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">{formatDate(r.date)} · {Number(r.mileage).toLocaleString()} km</p>
          </div>
          <div className="shrink-0 w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-[#64748b]">
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Date', value: formatDate(r.date) },
                { label: 'Mileage', value: `${Number(r.mileage).toLocaleString()} km` },
                { label: 'Workshop', value: r.workshop },
                { label: 'Total', value: `RM ${Number(r.totalCost).toFixed(2)}`, bold: true },
              ].map(({ label, value, bold }) => (
                <div key={label} className="bg-bg rounded-xl p-3">
                  <p className="text-[10px] text-[#64748b] uppercase tracking-widest mb-0.5">{label}</p>
                  <p className={`text-sm ${bold ? 'font-bold text-primary' : 'font-medium text-[#f1f5f9]'}`}>{value}</p>
                </div>
              ))}
            </div>

            {partsCount > 0 && (
              <div>
                <p className="text-xs text-[#64748b] mb-2 uppercase tracking-widest">Parts Changed</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.items.map((item, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                      {item.name}{item.price > 0 ? ` · RM ${item.price}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {r.notes && (
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
                <p className="text-[10px] text-yellow-400/70 mb-1 uppercase tracking-widest">Notes</p>
                <p className="text-sm text-[#f1f5f9]">{r.notes}</p>
              </div>
            )}

            {r.receiptUrl && (
              <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                </svg>
                View Receipt
              </a>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="w-full text-sm border border-danger/20 text-red-400 hover:bg-danger/10 rounded-xl py-2 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
              Delete Record
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function ServiceList() {
  const { selectedVehicle } = useSelectedVehicle()
  const { records, loading, remove } = useServiceRecords(selectedVehicle?.id)

  const handleDelete = async (id: string, receiptUrl?: string) => {
    if (!confirm('Delete this service record?')) return
    await remove(id, receiptUrl)
  }

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

  const totalCost = records.reduce((s, r) => s + Number(r.totalCost), 0)
  const totalParts = records.reduce((s, r) => s + r.items.length, 0)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#f8fafc]">Service Records</h2>
          <p className="text-[#64748b] text-sm mt-0.5">
            {selectedVehicle.brand} {selectedVehicle.model}
            {records.length > 0 && ` · ${records.length} record${records.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/service/add" className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
          Add Service
        </Link>
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Records', value: records.length },
            { label: 'Total Spent', value: `RM ${totalCost.toFixed(0)}` },
            { label: 'Parts Changed', value: totalParts },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-white/[0.06] rounded-2xl p-3.5 text-center">
              <p className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1">{label}</p>
              <p className="text-xl font-bold text-[#f8fafc]">{value}</p>
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
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <p className="text-[#f8fafc] font-semibold">No Service Records</p>
          <p className="text-[#64748b] text-sm mt-1 mb-5">Start tracking your vehicle maintenance</p>
          <Link to="/service/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add First Service
          </Link>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-1.5 top-5 bottom-5 w-px bg-white/[0.06]" />
          <div className="flex flex-col gap-3">
            {records.map(r => (
              <ServiceCard key={r.id} r={r} onDelete={() => handleDelete(r.id, r.receiptUrl)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
