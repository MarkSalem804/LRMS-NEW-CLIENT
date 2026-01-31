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
  ClientDashboard,
} from "./pages";
import MaterialDirectory from "./pages/Client Page/MaterialDirectory";
import ActivityLogs from "./pages/Administration Page/ActivityLogs";
import PositionsManagement from "./pages/Administration Page/PositionsManagement";
import OfficesManagement from "./pages/Administration Page/OfficesManagement";
import SchoolsManagement from "./pages/Administration Page/SchoolsManagement";
import LearnerLevelManagement from "./pages/Administration Page/LearnerLevelManagement";
import LearningAreasManagement from "./pages/Administration Page/LearningAreasManagement";
import ComponentsManagement from "./pages/Administration Page/ComponentsManagement";
import TrackManagement from "./pages/Administration Page/TrackManagement";
import MaterialsTypeManagement from "./pages/Administration Page/MaterialsTypeManagement";
import StrandsManagement from "./pages/Administration Page/StrandsManagement";
import SubjectTypeManagement from "./pages/Administration Page/SubjectTypeManagement";
import { ThemeProvider } from "./context/ThemeContext";
import { useStateContext } from "./contexts/ContextProvider";
import RequireAuth from "./contexts/RequireAuth";
import Modal from "react-modal";
import SHSMaterials from "./pages/Client Page/SHSMaterials";
import JHSMaterials from "./pages/Client Page/JHSMaterials";
import ElemMaterials from "./pages/Client Page/ElemMaterials";
import KinderMaterials from "./pages/Client Page/KinderMaterials";
import GlobalSuccessMessage from "./components/GlobalSuccessMessage";
import { Toaster } from "./components/shadcn-components/ui/sonner";
import LandingPage from "./pages/LandingPage";

// Set the app element for accessibility
Modal.setAppElement("#root");

function App() {
  const { auth } = useStateContext();
  const roles = ["Administrative", "Teacher", "EPS", "LR_coor", "Non_teaching"];

  return (
    <ThemeProvider>
      <Toaster />
      <GlobalSuccessMessage />
      <Routes>
        {/* Default route: Landing Page */}
        <Route index element={<LandingPage />} />
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
            {/* Common Routes for all roles inside Admin Layout */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/password" element={<Security />} />
            <Route path="/settings/passwords" element={<Security />} />
            <Route
              path="/materials/management"
              element={<MaterialsManagement />}
            />
            <Route path="/materials" element={<Materials />} />
            <Route path="/teacher/dashboard" element={<ClientDashboard />} />

            {/* Administrative only Routes */}
            <Route element={<RequireAuth allowedRoles={["Administrative"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users-management" element={<UsersManagement />} />
              <Route path="/activity-logs" element={<ActivityLogs />} />
              <Route path="/logs/user-logs" element={<ActivityLogs />} />
              <Route
                path="/context-libraries/position-titles"
                element={<PositionsManagement />}
              />
              <Route
                path="/context-libraries/offices"
                element={<OfficesManagement />}
              />
              <Route
                path="/context-libraries/schools"
                element={<SchoolsManagement />}
              />
              <Route
                path="/context-libraries/learner-level"
                element={<LearnerLevelManagement />}
              />
              <Route
                path="/context-libraries/learning-areas"
                element={<LearningAreasManagement />}
              />
              <Route
                path="/context-libraries/components"
                element={<ComponentsManagement />}
              />
              <Route
                path="/context-libraries/tracks"
                element={<TrackManagement />}
              />
              <Route
                path="/context-libraries/materials-type"
                element={<MaterialsTypeManagement />}
              />
              <Route
                path="/context-libraries/strands"
                element={<StrandsManagement />}
              />
              <Route
                path="/context-libraries/subject-type"
                element={<SubjectTypeManagement />}
              />
            </Route>

            {/* Role-based default redirection */}
            <Route
              index
              element={
                auth?.role === "Teacher" ? (
                  <Navigate to="/teacher/dashboard" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
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
