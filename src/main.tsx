import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './App.tsx'
import { AppProviders } from '@/app/providers/AppProviders'
import { BrowserRouter } from 'react-router-dom'
import { HealthStatusIndicator } from '@/widgets/health-status/HealthStatusIndicator'
import { AuthStatusIndicator } from '@/widgets/auth-status/AuthStatusIndicator'

console.log('App starting. Checking console visibility.') // Modified log statement for testing

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <HealthStatusIndicator />
      <AuthStatusIndicator />
      <App />
    </AppProviders>
  </BrowserRouter>,
)
