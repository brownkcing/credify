import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeMocks } from './mocks'
import '@/assets/styles/main.css'

async function bootstrap() {
  console.log('Starting app initialization...')
  
  if (import.meta.env.DEV) {
    console.log('Initializing MSW...')
    await initializeMocks()
  }

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  
  app.mount('#app')
  console.log('App initialization complete')
}

bootstrap()