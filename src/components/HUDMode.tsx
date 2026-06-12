import { useState, useEffect, useCallback } from 'react';
import { SpeedUnit, convertFromMs } from '../utils/speedUtils';
import { X, RotateCcw } from 'lucide-react';

interface HUDModeProps {
  speedMs: number;
  unit: SpeedUnit;
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function HUDMode({ speedMs, unit, isTracking, onStart, onStop }: HUDModeProps) {
  const [isMirrored, setIsMirrored] = useState(true);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      }
    } catch {
      // Wake lock not available
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  const handleStart = () => {
    onStart();
    requestWakeLock();
  };

  const handleStop = () => {
    onStop();
    releaseWakeLock();
  };

  const displaySpeed = convertFromMs(speedMs, unit);
  const speedKmh = speedMs * 3.6;
  const color = speedKmh < 60 ? '#00FF88' : speedKmh < 100 ? '#FF6B00' : '#FF0000';

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Toggle mirror"
        >
          <RotateCcw size={20} className="text-white" />
        </button>
        <button
          onClick={() => {
            if (isTracking) handleStop();
          }}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Exit HUD"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      <div
        className="flex flex-col items-center"
        style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
      >
        <span
          className="text-[10rem] sm:text-[14rem] font-black tabular-nums tracking-tighter leading-none"
          style={{
            color,
            textShadow: `0 0 60px ${color}66, 0 0 120px ${color}33`,
          }}
        >
          {displaySpeed < 10 ? displaySpeed.toFixed(1) : Math.round(displaySpeed)}
        </span>
        <span
          className="text-3xl sm:text-4xl font-bold tracking-[0.3em] uppercase mt-2"
          style={{ color: `${color}88` }}
        >
          {unit}
        </span>
      </div>

      <div className="absolute bottom-8">
        {!isTracking ? (
          <button
            onClick={handleStart}
            className="bg-[#00FF88] text-black font-bold px-10 py-4 rounded-2xl text-xl hover:bg-[#00dd77] transition-colors"
          >
            START
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="bg-red-600 text-white font-bold px-10 py-4 rounded-2xl text-xl hover:bg-red-700 transition-colors"
          >
            STOP
          </button>
        )}
      </div>
    </div>
  );
}
