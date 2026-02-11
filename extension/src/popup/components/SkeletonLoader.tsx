import React from "react";

interface Props {
  count: number;
}

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => {
  const bgColors = [
    "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)",
    "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
    "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
  ];

  return (
    <div
      style={{
        background: bgColors[index % bgColors.length],
        borderRadius: "14px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: "1.5px solid transparent",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      {/* Title skeleton */}
      <div
        style={{
          height: "14px",
          width: "70%",
          background: "rgba(0,0,0,0.08)",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      />

      {/* Vibe profile skeleton */}
      <div
        style={{
          height: "28px",
          width: "85%",
          background: "rgba(255,255,255,0.6)",
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      />

      {/* Tap hint */}
      <div
        style={{
          height: "10px",
          width: "60px",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "4px",
          margin: "8px auto 0",
        }}
      />
    </div>
  );
};

const SkeletonLoader: React.FC<Props> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} index={i + 2} />
      ))}

      <p
        style={{
          margin: "0 0 6px 0",
          fontSize: "10.5px",
          color: "#9CA3AF",
          textAlign: "center",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          animation: "fadeInOut 1.5s ease-in-out infinite",
        }}
      >
        ✨ Cooking up {count === 1 ? "a new insight" : `${count} new insights`}...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;
