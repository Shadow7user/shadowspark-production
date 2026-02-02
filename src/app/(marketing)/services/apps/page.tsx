import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AppDevelopmentPage() {
  return (
    <main className="w-full min-h-screen bg-[#050508] text-white pt-24 pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">
          Mobile & System <span className="text-cyan-500">Apps</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Native iOS, Android, and cross-platform applications built for scale.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 border border-gray-800 rounded-lg bg-[#0A0A0F] hover:border-cyan-500/50 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-white">Mobile Apps</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" /> React Native
                (iOS + Android)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" /> Flutter
                cross-platform
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" /> Native
                Swift/Kotlin
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" /> App Store
                deployment
              </li>
            </ul>
          </div>

          <div className="p-6 border border-gray-800 rounded-lg bg-[#0A0A0F] hover:border-purple-500/50 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-white">System Apps</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Windows
                desktop (Electron)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> macOS
                applications
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Linux
                utilities
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> CLI tools
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-lg border border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-white">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Simple App</p>
              <p className="text-3xl font-bold text-white mb-2">
                ₦800K - ₦1.5M
              </p>
              <p className="text-sm text-gray-500">Basic CRUD, 3-5 screens</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Complex App</p>
              <p className="text-3xl font-bold text-white mb-2">₦2M - ₦4M</p>
              <p className="text-sm text-gray-500">API integration, payments</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Enterprise</p>
              <p className="text-3xl font-bold text-white mb-2">₦5M+</p>
              <p className="text-sm text-gray-500">Custom backend, scaling</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact">
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold">
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
