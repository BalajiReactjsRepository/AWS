import React from "react";
import ErrorFallback from "./ErrorFallback";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the fallback UI can be shown
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Catch and log the error details
    this.setState({ error, errorInfo });

    // Optionally send error details to an external logging service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      console.log(this.state);
      // Pass meaningful error info to the fallback component
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
