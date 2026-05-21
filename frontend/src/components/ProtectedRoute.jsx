import { useAuth } from "../context/auth"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}