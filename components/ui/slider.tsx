"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

export function Slider({
  id,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
        style={{
          background: `linear-gradient(to right, rgb(52 211 153) 0%, rgb(168 85 247) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </div>
  );
}
