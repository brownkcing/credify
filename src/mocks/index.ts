export async function initializeMocks() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./browser')
      
      // Add debug logging
      console.log('[MSW] Starting worker...')
      
      await worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      })
      
      console.log('[MSW] Started successfully')
    } catch (error) {
      console.error('[MSW] Failed to start:', error)
    }
  }
}