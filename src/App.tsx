import { useState } from 'react';
import Navbar, { Tab } from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import HUD from './pages/HUD';
import About from './pages/About';
import { useGPS } from './hooks/useGPS';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('speedometer');
  const gps = useGPS();

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',system-ui,sans-serif]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === 'speedometer' && <Home gps={gps} onOpenHUD={() => setActiveTab('hud')} />}
        {activeTab === 'history' && <History gps={gps} />}
        {activeTab === 'hud' && <HUD gps={gps} />}
        {activeTab === 'about' && <About />}
      </main>
    </div>
  );
}

export default App;
