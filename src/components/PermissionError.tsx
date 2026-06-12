import { MapPinOff, RefreshCw } from 'lucide-react';

interface PermissionErrorProps {
  error: string;
  onRetry: () => void;
}

export default function PermissionError({ error, onRetry }: PermissionErrorProps) {
  return (
    <div className="bg-[#111111] border border-red-900/30 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPinOff size={32} className="text-red-500" />
      </div>
      <h3 className="text-white text-lg font-bold mb-2">Location Access Required</h3>
      <p className="text-gray-400 text-sm mb-6">{error}</p>

      <div className="text-left bg-[#0a0a0a] rounded-xl p-4 mb-6 text-xs text-gray-500 space-y-2">
        <p className="text-gray-300 font-semibold text-sm mb-2">How to enable location:</p>
        <p><span className="text-gray-300 font-medium">Chrome:</span> Click the lock icon in the address bar &gt; Site Settings &gt; Allow Location</p>
        <p><span className="text-gray-300 font-medium">Firefox:</span> Click the shield icon &gt; Permissions &gt; Allow Access to Location</p>
        <p><span className="text-gray-300 font-medium">Safari:</span> Safari &gt; Preferences &gt; Websites &gt; Location &gt; Allow</p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00dd77] transition-colors"
      >
        <RefreshCw size={18} />
        Retry Permission
      </button>
    </div>
  );
}
