import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred in this component.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw size={14} />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
