import { useState } from 'react';
import { ConverterUnit, convertBetween } from '../utils/speedUtils';
import { ArrowRightLeft } from 'lucide-react';

const units: ConverterUnit[] = ['km/h', 'mph', 'm/s', 'knots', 'km/min'];

export default function UnitConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<ConverterUnit>('km/h');
  const [to, setTo] = useState<ConverterUnit>('mph');

  const numValue = parseFloat(value);
  const result = !isNaN(numValue) ? convertBetween(numValue, from, to) : null;

  return (
    <div className="bg-[#111111] rounded-2xl p-5 sm:p-6 border border-[#1a1a1a]">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <ArrowRightLeft size={20} className="text-[#00FF88]" />
        Speed Converter
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter speed"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-white text-lg font-bold focus:outline-none focus:border-[#00FF88] transition-colors"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as ConverterUnit)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:border-[#00FF88] transition-colors"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value as ConverterUnit)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:border-[#00FF88] transition-colors"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
      {result !== null && (
        <div className="mt-4 bg-[#0a0a0a] rounded-xl p-4 text-center">
          <span className="text-gray-400 text-sm">{numValue} {from} = </span>
          <span className="text-[#00FF88] text-2xl font-black ml-1">
            {result < 0.01 ? result.toExponential(2) : result < 10 ? result.toFixed(4) : result < 100 ? result.toFixed(2) : result.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm ml-1">{to}</span>
        </div>
      )}
    </div>
  );
}
