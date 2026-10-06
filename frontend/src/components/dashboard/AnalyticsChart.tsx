'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

interface DataPoint {
    label: string;
    value: number;
}

interface AnalyticsChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
}

/**
 * AnalyticsChart — A lightweight, responsive line chart using SVG and Framer Motion.
 * Animates the path on mount and shows an exact-value tooltip on hover.
 */
export function AnalyticsChart({
    data,
    height = 200,
    color = 'rgb(var(--brand-primary))',
}: AnalyticsChartProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const padding = 20;
    const chartHeight = height - padding * 2;
    const chartWidth = 400; // Reference width, scaled by viewBox

    const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

    const points = useMemo(() => {
        return data.map((d, i) => {
            const x = (i / (data.length - 1)) * chartWidth;
            const y = chartHeight - (d.value / maxValue) * chartHeight;
            return { x, y };
        });
    }, [data, maxValue, chartHeight, chartWidth]);

    const pathData = useMemo(() => {
        if (points.length === 0) return '';
        return `M ${points[0].x} ${points[0].y} ` +
            points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
    }, [points]);

    const areaData = useMemo(() => {
        if (points.length === 0) return '';
        return `${pathData} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
    }, [pathData, points, chartHeight]);

    return (
        <div className="w-full relative group">
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full overflow-visible"
                style={{ height }}
                preserveAspectRatio="none"
            >
                {/* Area Gradient */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <line
                        key={p}
                        x1="0"
                        y1={chartHeight * p}
                        x2={chartWidth}
                        y2={chartHeight * p}
                        stroke="rgb(var(--border-default))"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Area fill */}
                <motion.path
                    d={areaData}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                />

                {/* Main line */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Hover guideline for the active point */}
                {hovered !== null && (
                    <line
                        x1={points[hovered].x}
                        y1="0"
                        x2={points[hovered].x}
                        y2={chartHeight}
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity="0.4"
                    />
                )}

                {/* Interactive points */}
                {points.map((p, i) => (
                    <g key={i}>
                        {/* Larger invisible hit-area for easier hovering */}
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="14"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                        />
                        <motion.circle
                            cx={p.x}
                            cy={p.y}
                            r={hovered === i ? 6 : 4}
                            fill="rgb(var(--bg-surface))"
                            stroke={color}
                            strokeWidth={hovered === i ? 3 : 2}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="pointer-events-none"
                        />
                    </g>
                ))}
            </svg>

            {/* Value tooltip */}
            <AnimatePresence>
                {hovered !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="absolute z-10 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md text-xs font-semibold shadow-lg pointer-events-none bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border-default))] text-[rgb(var(--text-primary))]"
                        style={{
                            left: `${(points[hovered].x / chartWidth) * 100}%`,
                            top: `${(points[hovered].y / chartHeight) * 100}%`,
                            marginTop: -12,
                        }}
                    >
                        {data[hovered].label}: <span style={{ color }}>{data[hovered].value}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 px-1">
                {data.map((d, i) => (
                    <span
                        key={i}
                        className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${hovered === i ? 'text-[rgb(var(--text-primary))]' : 'text-[rgb(var(--text-muted))]'
                            }`}
                    >
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
