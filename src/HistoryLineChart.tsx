import React from 'react';
import { calculateScores } from './constants';

interface HistoryLineChartProps {
  unlockedWeeks: any[];
}

export const HistoryLineChart: React.FC<HistoryLineChartProps> = ({ unlockedWeeks }) => {
  const width = 500;
  const height = 250;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 40;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const yTicks = [0, 25, 50, 75, 100];
  const N = unlockedWeeks.length;

  // Compute points coordinates
  const points = unlockedWeeks.map((item, idx) => {
    const scores = calculateScores(item.A, item.B);
    const score = scores.harmonyScore;

    let x = padLeft + chartW / 2; // Default for single point
    if (N > 1) {
      x = padLeft + idx * (chartW / (N - 1));
    }

    const y = padTop + chartH - (score / 100) * chartH;

    const parts = item.week.split("-W");
    const weekLabel = parts.length === 2 ? `W${parseInt(parts[1])}` : item.week;

    return { x, y, score, label: weekLabel };
  });

  // Area under the curve path d string
  let areaD = "";
  if (points.length > 0) {
    areaD = `M ${points[0].x} ${padTop + chartH} `;
    points.forEach(p => {
      areaD += `L ${p.x} ${p.y} `;
    });
    areaD += `L ${points[points.length - 1].x} ${padTop + chartH} Z`;
  }

  // Main stroke path d string
  let lineD = "";
  if (points.length > 0) {
    lineD = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      lineD += `L ${points[i].x} ${points[i].y} `;
    }
  }

  return (
    <svg id="history-line-chart" className="line-chart-svg" viewBox="0 0 500 250" width="100%">
      <defs>
        <linearGradient id="history-chart-fill-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-pink)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0.05"/>
        </linearGradient>
      </defs>

      {/* Grid and Y labels */}
      <g className="chart-grid">
        {yTicks.map(tick => {
          const y = padTop + chartH - (tick / 100) * chartH;
          return (
            <React.Fragment key={`grid-${tick}`}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="var(--card-border)"
                strokeDasharray="4,4"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
              >
                {tick}
              </text>
            </React.Fragment>
          );
        })}
      </g>

      {/* Area under the curve */}
      {points.length > 0 && (
        <path d={areaD} fill="url(#history-chart-fill-grad)" />
      )}

      {/* Main stroke line */}
      {points.length > 0 && (
        <path
          d={lineD}
          fill="none"
          stroke="var(--accent-pink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Dots, score text and week labels */}
      {points.map((p, idx) => (
        <g key={`point-${idx}`}>
          {/* Circle dot */}
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--card-bg)"
            stroke="var(--accent-pink)"
            strokeWidth="3"
          />
          {/* Score value above dot */}
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="var(--text-primary)"
          >
            {p.score}
          </text>
          {/* Week label underneath */}
          <text
            x={p.x}
            y={padTop + chartH + 20}
            textAnchor="middle"
            fontSize="10"
            fill="var(--text-secondary)"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
