import { useState } from 'react';
import { SpeedUnit } from '../utils/speedUtils';
import { useGPS } from '../hooks/useGPS';
import AnalogGauge from '../components/AnalogGauge';
import DigitalDisplay from '../components/DigitalDisplay';
import StatsBar from '../components/StatsBar';
import PermissionError from '../components/PermissionError';
import UnitConverter from '../components/UnitConverter';
import FAQ from '../components/FAQ';
import { Play, Square, Gauge, Monitor, Car, Bike, Sailboat, Footprints, Snowflake, Plane, Check, X, Loader2 } from 'lucide-react';

interface HomeProps {
  gps: ReturnType<typeof useGPS>;
  onOpenHUD: () => void;
}

export default function Home({ gps, onOpenHUD }: HomeProps) {
  const [unit, setUnit] = useState<SpeedUnit>('km/h');
  const [viewMode, setViewMode] = useState<'analog' | 'digital'>('analog');

  const units: SpeedUnit[] = ['km/h', 'mph', 'm/s', 'knots'];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* Speedometer Section */}
      <section className="pt-6 pb-4">
        {gps.error ? (
          <PermissionError error={gps.error} onRetry={gps.retryPermission} />
        ) : (
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setViewMode('analog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'analog'
                    ? 'bg-[#00FF88]/15 text-[#00FF88]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Gauge size={14} />
                Analog
              </button>
              <button
                onClick={() => setViewMode('digital')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'digital'
                    ? 'bg-[#00FF88]/15 text-[#00FF88]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Gauge size={14} />
                Digital
              </button>
              <button
                onClick={onOpenHUD}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-white transition-all"
              >
                <Monitor size={14} />
                HUD
              </button>
            </div>

            {/* GPS Acquiring Indicator */}
            {gps.isTracking && gps.gpsStatus === 'acquiring' && (
              <div className="flex items-center justify-center gap-2 mb-3 text-yellow-400 text-sm font-medium">
                <Loader2 size={16} className="animate-spin" />
                Acquiring GPS signal...
              </div>
            )}

            {/* Gauge / Display */}
            {viewMode === 'analog' ? (
              <AnalogGauge speedMs={gps.currentSpeed} unit={unit} />
            ) : (
              <DigitalDisplay speedMs={gps.currentSpeed} unit={unit} />
            )}

            {/* Unit Selector */}
            <div className="flex items-center justify-center gap-1.5 mt-2 mb-4">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    unit === u
                      ? 'bg-[#00FF88] text-black'
                      : 'bg-[#111111] text-gray-400 hover:text-white border border-[#222]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Start / Stop Button */}
            <div className="flex justify-center mb-4">
              {!gps.isTracking ? (
                <button
                  onClick={gps.startTracking}
                  className="flex items-center gap-2 bg-[#00FF88] text-black font-bold px-8 py-3.5 rounded-2xl text-lg hover:bg-[#00dd77] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play size={22} fill="currentColor" />
                  Start
                </button>
              ) : (
                <button
                  onClick={gps.stopTracking}
                  className="flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-2xl text-lg hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Square size={22} fill="currentColor" />
                  Stop
                </button>
              )}
            </div>

            {/* Stats Bar */}
            <StatsBar
              maxSpeed={gps.maxSpeed}
              avgSpeed={gps.avgSpeed}
              distance={gps.distance}
              duration={gps.duration}
              accuracy={gps.accuracy}
              unit={unit}
            />
          </>
        )}
      </section>

      {/* Unit Converter */}
      <section className="mb-8">
        <UnitConverter />
      </section>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-white text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Allow GPS', desc: 'Enable location in your browser', icon: <Car size={24} className="text-[#00FF88]" /> },
            { step: '2', title: 'Press Start', desc: 'Begin real-time tracking', icon: <Play size={24} className="text-[#00FF88]" /> },
            { step: '3', title: 'Track Speed', desc: 'See live speed instantly', icon: <Gauge size={24} className="text-[#00FF88]" /> },
          ].map((item) => (
            <div key={item.step} className="bg-[#111111] rounded-xl p-4 text-center border border-[#1a1a1a]">
              <div className="w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <p className="text-white font-bold text-sm mb-1">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-10">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Use Cases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { title: 'Car Driving', icon: <Car size={24} /> },
            { title: 'Cycling', icon: <Bike size={24} /> },
            { title: 'Boating & Sailing', icon: <Sailboat size={24} /> },
            { title: 'Running & Fitness', icon: <Footprints size={24} /> },
            { title: 'Skiing & Sports', icon: <Snowflake size={24} /> },
            { title: 'Aviation', icon: <Plane size={24} /> },
          ].map((item) => (
            <div key={item.title} className="bg-[#111111] rounded-xl p-4 text-center border border-[#1a1a1a] hover:border-[#00FF88]/30 transition-colors">
              <div className="text-[#00FF88] mb-2 flex justify-center">{item.icon}</div>
              <p className="text-white font-semibold text-sm">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why SpeedoTrack */}
      <section className="mb-10">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Why SpeedoTrack</h2>
        <div className="bg-[#111111] rounded-xl border border-[#1a1a1a] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left text-gray-500 font-semibold px-4 py-3">Feature</th>
                <th className="text-center text-[#00FF88] font-semibold px-4 py-3">SpeedoTrack</th>
                <th className="text-center text-gray-500 font-semibold px-4 py-3">Other Apps</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Free', true, false],
                ['No Download', true, false],
                ['Multiple Units', true, false],
                ['HUD Mode', true, false],
                ['No Ads', true, false],
                ['Trip History', true, false],
              ].map(([feature]) => (
                <tr key={feature as string} className="border-b border-[#1a1a1a]/50 last:border-0">
                  <td className="text-white font-medium px-4 py-3">{feature as string}</td>
                  <td className="text-center px-4 py-3">
                    <Check size={18} className="text-[#00FF88] mx-auto" />
                  </td>
                  <td className="text-center px-4 py-3">
                    <X size={18} className="text-red-500 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <FAQ />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gauge size={20} className="text-[#00FF88]" />
          <span className="text-white font-bold text-lg">SpeedoTrack</span>
        </div>
        <p className="text-gray-500 text-sm mb-2">Free GPS Speed Tracking</p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4">
          <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-400 cursor-pointer">About</span>
        </div>
        <p className="text-gray-700 text-xs">&copy; 2025 SpeedoTrack. Made for drivers, cyclists &amp; sailors.</p>
      </footer>
    </div>
  );
}
