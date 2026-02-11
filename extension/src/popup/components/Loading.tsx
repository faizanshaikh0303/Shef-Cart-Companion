import React from "react";

const Loading: React.FC = () => {
  const foods = ["🍲", "🥘", "🍛", "🥗", "🍜"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "6px" }}>
        {foods.map((food, i) => (
          <span
            key={i}
            style={{
              fontSize: "22px",
              animation: `bounce 1.4s ease-in-out ${i * 0.15}s infinite`,
              display: "inline-block",
            }}
          >
            {food}
          </span>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
        >
          Cooking up insights...
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#9CA3AF",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
        >
          Our AI chef is analyzing your cart
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
