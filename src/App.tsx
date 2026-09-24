import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BackgroundAudioController } from "@/components/BackgroundAudioController";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SchoolContact from "./pages/SchoolContact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import About from "./pages/About.tsx";
import Auth from "./pages/Auth.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import WorldPage from "./pages/WorldPage.tsx";
import MissionPage from "./pages/MissionPage.tsx";
import FinalTest from "./pages/FinalTest.tsx";
import Certificate from "./pages/Certificate.tsx";
import Account from "./pages/Account.tsx";
import TeacherLogin from "./pages/teacher/TeacherLogin.tsx";
import TeacherStart from "./pages/teacher/TeacherStart.tsx";
import ClassroomDashboard from "./pages/teacher/ClassroomDashboard.tsx";
import ClassSettings from "./pages/teacher/ClassSettings.tsx";
import MissionPreview from "./pages/teacher/MissionPreview.tsx";

const queryClient = new QueryClient();

// Old /lesson/:id links from v1 go to the mission with the same id.
const LegacyLessonRedirect = () => {
  const { lessonId } = useParams();
  return <Navigate to={`/mission/${lessonId}`} replace />;
};

const kid = (el: JSX.Element) => <ProtectedRoute>{el}</ProtectedRoute>;
const teacher = (el: JSX.Element) => <ProtectedRoute requireRole="teacher">{el}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BackgroundAudioController />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<SchoolContact />} />
          <Route path="/schools/contact" element={<Navigate to="/contact" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Navigate to="/" replace />} />

          {/* Kids (account required) */}
          <Route path="/dashboard" element={kid(<Dashboard />)} />
          <Route path="/world/:worldId" element={kid(<WorldPage />)} />
          <Route path="/mission/:missionId" element={kid(<MissionPage />)} />
          <Route path="/lesson/:lessonId" element={<LegacyLessonRedirect />} />
          <Route path="/final-test" element={kid(<FinalTest />)} />
          <Route path="/certificate" element={kid(<Certificate />)} />
          <Route path="/account" element={kid(<Account />)} />

          {/* Teachers */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/start" element={<TeacherStart />} />
          <Route path="/teacher" element={teacher(<ClassroomDashboard />)} />
          <Route path="/teacher/class/settings" element={teacher(<ClassSettings />)} />
          <Route path="/teacher/preview/:missionId" element={teacher(<MissionPreview />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
