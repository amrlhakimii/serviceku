import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useVehicles } from '../hooks/useVehicles'
import { useServiceRecords } from '../hooks/useServiceRecords'
import { useFuelRecords } from '../hooks/useFuelRecords'
import { useSelectedVehicle } from '../context/CarContext'
import Card from '../components/Card'
import { formatDate, daysUntil, isOverdue, expiryStatus } from '../utils/dateHelper'

function QuickAction({ to, icon, label, sub, color }: {
  to: string; icon: React.ReactNode; label: string; sub: string; color: string
}) {
  return (
    <Link to={to} className={`flex flex-col gap-2.5 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${color}`}>
      <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">{icon}</div>
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs opacity-60 mt-0.5">{sub}</p>
      </div>
    </Link>
  )
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent?: string
}) {
  return (
    <Card>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ?? 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-[#f8fafc] mt-0.5">{value}</p>
      {sub && <p className="text-xs text-[#64748b] mt-0.5">{sub}</p>}
    </Card>
  )
}

function ExpiryBadge({ label, date }: { label: string; date?: string }) {
  const status = expiryStatus(date)
  const days = date ? daysUntil(date) : null
  const configs = {
    expired: { bg: 'bg-danger/10 border-danger/20', text: 'text-red-400', msg: 'EXPIRED' },
    soon: { bg: 'bg-warning/10 border-warning/20', text: 'text-yellow-400', msg: `${days}d left` },
    valid: { bg: 'bg-success/10 border-success/20', text: 'text-green-400', msg: `${days}d left` },
    unknown: { bg: 'bg-white/5 border-white/10', text: 'text-[#64748b]', msg: 'Not set' },
  }
  const c = configs[status]
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${c.bg}`}>
      <span className="text-sm text-[#94a3b8]">{label}</span>
      <span className={`text-sm font-semibold ${c.text}`}>{c.msg}</span>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { vehicles } = useVehicles(user?.uid)
  const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle()
  const { records: serviceRecords } = useServiceRecords(selectedVehicle?.id)
  const { records: fuelRecords } = useFuelRecords(selectedVehicle?.id)

  if (!selectedVehicle && vehicles.length > 0) {
    setSelectedVehicle(vehicles[0])
  }

  const totalServiceCost = serviceRecords.reduce((s, r) => s + Number(r.totalCost), 0)
  const totalFuelCost = fuelRecords.reduce((s, r) => s + Number(r.totalPrice), 0)
  const totalLitres = fuelRecords.reduce((s, r) => s + Number(r.litres), 0)

  const { thisMonth, lastMonth } = useMemo(() => {
    const now = new Date()
    const m = now.getMonth(), y = now.getFullYear()
    const lm = m === 0 ? 11 : m - 1
    const ly = m === 0 ? y - 1 : y
    const sum = (recs: { date: string; totalCost?: number; totalPrice?: number }[], mo: number, yr: number) =>
      recs.filter(r => { const d = new Date(r.date); return d.getMonth() === mo && d.getFullYear() === yr })
        .reduce((s, r) => s + Number(r.totalCost ?? r.totalPrice ?? 0), 0)
    return {
      thisMonth: sum(serviceRecords, m, y) + sum(fuelRecords as { date: string; totalPrice: number }[], m, y),
      lastMonth: sum(serviceRecords, lm, ly) + sum(fuelRecords as { date: string; totalPrice: number }[], lm, ly),
    }
  }, [serviceRecords, fuelRecords])

  const latestService = serviceRecords[0]

  const chartData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const m = d.getMonth(), y = d.getFullYear()
      const label = d.toLocaleDateString('en-MY', { month: 'short' })
      const service = serviceRecords.filter(r => { const rd = new Date(r.date); return rd.getMonth() === m && rd.getFullYear() === y }).reduce((s, r) => s + Number(r.totalCost), 0)
      const fuel = fuelRecords.filter(r => { const rd = new Date(r.date); return rd.getMonth() === m && rd.getFullYear() === y }).reduce((s, r) => s + Number(r.totalPrice), 0)
      months.push({ month: label, service, fuel })
    }
    return months
  }, [serviceRecords, fuelRecords])

  const reminderInfo = useMemo(() => {
    if (!latestService) return null
    const next = new Date(latestService.date)
    next.setMonth(next.getMonth() + (latestService.reminderMonths ?? 6))
    const nextStr = next.toISOString().split('T')[0]
    const days = daysUntil(nextStr)
    return { nextStr, days, overdue: isOverdue(nextStr) }
  }, [latestService])

  const healthScore = useMemo(() => {
    if (!reminderInfo) return { score: 50, label: 'No data', color: 'text-[#64748b]', bg: '#64748b' }
    if (reminderInfo.overdue) return { score: 25, label: 'Overdue', color: 'text-red-400', bg: '#ef4444' }
    if (reminderInfo.days <= 14) return { score: 60, label: 'Due soon', color: 'text-yellow-400', bg: '#f59e0b' }
    if (reminderInfo.days <= 30) return { score: 75, label: 'Good', color: 'text-yellow-300', bg: '#fde047' }
    return { score: 95, label: 'Excellent', color: 'text-green-400', bg: '#22c55e' }
  }, [reminderInfo])

  const monthTrend = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth * 100).toFixed(0) : null

  if (!selectedVehicle) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2" />
              <circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" />
            </svg>
          </div>
          <h3 className="text-[#f8fafc] font-semibold mb-1">No Vehicle Selected</h3>
          <p className="text-[#64748b] text-sm mb-5">Add your first vehicle to start tracking maintenance and expenses</p>
          <Link to="/vehicles/add" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add Your Vehicle
          </Link>
        </Card>
      </div>
    )
  }

  const isMoto = selectedVehicle.type === 'motorcycle'

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">

      {/* Vehicle Hero */}
      <div className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
        style={{ background: isMoto ? 'linear-gradient(135deg, #1a0e05 0%, #2d1508 50%, #3d1f0a 100%)' : 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #1f2937 100%)' }}>
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full opacity-10" style={{ background: isMoto ? '#f97316' : '#3b82f6' }} />
        <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full opacity-5" style={{ background: isMoto ? '#f97316' : '#3b82f6' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{isMoto ? '🏍️' : '🚗'}</span>
              <span className="text-xs text-[#64748b] uppercase tracking-widest font-medium">Active Vehicle</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {selectedVehicle.brand} {selectedVehicle.model}
            </h2>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {selectedVehicle.plateNumber && (
                <span className="text-sm bg-white/10 px-3 py-0.5 rounded-full tracking-widest font-medium text-white/80">
                  {selectedVehicle.plateNumber}
                </span>
              )}
              <span className="text-white/40 text-sm">{selectedVehicle.year}</span>
              {selectedVehicle.engineCC && (
                <span className="text-white/40 text-sm">{selectedVehicle.engineCC}cc</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-4 shrink-0">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Health Score</p>
            <p className={`text-4xl font-bold ${healthScore.color}`}>{healthScore.score}</p>
            <p className={`text-xs font-medium mt-0.5 ${healthScore.color}`}>{healthScore.label}</p>
            <div className="w-20 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${healthScore.score}%`, background: healthScore.bg }} />
            </div>
          </div>
        </div>

        {reminderInfo && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 ${
            reminderInfo.overdue ? 'bg-danger/15 border border-danger/25' :
            reminderInfo.days <= 30 ? 'bg-warning/10 border border-warning/20' : 'bg-white/[0.06] border border-white/10'
          }`}>
            <span>{reminderInfo.overdue ? '⚠️' : reminderInfo.days <= 30 ? '🔔' : '✅'}</span>
            <div>
              <p className="text-sm font-semibold text-white">
                {reminderInfo.overdue
                  ? `Service overdue by ${Math.abs(reminderInfo.days)} days`
                  : reminderInfo.days <= 30
                  ? `Service due in ${reminderInfo.days} days`
                  : `Next service: ${formatDate(reminderInfo.nextStr)}`}
              </p>
              {latestService && <p className="text-xs text-white/40 mt-0.5">Last serviced: {formatDate(latestService.date)}</p>}
            </div>
            {(reminderInfo.overdue || reminderInfo.days <= 30) && (
              <Link to="/service/add" className="ml-auto text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors shrink-0">
                Book Now
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Expiry Alerts */}
      {(selectedVehicle.roadTaxExpiry || selectedVehicle.insuranceExpiry) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {selectedVehicle.roadTaxExpiry && <ExpiryBadge label="Road Tax (Cukai Jalan)" date={selectedVehicle.roadTaxExpiry} />}
          {selectedVehicle.insuranceExpiry && <ExpiryBadge label="Insurance" date={selectedVehicle.insuranceExpiry} />}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction to="/service/add" label="Add Service" sub="Log a workshop visit"
            color="bg-primary/10 border-primary/20 text-primary"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>}
          />
          <QuickAction to="/fuel/add" label="Add Fuel" sub="Track petrol expenses"
            color="bg-accent/10 border-accent/20 text-accent"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 10h12M17 6h.01M19 10v4M17 10h4a1 1 0 011 1v5a1 1 0 01-1 1h-1" /></svg>}
          />
          <QuickAction to="/calendar" label="Calendar" sub="Service schedule"
            color="bg-success/10 border-success/20 text-success"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
          />
          <QuickAction to="/documents" label="Documents" sub="Expiry tracker"
            color="bg-warning/10 border-warning/20 text-warning"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Service Spent" value={`RM ${totalServiceCost.toFixed(0)}`} sub={`${serviceRecords.length} records`}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>}
          accent="bg-primary/10 text-primary"
        />
        <StatCard label="Fuel Spent" value={`RM ${totalFuelCost.toFixed(0)}`} sub={`${totalLitres.toFixed(0)} L total`}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 10h12" /></svg>}
          accent="bg-accent/10 text-accent"
        />
        <StatCard label="This Month" value={`RM ${thisMonth.toFixed(0)}`}
          sub={monthTrend ? `${Number(monthTrend) > 0 ? '+' : ''}${monthTrend}% vs last month` : 'No prior data'}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
          accent="bg-warning/10 text-warning"
        />
        <StatCard label="Next Service" value={reminderInfo ? `${Math.abs(reminderInfo.days)}d` : 'N/A'}
          sub={reminderInfo ? (reminderInfo.overdue ? 'OVERDUE' : 'remaining') : 'No records'}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
          accent={reminderInfo?.overdue ? 'bg-danger/10 text-red-400' : 'bg-success/10 text-success'}
        />
      </div>

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#f8fafc]">Monthly Expenses</h3>
          <div className="flex items-center gap-4 text-xs text-[#64748b]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Service</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" />Fuel</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={14} barGap={3}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => `RM ${Number(v).toFixed(2)}`}
              contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#141821', color: '#f1f5f9', fontSize: 12 }}
            />
            <Bar dataKey="service" name="Service" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fuel" name="Fuel" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#f8fafc]">Recent Services</h3>
            <Link to="/service" className="text-xs text-primary hover:text-primary-hover font-medium">View all →</Link>
          </div>
          {serviceRecords.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">🔧</p>
              <p className="text-[#64748b] text-sm">No service records yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {serviceRecords.slice(0, 4).map((r, i) => (
                <div key={r.id} className={`flex items-center justify-between py-2.5 ${i < Math.min(serviceRecords.length, 4) - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f1f5f9] leading-none">{r.workshop}</p>
                      <p className="text-xs text-[#64748b] mt-0.5">{formatDate(r.date)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#f8fafc]">RM {Number(r.totalCost).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#f8fafc]">Recent Fuel</h3>
            <Link to="/fuel" className="text-xs text-primary hover:text-primary-hover font-medium">View all →</Link>
          </div>
          {fuelRecords.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">⛽</p>
              <p className="text-[#64748b] text-sm">No fuel records yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {fuelRecords.slice(0, 4).map((r, i) => (
                <div key={r.id} className={`flex items-center justify-between py-2.5 ${i < Math.min(fuelRecords.length, 4) - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 10h12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f1f5f9] leading-none">{r.petrolType} · {r.litres}L</p>
                      <p className="text-xs text-[#64748b] mt-0.5">{formatDate(r.date)}{r.station ? ` · ${r.station}` : ''}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#f8fafc]">RM {Number(r.totalPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Vehicles', value: vehicles.length, sub: 'registered' },
          { label: 'All-time Spend', value: `RM ${(totalServiceCost + totalFuelCost).toFixed(0)}`, sub: 'service + fuel' },
          { label: 'Fuel Records', value: fuelRecords.length, sub: 'fill-ups logged' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-white/[0.06] rounded-2xl p-4 text-center">
            <p className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-bold text-[#f8fafc]">{value}</p>
            <p className="text-xs text-[#64748b] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
