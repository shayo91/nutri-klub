import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Load Font Awesome
const loadFontAwesome = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(link);
};

// Set page title and meta description
const setMetaTags = () => {
  document.title = "Jelena Matijaš - Professional Nutritionist";
  
  // Add meta description
  const metaDescription = document.createElement("meta");
  metaDescription.name = "description";
  metaDescription.content = "Jelena Matijaš is a certified nutritionist offering personalized meal plans, nutrition coaching, and health assessments. Transform your relationship with food and discover a balanced approach to nutrition.";
  document.head.appendChild(metaDescription);
};

loadFontAwesome();
setMetaTags();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
