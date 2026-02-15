"use client";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="mt-2 text-slate-400">Please refresh the page or try again later.</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
