import { Suspense } from "react";
import { SelectSlotPageContent } from "./SelectSlotContent";

export default function SelectSlotPage() {
  return (
    <Suspense fallback={<div style={loadingStyles}>Loading...</div>}>
      <SelectSlotPageContent />
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