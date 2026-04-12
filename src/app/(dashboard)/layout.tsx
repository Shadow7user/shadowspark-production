import DeveloperModeToggle from "@/components/dashboard/DeveloperModeToggle";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <div className="px-4 py-8 bg-slate-900/50 border-t border-slate-800 flex justify-end">
        <DeveloperModeToggle />
      </div>
      <Footer />
    </div>
  );
}
