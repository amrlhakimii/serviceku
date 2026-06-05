import { useState } from 'react'

const josefin = { fontFamily: "'Josefin Sans', sans-serif" }
const raleway = { fontFamily: "'Raleway', sans-serif" }

const DEFAULT_PARTS = [
  'Engine Oil', 'Oil Filter', 'Air Filter', 'Brake Pad', 'Spark Plug',
  'Battery', 'Tyre', 'Coolant', 'Transmission Oil', 'Timing Belt',
]

interface ServiceItemCheckboxProps {
  selected: string[]
  onChange: (items: string[]) => void
}

export default function ServiceItemCheckbox({ selected, onChange }: ServiceItemCheckboxProps) {
  const [customInput, setCustomInput] = useState('')

  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item])
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed])
    }
    setCustomInput('')
  }

  const customItems = selected.filter(i => !DEFAULT_PARTS.includes(i))

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[...DEFAULT_PARTS, ...customItems].map(part => {
          const isSelected = selected.includes(part)
          return (
            <button
              key={part}
              type="button"
              onClick={() => toggle(part)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer text-sm transition-all text-left ${
                isSelected
                  ? 'border-secondary/40 bg-secondary/10 text-secondary font-semibold'
                  : 'border-white/[0.08] text-[#567089] hover:border-white/20 hover:text-[#8aadc8]'
              }`}
              style={isSelected ? josefin : raleway}
            >
              <div className={`w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
                isSelected ? 'bg-secondary border-secondary' : 'border-white/20'
              }`}>
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {part}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom part..."
          className="flex-1 border-2 border-white/[0.1] bg-white/[0.04] text-[#c8dff0] placeholder:text-[#3d5e77] rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary transition-all"
          style={raleway}
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2 bg-secondary/20 text-secondary hover:bg-secondary/30 rounded-xl text-sm font-semibold transition-colors border border-secondary/20"
          style={josefin}
        >
          Add
        </button>
      </div>
    </div>
  )
}
