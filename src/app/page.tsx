// Root page — middleware handles routing to /mobile or /desktop
// This page is a fallback for environments where middleware doesn't fire
// (e.g. direct static export). It shows a basic loading state.
export default function RootPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a1a",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ fontSize: "48px" }}>🗳️</div>
      <h1 style={{ color: "#f8fafc", fontSize: "24px", fontWeight: 800, margin: 0 }}>
        GenZVoter
      </h1>
      <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
        Loading...
      </p>
    </div>
  );
}
