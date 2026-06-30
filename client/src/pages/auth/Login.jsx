import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name.split(" ")[0]} 👋`);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Convenience: pre-fill the seeded demo credentials.
  // const useDemo = () => {
  //   setValue("email", "user@crelman.com");
  //   setValue("password", "Test@1234");
  // };

  return (
    <AuthShell>
      <div className="text-center overflow-auto-hidden">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-3xl bg-linear-to-br from-violet-100 via-purple-100 to-indigo-100 shadow-lg overflow-hidden">
          <Mail className="h-6 w-6 text-violet-700" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Sign in to your <span className="font-semibold text-violet-700">CRELMAN</span> workspace and continue managing your customers with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field label="Business Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="email"
              placeholder="name@company.in"
              className="pl-11"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="password"
              placeholder="Enter your password"
              className="pl-11"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>
        </Field>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={submitting}
        >
          Sign In
        </Button>
      </form>

      {/* <button
        onClick={useDemo}
        className="mt-4 w-full rounded-2xl border border-dashed border-violet-300 bg-violet-50 py-3 text-sm font-semibold text-violet-700 transition-all duration-300 hover:border-violet-400 hover:bg-violet-100"
      >
        Use Demo Workspace
      </button> */}

      <p className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-violet-700 transition hover:text-violet-800 hover:underline"
        >
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}