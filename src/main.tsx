import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './App.tsx'
import { AppProviders } from '@/app/providers/AppProviders'
import { BrowserRouter } from 'react-router-dom'
import { initSentry } from '@/shared/lib/sentry'
import { reportWebVitals } from '@/shared/lib/webVitals'
import { ErrorPage } from '@/pages/error-page'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'

initSentry()
reportWebVitals()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProviders>
      <ErrorBoundary
        fallback={({ resetError }) => (
          <ErrorPage onRetry={resetError} onHome={() => window.location.assign('/')} />
        )}
      >
        <App />
      </ErrorBoundary>
    </AppProviders>
  </BrowserRouter>,
)
