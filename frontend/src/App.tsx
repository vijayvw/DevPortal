import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./admin/context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;