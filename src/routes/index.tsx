import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: "EventHub — Discover events in South Africa" }],
  }),
});

function Index() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", color: "#efefef", fontFamily: "system-ui" }}>
      <p>Loading EventHub… <a href="/app.html" style={{ color: "#FF3A5C" }}>Continue</a></p>
    </div>
  );
}
