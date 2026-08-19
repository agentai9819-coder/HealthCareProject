import { Suspense } from "react";
import { ConfirmPageContent } from "./ConfirmContent";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={loadingStyles}>Loading...</div>}>
      <ConfirmPageContent />
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