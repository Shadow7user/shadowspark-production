'use client';

import React from 'react';
import { Zap, Shield, Boxes, Wifi, TrendingUp, Cloud } from 'lucide-react';

interface ServiceIconProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
}

export function ServiceIcon({ icon, label, description, href }: ServiceIconProps) {
  const content = (
    <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-cyan-500/30 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 hover:border-cyan-500/60 hover:from-purple-900/40 hover:to-cyan-900/40 transition-all duration-300 group cursor-pointer">
      <div className="text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-sm font-bold text-center text-white">{label}</p>
      {description && <p className="text-xs text-gray-400 text-center">{description}</p>}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

export function ServiceIconsGrid() {
  const services = [
    {
      icon: <Zap className="h-8 w-8" strokeWidth={1.5} />,
      label: 'AI Solutions',
      description: 'Intelligent automation',
      href: '/services/ai-solutions',
    },
    {
      icon: <Shield className="h-8 w-8" strokeWidth={1.5} />,
      label: 'Cybersecurity',
      description: 'Enterprise protection',
      href: '/services/cybersecurity',
    },
    {
      icon: <Boxes className="h-8 w-8" strokeWidth={1.5} />,
      label: 'Blockchain',
      description: 'Decentralized solutions',
      href: '/services/blockchain',
    },
    {
      icon: <Wifi className="h-8 w-8" strokeWidth={1.5} />,
      label: 'IoT Integration',
      description: 'Connected systems',
      href: '/services/iot',
    },
    {
      icon: <TrendingUp className="h-8 w-8" strokeWidth={1.5} />,
      label: 'Data Analytics',
      description: 'Insights & intelligence',
      href: '/services/analytics',
    },
    {
      icon: <Cloud className="h-8 w-8" strokeWidth={1.5} />,
      label: 'Cloud Solutions',
      description: 'Scalable infrastructure',
      href: '/services/cloud',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(service => (
        <ServiceIcon
          key={service.label}
          icon={service.icon}
          label={service.label}
          description={service.description}
          href={service.href}
        />
      ))}
    </div>
  );
}
