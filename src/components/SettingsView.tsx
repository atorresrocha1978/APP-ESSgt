import React from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Mic, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Stethoscope, 
  Syringe, 
  Smile,
  Sliders,
  Check
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOM_LIST } from '../constants/rooms';

export const SettingsView: React.FC = () => {
  const { 
    audioSettings, 
    updateAudioSettings, 
    testRoomSound, 
    resetToDefaultData, 
    clearQueue,
    clearReports
  } = useClinic();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
          <Settings className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Configurações & Notificações Sonoras
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Personalize os avisos acústicos, sintetizador de voz e gerencie a base de dados da clínica.
          </p>
        </div>
      </div>

      {/* Audio & Room Chime Settings */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-blue-600 stroke-[2.5]" />
            <h2 className="font-black text-base text-slate-800">
              Sinais Sonoros Personalizados por Consultório
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={audioSettings.enabled} 
              onChange={(e) => updateAudioSettings({ enabled: e.target.checked })} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Volume Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
            <label className="block text-xs font-black text-slate-700 mb-2 flex justify-between">
              <span>Volume dos Sinais Sonoros (Chimes)</span>
              <span className="font-mono text-blue-700">{Math.round(audioSettings.volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={audioSettings.volume}
              onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
              className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
            <label className="block text-xs font-black text-slate-700 mb-2 flex justify-between">
              <span>Volume da Voz Sintetizada</span>
              <span className="font-mono text-blue-700">{Math.round(audioSettings.voiceVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={audioSettings.voiceVolume}
              onChange={(e) => updateAudioSettings({ voiceVolume: parseFloat(e.target.value) })}
              className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Room Sound Tests */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Testar Acústica Personalizada de Cada Sala:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROOM_LIST.map((room) => (
              <div 
                key={room.id}
                className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 hover:bg-white hover:border-blue-300 transition-all flex items-center justify-between shadow-2xs"
              >
                <div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg ${room.badgeBg} ${room.badgeText}`}>
                    {room.prefix}
                  </span>
                  <h4 className="font-black text-xs text-slate-800 mt-1.5">{room.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{room.subname}</p>
                </div>

                <button
                  id={`btn-settings-test-${room.id}`}
                  onClick={() => testRoomSound(room.id)}
                  className="px-3 py-2 rounded-xl bg-white border border-sky-200 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Ouvir</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Announcement Toggle */}
        <div className="pt-4 border-t border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
              <Mic className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-800">
                Chamada por Voz Sintetizada em Português
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Lê a senha, nome do paciente e o consultório de destino através da Web Speech API.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={audioSettings.voiceEnabled} 
              onChange={(e) => updateAudioSettings({ voiceEnabled: e.target.checked })} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

      </div>

      {/* Data Management Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h2 className="font-black text-base text-slate-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 stroke-[2.5]" />
          Gerenciamento da Base de Dados Local
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Você pode restaurar a base com dados realistas de demonstração (incluindo 120 atendimentos mensais no histórico para relatórios), zerar a fila atual de espera ou zerar todo o histórico de relatórios da UIS.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            id="btn-clear-reports-settings"
            onClick={() => {
              if (window.confirm('Atenção: Deseja realmente zerar todo o histórico de relatórios e atendimentos anteriores? As estatísticas serão redefinidas para zero.')) {
                clearReports();
                alert('Relatórios zerados com sucesso!');
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Zerar Relatórios & Histórico</span>
          </button>

          <button
            id="btn-clear-queue-only"
            onClick={() => {
              if (window.confirm('Deseja limpar todos os pacientes em espera na fila agora?')) {
                clearQueue();
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white border border-amber-200 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Zerar Fila de Espera Atual</span>
          </button>

          <button
            id="btn-reset-demo-data"
            onClick={() => {
              if (window.confirm('Deseja recarregar os dados de demonstração com histórico completo de 30 dias?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-sky-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-sky-200 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Recarregar Dados de Demonstração (30 dias)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
