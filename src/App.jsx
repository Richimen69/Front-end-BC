import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Header from "./components/layout/Header";
import Dashboard from "./views/Dashboard";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import NotFound from "./views/NotFound";
import Tramites from "./views/Tramites";
import Configuraciones from "./views/Configuraciones";
import TramiteCliente from "./views/TramiteCliente";
import VistaTramite from "./views/VistaTramite";
import Rpp from "./views/Rpp";
import Clientes from "./views/Clientes";
import CatalogoRPP from "./views/CatalogoRPP";
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
          path="/rpp"
          element={
            <ProtectedRoute>
              <Header />
              <Rpp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/config"
          element={
            <ProtectedRoute>
              <Header />
              <Configuraciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogo"
          element={
            <ProtectedRoute>
              <Header />
              <CatalogoRPP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Header />
              <Clientes />
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
