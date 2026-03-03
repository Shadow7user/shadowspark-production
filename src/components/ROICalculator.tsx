"use client";
import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";

interface ROICalculatorProps {
  /** Label for the "hours saved per month" slider */
  hoursLabel?: string;
  /** Base hourly rate in NGN */
  hourlyRate?: number;
  /** Monthly platform fee in NGN (used for ROI calculation) */
  monthlyPlatformFee?: number;
  /** Name of the solution (shown in the summary) */
  solutionName?: string;
  /** WhatsApp CTA link */
  whatsappHref?: string;
}

export default function ROICalculator({
  hoursLabel = "Admin hours saved per month",
  hourlyRate = 1500,
  monthlyPlatformFee = 150_000,
  solutionName = "this system",
  whatsappHref = "https://wa.me/2349037621612?text=I%27d%20like%20to%20get%20a%20quote",
}: ROICalculatorProps) {
  const [hours, setHours] = useState(40);
  const [users, setUsers] = useState(200);

  const monthlySavings = hours * hourlyRate;
  const annualSavings = monthlySavings * 12;
  const monthlyROI = monthlySavings - monthlyPlatformFee;
  const roiPercent = Math.round((monthlyROI / monthlyPlatformFee) * 100);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">ROI Calculator</h3>
          <p className="text-xs text-slate-500">Estimate your monthly savings</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hours slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-slate-400">{hoursLabel}</label>
            <span className="text-sm font-semibold text-[#d4a843]">{hours} hrs</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-[#d4a843]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">5 hrs</span>
            <span className="text-xs text-slate-600">200 hrs</span>
          </div>
        </div>

        {/* Users/students slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-slate-400">Active users / records</label>
            <span className="text-sm font-semibold text-[#d4a843]">{users.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full accent-[#d4a843]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">50</span>
            <span className="text-xs text-slate-600">2,000</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-xl bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">Monthly savings</p>
            <p className="mt-1 text-xl font-bold text-white">
              ₦{monthlySavings.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">Annual savings</p>
            <p className="mt-1 text-xl font-bold text-white">
              ₦{annualSavings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ROI highlight */}
        <div className="flex items-center gap-3 rounded-xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-4">
          <TrendingUp size={20} className="shrink-0 text-[#d4a843]" />
          <div>
            <p className="text-sm font-semibold text-white">
              {roiPercent > 0
                ? `${roiPercent}% ROI after platform cost`
                : "Break-even this month"}
            </p>
            <p className="text-xs text-slate-500">
              Based on ₦{hourlyRate.toLocaleString()}/hr staff rate and ₦{monthlyPlatformFee.toLocaleString()}/mo platform fee
            </p>
          </div>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-5 py-3 text-sm font-semibold text-slate-900 transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
        >
          Get a quote for {solutionName}
        </a>
      </div>
    </div>
  );
}
