import {
  TrendingUp,
  Bot,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import logo from "../../assets/logo.png";

/* Premium CRELMAN authentication layout */
export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-violet-50 via-white to-purple-100 overflow-hidden">
      {/* Marketing Panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-violet-700 via-purple-700 to-indigo-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Background Effects */}
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-112 w-md rounded-full bg-violet-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent" />

        {/* Brand */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <img
              src={logo}
              alt="CRELMAN"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-wide">
              CRELMAN
            </h1>

            <p className="text-sm text-violet-100">
              AI-powered CRM
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
            Trusted by Growing Businesses
          </div>

          <div className="mt-12 space-y-5">
            {[
              {
                icon: TrendingUp,
                text: "Visual sales pipeline with seamless opportunity tracking",
              },
              {
                icon: Bot,
                text: "AI-generated summaries, follow-ups and professional emails",
              },
              {
                icon: ShieldCheck,
                text: "Enterprise-grade security with secure authentication",
              },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:bg-white/15"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-sm font-medium text-violet-50">
                  {text}
                </span>

                <ArrowUpRight className="ml-auto h-4 w-4 text-violet-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
     {/* Footer */}
<div className="relative flex items-center justify-between border-t border-white/10 pt-6 text-sm">
  <a
    href="https://www.linkedin.com/in/sagar-gupta-a20a8031b/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-violet-200 transition-colors duration-200 hover:text-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 17V9.5H5.84V17H8.34ZM7.09 8.44C7.89 8.44 8.5 7.83 8.5 7.03C8.5 6.23 7.89 5.62 7.09 5.62C6.29 5.62 5.68 6.23 5.68 7.03C5.68 7.83 6.29 8.44 7.09 8.44ZM18.16 17V12.88C18.16 10.68 16.99 9.34 15.08 9.34C14.08 9.34 13.44 9.89 13.19 10.41V9.5H10.69C10.72 10.1 10.69 17 10.69 17H13.19V12.81C13.19 12.59 13.21 12.37 13.27 12.21C13.45 11.77 13.86 11.31 14.54 11.31C15.44 11.31 15.8 11.99 15.8 12.98V17H18.16Z" />
    </svg>

    <span>Connect with me on LinkedIn</span>
  </a>
</div>
      </div>

      {/* Form Panel */}
      <div className="flex w-full items-center justify-center bg-white/60 px-6 py-12 backdrop-blur-xl lg:w-1/2">
        <div className="w-full max-w-md rounded-[2rem] border border-violet-100 bg-white/90 p-10 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}