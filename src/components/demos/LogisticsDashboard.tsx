import React from "react";
import { Truck, MapPin, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DeliveryMetric {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  color: string;
}

const METRICS: DeliveryMetric[] = [
  { id: "1", label: "Active Fleet", value: "12 Trucks", trend: "up", color: "text-blue-600" },
  { id: "2", label: "Fuel Cost", value: "₦420/km", trend: "down", color: "text-emerald-600" },
  { id: "3", label: "Delay Risk", value: "Low (Rumuokoro)", trend: "neutral", color: "text-amber-600" },
];

const LogisticsDashboard: React.FC = () => {
  const trendIcon = (trend: DeliveryMetric["trend"]) => {
    switch (trend) {
      case "down":
        return TrendingDown;
      case "neutral":
        return Minus;
      default:
        return TrendingUp;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Frontier Lodgist AI</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational • Port Harcourt Node
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Optimization</p>
          <p className="text-lg font-mono text-indigo-600 font-bold">94.2% Route Efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {METRICS.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">{metric.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</h3>
              </div>
              {React.createElement(trendIcon(metric.trend), { className: `w-5 h-5 ${metric.color}` })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl text-white relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative p-6 z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
              <Truck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Route #PH-809 • Medical Supplies</h3>
              <p className="text-slate-400 text-sm">Trans Amadi Ind. Layout → UPTH</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
              ON TIME
            </span>
          </div>

          <div className="space-y-6 border-l-2 border-slate-700 ml-3 pl-6 relative">
            <div className="relative">
              <span className="absolute -left-[31px] bg-slate-900 p-1">
                <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-700" />
              </span>
              <p className="text-xs text-slate-500">08:30 AM</p>
              <p className="text-sm text-slate-300">Departed Warehouse (Slaughter)</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] bg-slate-900 p-1">
                <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </span>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-indigo-400 font-bold mb-1">CURRENT LOCATION</p>
                  <p className="text-base font-medium">Garrison Flyover</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded w-fit">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Heavy Traffic detected on Aba Rd. Rerouting...</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono">
                    14<span className="text-sm text-slate-500 font-sans">mins</span>
                  </p>
                  <p className="text-xs text-slate-500">to destination</p>
                </div>
              </div>
            </div>

            <div className="relative opacity-50">
              <span className="absolute -left-[31px] bg-slate-900 p-1">
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700" />
              </span>
              <p className="text-xs text-slate-500">EST. 09:15 AM</p>
              <p className="text-sm text-slate-300">University of Port Harcourt Teaching Hospital</p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Optimize my fleet now"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <MapPin className="w-5 h-5" />
        Optimize My Fleet Now
      </button>
    </div>
  );
};

export default LogisticsDashboard;
