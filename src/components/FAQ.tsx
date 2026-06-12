import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How accurate is the GPS speedometer?',
    answer: 'In open areas with clear sky view, GPS speed measurement is accurate within ±0.5 km/h. Accuracy may decrease in tunnels, underground parking, or areas with tall buildings that block satellite signals. For best results, ensure your device has a clear view of the sky.',
  },
  {
    question: 'Does it work without internet?',
    answer: 'Yes, the GPS speedometer works without internet once the page is loaded. GPS relies on satellite signals, not cellular data. However, you need an internet connection to initially load the SpeedoTrack website. After that, it functions offline using your device\'s GPS hardware.',
  },
  {
    question: 'Why does it show 0 km/h?',
    answer: 'A reading of 0 km/h typically means your device hasn\'t acquired a GPS fix yet, or you\'re indoors where satellite signals can\'t reach. Try moving near a window or going outside. Also ensure location permissions are granted in your browser settings.',
  },
  {
    question: 'What units are supported?',
    answer: 'SpeedoTrack supports four speed units: kilometers per hour (km/h), miles per hour (mph), meters per second (m/s), and knots. You can switch between units instantly using the unit selector. The built-in converter also supports km/min for additional flexibility.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes, SpeedoTrack is completely free to use with no ads, no subscriptions, and no hidden costs. There\'s nothing to download or install — it runs directly in your web browser. We believe essential tools like speed tracking should be accessible to everyone.',
  },
  {
    question: 'Does it drain battery?',
    answer: 'GPS tracking does use more battery than normal browsing because it keeps the GPS radio active. On most devices, you can expect 3-5 hours of continuous tracking on a full charge. Using HUD mode with Wake Lock prevents your screen from sleeping, which also contributes to battery usage.',
  },
  {
    question: 'How to enable location permission?',
    answer: 'In Chrome, click the lock icon in the address bar, go to Site Settings, and set Location to Allow. In Firefox, click the shield icon, then Permissions, and allow Location access. In Safari, go to Preferences, then Websites, then Location, and set it to Allow for this site.',
  },
  {
    question: 'Works for cycling/boating?',
    answer: 'Yes, SpeedoTrack works for any activity where you\'re moving — driving, cycling, running, boating, skiing, and more. The GPS speedometer measures your actual ground speed regardless of the vehicle or activity. For boating, the knots unit is particularly useful as it\'s the standard maritime speed measurement.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="bg-[#111111] rounded-xl border border-[#1a1a1a] overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-white font-semibold text-sm pr-4">{item.question}</span>
            <ChevronDown
              size={18}
              className={`text-gray-500 shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
