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
  // DataManagement,
  ClientPage,
  VerificationPage,
} from "./pages";
import MaterialDirectory from "./pages/Client Page/MaterialDirectory";
import { ThemeProvider } from "./context/ThemeContext";
// import { useStateContext } from "./contexts/ContextProvider";
import RequireAuth from "./contexts/RequireAuth";
import Modal from "react-modal";
import SHSMaterials from "./pages/Client Page/SHSMaterials";
import JHSMaterials from "./pages/Client Page/JHSMaterials";
import ElemMaterials from "./pages/Client Page/ElemMaterials";
import KinderMaterials from "./pages/Client Page/KinderMaterials";
import GlobalSuccessMessage from "./components/GlobalSuccessMessage";

// Set the app element for accessibility
Modal.setAppElement("#root");

function App() {
  const roles = ["ADMIN", "USER", "LEARNER", "TEACHER"];

  return (
    <ThemeProvider>
      <GlobalSuccessMessage />
      <Routes>
        {/* Default route: redirect to /login if not authenticated */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerificationPage />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/materials-directory" element={<MaterialDirectory />} />
        <Route path="/materials/shs" element={<SHSMaterials />} />
        <Route path="/materials/jhs" element={<JHSMaterials />} />
        <Route path="/materials/elem" element={<ElemMaterials />} />
        <Route path="/materials/kinder" element={<KinderMaterials />} />
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
            {/* <Route path="/data-management" element={<DataManagement />} /> */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/client-page" element={<ClientPage />} />
        </Route>
        {/* Redirect all unknown routes to NotFound page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
