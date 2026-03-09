
"use client";

import { motion } from "framer-motion";
import type { SVGProps } from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <filter id="shadow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="8"
              floodColor="#BD00FF"
            />
          </filter>
        </defs>

        {/* Shadow/Glow Layer */}
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          fontSize="90"
          fontWeight="bold"
          fontFamily="sans-serif"
          fill="#BD00FF"
          filter="url(#shadow-glow)"
          style={{ textShadow: "0 0 15px #BD00FF" }}
        >
          SS
        </text>

        {/* Primary Spark Layer */}
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          fontSize="90"
          fontWeight="bold"
          fontFamily="sans-serif"
          fill="#00FFD5"
        >
          SS
        </text>
      </svg>
    </motion.div>
  );
};

export default Logo;
