'use client';

import React from 'react';
import Image from 'next/image';

export function TrustLogos() {
  const logos = [
    { name: 'Paystack', src: '/logos/paystack.svg' },
    { name: 'Vercel', src: '/logos/vercel.svg' },
    { name: 'Nigeria', src: '/logos/nigeria-flag.svg' },
    { name: 'Tech', src: '/logos/tech-badge.svg' },
  ];

  return (
    <section className="py-12 border-t border-cyan-500/20">
      <h3 className="text-center text-gray-400 text-sm font-bold mb-8">TRUSTED BY</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center max-w-4xl mx-auto px-4">
        {logos.map(logo => (
          <div
            key={logo.name}
            className="h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
          >
            {/* Fallback: Show text if image not available */}
            <span className="text-cyan-400/70 text-sm font-bold">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
