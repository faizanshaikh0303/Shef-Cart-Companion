import React, { useState } from "react";
import { useCartInsights } from "./hooks/useCartInsights";
import DishCard from "./components/DishCard";
import Loading from "./components/Loading";
import EmptyCart from "./components/EmptyCart";
import NotOnShef from "./components/NotOnShef";
import ErrorState from "./components/ErrorState";
import ManualInput from "./components/ManualInput";
import SkeletonLoader from "./components/SkeletonLoader";

const App: React.FC = () => {
  const { insights, state, retry, manualSubmit, fetchingNew, newCount } =
    useCartInsights();
  const [manualMode, setManualMode] = useState(false);

  const handleManualSubmit = (dishes: string[]) => {
    setManualMode(false);
    manualSubmit(dishes);
  };

  const renderContent = () => {
    if (manualMode) {
      return (
        <ManualInput
          onSubmit={handleManualSubmit}
          onBack={() => setManualMode(false)}
        />
      );
    }

    switch (state) {
      case "loading":
        return <Loading />;
      case "not_shef":
        return <NotOnShef onManualMode={() => setManualMode(true)} />;
      case "empty":
        return <EmptyCart onManualMode={() => setManualMode(true)} />;
      case "error":
        return <ErrorState onRetry={retry} />;
      case "ready":
        return (
          <div>
            {insights.map((insight, i) => (
              <div
                key={`${insight.dishName}-${i}`}
                style={{
                  animation: "fadeSlideIn 0.4s ease-out both",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <DishCard insight={insight} index={i} />
              </div>
            ))}

            {/* Skeleton loader for new items being fetched */}
            {fetchingNew && newCount > 0 && (
              <SkeletonLoader count={newCount} />
            )}

            {/* Manual mode button at bottom */}
            <button
              onClick={() => setManualMode(true)}
              style={{
                display: "block",
                margin: "6px auto 0",
                background: "none",
                border: "none",
                color: "#D1D5DB",
                fontSize: "10px",
                cursor: "pointer",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F59E0B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#D1D5DB";
              }}
            >
              ✏️ Enter dishes manually
            </button>

            <style>{`
              @keyframes fadeSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: "340px",
        maxHeight: "500px",
        overflowY: "auto",
        background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 12px",
          textAlign: "center",
          borderBottom: "1px solid #FDE68A40",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🍲</span>
          <h1
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #F59E0B, #EF4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Cart Companion
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "10.5px",
            color: "#9CA3AF",
            letterSpacing: "0.02em",
          }}
        >
          AI-powered food vibes for your Shef order
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px 8px" }}>{renderContent()}</div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 16px 10px",
          textAlign: "center",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "9px",
            color: "#D1D5DB",
            letterSpacing: "0.03em",
          }}
        >
          Powered by Groq ⚡ • Not affiliated with Shef
        </p>
      </div>
    </div>
  );
};

export default App;
