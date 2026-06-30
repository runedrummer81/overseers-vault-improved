import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import StartPage from "./pages/StartPage";
import CampaignPage from "./pages/CampaignPage";
import SessionPage from "./pages/SessionPage";
import CreaturesItemsPage from "./pages/CreaturesItemsPage";

const basename = import.meta.env.DEV ? "/" : "/overseers-vault-improved";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaign/:campaignId"
            element={
              <ProtectedRoute>
                <CampaignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaign/:campaignId/session/:sessionId"
            element={
              <ProtectedRoute>
                <SessionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creatures-items"
            element={
              <ProtectedRoute>
                <CreaturesItemsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
