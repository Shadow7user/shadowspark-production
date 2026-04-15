"use client";
import React from "react";

// Placeholder for AppleCardsCarousel component
export const AppleCardsCarousel = ({ items }: { items: any[] }) => {
  return (
    <div className="p-4 border border-dashed border-cyan-500 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-2">Apple Cards Carousel Placeholder</h2>
      <p className="text-slate-400 text-sm mb-4">
        This component will display a swipeable carousel of the Four Layers of Growth.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-900/50 p-4 rounded-md">
            <h3 className="text-white font-bold">{item.title}</h3>
            <p className="text-slate-400 text-xs mt-1">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
