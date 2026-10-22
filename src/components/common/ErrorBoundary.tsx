import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Camera, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Studio App caught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                A-S Studio Recovery
              </h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                A local state conflict was detected. Click below to refresh the studio records and launch the platform.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset &amp; Launch A-S Studio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
