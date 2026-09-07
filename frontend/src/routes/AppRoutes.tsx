import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRoute from "../admin/routes/ProtectedRoute";
import Skills from "../admin/pages/Skills";
import Projects from "../admin/pages/Projects";
import Blog from "../admin/pages/Blog";
import Media from "../admin/pages/Media";
import ContactsPage from "../admin/pages/ContactsPage";
import AuditLogsPage from "../admin/pages/AuditLogsPage";
import SettingsPage from "../admin/pages/SettingsPage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  	      path="/admin/skills"
          element={
           <ProtectedRoute>
             <Skills />
           </ProtectedRoute>
          }
	      />
        <Route
          path="/admin/projects"
          element={
             <ProtectedRoute>
                <Projects />
            </ProtectedRoute>
          }
       />

       <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              <Blog />
           </ProtectedRoute>
          }
       />
       <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <Media />
            </ProtectedRoute>
          }
        />

        <Route
        path="/admin/contact"
        element={
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />

        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
