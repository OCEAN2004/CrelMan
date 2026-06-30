import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Lock, Building2 } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success("Account created — welcome to CRELMAN! 🎉");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-3xl bg-linear-to-br from-violet-100 via-purple-100 to-indigo-100 shadow-lg">
          <User className="h-6 w-6 text-violet-700" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Create Your Account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Join{" "}
          <span className="font-semibold text-violet-700">
            CRELMAN
          </span>{" "}
          and start managing your customers, leads and sales pipeline with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field label="Full Name" error={errors.name?.message}>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Sagar Gupta"
              className="pl-11"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </div>
        </Field>

        <Field label="Business Name" error={errors.company?.message}>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Gupta Enterprises"
              className="pl-11"
              {...register("company")}
            />
          </div>
        </Field>

        <Field label="Business Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="email"
              placeholder="gupta@company.in"
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
              placeholder="Minimum 6 characters"
              className="pl-11"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
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
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-violet-700 transition hover:text-violet-800 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}