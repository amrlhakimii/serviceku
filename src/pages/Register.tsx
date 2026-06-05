import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/')
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 bg-surface border-r border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f8fafc] leading-none">ServiceKu</h1>
              <p className="text-[#64748b] text-xs mt-0.5">Vehicle Manager</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-[#f8fafc] leading-snug">
            Start Tracking<br />Today.
          </h2>
          <p className="text-[#64748b] text-sm leading-relaxed">
            Join ServiceKu and keep on top of your vehicle's health — service records, fuel, road tax, insurance, and more.
          </p>
        </div>
        <p className="text-[#374151] text-xs">© 2025 ServiceKu</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#f8fafc]">ServiceKu</h1>
            <p className="text-[#64748b] text-sm mt-1">Create your account</p>
          </div>

          <div className="bg-card border border-white/[0.06] rounded-2xl p-7">
            <h2 className="text-xl font-bold text-[#f8fafc] mb-1">Create Account</h2>
            <p className="text-[#64748b] text-sm mb-6">Get started in under a minute</p>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
                { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'Min. 6 characters' },
                { label: 'Confirm Password', type: 'password', value: confirm, setter: setConfirm, placeholder: '••••••••' },
              ].map(({ label, type, value, setter, placeholder }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#94a3b8]">{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    required
                    placeholder={placeholder}
                    className="border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748b] mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
