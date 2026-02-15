"use client";
import { useState } from "react";
import { Calculator, MessageSquare, Layers, Wrench } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import {
  trackCalculatorInteract,
  trackCalculatorChannelToggle,
  trackCalculatorAddonToggle,
  trackCalculatorQuoteClick,
} from "@/lib/analytics";

const channelOptions = [
  { id: "whatsapp", label: "WhatsApp", price: 30000 },
  { id: "web", label: "Web Chat", price: 20000 },
  { id: "sms", label: "SMS", price: 25000 },
];

const featureOptions = [
  { id: "bi", label: "BI Dashboard", price: 50000 },
  { id: "leads", label: "Lead Capture & CRM", price: 30000 },
  { id: "rpa", label: "RPA Workflows", price: 80000 },
  { id: "multilingual", label: "Multilingual Support", price: 20000 },
];

const messageTiers = [
  { max: 1000, label: "Up to 1,000", base: 0 },
  { max: 5000, label: "Up to 5,000", base: 25000 },
  { max: 10000, label: "Up to 10,000", base: 50000 },
  { max: 50000, label: "Up to 50,000", base: 100000 },
  { max: Infinity, label: "Unlimited", base: 200000 },
];

export default function PricingCalculator() {
  const [messageVolume, setMessageVolume] = useState(1);
  const [channels, setChannels] = useState<string[]>(["whatsapp"]);
  const [features, setFeatures] = useState<string[]>([]);

  const tier = messageTiers[messageVolume];
  const channelCost = channelOptions
    .filter((c) => channels.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);
  const featureCost = featureOptions
    .filter((f) => features.includes(f.id))
    .reduce((sum, f) => sum + f.price, 0);
  const total = tier.base + channelCost + featureCost;

  function toggleChannel(id: string) {
    const willEnable = !channels.includes(id);
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    trackCalculatorChannelToggle(id, willEnable);
  }

  function toggleFeature(id: string) {
    const willEnable = !features.includes(id);
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
    trackCalculatorAddonToggle(id, willEnable);
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4a843]/30 bg-[#d4a843]/10 px-4 py-1.5 text-sm text-[#d4a843]">
          <Calculator size={14} /> Pricing Calculator
        </div>
        <h2 className="text-3xl font-bold text-white">
          Build your <span className="gradient-text">custom plan</span>
        </h2>
        <p className="mt-2 text-slate-400">
          Adjust the sliders and toggles to estimate your monthly cost.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-8">
          {/* Message volume */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-[#d4a843]" />
              <h3 className="text-sm font-semibold text-white">
                Monthly Message Volume
              </h3>
            </div>
            <input
              type="range"
              min={0}
              max={messageTiers.length - 1}
              value={messageVolume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMessageVolume(v);
                trackCalculatorInteract(
                  "message_volume",
                  messageTiers[v].label,
                );
              }}
              className="w-full cursor-pointer accent-[#d4a843]"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>1K</span>
              <span>5K</span>
              <span>10K</span>
              <span>50K</span>
              <span>&infin;</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Selected:{" "}
              <span className="text-white font-medium">{tier.label}</span>{" "}
              messages/month
            </p>
          </div>

          {/* Channels */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#d4a843]" />
              <h3 className="text-sm font-semibold text-white">Channels</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {channelOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleChannel(c.id)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                    channels.includes(c.id)
                      ? "border-[#d4a843] bg-[#d4a843]/10 text-[#d4a843]"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {c.label}
                  <span className="ml-2 text-xs text-slate-500">
                    +{"\u20A6"}
                    {(c.price / 1000).toFixed(0)}k
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Wrench size={16} className="text-[#d4a843]" />
              <h3 className="text-sm font-semibold text-white">Add-ons</h3>
            </div>
            <div className="space-y-2">
              {featureOptions.map((f) => (
                <label
                  key={f.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                    features.includes(f.id)
                      ? "border-[#c0935a] bg-[#c0935a]/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={features.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-[#c0935a]"
                    />
                    <span
                      className={`text-sm ${features.includes(f.id) ? "text-white" : "text-slate-400"}`}
                    >
                      {f.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    +{"\u20A6"}
                    {(f.price / 1000).toFixed(0)}k/mo
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col">
          <div className="glass-card sticky top-24 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">
              Estimated Monthly Cost
            </h3>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Base ({tier.label} messages)</span>
                <span className="text-white">
                  {"\u20A6"}
                  {tier.base.toLocaleString()}
                </span>
              </div>
              {channelOptions
                .filter((c) => channels.includes(c.id))
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between text-slate-400"
                  >
                    <span>{c.label} channel</span>
                    <span className="text-white">
                      {"\u20A6"}
                      {c.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              {featureOptions
                .filter((f) => features.includes(f.id))
                .map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between text-slate-400"
                  >
                    <span>{f.label}</span>
                    <span className="text-white">
                      {"\u20A6"}
                      {f.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              <div className="border-t border-slate-700 pt-3">
                <div className="flex items-end justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="text-3xl font-bold text-white">
                    {"\u20A6"}
                    {total.toLocaleString()}
                    <span className="text-sm font-normal text-slate-500">
                      /mo
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <WhatsAppLink
              href={`https://wa.me/2349037621612?text=${encodeURIComponent(
                `Hi, I'm interested in a custom plan:\n- ${tier.label} messages/month\n- Channels: ${channels.join(", ")}\n- Add-ons: ${features.length > 0 ? features.join(", ") : "none"}\n- Estimated: \u20A6${total.toLocaleString()}/mo`,
              )}`}
              source="pricing_calculator"
              className="mt-6 block rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
            >
              Get This Quote on WhatsApp
            </WhatsAppLink>
            <p className="mt-3 text-center text-xs text-slate-500">
              Prices are estimates. Final pricing confirmed after consultation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
