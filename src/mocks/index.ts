export async function initializeMocks() {
    if (import.meta.env.DEV) {
      try {
        const { worker } = await import('./browser')
        await worker.start({
          onUnhandledRequest: 'warn', // Changed from 'bypass' to 'warn' for debugging
          serviceWorker: {
            url: '/mockServiceWorker.js'
          }
        })
        console.log('[MSW] Started')
      } catch (error) {
        console.error('[MSW] Failed to start:', error)
      }
    }
  }