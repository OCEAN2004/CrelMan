import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui";

/** Gate private routes — redirects to /login when unauthenticated. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-violet-50 via-white to-purple-100">
        {/* Background Blobs */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

        {/* Loading Card */}
        <div className="relative z-10 flex flex-col items-center rounded-3xl border border-violet-100 bg-white/80 px-12 py-10 shadow-2xl backdrop-blur-xl">
          <Spinner />

          <h2 className="mt-6 text-xl font-bold tracking-wide text-slate-800">
            Loading CRELMAN
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Preparing your AI-powered workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}