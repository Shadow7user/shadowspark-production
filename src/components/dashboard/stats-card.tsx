'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  currency?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral',
  currency = false,
}: StatsCardProps) {
  // Format number with commas (Nigerian market)
  const formatValue = (val: string | number): string => {
    const numValue = typeof val === 'string' ? parseInt(val) : val;
    const formatted = numValue.toLocaleString('en-US');
    return currency ? `₦${formatted}` : formatted;
  };

  const displayValue = formatValue(value);

  // Trend color mapping
  const trendColorMap = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground',
  };

  const trendArrowMap = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <Card
      className={cn(
        'border-cyber-cyan/30 bg-gradient-to-br from-cyber-cyan/5 to-purple-500/5 backdrop-blur',
        'border-cyberpunk hover:border-cyber-cyan/60 transition-all duration-300',
        'hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105',
        'active:scale-95'
      )}
    >
      <CardContent className="p-6">
        {/* Header: Icon + Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className="text-cyber-cyan opacity-60 hover:opacity-100 transition-opacity">
            {icon}
          </div>
        </div>

        {/* Value Display */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {displayValue}
            </div>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div
              className={cn(
                'text-xs font-semibold flex items-center gap-1',
                trendColorMap[trendType]
              )}
              style={{
                animation: 'none',
                animationDelay: '0s',
              }}
            >
              <span>{trendArrowMap[trendType]}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Subtle bottom accent line */}
        <div className="mt-4 h-px bg-gradient-to-r from-cyber-cyan/0 via-cyber-cyan/20 to-cyber-cyan/0" />
      </CardContent>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          :global(div) {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </Card>
  );
}
