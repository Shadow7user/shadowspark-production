"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  highlighted?: boolean;
};

export function GlassCard({
  title,
  description,
  icon,
  children,
  highlighted = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={[
        "rounded-2xl border bg-white/5 p-6 text-zinc-100 backdrop-blur-md",
        highlighted
          ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20"
          : "border-white/10 bg-black/20",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            {icon}
          </div>
        ) : null}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p> : null}
        </div>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </motion.div>
  );
}

export default GlassCard;
