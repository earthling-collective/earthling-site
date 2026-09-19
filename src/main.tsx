import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Marks that scripting is available so scroll-reveal styles can apply.
// Without JS (or before hydration) everything stays visible.
document.documentElement.classList.add("js");

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
