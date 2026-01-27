import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './App.tsx'
import { AppProviders } from '@/app/providers/AppProviders'
import { BrowserRouter } from 'react-router-dom'
import { HealthStatusIndicator } from '@/widgets/health-status/HealthStatusIndicator'
import { AuthStatusIndicator } from '@/widgets/auth-status/AuthStatusIndicator'
import { AUTH_DEBUG } from '@/shared/config/env' // Added import

console.log('VITE_AUTH_DEBUG:', AUTH_DEBUG) // Added log statement

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <HealthStatusIndicator />
      <AuthStatusIndicator />
      <App />
    </AppProviders>
  </BrowserRouter>,
)
