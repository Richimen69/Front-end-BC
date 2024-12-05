import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Header from "./components/Header";
import Dashboard from "./views/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./views/NotFound";
import Tramites from "./views/Tramites";
function App() {
  return (
    <div className="bg-background min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Header />
              <Dashboard />
            </ProtectedRoute>
          }
        />
                <Route
          path="/tramites"
          element={
            <ProtectedRoute>
              <Header />
              <Tramites />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
