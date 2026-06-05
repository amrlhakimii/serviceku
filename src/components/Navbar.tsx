import { useSelectedVehicle } from '../context/CarContext'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { selectedVehicle } = useSelectedVehicle()

  return (
    <header className="h-14 bg-surface/90 backdrop-blur border-b border-white/[0.06] flex items-center px-4 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        aria-label="Open menu"
      >
        <div className="w-5 h-0.5 bg-[#94a3b8] rounded-full" />
        <div className="w-4 h-0.5 bg-[#94a3b8] rounded-full" />
        <div className="w-5 h-0.5 bg-[#94a3b8] rounded-full" />
      </button>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        {selectedVehicle ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary">
              {selectedVehicle.type === 'motorcycle' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-1L9 11H5.5a3.5 3.5 0 010-7H8m5-1l3 7M8 13l4-4"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#f1f5f9] leading-none truncate">
                {selectedVehicle.brand} {selectedVehicle.model}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5 truncate">
                {selectedVehicle.plateNumber} · {selectedVehicle.year}
                {selectedVehicle.engineCC ? ` · ${selectedVehicle.engineCC}cc` : ''}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#64748b]">No vehicle selected</p>
        )}
      </div>

      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" title="Connected" />
    </header>
  )
}
