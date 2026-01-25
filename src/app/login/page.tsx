import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">ShadowSpark</h1>
          <p className="mt-2 text-lg text-gray-300">Enter your credentials</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
