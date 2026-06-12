import { SpeedUnit, convertFromMs } from '../utils/speedUtils';

interface DigitalDisplayProps {
  speedMs: number;
  unit: SpeedUnit;
}

export default function DigitalDisplay({ speedMs, unit }: DigitalDisplayProps) {
  const displaySpeed = convertFromMs(speedMs, unit);
  const speedKmh = speedMs * 3.6;

  const color = speedKmh < 60 ? '#00FF88' : speedKmh < 100 ? '#FF6B00' : '#FF0000';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <span
          className="text-8xl sm:text-9xl font-black tabular-nums tracking-tighter"
          style={{ color, textShadow: `0 0 40px ${color}44, 0 0 80px ${color}22` }}
        >
          {displaySpeed < 10 ? displaySpeed.toFixed(1) : Math.round(displaySpeed)}
        </span>
      </div>
      <span className="text-gray-400 text-xl font-semibold mt-2 tracking-widest uppercase">
        {unit}
      </span>
    </div>
  );
}
