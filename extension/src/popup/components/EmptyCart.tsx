import React from "react";

interface Props {
  onManualMode: () => void;
}

const EmptyCart: React.FC<Props> = ({ onManualMode }) => {
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
      <span style={{ fontSize: "40px" }}>🛒</span>

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
          No dishes found in cart
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
          Add items to your Shef cart first, or try typing dish names manually below.
        </p>
      </div>

      <button
        onClick={onManualMode}
        style={{
          marginTop: "4px",
          padding: "8px 16px",
          fontSize: "11.5px",
          fontWeight: 600,
          color: "#F59E0B",
          background: "#FFFBEB",
          border: "1.5px solid #FDE68A",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#FEF3C7";
          e.currentTarget.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#FFFBEB";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        ✏️ Enter dishes manually
      </button>
    </div>
  );
};

export default EmptyCart;
