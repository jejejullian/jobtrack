import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function DummyDashboard() {
  return <div className="p-2">Dashboard — coming soon</div>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DummyDashboard />} />
            {/* TODO: ganti dengan halaman asli nanti */}
            {/* <Route path="/jobs" element={<JobsPage />} /> */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
