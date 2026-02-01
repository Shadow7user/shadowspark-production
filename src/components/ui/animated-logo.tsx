'use client';

import React, { useEffect, useRef } from 'react';

export function AnimatedLogo() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Add glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feGaussianBlur'
    );
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.insertBefore(defs, svg.firstChild);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className="w-16 h-16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Animated S Logo */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(0, 255, 213, 0.6)); }
          50% { filter: drop-shadow(0 0 12px rgba(0, 255, 213, 1)); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          360deg { transform: rotate(360deg); }
        }
        .logo-s {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .logo-circuit {
          animation: rotate 20s linear infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Background circuit */}
      <g className="logo-circuit" opacity="0.3">
        <circle cx="100" cy="100" r="95" stroke="#00FFD5" strokeWidth="2" fill="none" />
        <circle cx="100" cy="100" r="85" stroke="#00FFD5" strokeWidth="1" fill="none" />
      </g>

      {/* Main S */}
      <text
        x="100"
        y="120"
        fontSize="80"
        fontWeight="bold"
        textAnchor="middle"
        className="logo-s"
        fill="#00FFD5"
      >
        S
      </text>

      {/* Accent dots */}
      <circle cx="130" cy="70" r="3" fill="#BD00FF" opacity="0.8" />
      <circle cx="70" cy="130" r="3" fill="#00FFD5" opacity="0.8" />
    </svg>
  );
}
