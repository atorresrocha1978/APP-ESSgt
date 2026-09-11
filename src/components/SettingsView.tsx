import React, { useState } from 'react';
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
  Check,
  BookOpen,
  Download,
  FileText,
  AlertTriangle,
  X,
  Server,
  Wifi,
  WifiOff,
  Copy,
  ExternalLink,
  Network,
  RefreshCw
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOM_LIST } from '../constants/rooms';
import { generatePdfManual } from '../utils/generatePdfManual';

export const SettingsView: React.FC = () => {
  const { 
    audioSettings, 
    updateAudioSettings, 
    testRoomSound, 
    resetToDefaultData, 
    clearQueue,
    clearReports,
    setActiveTab,
    serverIp,
    serverUrl,
    networkStatus,
    connectedClientsCount,
    syncWithServer
  } = useClinic();

  const [confirmAction, setConfirmAction] = useState<'clearReports' | 'clearQueue' | 'resetDemo' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast(`Link copiado: ${url}`);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithServer();
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Sincronização com o servidor local concluída com sucesso!');
    }, 600);
  };

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

      {/* Official Manual & Documentation Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm space-y-6">
        
        {/* Technical Documentation Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-slate-800">
                Documentação Técnica do Sistema (v2.5)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Especificação de arquitetura, models TypeScript, RBAC, fluxos e áudio da UIS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('documentacao')}
              id="btn-settings-view-docs"
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Ver Documentação</span>
            </button>

            <a
              href="/DOCUMENTACAO_SISTEMA.md"
              download="DOCUMENTACAO_SISTEMA_UIS_ESSgt.md"
              id="btn-settings-download-docs-md"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Baixar .md</span>
            </a>
          </div>
        </div>

        {/* Operational Manual Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-slate-800">
                Manual de Operação do Usuário (PDF / A4)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Documentação operacional oficial com diretrizes de triagem militar e procedimentos padrão (POP).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manual')}
              id="btn-settings-view-manual"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-red-600" />
              <span>Visualizar na Tela</span>
            </button>

            <button
              onClick={generatePdfManual}
              id="btn-settings-download-manual-pdf"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-red-100"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF (A4)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">Formato A4 Padrão:</strong>
            <span>Diagramação de 6 páginas com capa institucional, sumário e cabeçalhos oficiais.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">Procedimentos Detalhados:</strong>
            <span>Instruções completas para Médicos, Dentistas, Enfermagem e Recepção.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">Documentação Completa:</strong>
            <span>Arquivo markdown completo com diagrama de módulos e contratos de API.</span>
          </div>
        </div>
      </div>

      {/* Local Server & Network Access Card (10.43.225.80) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
              <Server className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-slate-800">
                  Servidor Local & Acesso via Navegador (Intranet)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  10.43.225.80
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Configurado para operação local no IP 10.43.225.80 com sincronização em tempo real (SSE) entre todos os computadores e o painel TV.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              id="btn-settings-manual-sync"
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
            </button>

            <button
              onClick={() => handleCopyUrl(`http://${serverIp}:3000`)}
              id="btn-settings-copy-server-url"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-200"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar URL</span>
            </button>
          </div>
        </div>

        {/* Network Metrics & Endpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              IP do Servidor Local
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-base text-slate-800 tracking-tight">
                {serverIp}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black">
                Porta 3000
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Host de rede configurado para escuta em <code className="font-mono">0.0.0.0:3000</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sincronização em Tempo Real (LAN)
            </span>
            <div className="flex items-center gap-2">
              {networkStatus === 'online' ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-emerald-700">Canal SSE Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs text-amber-700">Reconectando...</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              Chamadas no consultório disparam áudio no Painel TV instantaneamente via rede.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Link Principal de Acesso
            </span>
            <div className="flex items-center justify-between">
              <a 
                href={`http://${serverIp}:3000`} 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 truncate"
              >
                <span>http://{serverIp}:3000</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            <p className="text-[10px] text-slate-500">
              Acesso direto via Google Chrome, Microsoft Edge ou Firefox.
            </p>
          </div>
        </div>

        {/* Workstations Quick Links */}
        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600 stroke-[2.5]" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Atalhos de Postos de Trabalho no Servidor Local
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs space-y-1">
              <span className="font-bold text-slate-800 block">🖥️ Painel TV / Sala de Espera</span>
              <span className="text-[11px] text-slate-500 block">Usuário: <code className="font-mono text-slate-700">painel.tv</code></span>
              <span className="text-[11px] text-slate-500 block">Senha: <code className="font-mono text-slate-700">tv</code></span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs space-y-1">
              <span className="font-bold text-slate-800 block">📋 Recepção / Triagem</span>
              <span className="text-[11px] text-slate-500 block">Usuário: <code className="font-mono text-slate-700">recepcao</code></span>
              <span className="text-[11px] text-slate-500 block">Senha: <code className="font-mono text-slate-700">123</code></span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs space-y-1">
              <span className="font-bold text-slate-800 block">🩺 Consultórios Médicos</span>
              <span className="text-[11px] text-slate-500 block">Usuário: <code className="font-mono text-slate-700">medico1</code></span>
              <span className="text-[11px] text-slate-500 block">Senha: <code className="font-mono text-slate-700">123</code></span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs space-y-1">
              <span className="font-bold text-slate-800 block">🛡️ Administração Geral</span>
              <span className="text-[11px] text-slate-500 block">Usuário: <code className="font-mono text-slate-700">admin</code></span>
              <span className="text-[11px] text-slate-500 block">Senha: <code className="font-mono text-slate-700">E$$gt@1936</code></span>
            </div>
          </div>
        </div>

        {/* Firewall Instructions Tip */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Regra de Firewall no Servidor Local (10.43.225.80):</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Certifique-se de que a porta <strong>3000 TCP</strong> esteja autorizada no Firewall do Windows Server ou Linux. Para liberar rapidamente no prompt de comando do Windows (como Administrador):
          </p>
          <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto select-all">
            netsh advfirewall firewall add rule name="UIS ESSgt Porta 3000" dir=in action=allow protocol=TCP localport=3000
          </div>
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
            onClick={() => setConfirmAction('clearReports')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Zerar Relatórios & Histórico</span>
          </button>

          <button
            id="btn-clear-queue-only"
            onClick={() => setConfirmAction('clearQueue')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white border border-amber-200 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Zerar Fila de Espera Atual</span>
          </button>

          <button
            id="btn-reset-demo-data"
            onClick={() => setConfirmAction('resetDemo')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-sky-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-sky-200 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Recarregar Dados de Demonstração (30 dias)</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              {confirmAction === 'resetDemo' ? (
                <RotateCcw className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Trash2 className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {confirmAction === 'clearReports' && 'Zerar Histórico & Relatórios'}
              {confirmAction === 'clearQueue' && 'Zerar Fila de Espera'}
              {confirmAction === 'resetDemo' && 'Recarregar Dados de Demonstração'}
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {confirmAction === 'clearReports' && 'Atenção: Deseja realmente zerar todo o histórico de relatórios e atendimentos finalizados? As estatísticas serão redefinidas para zero.'}
              {confirmAction === 'clearQueue' && 'Deseja limpar todos os pacientes que estão aguardando atendimento na fila agora?'}
              {confirmAction === 'resetDemo' && 'Deseja recarregar o banco de dados com a carga de demonstração de 30 dias (120 atendimentos e fila de exemplo)?'}
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmAction === 'clearReports') {
                    clearReports();
                    showToast('Histórico e relatórios zerados com sucesso!');
                  } else if (confirmAction === 'clearQueue') {
                    clearQueue();
                    showToast('Fila de espera zerada com sucesso!');
                  } else if (confirmAction === 'resetDemo') {
                    resetToDefaultData();
                    showToast('Dados de demonstração recarregados com sucesso!');
                  }
                  setConfirmAction(null);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer text-white shadow-md transition-all flex items-center gap-1.5 ${
                  confirmAction === 'resetDemo'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
