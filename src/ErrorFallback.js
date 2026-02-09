import React, { useEffect } from "react";
import "./error.css";

const ErrorFallback = ({ error, errorInfo }) => {
  useEffect(() => {
    document.body.classList.add("loading");
    const timeout = setTimeout(() => {
      document.body.classList.remove("loading");
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="error-container">
      <h1 className="error-code">500</h1>
      <h2 className="error-msg">
        Unexpected Error <b>:(</b>
      </h2>
      <div className="gears">
        <div className="gear one">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="gear two">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="gear three">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="error-msg-container">
        <h5 className="my-3">Oops! Something went wrong.</h5>
        {process.env.REACT_APP_ENV === "development" && error && (
          <p>Error: {error.toString()}</p>
        )}

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
