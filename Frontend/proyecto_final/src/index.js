import React from "react";
import ReactDOM from "react-dom/client";

import "./assets/css/index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import * as pages from "./pages/routesPag";

import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./components/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<pages.Home />} />
          <Route path="/catalogo" element={<pages.Products />} />
          <Route path="/catalogo/:id" element={<pages.ProductoIndiv />} />
          <Route path="/carro-de-compra" element={<pages.Carrito />} />
          <Route path="/facturacion/:id" element={<pages.Facturacion />} />
          <Route path="/perfil-usuario" element={<pages.Perfil />} />
          <Route path="/iniciar-sesion" element={<pages.Login />} />
          <Route path="/registrarse" element={<pages.Register />} />
          <Route path="/olvide-contraseña" element={<pages.Forgot />} />
          <Route path="/usuarios" element={<pages.DashUser />} />
          <Route path="/clientes" element={<pages.DashClient />} />
          <Route path="/vendedores" element={<pages.DashSeller />} />
          <Route path="/productos" element={<pages.DashProducts />} />
          <Route path="/ventas" element={<pages.DashSales />} />
          <Route path="/reporte-cliente" element={<pages.ReporteCliente />} />
          <Route path="/info-vendedores" element={<pages.DashVendedores />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
