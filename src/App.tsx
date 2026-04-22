import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminViewSwitcher } from "@/components/AdminViewSwitcher";
import { BackgroundAudioController } from "@/components/BackgroundAudioController";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LanguageSelect from "./pages/LanguageSelect.tsx";
import Landing from "./pages/Landing.tsx";
import Pricing from "./pages/Pricing.tsx";
import SchoolContact from "./pages/SchoolContact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import WorldPage from "./pages/WorldPage.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import FinalTest from "./pages/FinalTest.tsx";
import Certificate from "./pages/Certificate.tsx";
import Account from "./pages/Account.tsx";
import TeacherLogin from "./pages/teacher/TeacherLogin.tsx";
import ClassroomDashboard from "./pages/teacher/ClassroomDashboard.tsx";
import WorldDetail from "./pages/teacher/WorldDetail.tsx";
import LessonDetail from "./pages/teacher/LessonDetail.tsx";
import ClassSettings from "./pages/teacher/ClassSettings.tsx";
import LessonDemo from "./pages/teacher/LessonDemo.tsx";
import AdminLessons from "./pages/AdminLessons.tsx";
import ParentPreview from "./pages/admin/ParentPreview.tsx";
import SchoolPreview from "./pages/admin/SchoolPreview.tsx";
import LessonAudio from "./pages/admin/LessonAudio.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BackgroundAudioController />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<LanguageSelect />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/schools/contact" element={<SchoolContact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/world/:worldId"
            element={
              <ProtectedRoute>
                <WorldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/final-test"
            element={
              <ProtectedRoute>
                <FinalTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute requireRole="teacher">
                <ClassroomDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/world/:id"
            element={
              <ProtectedRoute requireRole="teacher">
                <WorldDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/world/:worldId/lesson/:lessonId"
            element={
              <ProtectedRoute requireRole="teacher">
                <LessonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class/settings"
            element={
              <ProtectedRoute requireRole="teacher">
                <ClassSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/demo"
            element={
              <ProtectedRoute requireRole="teacher">
                <LessonDemo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lessons"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLessons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/preview/parent"
            element={
              <ProtectedRoute requireRole="admin">
                <ParentPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/preview/school"
            element={
              <ProtectedRoute requireRole="admin">
                <SchoolPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audio"
            element={
              <ProtectedRoute requireRole="admin">
                <LessonAudio />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
        <AdminViewSwitcher />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
