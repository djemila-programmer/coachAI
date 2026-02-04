import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔹 On ne fait plus de test API ici
// Le token et l'utilisateur seront gérés dans AuthProvider

createRoot(document.getElementById("root")!).render(<App />);
