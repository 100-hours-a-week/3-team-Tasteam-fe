import { Component, type ErrorInfo, type ReactNode } from 'react'

type FallbackProps = {
  error: Error
  resetError: () => void
}

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: (props: FallbackProps) => ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep empty: app-level logging is handled elsewhere.
  }

  private resetError = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetError: this.resetError,
      })
    }
    return this.props.children
  }
}
