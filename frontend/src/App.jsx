import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function DummyLogin() {
  return <div>Halaman Login - Teks Berjalan</div>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DummyLogin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
