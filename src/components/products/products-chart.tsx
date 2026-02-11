"use client";

import { addMonths, format, parseISO, startOfMonth, subMonths } from "date-fns";

import type { Product } from "@/lib/types";

const MONTHS_TO_SHOW = 6;

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return [
    `M ${first.x} ${first.y}`,
    ...rest.map((point) => `L ${point.x} ${point.y}`)
  ].join(" ");
}

export function ProductsChart({ products }: { products: Product[] }) {
  const base = startOfMonth(new Date());
  const months = Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const date = subMonths(base, MONTHS_TO_SHOW - 1 - index);
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
  const height = 160;
  const paddingX = 42;
  const paddingY = 18;
  const step = (width - paddingX * 2) / (MONTHS_TO_SHOW - 1);

  const points = months.map((month, index) => {
    const x = paddingX + index * step;
    const y = paddingY + (1 - month.count / max) * (height - paddingY * 2);
    return { x, y };
  });

  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${paddingX + (MONTHS_TO_SHOW - 1) * step} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
  const ticks = [0, Math.ceil(max * 0.5), max];

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Catalog pulse
          </p>
          <p className="text-lg font-semibold">Products added over time</p>
        </div>
        <div className="text-sm text-muted-foreground">Last {MONTHS_TO_SHOW} months</div>
      </div>

      <div className="relative mt-6 rounded-2xl border border-border/60 bg-background/60 p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
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
              key={months[index].label}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke="rgb(99 102 241)"
              strokeWidth="2"
            >
              <title>
                {months[index].label}: {months[index].count} products
              </title>
            </circle>
          ))}
        </svg>
        <div className="mt-4 grid grid-cols-6 text-center text-xs font-medium text-muted-foreground">
          {months.map((month) => (
            <div key={month.label}>
              <div>{month.label}</div>
              <div className="mt-1 text-[11px] text-foreground">{month.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
