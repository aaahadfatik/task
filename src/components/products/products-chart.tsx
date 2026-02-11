"use client";

import { addMonths, format, parseISO, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";

import type { Product } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return [
    `M ${first.x} ${first.y}`,
    ...rest.map((point) => `L ${point.x} ${point.y}`)
  ].join(" ");
}

export function ProductsChart({
  products,
  monthsToShow,
  onMonthsToShowChange
}: {
  products: Product[];
  monthsToShow: number;
  onMonthsToShowChange: (value: number) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const base = startOfMonth(new Date());
  const months = Array.from({ length: monthsToShow }, (_, index) => {
    const date = subMonths(base, monthsToShow - 1 - index);
    const label = format(date, "MMM");
    const nextMonth = addMonths(date, 1);
    const count = products.filter((product) => {
      const added = parseISO(product.dateAdded);
      return added >= date && added < nextMonth;
    }).length;
    return { label, count };
  });

  const max = Math.max(1, ...months.map((m) => m.count));
  const width = 600;
  const height = 190;
  const paddingX = 0;
  const paddingY = 18;
  const step = width / Math.max(1, monthsToShow - 1);

  const points = months.map((month, index) => {
    const x = paddingX + index * step;
    const y = paddingY + (1 - month.count / max) * (height - paddingY * 2);
    return { x, y };
  });

  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${paddingX + (monthsToShow - 1) * step} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
  const ticks = [0, Math.ceil(max * 0.5), max];
  const labelY = height - 2;
  const labelStep =
    monthsToShow <= 6 ? 1 : monthsToShow <= 12 ? 2 : monthsToShow <= 24 ? 3 : 6;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Catalog pulse
          </p>
          <p className="text-lg font-semibold">Products added over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-muted-foreground">Last {monthsToShow} months</div>
          <Select
            value={String(monthsToShow)}
            onValueChange={(value) => onMonthsToShowChange(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
          <SelectContent>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative mt-6 rounded-2xl border border-border/60 bg-background/60 p-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
          <defs>
            <linearGradient id="pulse-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((tick) => {
            const y = paddingY + (1 - tick / max) * (height - paddingY * 2);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="rgba(99, 102, 241, 0.15)"
                  strokeDasharray="4 6"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.55"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          <path d={areaPath} fill="url(#pulse-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(99 102 241)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <circle
              key={`${months[index].label}-${index}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke="rgb(99 102 241)"
              strokeWidth="2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
          {points.map((point, index) => (
            <g key={`${months[index].label}-${index}-label`}>
              <text
                x={
                  index === 0
                    ? paddingX + 2
                    : index === points.length - 1
                      ? width - paddingX - 2
                      : point.x
                }
                y={labelY - 12}
                textAnchor={
                  index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"
                }
                fontSize="11"
                fill="currentColor"
                opacity="0.7"
              >
                {index % labelStep === 0 ? months[index].label : ""}
              </text>
              <text
                x={
                  index === 0
                    ? paddingX + 2
                    : index === points.length - 1
                      ? width - paddingX - 2
                      : point.x
                }
                y={labelY}
                textAnchor={
                  index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"
                }
                fontSize="11"
                fill="currentColor"
              >
                {index % labelStep === 0 ? months[index].count : ""}
              </text>
            </g>
          ))}
        </svg>
        {hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute rounded-lg border border-border/60 bg-card px-3 py-2 text-xs shadow-md"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100}%`,
              transform: "translate(-50%, -120%)"
            }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {months[hoveredIndex].label}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              {months[hoveredIndex].count} products
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
