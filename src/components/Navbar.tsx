import { Gauge, History, Monitor, Info } from 'lucide-react';

export type Tab = 'speedometer' | 'history' | 'hud' | 'about';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'speedometer', label: 'Speedometer', icon: <Gauge size={18} /> },
  { id: 'history', label: 'History', icon: <History size={18} /> },
  { id: 'hud', label: 'HUD', icon: <Monitor size={18} /> },
  { id: 'about', label: 'About', icon: <Info size={18} /> },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="bg-[#111111] border-b border-[#222] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 shrink-0">
            <Gauge size={24} className="text-[#00FF88]" />
            <span className="text-white font-bold text-lg tracking-tight hidden sm:inline">SpeedoTrack</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#00FF88]/15 text-[#00FF88]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
