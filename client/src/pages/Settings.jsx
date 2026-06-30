import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Mail,
  KeyRound,
} from "lucide-react";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Field,
  Badge,
  Avatar,
  Spinner,
} from "../components/ui";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { authApi, aiApi } from "../lib/services";
import { shortDate } from "../lib/format";
import { cn } from "../lib/utils";

/* ───────────────── Section Icon ───────────────── */

function SectionIcon({
  icon: Icon,
  className,
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-purple-100 shadow-sm",
        className
      )}
    >
      <Icon className="h-5 w-5 text-violet-700" />
    </div>
  );
}

/* ───────────────── Profile Card ───────────────── */

function ProfileCard({
  user,
  updateUser,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name || "",
      company:
        user.company || "",
      avatar:
        user.avatar || "",
    });
  }, [user, reset]);

  const onSubmit = async (
    form
  ) => {
    try {
      const res =
        await authApi.updateProfile(
          form
        );

      updateUser(res.user);

      toast.success(
        "Profile updated successfully"
      );
    } catch (err) {
      toast.error(
        err.message ||
          "Couldn't update profile"
      );
    }
  };

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <SectionIcon
            icon={User}
          />

          <div>
            <CardTitle>
              Profile Information
            </CardTitle>

            <CardDescription>
              Update your
              personal and
              business
              details.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Profile Preview */}

        <div className="mb-7 flex items-center gap-4 rounded-3xl border border-violet-100 bg-violet-50/50 p-4">
          <Avatar
            name={user?.name}
            src={user?.avatar}
            size="lg"
          />

          <div>
            <p className="font-semibold text-slate-900">
              {user?.name}
            </p>

            <p className="text-sm text-slate-500">
              {user?.email}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Full Name"
              error={
                errors.name
                  ?.message
              }
              className="sm:col-span-2"
            >
              <Input
                placeholder="Rahul Sharma"
                {...register(
                  "name",
                  {
                    required:
                      "Name is required",
                  }
                )}
              />
            </Field>

            <Field label="Business Name">
              <Input
                placeholder="ABC Technologies Pvt. Ltd."
                {...register(
                  "company"
                )}
              />
            </Field>

            <Field label="Email Address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={
                    user?.email ||
                    ""
                  }
                  disabled
                  readOnly
                  className="pl-10"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Email address
                cannot be
                changed.
              </p>
            </Field>

            <Field
              label="Profile Photo URL"
              className="sm:col-span-2"
            >
              <Input
                placeholder="https://your-image-link.com/profile.jpg"
                {...register(
                  "avatar"
                )}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={
                isSubmitting
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ───────────────── Security Card ───────────────── */

function SecurityCard() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  const newPassword =
    watch("password");

  const onSubmit = async ({
    password,
  }) => {
    try {
      await authApi.updateProfile(
        {
          password,
        }
      );

      toast.success(
        "Password updated successfully"
      );

      reset();
    } catch (err) {
      toast.error(
        err.message ||
          "Couldn't update password"
      );
    }
  };

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <SectionIcon
            icon={Lock}
          />

          <div>
            <CardTitle>
              Security
            </CardTitle>

            <CardDescription>
              Keep your
              account secure
              by updating
              your password.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="New Password"
              error={
                errors.password
                  ?.message
              }
            >
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="pl-10"
                  {...register(
                    "password",
                    {
                      required:
                        "Password is required",
                      minLength:
                        {
                          value: 6,
                          message:
                            "Must be at least 6 characters",
                        },
                    }
                  )}
                />
              </div>
            </Field>

                       <Field
              label="Confirm Password"
              error={
                errors.confirmPassword
                  ?.message
              }
            >
              <Input
                type="password"
                placeholder="Re-enter your password"
                {...register(
                  "confirmPassword",
                  {
                    required:
                      "Please confirm your password",
                    validate: (
                      value
                    ) =>
                      value ===
                        newPassword ||
                      "Passwords do not match",
                  }
                )}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isSubmitting}
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ───────────────── AI Integration ───────────────── */

function AiIntegrationCard() {
  const [status, setStatus] =
    useState(null);

  useEffect(() => {
    aiApi
      .status()
      .then((res) =>
        setStatus(res)
      )
      .catch(() =>
        setStatus({
          success: false,
          configured: false,
          model: null,
        })
      );
  }, []);

  return (
    <Card className="rounded-3xl border border-violet-100 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-purple-100 shadow-sm">
            <Shield className="h-5 w-5 text-violet-700" />
          </div>

          <div>
            <CardTitle>
              AI Integration
            </CardTitle>

            <CardDescription>
              Check the
              status of AI
              features
              available in
              CRELMAN.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {status === null ? (
          <div className="flex items-center gap-3 py-2">
            <Spinner className="p-0" />

            <span className="text-sm text-slate-500">
              Checking AI
              status...
            </span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {status.configured ? (
                <Badge className="border border-violet-200 bg-violet-100 text-violet-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </Badge>
              ) : (
                <Badge className="border border-amber-200 bg-amber-100 text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Not Connected
                </Badge>
              )}

              {status.model && (
                <span className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-1 font-mono text-xs text-slate-600">
                  {status.model}
                </span>
              )}
            </div>

            {!status.configured && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-semibold text-amber-800">
                  AI Setup Required
                </p>

                <p className="mt-2 text-sm leading-relaxed text-amber-700">
                  Add your
                  API key in
                  the backend{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                    .env
                  </code>{" "}
                  file and
                  restart the
                  server to
                  enable AI
                  features.
                </p>
              </div>
            )}

            {status.configured && (
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  AI features
                  are active.
                  Smart lead
                  summaries,
                  email
                  generation,
                  insights,
                  and workflow
                  assistance
                  are ready to
                  use.

                  {status.model && (
                    <>
                      {" "}
                      Current
                      Model:{" "}
                      <span className="font-semibold text-slate-900">
                        {status.model}
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ───────────────── Account Card ───────────────── */

function AccountCard({
  user,
  logout,
}) {
  return (
    <Card className="rounded-3xl border border-violet-100 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <SectionIcon
            icon={Shield}
          />

          <div>
            <CardTitle>
              Account
            </CardTitle>

            <CardDescription>
              View your
              account
              details and
              manage your
              session.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Role
            </p>

            <Badge className="border border-violet-200 bg-violet-100 text-violet-700 capitalize">
              {user?.role ||
                "Member"}
            </Badge>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Member Since
            </p>

            <p className="font-semibold text-slate-900">
              {shortDate(
                user?.createdAt
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="danger"
            onClick={logout}
          >
            Log Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────────────── Settings Page ───────────────── */

export default function Settings() {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, security preferences, AI features, and account."
      />

      <ProfileCard
        user={user}
        updateUser={updateUser}
      />

      <SecurityCard />

      <AiIntegrationCard />

      <AccountCard
        user={user}
        logout={logout}
      />
    </div>
  );
}