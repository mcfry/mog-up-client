// Libraries
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  transitions,
  positions,
  Provider as AlertProvider,
} from "@blaumaus/react-alert";
import AlertTemplate from "react-alert-template-basic";

import PrivateRoute from "./PrivateRoute.js";
import { AuthProvider } from "../utils/Auth.js";

// Views
import views from "../components";

// alert configuration
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 25000,
  offset: "10px",
  transition: transitions.SCALE,
};

const viewerRoutes = () => (
  <AuthProvider>
    <AlertProvider template={AlertTemplate} {...options}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<views.LoginPage />} />

          <Route path="/register" element={<views.RegisterPage />} />

          <Route element={<views.App />}>
            <Route path="/" element={<views.ListPage />} />
            <Route path="/allmogs" element={<views.ListPage />} />
            <Route path="/about" element={<views.AboutPage />} />
            <Route path="*" element={<views.NotFoundPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/mymogs" element={<views.UserListPage />} />
              <Route path="/create" element={<views.CreatePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  </AuthProvider>
);

export default viewerRoutes;
