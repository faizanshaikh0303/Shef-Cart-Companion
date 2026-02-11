import React from "react";

interface Props {
  onRetry: () => void;
}

const ErrorState: React.FC<Props> = ({ onRetry }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        textAlign: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "36px" }}>😅</span>

      <div>
        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#9CA3AF",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            lineHeight: 1.5,
          }}
        >
          Our AI chef might be warming up. Give it another shot!
        </p>
      </div>

      <button
        onClick={onRetry}
        style={{
          marginTop: "4px",
          padding: "8px 20px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        🔄 Try Again
      </button>
    </div>
  );
};

export default ErrorState;
