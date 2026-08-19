import { Suspense } from "react";
import { ViewBookingContent } from "./ViewBookingContent";

export default function ViewBookingPage() {
  return (
    <Suspense fallback={<div style={loadingStyles}>Loading booking...</div>}>
      <ViewBookingContent />
    </Suspense>
  );
}

const loadingStyles: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f7fa",
};