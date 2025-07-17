import { useStateContext } from "../contexts/ContextProvider";
import { useState, useEffect } from "react";

// Global Success Message component
function GlobalSuccessMessage() {
  const { successMessage } = useStateContext();
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (!successMessage) {
      setTimeLeft(3);
      return;
    }

    const startTime = Date.now();
    const duration = 3000; // 3 seconds
    const interval = 1000; // Update every second

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const newTimeLeft = Math.ceil(remaining / 1000);

      setTimeLeft(newTimeLeft);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [successMessage]);

  if (!successMessage) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "#22c55e",
        color: "white",
        padding: "20px 32px",
        borderRadius: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontWeight: 500,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
        minWidth: 320,
        maxWidth: 450,
      }}
      className="hidden md:block" // only show on desktop
    >
      <div
        style={{
          position: "relative",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.3)",
          borderTop: "3px solid white",
          animation: "spin 1s linear infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            animation: "counter-spin 1s linear infinite",
          }}
        >
          {timeLeft}
        </span>
      </div>
      <span>{successMessage}</span>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes counter-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default GlobalSuccessMessage;
