import FAQ from '../components/FAQ';
import { Gauge, Satellite, Wifi, Smartphone, Battery, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-white text-2xl font-bold mb-6">About SpeedoTrack</h1>

      {/* How GPS Speedometer Works */}
      <section className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">How GPS Speedometer Works</h2>
        <div className="bg-[#111111] rounded-xl p-5 border border-[#1a1a1a] space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            SpeedoTrack uses your device's built-in GPS receiver to measure your real-time speed. The Global Positioning System (GPS) consists of a network of satellites orbiting Earth that continuously broadcast their position and time.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your device receives signals from multiple GPS satellites and calculates its position using trilateration — determining distance from at least 4 satellites to pinpoint your exact location on Earth. By measuring how your position changes over time, the system calculates your speed with high accuracy.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The speed is calculated either directly from the GPS chipset (which provides a speed reading in meters per second) or by computing the distance between consecutive position fixes divided by the time interval. SpeedoTrack applies a smoothing algorithm to the last 3 readings to reduce GPS jitter and provide a stable, accurate display.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Satellite size={20} />, title: 'GPS Based', desc: 'Uses satellite signals for accurate speed measurement' },
            { icon: <Wifi size={20} />, title: 'Works Offline', desc: 'No internet needed once the page is loaded' },
            { icon: <Smartphone size={20} />, title: 'No Download', desc: 'Runs directly in your browser, nothing to install' },
            { icon: <Battery size={20} />, title: 'Wake Lock', desc: 'Prevents screen from sleeping during tracking' },
            { icon: <Globe size={20} />, title: '4 Speed Units', desc: 'Switch between km/h, mph, m/s, and knots' },
            { icon: <Gauge size={20} />, title: 'HUD Mode', desc: 'Mirror display for windshield projection' },
          ].map((item) => (
            <div key={item.title} className="bg-[#111111] rounded-xl p-4 border border-[#1a1a1a]">
              <div className="text-[#00FF88] mb-2">{item.icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </section>
    </div>
  );
}
