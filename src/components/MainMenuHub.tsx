import React from 'react';
import { 
  Users, 
  Tv, 
  Stethoscope, 
  ShieldCheck, 
  ClipboardList, 
  Volume2, 
  Sparkles, 
  Syringe, 
  Smile, 
  UserPlus, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Download
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { RoomId } from '../types';
import { generatePdfManual } from '../utils/generatePdfManual';

export const MainMenuHub: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setActiveTab, 
    patients, 
    roomList, 
    activeRoomId, 
    setActiveRoomId,
    currentCall,
    attendanceRecords
  } = useClinic();

  const waitingPatients = patients.filter(p => p.status === 'aguardando');
  const inProgressPatients = patients.filter(p => p.status === 'em_atendimento');
  const todayRecords = attendanceRecords.filter(r => r.dayString === new Date().toISOString().split('T')[0]);

  const activeRoom = roomList.find(r => r.id === activeRoomId) || roomList[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Unit Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img 
              src="/brasao_essgt.png" 
              alt="Brasão Oficial da Escola Superior de Sargentos - ESSgt" 
              referrerPolicy="no-referrer"
              className="w-16 h-22 sm:w-20 sm:h-28 object-contain drop-shadow-2xl shrink-0" 
            />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Polícia Militar do Estado de São Paulo • ESSgt
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Unidade Integrada de Saúde (UIS)
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                Menu Principal de Acesso Operacional • Selecione o módulo do sistema para iniciar suas atividades ou gerenciar a unidade.
              </p>
            </div>
          </div>

          {/* User profile & Quick logout */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-700/80 flex items-center justify-between lg:justify-end gap-4 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                    {currentUser?.role === 'admin' && 'Administrador'}
                    {currentUser?.role === 'medico' && 'Médico(a)'}
                    {currentUser?.role === 'dentista' && 'Cirurgião-Dentista'}
                    {currentUser?.role === 'enfermeiro' && 'Enfermagem'}
                    {currentUser?.role === 'recepcao' && 'Recepção / Triagem'}
                    {currentUser?.role === 'painel_tv' && 'Totem Painel TV'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white truncate max-w-[160px]">
                  {currentUser?.name || 'Operador'}
                </h3>
                {currentUser?.councilNumber && (
                  <p className="text-[11px] text-slate-400 font-mono">
                    {currentUser.councilType}: {currentUser.councilNumber}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sair do sistema"
              className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-rose-600/30 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live operational counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium block">Pacientes Aguardando</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{waitingPatients.length}</span>
              <span className="text-[11px] text-slate-400">na fila</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium block">Em Atendimento</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-sky-400">{inProgressPatients.length}</span>
              <span className="text-[11px] text-slate-400">em consulta</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium block">Consultórios Ativos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{roomList.length}</span>
              <span className="text-[11px] text-slate-400">salas prontas</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium block">Atendidos Hoje</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400">{todayRecords.length}</span>
              <span className="text-[11px] text-slate-400">finalizados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Access Modules Grid (Requested by User) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Módulos de Acesso ao Sistema
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clique em qualquer módulo para acessar a área operacional desejada.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Recepção */}
          <div 
            id="menu-card-recepcao"
            onClick={() => setActiveTab('recepcao')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {waitingPatients.length} aguardando
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                Recepção & Triagem
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Emissão de senhas prioritárias e normais, triagem de policiais militares e civis, controle de fila e comprovante impresso.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Cadastro militar com Posto/Graduação, RE e OPM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Emissão de senhas e comprovante de atendimento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Transferência de pacientes entre consultórios</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Módulo Operacional</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                Acessar Recepção <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Painel TV */}
          <div 
            id="menu-card-tv"
            onClick={() => setActiveTab('tv')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                  <Tv className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Chamada ao Vivo
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                Painel TV (Sala de Espera)
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Painel multimídia de chamada sonora e visual com sintetizador de voz (TTS) para monitores e televisores da sala de espera.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Alerta sonoro harmônico personalizado por sala</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Voz automática em português anunciando paciente</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Histórico das últimas senhas chamadas e tela cheia</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Mídia de Espera</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-indigo-600 group-hover:translate-x-1 transition-transform">
                Abrir Painel TV <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: Consultórios */}
          <div 
            id="menu-card-consultorios"
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {roomList.length} salas ativas
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                Consultórios de Atendimento
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Posto de trabalho médico, odontológico e de enfermagem para chamada de fila, evolução clínica e encaminhamento para medicação.
              </p>

              {/* Room Selector inside Consultório Card */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Selecione o Consultório Desejado:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={activeRoomId}
                    onChange={(e) => setActiveRoomId(e.target.value as RoomId)}
                    className="flex-1 bg-white text-xs font-bold text-slate-800 rounded-xl px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {roomList.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} • {r.subname} ({r.prefix})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Posto de Saúde</span>
              <button
                onClick={() => setActiveTab('consultorios')}
                className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-600 group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Acessar Consultórios <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: Tela do Administrador */}
          <div 
            id="menu-card-admin"
            onClick={() => setActiveTab('admin')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-purple-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  Central Administrativa
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                Tela do Administrador
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Gestão centralizada da unidade de saúde com controle total de salas, profissionais e base geral de pacientes.
              </p>

              {/* 3 Explicit Sub-modules Highlighted as per Prompt */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Criar e Editar Consultórios (Salas, médicos e siglas)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Users className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Criar e Gerenciar Usuários (Médicos, dentistas e equipe)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-xs font-bold text-purple-900">
                  <UserPlus className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Cadastro de Pacientes (Militar RE/OPM e Civil)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Controle Total</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-purple-600 group-hover:translate-x-1 transition-transform">
                Acessar Administração <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Documentation & Operational Manual Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card A: Documentação Técnica do Sistema (v2.5) */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-blue-900/40 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Especificação Arquitetural • v2.5 Oficial
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Documentação Técnica do Sistema
            </h3>

            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Especificação completa de engenharia de software da UIS: arquitetura em React 18 / TypeScript, matriz de permissões (RBAC), modelos de dados, fluxo de triagem e Web Audio API.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ 8 Módulos Detalhados
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ Modelos de Dados
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ Arquivo .md Integrado
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 mt-4 border-t border-slate-800">
            <button
              id="btn-hub-view-docs"
              onClick={() => setActiveTab('documentacao')}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/40"
              title="Abrir Documentação Completa do Sistema"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Documentação</span>
            </button>

            <a
              href="/DOCUMENTACAO_SISTEMA.md"
              download="DOCUMENTACAO_SISTEMA_UIS_ESSgt.md"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              title="Baixar DOCUMENTACAO_SISTEMA.md"
            >
              <Download className="w-4 h-4" />
              <span>Baixar .md</span>
            </a>
          </div>
        </div>

        {/* Card B: Manual de Operação do Usuário (PDF / A4) */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-red-900/40 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Documentação Oficial • Formato A4 (210 × 297 mm)
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Manual de Operação do Usuário (PDF / A4)
            </h3>

            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Guia operacional de procedimentos padrão (POP) diagramado em 6 páginas A4 oficiais da PMESP: triagem militar, chamada na TV, consultórios médicos e administração.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ Capa Oficial PMESP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ 6 Páginas A4
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                ✓ Pronto para Impressão
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 mt-4 border-t border-slate-800">
            <button
              id="btn-hub-view-manual"
              onClick={() => setActiveTab('manual')}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10"
              title="Abrir Manual Interativo na Tela"
            >
              <BookOpen className="w-4 h-4 text-red-600" />
              <span>Visualizar Manual A4</span>
            </button>

            <button
              id="btn-hub-download-manual-pdf"
              onClick={generatePdfManual}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/40"
              title="Baixar Arquivo PDF em Tamanho A4"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Quick Links (Relatórios, Documentação e Configurações) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div 
          onClick={() => setActiveTab('gestao')}
          className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Relatórios & Gestão</h4>
              <p className="text-xs text-slate-500">Métricas de tempo de espera (TME) e gráficos</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <div 
          onClick={() => setActiveTab('documentacao')}
          className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Documentação do Sistema</h4>
              <p className="text-xs text-slate-500">Especificação técnica, RBAC e tipos de dados</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <div 
          onClick={() => setActiveTab('configuracoes')}
          className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Configurações do Sistema</h4>
              <p className="text-xs text-slate-500">Ajuste do sintetizador de voz e banco de dados</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
