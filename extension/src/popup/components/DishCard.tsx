import React, { useState } from "react";
import { DishInsight } from "../types";

interface Props {
  insight: DishInsight;
  index: number;
}

const cardThemes = [
  { bg: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)", accent: "#F59E0B", tag: "#FFFBEB" },
  { bg: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", accent: "#10B981", tag: "#ECFDF5" },
  { bg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", accent: "#3B82F6", tag: "#EFF6FF" },
  { bg: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)", accent: "#EC4899", tag: "#FDF2F8" },
  { bg: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", accent: "#8B5CF6", tag: "#F5F3FF" },
];

const DishCard: React.FC<Props> = ({ insight, index }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = cardThemes[index % cardThemes.length];

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: theme.bg,
        borderRadius: "14px",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1.5px solid ${expanded ? theme.accent : "transparent"}`,
        boxShadow: expanded
          ? `0 4px 16px ${theme.accent}22`
          : "0 1px 4px rgba(0,0,0,0.04)",
        marginBottom: "10px",
        transform: expanded ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Dish Name */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#1F2937",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {insight.dishName}
        </h3>
        <span
          style={{
            fontSize: "11px",
            color: theme.accent,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            marginLeft: "8px",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </div>

      {/* Vibe Profile - always visible */}
      <div
        style={{
          background: `${theme.tag}`,
          borderRadius: "8px",
          padding: "6px 10px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#374151",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          border: `1px solid ${theme.accent}20`,
          letterSpacing: "0.01em",
        }}
      >
        {insight.vibeProfile}
      </div>

      {/* Expandable section */}
      <div
        style={{
          maxHeight: expanded ? "200px" : "0px",
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          marginTop: expanded ? "10px" : "0px",
        }}
      >
        {/* Fun Fact */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            marginBottom: "8px",
            padding: "8px 10px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "8px",
          }}
        >
          <span style={{ fontSize: "13px", flexShrink: 0 }}>💡</span>
          <p
            style={{
              margin: 0,
              fontSize: "11.5px",
              color: "#4B5563",
              lineHeight: 1.5,
              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              fontStyle: "italic",
            }}
          >
            {insight.funFact}
          </p>
        </div>

        {/* Pairing */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            padding: "8px 10px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "8px",
          }}
        >
          <span style={{ fontSize: "13px", flexShrink: 0 }}>🍽️</span>
          <p
            style={{
              margin: 0,
              fontSize: "11.5px",
              color: "#374151",
              lineHeight: 1.5,
              fontWeight: 500,
              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
          >
            <span style={{ color: "#6B7280", fontWeight: 400 }}>Pair with: </span>
            {insight.pairing}
          </p>
        </div>
      </div>

      {/* Tap hint */}
      {!expanded && (
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: "10px",
            color: "#9CA3AF",
            textAlign: "center",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
        >
          tap to explore ✨
        </p>
      )}
    </div>
  );
};

export default DishCard;
