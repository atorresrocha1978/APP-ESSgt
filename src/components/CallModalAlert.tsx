import React from 'react';
import { Volume2, X, ArrowRight, Tv, Radio } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS } from '../constants/rooms';

export const CallModalAlert: React.FC = () => {
  const { currentCall, isCallingAnimation, dismissCurrentCallAlert, setActiveTab, activeTab } = useClinic();

  if (!currentCall || !isCallingAnimation || activeTab === 'tv') {
    return null;
  }

  const room = ROOMS[currentCall.roomId];

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full p-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border-2 border-blue-400/80 ring-4 ring-blue-500/20 relative overflow-hidden">
        
        {/* Animated Glow Accent */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400"></div>

        <button
          onClick={dismissCurrentCallAlert}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5 border border-blue-500/30">
            <Radio className="w-5 h-5 animate-pulse stroke-[2.5]" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                CHAMADA AO VIVO NO PAINEL
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-xl font-mono font-black text-blue-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                {currentCall.ticketNumber}
              </span>
              <h4 className="text-base font-black text-white truncate">
                {currentCall.patientName}
              </h4>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Dirigir-se ao: <strong className="text-blue-300 font-bold">{currentCall.roomName}</strong> ({room?.subname})
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveTab('tv');
                  dismissCurrentCallAlert();
                }}
                className="flex items-center gap-1.5 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <Tv className="w-4 h-4 stroke-[2.5]" />
                <span>Abrir Painel da TV</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(currentCall.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
