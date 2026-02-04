import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppRoutes } from "./routes/routes";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
