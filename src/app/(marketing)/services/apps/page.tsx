import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Code2, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";

export default function AppDevelopmentPage() {
  return (
    <main className="w-full min-h-screen bg-[#050508] text-white pt-24 pb-20">
      {/* Header */}
      <section className="text-center px-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Mobile & System <span className="text-cyan-500">Apps</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Native iOS, Android, and cross-platform applications built for scale.
        </p>
      </section>

      {/* Service Types */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 mb-16">
        <Card className="bg-[#0A0A0F] border-gray-800 p-6">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-cyan-500" />
            </div>
            <CardTitle className="text-2xl text-white mb-4">
              Mobile Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0F] border-gray-800 p-6">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Monitor className="w-6 h-6 text-purple-500" />
            </div>
            <CardTitle className="text-2xl text-white mb-4">
              System Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-lg border border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#0A0A0F] rounded-lg">
              <Code2 className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <p className="text-sm text-gray-400 mb-2">Simple App</p>
              <p className="text-3xl font-bold text-white mb-2">
                ₦800K - ₦1.5M
              </p>
              <p className="text-sm text-gray-500">Basic CRUD, 3-5 screens</p>
            </div>
            <div className="text-center p-6 bg-[#0A0A0F] rounded-lg border-2 border-purple-500/50">
              <Code2 className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <p className="text-sm text-gray-400 mb-2">Complex App</p>
              <p className="text-3xl font-bold text-white mb-2">₦2M - ₦4M</p>
              <p className="text-sm text-gray-500">API integration, payments</p>
            </div>
            <div className="text-center p-6 bg-[#0A0A0F] rounded-lg">
              <Code2 className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <p className="text-sm text-gray-400 mb-2">Enterprise</p>
              <p className="text-3xl font-bold text-white mb-2">₦5M+</p>
              <p className="text-sm text-gray-500">Custom backend, scaling</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 text-center px-4">
        <Link href="/contact">
          <Button className="px-8 py-6 text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
            Book Free Consultation
          </Button>
        </Link>
      </section>
    </main>
  );
}
