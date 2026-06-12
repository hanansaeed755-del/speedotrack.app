import { useState } from 'react';
import { SpeedUnit } from '../utils/speedUtils';
import { useGPS } from '../hooks/useGPS';
import HUDMode from '../components/HUDMode';
import { Monitor } from 'lucide-react';

interface HUDProps {
  gps: ReturnType<typeof useGPS>;
}

export default function HUD({ gps }: HUDProps) {
  const [unit] = useState<SpeedUnit>('km/h');
  const [showHUD, setShowHUD] = useState(false);

  if (showHUD) {
    return (
      <HUDMode
        speedMs={gps.currentSpeed}
        unit={unit}
        isTracking={gps.isTracking}
        onStart={gps.startTracking}
        onStop={() => {
          gps.stopTracking();
          setShowHUD(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-center">
      <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4">
        <Monitor size={36} className="text-[#00FF88]" />
      </div>
      <h1 className="text-white text-2xl font-bold mb-2">HUD Mode</h1>
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        Full-screen heads-up display for windshield projection. The speed display is mirror-flipped so it reads correctly when reflected on your windshield.
      </p>
      <button
        onClick={() => setShowHUD(true)}
        className="bg-[#00FF88] text-black font-bold px-8 py-3.5 rounded-2xl text-lg hover:bg-[#00dd77] transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Enter HUD Mode
      </button>
    </div>
  );
}
