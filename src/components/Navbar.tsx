import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  UserPlus, 
  Stethoscope, 
  BarChart3, 
  Settings, 
  Volume2, 
  VolumeX, 
  Clock, 
  Users, 
  Activity,
  LogOut,
  ShieldCheck, 
  User as UserIcon,
  ChevronDown,
  LayoutGrid,
  BookOpen,
  FileText
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS } from '../constants/rooms';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    patients, 
    rooms,
    activeRoomId, 
    audioSettings, 
    updateAudioSettings,
    currentCall,
    currentUser,
    logout
  } = useClinic();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const waitingCount = patients.filter(p => p.status === 'aguardando').length;
  const activeRoom = (rooms && rooms[activeRoomId]) || ROOMS[activeRoomId] || { prefix: 'CON', name: 'Consultório' };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Clinic Brand (clicking goes to Menu) */}
          <div 
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
            title="Ir para o Menu Principal"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-800">
                  ESSgt <span className="text-red-600 font-black">- UIS</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                  Ao Vivo
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                Unidade Integrada de Saúde • ESSgt
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-100 overflow-x-auto max-w-full">
            <button
              id="nav-tab-menu"
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <LayoutGrid className={`w-3.5 h-3.5 ${activeTab === 'menu' ? 'text-white' : 'text-blue-600'}`} />
              <span>Menu</span>
            </button>

            <button
              id="nav-tab-recepcao"
              onClick={() => setActiveTab('recepcao')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'recepcao'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <UserPlus className={`w-3.5 h-3.5 ${activeTab === 'recepcao' ? 'text-white' : 'text-blue-600'}`} />
              <span>Recepção</span>
              {waitingCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'recepcao' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {waitingCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-tv"
              onClick={() => setActiveTab('tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tv'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Tv className={`w-3.5 h-3.5 ${activeTab === 'tv' ? 'text-white' : 'text-indigo-600'}`} />
              <span>Painel TV</span>
              {currentCall && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            <button
              id="nav-tab-consultorios"
              onClick={() => setActiveTab('consultorios')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'consultorios'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 ${activeTab === 'consultorios' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Consultórios</span>
              <span className={`hidden lg:inline text-[9px] px-1.5 py-0.2 rounded font-mono font-black ${
                activeTab === 'consultorios' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {activeRoom.prefix}
              </span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'admin' || activeTab === 'usuarios'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' || activeTab === 'usuarios' ? 'text-white' : 'text-purple-600'}`} />
              <span>Administrador</span>
            </button>

            <button
              id="nav-tab-gestao"
              onClick={() => setActiveTab('gestao')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gestao'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'gestao' ? 'text-white' : 'text-slate-600'}`} />
              <span>Relatórios</span>
            </button>

            <button
              id="nav-tab-manual"
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'manual'
                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Manual de Operação em PDF (A4 Oficial)"
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'manual' ? 'text-white' : 'text-red-600'}`} />
              <span>Manual A4</span>
            </button>

            <button
              id="nav-tab-docs"
              onClick={() => setActiveTab('documentacao')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'documentacao'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Documentação Técnica e Funcional do Sistema"
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === 'documentacao' ? 'text-white' : 'text-blue-600'}`} />
              <span>Documentação</span>
            </button>

            <button
              id="nav-tab-config"
              onClick={() => setActiveTab('configuracoes')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'configuracoes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Configurações & Sons"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Right Section: User Badge, Audio & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Audio toggle */}
            <button
              id="btn-toggle-audio-navbar"
              onClick={() => updateAudioSettings({ enabled: !audioSettings.enabled })}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-2xl text-xs font-bold transition-colors border cursor-pointer ${
                audioSettings.enabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
              title={audioSettings.enabled ? 'Sons & Voz Ativados' : 'Sons Desativados'}
            >
              {audioSettings.enabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Sons On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Mudo</span>
                </>
              )}
            </button>

            {/* Current Logged In User Pill */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-sky-50/90 pl-1.5 pr-2.5 py-1 rounded-2xl border border-sky-200">
                <div className={`w-7 h-7 rounded-xl ${currentUser.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-black text-xs shadow-xs`}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-slate-800 truncate max-w-[130px]">
                      {currentUser.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 block leading-tight">
                    {currentUser.councilNumber ? `${currentUser.councilType} ${currentUser.councilNumber}` : currentUser.role}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  id="btn-logout"
                  onClick={logout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                  title="Sair do Posto / Trocar Usuário"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

