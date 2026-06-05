export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export function isOverdue(dateStr: string): boolean {
  return daysUntil(dateStr) < 0
}

export function toInputDate(dateStr: string): string {
  return dateStr.split('T')[0]
}

export function expiryStatus(dateStr?: string): 'expired' | 'soon' | 'valid' | 'unknown' {
  if (!dateStr) return 'unknown'
  const days = daysUntil(dateStr)
  if (days < 0) return 'expired'
  if (days <= 30) return 'soon'
  return 'valid'
}
