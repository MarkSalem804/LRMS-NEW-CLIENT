import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import {
  Login,
  Dashboard,
  Materials,
  Security,
  Profile,
  NotFound,
  AboutUs,
  UsersManagement,
  MaterialsManagement,
} from "./pages";
import { ThemeProvider } from "./context/ThemeContext";
// import { useStateContext } from "./contexts/ContextProvider";
import RequireAuth from "./contexts/RequireAuth";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

function App() {
  const roles = ["ADMIN", "USER", "LEARNER", "TEACHER"];

  return (
    <ThemeProvider>
      <Routes>
        {/* Default route: redirect to /login if not authenticated */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route element={<RequireAuth allowedRoles={roles} />}>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/security" element={<Security />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users-management" element={<UsersManagement />} />
            <Route
              path="/materials/management"
              element={<MaterialsManagement />}
            />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        {/* Redirect all unknown routes to NotFound page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
