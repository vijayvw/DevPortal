import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
