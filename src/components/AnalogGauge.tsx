import { SpeedUnit, convertFromMs } from '../utils/speedUtils';

interface AnalogGaugeProps {
  speedMs: number;
  unit: SpeedUnit;
}

const MAX_SPEED_KMH = 180;
const MIN_ANGLE = -135;
const MAX_ANGLE = 135;
const ANGLE_RANGE = MAX_ANGLE - MIN_ANGLE;

function speedToAngle(speedKmh: number): number {
  const clamped = Math.min(speedKmh, MAX_SPEED_KMH);
  return MIN_ANGLE + (clamped / MAX_SPEED_KMH) * ANGLE_RANGE;
}

function getSpeedColor(speedKmh: number): string {
  if (speedKmh < 60) return '#00FF88';
  if (speedKmh < 100) return '#FF6B00';
  return '#FF0000';
}

const majorMarks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];

export default function AnalogGauge({ speedMs, unit }: AnalogGaugeProps) {
  const speedKmh = speedMs * 3.6;
  const displaySpeed = convertFromMs(speedMs, unit);
  const angle = speedToAngle(speedKmh);
  const needleColor = getSpeedColor(speedKmh);

  const marks = majorMarks.map((mark) => {
    const markAngle = speedToAngle(mark);
    const rad = ((markAngle - 90) * Math.PI) / 180;
    const innerR = 120;
    const outerR = 135;
    const textR = 105;
    return {
      mark,
      x1: 150 + innerR * Math.cos(rad),
      y1: 150 + innerR * Math.sin(rad),
      x2: 150 + outerR * Math.cos(rad),
      y2: 150 + outerR * Math.sin(rad),
      tx: 150 + textR * Math.cos(rad),
      ty: 150 + textR * Math.sin(rad),
      color: mark < 60 ? '#00FF88' : mark < 100 ? '#FF6B00' : '#FF0000',
    };
  });

  const arcSegments = [
    { start: 0, end: 60, color: '#00FF8833' },
    { start: 60, end: 100, color: '#FF6B0033' },
    { start: 100, end: 180, color: '#FF000033' },
  ];

  function arcPath(startKmh: number, endKmh: number, r: number): string {
    const startAngle = ((speedToAngle(startKmh) - 90) * Math.PI) / 180;
    const endAngle = ((speedToAngle(endKmh) - 90) * Math.PI) / 180;
    const x1 = 150 + r * Math.cos(startAngle);
    const y1 = 150 + r * Math.sin(startAngle);
    const x2 = 150 + r * Math.cos(endAngle);
    const y2 = 150 + r * Math.sin(endAngle);
    const largeArc = endKmh - startKmh > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[340px] sm:max-w-[380px]">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
        </defs>

        <circle cx="150" cy="150" r="148" fill="url(#bgGrad)" stroke="#222" strokeWidth="2" />

        {arcSegments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(seg.start, seg.end, 138)}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}

        {marks.map((m) => (
          <g key={m.mark}>
            <line
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              stroke={m.color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x={m.tx}
              y={m.ty}
              textAnchor="middle"
              dominantBaseline="central"
              fill={m.color}
              fontSize="11"
              fontWeight="600"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {m.mark}
            </text>
          </g>
        ))}

        {Array.from({ length: 37 }, (_, i) => {
          const kmh = i * 5;
          if (majorMarks.includes(kmh)) return null;
          const markAngle = speedToAngle(kmh);
          const rad = ((markAngle - 90) * Math.PI) / 180;
          const innerR = 125;
          const outerR = 135;
          return (
            <line
              key={`minor-${i}`}
              x1={150 + innerR * Math.cos(rad)}
              y1={150 + innerR * Math.sin(rad)}
              x2={150 + outerR * Math.cos(rad)}
              y2={150 + outerR * Math.sin(rad)}
              stroke="#333"
              strokeWidth="1"
            />
          );
        })}

        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: '150px 150px',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <line
            x1="150"
            y1="150"
            x2="150"
            y2="30"
            stroke={needleColor}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <polygon
            points="147,40 153,40 150,25"
            fill={needleColor}
            filter="url(#glow)"
          />
        </g>

        <circle cx="150" cy="150" r="8" fill="#222" stroke={needleColor} strokeWidth="2" />

        <text
          x="150"
          y="195"
          textAnchor="middle"
          fill="white"
          fontSize="28"
          fontWeight="900"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {displaySpeed < 10 ? displaySpeed.toFixed(1) : Math.round(displaySpeed)}
        </text>
        <text
          x="150"
          y="215"
          textAnchor="middle"
          fill="#888"
          fontSize="12"
          fontWeight="400"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {unit}
        </text>
      </svg>
    </div>
  );
}
