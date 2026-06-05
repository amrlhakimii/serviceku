export function calculateNextServiceDate(lastServiceDate: string, intervalMonths: number): string {
  const date = new Date(lastServiceDate)
  date.setMonth(date.getMonth() + intervalMonths)
  return date.toISOString().split('T')[0]
}
