import { NavLink } from 'react-router-dom'
import { useSelectedVehicle } from '../context/CarContext'
import { useVehicles } from '../hooks/useVehicles'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  {
    to: '/', end: true, label: 'Dashboard',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  },
  {
    to: '/service', end: false, label: 'Service',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  },
  {
    to: '/fuel', end: false, label: 'Fuel',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 10h12M17 6h.01M19 10v4M17 10h4a1 1 0 011 1v5a1 1 0 01-1 1h-1" /></svg>,
  },
  {
    to: '/calendar', end: false, label: 'Calendar',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  },
  {
    to: '/documents', end: false, label: 'Documents',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>,
  },
  {
    to: '/vehicles', end: false, label: 'My Vehicles',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2" /><circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" /></svg>,
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { vehicles } = useVehicles(user?.uid)
  const { selectedVehicle, setSelectedVehicle } = useSelectedVehicle()

  const vehicleIcon = (type?: string) => type === 'motorcycle'
    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-1L9 11H5.5a3.5 3.5 0 010-7H8m5-1l3 7M8 13l4-4"/></svg>
    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 flex flex-col z-30 bg-surface border-r border-white/[0.06]
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[#f8fafc] font-bold text-base leading-none">ServiceKu</h1>
            <p className="text-[#64748b] text-xs mt-0.5">Vehicle Manager</p>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="px-3 pb-3">
          <div className="bg-card border border-white/[0.06] rounded-xl p-3">
            <p className="text-[#64748b] text-[10px] uppercase tracking-widest mb-2 font-medium">Active Vehicle</p>
            {vehicles.length === 0 ? (
              <p className="text-[#64748b] text-sm">No vehicles yet</p>
            ) : (
              <select
                value={selectedVehicle?.id ?? ''}
                onChange={e => setSelectedVehicle(vehicles.find(v => v.id === e.target.value) ?? null)}
                className="w-full bg-transparent text-[#f1f5f9] text-sm outline-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-800">Select vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id} className="text-gray-800">
                    {v.type === 'motorcycle' ? '🏍️' : '🚗'} {v.brand} {v.model}
                  </option>
                ))}
              </select>
            )}
            {selectedVehicle && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-5 h-5 bg-primary/15 rounded-md flex items-center justify-center text-primary">
                  {vehicleIcon(selectedVehicle.type)}
                </div>
                <span className="text-[#94a3b8] text-xs tracking-widest font-medium">{selectedVehicle.plateNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="text-[#374151] text-[10px] uppercase tracking-widest px-2 mb-2 font-semibold">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all duration-150
                ${isActive
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                  : 'text-[#64748b] hover:text-[#f1f5f9] hover:bg-white/[0.04]'}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-[#64748b] text-xs truncate flex-1">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full text-sm text-[#64748b] hover:text-[#f1f5f9] hover:bg-white/[0.04] rounded-xl px-3 py-2 transition-colors text-left flex items-center gap-2.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
