export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < 2; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  throw lastError
}
