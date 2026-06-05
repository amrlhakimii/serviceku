import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const features = [
  'Service record tracking',
  'Fuel expense monitoring',
  'Road tax & insurance alerts',
  'Car & motorcycle support',
]

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
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
            Your Vehicle,<br />Your Control.
          </h2>
          <p className="text-[#64748b] text-sm leading-relaxed mb-8">
            Track service records, fuel costs, and expiry dates for all your cars and motorcycles — in one place.
          </p>
          <div className="flex flex-col gap-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-primary/15 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#94a3b8]">{f}</span>
              </div>
            ))}
          </div>
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
            <p className="text-[#64748b] text-sm mt-1">Vehicle Manager</p>
          </div>

          <div className="bg-card border border-white/[0.06] rounded-2xl p-7">
            <h2 className="text-xl font-bold text-[#f8fafc] mb-1">Welcome back</h2>
            <p className="text-[#64748b] text-sm mb-6">Sign in to manage your vehicles</p>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#94a3b8]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#94a3b8]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="border border-white/[0.1] bg-white/[0.04] text-[#f1f5f9] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-[#374151]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748b] mt-5">
              No account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
