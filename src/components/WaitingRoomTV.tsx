import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Stethoscope, 
  Sparkles, 
  Syringe, 
  Smile, 
  ShieldCheck, 
  Users, 
  Radio, 
  Moon, 
  Sun,
  BellRing,
  HeartPulse,
  Activity,
  VolumeX
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS, ROOM_LIST } from '../constants/rooms';
import { RoomId } from '../types';

export const WaitingRoomTV: React.FC = () => {
  const { 
    rooms,
    currentCall, 
    callHistory, 
    patients, 
    audioSettings, 
    updateAudioSettings,
    recallPatient,
    isCallingAnimation
  } = useClinic();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [time, setTime] = useState({ time: '', date: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getRoomIcon = (roomId: RoomId) => {
    switch (roomId) {
      case 'consultorio_01': return <Stethoscope className="w-8 h-8" />;
      case 'consultorio_02': return <Sparkles className="w-8 h-8" />;
      case 'medicacao': return <Syringe className="w-8 h-8" />;
      case 'odonto_01': return <Smile className="w-8 h-8" />;
      case 'odonto_02': return <ShieldCheck className="w-8 h-8" />;
      default: return <Stethoscope className="w-8 h-8" />;
    }
  };

  const activeCall = currentCall || (callHistory.length > 0 ? callHistory[0] : null);
  const waitingPatients = patients.filter(p => p.status === 'aguardando');

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-4 sm:p-6 flex flex-col gap-6 font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-sky-50 text-slate-800'
    }`}>
      
      {/* Header matching Vibrant Palette */}
      <header className={`flex items-center justify-between p-4 sm:p-5 rounded-3xl shadow-sm border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-sky-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200 text-white shrink-0">
            <Activity className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                ESSgt <span className="text-red-600 font-black">- UIS</span>
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Unidade Integrada de Saúde • Painel de Chamadas • {time.date || 'Hoje'}
            </p>
          </div>
        </div>

        {/* Metrics and Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-emerald-50 px-3 sm:px-4 py-2 rounded-2xl border border-emerald-100 text-center hidden sm:block">
            <p className="text-[10px] uppercase font-black text-emerald-600">Fila Atual</p>
            <p className="text-lg sm:text-xl font-black text-emerald-700">{waitingPatients.length} pac.</p>
          </div>

          <div className="bg-blue-50 px-3 sm:px-4 py-2 rounded-2xl border border-blue-100 text-center hidden md:block">
            <p className="text-[10px] uppercase font-black text-blue-600">Chamadas Hoje</p>
            <p className="text-lg sm:text-xl font-black text-blue-700">{callHistory.length}</p>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800 text-teal-300 font-mono text-lg sm:text-xl font-black tracking-wider shadow-inner">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>{time.time || '12:00:00'}</span>
          </div>

          {/* Contrast & Fullscreen */}
          <button
            id="btn-tv-dark-mode"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-2xl transition-colors border ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
            }`}
            title="Alternar Contraste"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="btn-tv-fullscreen"
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-2xl transition-colors border ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
            }`}
            title="Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Grid matching Vibrant Palette (8 cols + 4 cols) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SECTION 1: Giant Call Banner & Bottom Recent Calls (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Giant Call Card */}
          {activeCall ? (
            <div className={`flex-1 bg-blue-600 rounded-[36px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-blue-300 flex flex-col items-center justify-center relative overflow-hidden text-white transition-all duration-300 ${
              isCallingAnimation ? 'ring-8 ring-blue-400/50 scale-[1.01]' : ''
            }`}>
              {/* Vibrant Gradient Background Layer */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-800 opacity-60"></div>

              <div className="z-10 text-center flex flex-col items-center w-full max-w-2xl">
                
                {/* Status Pill Badge */}
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="bg-white/20 px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md border border-white/30 inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Chamando Agora
                  </span>

                  {activeCall.priority === 'urgente' && (
                    <span className="bg-rose-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg animate-bounce">
                      Urgência
                    </span>
                  )}
                  {activeCall.priority === 'preferencial' && (
                    <span className="bg-amber-400 text-amber-950 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                      Preferencial
                    </span>
                  )}
                </div>

                {/* Giant Ticket Number */}
                <h2 className="text-[70px] sm:text-[105px] lg:text-[120px] font-black leading-none mb-2 sm:mb-4 tracking-tighter drop-shadow-xl font-mono text-white">
                  {activeCall.ticketNumber}
                </h2>

                {/* Patient Military Rank and Name */}
                <div className="mb-6 sm:mb-8 text-center">
                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    {activeCall.rank && (
                      <span className="bg-white/25 px-3.5 py-1 rounded-xl text-base sm:text-xl font-black uppercase tracking-wider backdrop-blur-md border border-white/40">
                        {activeCall.rank}
                      </span>
                    )}
                    <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-white/95 uppercase drop-shadow-md">
                      {activeCall.patientName}
                    </span>
                  </div>
                  {(activeCall.re || activeCall.opm) && (
                    <div className="text-sm sm:text-base font-bold text-blue-200 mt-1.5 flex items-center justify-center gap-3">
                      {activeCall.re && <span>RE: {activeCall.re}</span>}
                      {activeCall.opm && <span>• OPM: {activeCall.opm}</span>}
                    </div>
                  )}
                </div>

                {/* White Container with Destination Details */}
                <div className="bg-white text-blue-700 px-6 py-4 sm:px-10 sm:py-5 rounded-3xl shadow-2xl flex items-center gap-4 sm:gap-6 border border-white/80 max-w-xl w-full justify-between sm:justify-start">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {getRoomIcon(activeCall.roomId)}
                  </div>

                  <div className="text-left flex-1">
                    <p className="text-xs sm:text-sm uppercase font-black text-blue-500">
                      Local de Atendimento
                    </p>
                    <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {activeCall.roomName}
                    </p>
                  </div>

                  <div className="text-right pl-3 border-l border-slate-100 hidden sm:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Especialidade</p>
                    <p className="text-sm font-bold text-blue-600">{activeCall.roomTypeLabel}</p>
                  </div>
                </div>

              </div>

              {/* Bottom Doctor tag */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/80 font-medium z-10 hidden sm:flex">
                <span>Profissional: <strong className="text-white font-bold">{activeCall.doctorName || 'Equipe Médica'}</strong></span>
                <span className="font-mono">Chamado às {new Date(activeCall.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ) : (
            <div className={`flex-1 rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-xl border relative overflow-hidden ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-sky-100'
            }`}>
              <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                <BellRing className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Aguardando Próxima Chamada
              </h3>
              <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">
                Os pacientes militares e civis cadastrados na <span className="text-red-600 font-bold">U.I.S.</span> serão chamados pelos respectivos consultórios com alerta sonoro e voz sintetizada.
              </p>
            </div>
          )}

          {/* Bottom Recent Calls Bar matching Vibrant Palette */}
          <div className={`h-28 sm:h-32 rounded-3xl p-5 border flex items-center gap-4 overflow-hidden shadow-sm transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-sky-100'
          }`}>
            <div className="shrink-0 h-full w-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1 overflow-x-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Últimas Chamadas
              </p>
              <div className="flex gap-6 sm:gap-8 items-center min-w-max">
                {callHistory.length > 0 ? (
                  callHistory.slice(0, 5).map((call, idx) => {
                    const room = (rooms && rooms[call.roomId]) || ROOMS[call.roomId];
                    return (
                      <div key={call.id + idx} className="flex flex-col">
                        <span className={`text-lg sm:text-xl font-black font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {call.ticketNumber}
                        </span>
                        <span className={`text-xs font-bold uppercase truncate max-w-[140px] ${
                          call.roomId === 'consultorio_01' ? 'text-blue-600' :
                          call.roomId === 'consultorio_02' ? 'text-orange-500' :
                          call.roomId === 'medicacao' ? 'text-emerald-500' : 'text-teal-600'
                        }`}>
                          {call.roomName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[140px]">
                          {call.rank ? `${call.rank} ` : ''}{call.patientName.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Nenhuma chamada anterior registrada hoje.
                  </span>
                )}
              </div>
            </div>
          </div>

        </section>

        {/* SECTION 2: Aside Sidebar with Live Queue List (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className={`flex-1 rounded-[36px] sm:rounded-[40px] shadow-xl border flex flex-col overflow-hidden transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-sky-100'
          }`}>
            
            {/* Sidebar Header */}
            <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/80 border-sky-100'
            }`}>
              <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></span>
                FILA DE ESPERA
              </h3>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-600 text-white shadow-xs">
                {waitingPatients.length} pacientes
              </span>
            </div>

            {/* Waiting Queue Cards */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {waitingPatients.length > 0 ? (
                waitingPatients.map((p, idx) => {
                  const room = (rooms && rooms[p.targetRoomId]) || ROOMS[p.targetRoomId];
                  const isFirst = idx === 0;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isFirst 
                          ? 'bg-blue-50/90 border-2 border-blue-300 shadow-sm hover:scale-[1.01]' 
                          : isDarkMode 
                            ? 'bg-slate-850 border-slate-800 hover:bg-slate-800' 
                            : 'bg-white border-slate-100 hover:bg-sky-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl shadow-xs flex items-center justify-center font-black text-sm shrink-0 ${
                          isFirst ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.ticketNumber.split('-')[0]}
                        </div>
                        <div className="truncate">
                          <p className={`text-xs sm:text-sm font-bold truncate ${
                            isDarkMode ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {p.rank ? `${p.rank} ` : ''}{p.name}
                          </p>
                          <p className={`text-[10px] font-black uppercase ${
                            p.targetRoomId === 'consultorio_01' ? 'text-blue-600' :
                            p.targetRoomId === 'consultorio_02' ? 'text-orange-500' :
                            p.targetRoomId === 'medicacao' ? 'text-emerald-600' : 'text-teal-600'
                          }`}>
                            {room?.name} • RE: {p.re || p.document || '---'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {p.ticketNumber}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Não há pacientes aguardando chamada neste momento.
                </div>
              )}
            </div>

          </div>
        </aside>

      </main>

      {/* Footer matching Vibrant Palette */}
      <footer className={`h-12 backdrop-blur rounded-2xl flex items-center justify-between px-6 border transition-all ${
        isDarkMode ? 'bg-slate-900/70 border-slate-800 text-slate-400' : 'bg-white/70 border-white/80 text-slate-600 shadow-xs'
      }`}>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">
            Métricas da U.I.S. ESSgt:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold">Prontidão: 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold">Fila em Tempo Real</span>
          </div>
        </div>

        <div className="text-xs font-black text-slate-400">
          ESSgt - UIS • POLÍCIA MILITAR DO ESTADO DE SÃO PAULO
        </div>
      </footer>

    </div>
  );
};

