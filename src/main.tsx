import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './App.tsx'
import { AppProviders } from '@/app/providers/AppProviders'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@sentry/react'
import { initSentry } from '@/shared/lib/sentry'
import { ErrorPage } from '@/pages/error-page'

initSentry()

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
