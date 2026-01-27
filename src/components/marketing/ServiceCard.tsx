'use client';

import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  startingPrice: number;
  features: string[];
  ctaText?: string;
  popular?: boolean;
}

export function ServiceCard({
  title,
  description,
  icon,
  startingPrice,
  features,
  ctaText = 'Get Started',
  popular = false,
}: ServiceCardProps) {
  const formattedPrice = `₦${startingPrice.toLocaleString('en-NG')}`;

  return (
    <div className="relative group h-full">
      {/* Gradient Background (Hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/0 via-cyber-purple/0 to-cyber-cyan/0 group-hover:from-cyber-cyan/20 group-hover:via-cyber-purple/10 group-hover:to-cyber-cyan/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 blur-xl" />

      {/* Card Container */}
      <div className="relative bg-background/50 backdrop-blur-xl border border-white/10 group-hover:border-cyber-cyan/50 rounded-xl p-6 h-full flex flex-col gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
        {/* Popular Badge */}
        {popular && (
          <div className="absolute top-4 right-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50">
              Most Popular
            </span>
          </div>
        )}

        {/* Icon & Title Section */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center text-cyber-cyan group-hover:text-cyber-purple transition-colors">
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="flex-1 space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Starting from</p>
            <p className="text-2xl font-bold text-cyber-cyan">{formattedPrice}</p>
          </div>

          <Button
            className="w-full bg-cyber-cyan hover:bg-cyber-cyan/80 text-background font-semibold transition-all group/btn"
          >
            {ctaText}
            <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
