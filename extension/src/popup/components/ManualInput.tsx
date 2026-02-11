import React, { useState } from "react";

interface Props {
  onSubmit: (dishes: string[]) => void;
  onBack: () => void;
}

const ManualInput: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const dishes = input
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);
    if (dishes.length > 0) {
      onSubmit(dishes);
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#9CA3AF",
          fontSize: "11px",
          cursor: "pointer",
          padding: "0",
          marginBottom: "10px",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        ← Back
      </button>

      <p
        style={{
          margin: "0 0 8px 0",
          fontSize: "12px",
          fontWeight: 600,
          color: "#374151",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        Type your dish names (one per line):
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"Chicken Biryani\nPalak Paneer\nBeef Empanadas"}
        rows={4}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: "12px",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          border: "1.5px solid #E5E7EB",
          borderRadius: "10px",
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s ease",
          boxSizing: "border-box",
          lineHeight: 1.6,
          background: "#FAFAFA",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#F59E0B";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#E5E7EB";
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={input.trim().length === 0}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          fontSize: "12.5px",
          fontWeight: 700,
          color: input.trim().length > 0 ? "#FFFFFF" : "#D1D5DB",
          background: input.trim().length > 0
            ? "linear-gradient(135deg, #F59E0B, #EF4444)"
            : "#F3F4F6",
          border: "none",
          borderRadius: "10px",
          cursor: input.trim().length > 0 ? "pointer" : "not-allowed",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => {
          if (input.trim().length > 0) {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        🔍 Get Insights
      </button>
    </div>
  );
};

export default ManualInput;
