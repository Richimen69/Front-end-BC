import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Header from "./components/Header";
import Dashboard from "./views/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./views/NotFound";
import Tramites from "./views/Tramites";
import TramiteCliente from "./views/TramiteCliente";
import VistaTramite from "./views/VistaTramite";
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
        <Route
          path="/vistaprevia"
          element={
            <ProtectedRoute>
              <Header />
              <VistaTramite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tramitecliente"
          element={
            <ProtectedRoute>
              <Header />
              <TramiteCliente />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
