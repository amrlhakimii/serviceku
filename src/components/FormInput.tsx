interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#8aadc8]" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{label}</label>
      <input
        className={`border-2 rounded-xl px-3 py-2.5 text-sm outline-none transition-all
          bg-white/[0.04] text-[#c8dff0] placeholder:text-[#3d5e77]
          focus:border-secondary
          ${error ? 'border-red-400/50' : 'border-white/[0.1]'}`}
        style={{ fontFamily: "'Raleway', sans-serif" }}
        {...props}
      />
      {error && <p className="text-xs text-red-400" style={{ fontFamily: "'Raleway', sans-serif" }}>{error}</p>}
    </div>
  )
}
