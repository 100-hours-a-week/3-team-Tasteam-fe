import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './App.tsx'
import { AppProviders } from '@/app/providers/AppProviders'
import { BrowserRouter } from 'react-router-dom'
import { initSentry } from '@/shared/lib/sentry'
import { reportWebVitals } from '@/shared/lib/webVitals'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { AppErrorFallback } from '@/shared/ui/AppErrorFallback'

initSentry()
reportWebVitals()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <ErrorBoundary
        fallback={({ resetError }) => (
          <AppErrorFallback onRetry={resetError} onHome={() => window.location.assign('/')} />
        )}
      >
        <App />
      </ErrorBoundary>
    </AppProviders>
  </BrowserRouter>,
)
