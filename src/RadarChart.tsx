import React from 'react';
import { BEHAVIORAL_ITEMS } from './constants';

interface RadarChartProps {
  dataA: any;
  dataB: any;
}

export const RadarChart: React.FC<RadarChartProps> = ({ dataA, dataB }) => {
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 140;
  const levels = 5;

  // 10 behavioral dimensions short labels
  const axisLabels = BEHAVIORAL_ITEMS.map(item => (item.name || item.selfName || "").split(" ")[0]);

  // Performance calculation (Self + Partner evaluation) / 2
  const getDimensionValue = (dataSelf: any, dataPartner: any, itemId: string) => {
    const keySelf = `self${itemId.charAt(0).toUpperCase()}${itemId.slice(1)}`;
    const keyPartner = `partner${itemId.charAt(0).toUpperCase()}${itemId.slice(1)}`;
    return ((dataSelf[keySelf] || 3) + (dataPartner[keyPartner] || 3)) / 2;
  };

  const valuesA = BEHAVIORAL_ITEMS.map(item => getDimensionValue(dataA, dataB, item.id));
  const valuesB = BEHAVIORAL_ITEMS.map(item => getDimensionValue(dataB, dataA, item.id));

  const getCoordinates = (index: number, value: number) => {
    // 360 degrees / 10 axes = 36 degrees spacing
    const angle = (index * 36 - 90) * (Math.PI / 180);
    const radius = (value / 5) * maxRadius;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  };

  // Draw Polygon A (Partner A's consensus score)
  const pointsA = valuesA.map((val, i) => {
    const coords = getCoordinates(i, val);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  // Draw Polygon B (Partner B's consensus score)
  const pointsB = valuesB.map((val, i) => {
    const coords = getCoordinates(i, val);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  return (
    <svg id="radar-chart" className="radar-svg" viewBox="0 0 400 400" width="100%" height="100%">
      {/* Background circular grids */}
      {Array.from({ length: levels }).map((_, idx) => {
        const level = idx + 1;
        const radius = (level / levels) * maxRadius;
        return (
          <React.Fragment key={`level-${level}`}>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
            {level > 1 && (
              <text
                x={cx + 5}
                y={cy - radius + 4}
                fill="var(--text-muted)"
                fontSize="10px"
              >
                {level}
              </text>
            )}
          </React.Fragment>
        );
      })}

      {/* Axes lines and text labels */}
      {axisLabels.map((label, i) => {
        const angle = (i * 36 - 90) * (Math.PI / 180);
        const labelDistance = maxRadius + 22;
        const labelX = cx + labelDistance * Math.cos(angle);
        const labelY = cy + labelDistance * Math.sin(angle) + 4;
        return (
          <React.Fragment key={`axis-${i}`}>
            <line
              x1={cx}
              y1={cy}
              x2={cx + maxRadius * Math.cos(angle)}
              y2={cy + maxRadius * Math.sin(angle)}
              stroke="var(--card-border)"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="12px"
              fontWeight="600"
            >
              {label}
            </text>
          </React.Fragment>
        );
      })}

      {/* Polygon A */}
      <polygon
        points={pointsA}
        fill="rgba(212, 136, 136, 0.22)"
        stroke="var(--accent-pink)"
        strokeWidth="2.5"
      />

      {/* Polygon B */}
      <polygon
        points={pointsB}
        fill="rgba(217, 160, 91, 0.22)"
        stroke="var(--accent-gold)"
        strokeWidth="2.5"
      />

      {/* Dots at each coordinate for A */}
      {valuesA.map((val, i) => {
        const coords = getCoordinates(i, val);
        return (
          <circle
            key={`dot-a-${i}`}
            cx={coords.x}
            cy={coords.y}
            r="3.5"
            fill="var(--accent-pink)"
            stroke="#fff"
            strokeWidth="1"
          />
        );
      })}

      {/* Dots at each coordinate for B */}
      {valuesB.map((val, i) => {
        const coords = getCoordinates(i, val);
        return (
          <circle
            key={`dot-b-${i}`}
            cx={coords.x}
            cy={coords.y}
            r="3.5"
            fill="var(--accent-gold)"
            stroke="#fff"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};
