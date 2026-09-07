import React, { useState, useRef } from 'react';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  UserPlus, 
  Tv, 
  Stethoscope, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  BookOpen,
  Building2,
  Volume2,
  Lock,
  Search
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { generatePdfManual } from '../utils/generatePdfManual';

interface UserManualA4ViewProps {
  onClose?: () => void;
}

export const UserManualA4View: React.FC<UserManualA4ViewProps> = ({ onClose }) => {
  const { setActiveTab } = useClinic();
  const [activePage, setActivePage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      generatePdfManual();
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setTimeout(() => {
        setIsGeneratingPdf(false);
      }, 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToPage = (pageNum: number) => {
    setActivePage(pageNum);
    const targetEl = pagesRef.current[pageNum - 1];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab('menu');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 text-slate-800 pb-16 font-sans">
      
      {/* Top Floating Control Bar (Hidden during printing) */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-white shadow-xl no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleBack}
              id="btn-manual-back"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Retornar ao Sistema"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Sistema</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                  Manual de Operação do Usuário • A4 Oficial
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">
                  Polícia Militar de SP • ESSgt - UIS (6 Páginas)
                </p>
              </div>
            </div>
          </div>

          {/* Center: Page Jumpers */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            {[
              { num: 1, label: 'Capa' },
              { num: 2, label: '1. Acesso & Login' },
              { num: 3, label: '2. Recepção' },
              { num: 4, label: '3. Painel TV' },
              { num: 5, label: '4. Consultórios' },
              { num: 6, label: '5. Admin & FAQ' },
            ].map(p => (
              <button
                key={p.num}
                onClick={() => scrollToPage(p.num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activePage === p.num
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Right: Actions (Download PDF, Print, Zoom) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setZoomScale(prev => Math.max(0.75, prev - 0.1))}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(prev => Math.min(1.25, prev + 0.1))}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              id="btn-print-manual"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer shadow-sm"
              title="Imprimir Manual em Papel A4"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Imprimir A4</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              id="btn-download-manual-pdf"
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-red-900/40 disabled:opacity-60"
              title="Baixar Arquivo PDF em Formato A4"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF (A4)'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Container of A4 Pages */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col items-center gap-8">
        
        {/* Helper announcement banner on screen */}
        <div className="w-full max-w-[210mm] bg-blue-950/80 border border-blue-800/80 rounded-2xl p-4 text-blue-200 text-xs flex items-center justify-between gap-4 no-print shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Manual Pronto para Download e Impressão A4</p>
              <p className="text-blue-300">
                Documento diagramado nas dimensões exatas da folha A4 (210 × 297 mm). Você pode baixar diretamente o arquivo <strong>.PDF</strong> ou imprimir via navegador.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md"
          >
            Baixar PDF Agora
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 1: CAPA OFICIAL (A4) */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[0] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-slate-900 text-white shadow-2xl rounded-sm p-10 flex flex-col justify-between relative overflow-hidden border border-slate-800 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          {/* Header Top Bar */}
          <div className="relative z-10">
            <div className="bg-blue-900 rounded-2xl p-6 border-b-4 border-red-600 text-center shadow-lg">
              <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-1">
                Polícia Militar do Estado de São Paulo
              </span>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">
                Diretoria de Saúde • Escola Superior de Sargentos (ESSgt)
              </h2>
              <p className="text-xs text-blue-200 mt-1 font-semibold">
                Unidade Integrada de Saúde - UIS
              </p>
            </div>

            {/* Emblem Shield Center */}
            <div className="flex flex-col items-center my-8">
              <img 
                src="/brasao_essgt.png" 
                alt="Brasão Oficial da Escola Superior de Sargentos" 
                referrerPolicy="no-referrer"
                className="w-32 h-44 object-contain drop-shadow-2xl" 
              />
              <span className="text-[11px] font-black text-slate-300 mt-2 tracking-widest uppercase">
                ESSgt - UIS • 1936
              </span>
            </div>

            {/* Main Title */}
            <div className="text-center space-y-3">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-widest">
                Procedimento Operacional Padrão (POP)
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Manual de Operação
              </h1>
              <p className="text-lg font-bold text-blue-400">
                Sistema de Gestão de Filas e Atendimento Ambulatorial
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Instruções operacionais para Médicos, Cirurgiões-Dentistas, Enfermagem, Recepção e Administradores da UIS.
              </p>
            </div>
          </div>

          {/* White Card with Summary of Sections */}
          <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-xl border border-slate-200 my-6 relative z-10">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Estrutura do Manual do Usuário</span>
              <span className="text-[10px] text-blue-600 font-bold">Edição 2026 • v2.5 Oficial</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Acesso & Segurança</strong>
                  <p className="text-[11px] text-slate-600">Login seguro, senha estrita do administrador e modais de confirmação.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Recepção & Triagem</strong>
                  <p className="text-[11px] text-slate-600">Cadastro militar (RE/OPM/Posto/Convênio), prioridades e gestão segura da fila.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Painel TV da Espera</strong>
                  <p className="text-[11px] text-slate-600">Modo totem, sintetizador de voz (TTS) com termos militares e som harmônico.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Consultórios</strong>
                  <p className="text-[11px] text-slate-600">Chamada ágil, evolução clínica, medicação e cronômetro de consulta.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">5</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Administração, Tabelas de Apoio, Relatórios & FAQ</strong>
                  <p className="text-[11px] text-slate-600">4 abas de gestão (Salas, Usuários, Pacientes e Postos/OPMs/Convênios), métricas TME/TMA e auditoria.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Footer */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>Unidade Integrada de Saúde - UIS / ESSgt</span>
            <span>Documento Ostensivo • Página 1 de 6</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 2: ACESSO, SEGURANÇA E NAVEGAÇÃO */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[1] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl rounded-sm p-10 flex flex-col justify-between border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          <div>
            {/* Standard Header */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border-b-2 border-red-600 flex items-center justify-between mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  MÓDULO 1 | ACESSO, PERFIS DE USUÁRIO & SEGURANÇA
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-[10px] font-mono font-bold text-white">
                PÁG. 2/6
              </span>
            </div>

            {/* Section 1.1 */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">1.1</span>
                  Autenticação Segura & Credenciais de Administrador
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                O sistema adota autenticação estrita para garantir a segurança dos dados clínicos e a integridade da fila de espera da UIS. Senhas genéricas ou de teste foram completamente descontinuadas no ambiente produtivo.
              </p>

              {/* Red Warning Box: Admin Credentials */}
              <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-600 text-slate-800 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-black text-red-800 uppercase tracking-wider">
                    Credenciais Oficiais do Administrador da UIS:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-red-200 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Usuário:</span>
                    <strong className="text-slate-900 text-sm">admin</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Senha Estrita:</span>
                    <strong className="text-red-700 text-sm tracking-wider">E$$gt@1936</strong>
                  </div>
                </div>
                <p className="text-[11px] text-red-700 pt-1">
                  * Apenas o responsável pela gestão e coordenação da UIS deve possuir estas credenciais. O administrador possui acesso irrestrito para gerenciar usuários, salas e relatórios.
                </p>
              </div>

              {/* Section 1.2 */}
              <div className="border-b border-slate-200 pb-2 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">1.2</span>
                  Tabela de Perfis de Usuário & Permissões
                </h4>
              </div>

              {/* Roles Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-2">Perfil</th>
                      <th className="p-2">Função Principal</th>
                      <th className="p-2">Conselho</th>
                      <th className="p-2">Permissão Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-purple-700">Administrador</td>
                      <td className="p-2 text-slate-600">Gestão global de salas, profissionais e base de dados</td>
                      <td className="p-2 text-slate-500 font-mono">Gestão UIS</td>
                      <td className="p-2 font-bold text-red-600">Total (Irrestrita)</td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-2 font-bold text-blue-700">Médico(a)</td>
                      <td className="p-2 text-slate-600">Chamada de pacientes, consulta clínica e prontuário</td>
                      <td className="p-2 text-slate-500 font-mono">CRM / SP</td>
                      <td className="p-2 text-slate-400">Sem Acesso</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-emerald-700">Cirurgião-Dentista</td>
                      <td className="p-2 text-slate-600">Atendimento odontológico, procedimentos e profilaxia</td>
                      <td className="p-2 text-slate-500 font-mono">CRO / SP</td>
                      <td className="p-2 text-slate-400">Sem Acesso</td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-2 font-bold text-amber-700">Enfermagem</td>
                      <td className="p-2 text-slate-600">Triagem clínica, sinais vitais e aplicação de medicação</td>
                      <td className="p-2 text-slate-500 font-mono">COREN / SP</td>
                      <td className="p-2 text-slate-400">Sem Acesso</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-sky-700">Recepção</td>
                      <td className="p-2 text-slate-600">Identificação militar (RE/OPM), emissão de senhas e fila</td>
                      <td className="p-2 text-slate-500 font-mono">Operacional</td>
                      <td className="p-2 text-slate-400">Sem Acesso</td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-2 font-bold text-indigo-700">Painel TV (Totem)</td>
                      <td className="p-2 text-slate-600">Exibição pública de chamadas com som e sintetizador de voz</td>
                      <td className="p-2 text-slate-500 font-mono">Autônomo</td>
                      <td className="p-2 text-slate-400">Sem Acesso</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 1.3 */}
              <div className="border-b border-slate-200 pb-2 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">1.3</span>
                  Barra Superior de Navegação (Navbar)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-700 font-bold block mb-0.5">Botão Menu:</strong>
                  <span className="text-slate-600">Acesso ao Hub central da UIS com indicadores ao vivo e atalhos diretos.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-700 font-bold block mb-0.5">Botão Recepção:</strong>
                  <span className="text-slate-600">Área de acolhimento e impressão de senhas para novos pacientes.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-700 font-bold block mb-0.5">Botão TV:</strong>
                  <span className="text-slate-600">Abre o monitor da sala de espera para acompanhamento das chamadas.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-700 font-bold block mb-0.5">Botão Consultórios:</strong>
                  <span className="text-slate-600">Espaço de atendimento para médicos, dentistas e equipe de enfermagem.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Unidade Integrada de Saúde - UIS / ESSgt • SGF</span>
            <span>Edição Oficial 2026</span>
            <span className="font-bold">Página 2 de 6</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 3: RECEPÇÃO E TRIAGEM MILITAR */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[2] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl rounded-sm p-10 flex flex-col justify-between border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          <div>
            {/* Standard Header */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border-b-2 border-red-600 flex items-center justify-between mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  MÓDULO 2 | RECEPÇÃO, TRIAGEM & EMISSÃO DE SENHAS
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-[10px] font-mono font-bold text-white">
                PÁG. 3/6
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">2.1</span>
                  Passo a Passo para Emissão de Senha
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  {
                    step: 'Passo 1',
                    title: 'Identificação da Condição & Posto/Graduação',
                    desc: 'Defina se o paciente é Militar Estadual (ativo, inativo ou aluno) ou Dependente Civil. Para militares, selecione o Posto ou Graduação (ex: Cel PM, Cap PM, 1º Sgt PM, Cb PM, Sd PM, Aluno Sgt PM) alimentado pelas tabelas oficiais de apoio da UIS.'
                  },
                  {
                    step: 'Passo 2',
                    title: 'Registro Estatístico (RE), OPM & Convênio',
                    desc: 'Informe o RE militar (ex: 123456-7). Selecione a OPM de lotação (ex: ESSgt, 1º BPM/M, APMBB, CPI-2) e a Assistência à Saúde (Cruz Azul, CBPM, IAMSPE ou Particular). Em caso de dependente civil, registre o RE do titular.'
                  },
                  {
                    step: 'Passo 3',
                    title: 'Dados Pessoais e Queixa Inicial',
                    desc: 'Preencha o Nome Completo, Idade e Sexo do paciente. O campo "Observações / Queixa" permite registrar sintomas prévios que orientem a equipe médica.'
                  },
                  {
                    step: 'Passo 4',
                    title: 'Classificação da Prioridade Legal',
                    desc: 'Defina rigorosamente a prioridade (Normal, Preferencial ou Urgência Clínica), conforme detalhado na tabela normativa abaixo.'
                  },
                  {
                    step: 'Passo 5',
                    title: 'Destino do Atendimento & Impressão',
                    desc: 'Selecione o consultório inicial e clique em "Emitir Senha". A senha sequencial é gerada imediatamente (ex: CLI-012) e o comprovante pode ser impresso para o paciente.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">{item.title}</strong>
                      <p className="text-slate-600 text-[10.5px] mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 2.2 */}
              <div className="border-b border-slate-200 pb-1 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] flex items-center justify-center font-bold">2.2</span>
                  Critérios Oficiais de Prioridade de Atendimento
                </h4>
              </div>

              {/* Priority Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10.5px]">
                      <th className="p-1.5">Prioridade</th>
                      <th className="p-1.5">Público Atendido & Fundamentação</th>
                      <th className="p-1.5">Comportamento na Fila</th>
                      <th className="p-1.5">Identificador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[10px]">
                    <tr className="bg-white">
                      <td className="p-1.5 font-bold text-blue-700">NORMAL</td>
                      <td className="p-1.5 text-slate-600">Consultas eletivas, exames periódicos e retornos de rotina</td>
                      <td className="p-1.5 text-slate-600">Ordem cronológica de chegada à UIS</td>
                      <td className="p-1.5"><span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[9.5px]">Azul</span></td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-1.5 font-bold text-amber-700">PREFERENCIAL</td>
                      <td className="p-1.5 text-slate-600">Idosos (≥60 anos), gestantes, lactantes, pessoas com deficiência (Lei Federal nº 10.048/2000)</td>
                      <td className="p-1.5 text-slate-600">Intercalado com prioridade sobre a fila normal</td>
                      <td className="p-1.5"><span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[9.5px]">Amarelo</span></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-1.5 font-bold text-red-600">URGÊNCIA</td>
                      <td className="p-1.5 text-slate-600">Casos agudos, crises hipertensivas, dores intensas e traumas recentes</td>
                      <td className="p-1.5 font-bold text-red-700">Prioridade MÁXIMA (Passa ao topo da fila)</td>
                      <td className="p-1.5"><span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[9.5px]">Vermelho</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2.3: Gestão Segura da Fila & Modais de Confirmação */}
              <div className="border-b border-slate-200 pb-1 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] flex items-center justify-center font-bold">2.3</span>
                  Gestão Segura da Fila: Cancelar vs. Excluir Paciente
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                  <strong className="text-amber-900 block font-bold text-[11px] mb-0.5">Marcar como Cancelado (Desistência):</strong>
                  <p className="text-slate-700 text-[10.5px] leading-tight">
                    Retira o paciente da espera ativa, mas <strong>preserva o registro para auditoria clínica e estatísticas da UIS</strong>. Recomendado quando o paciente precisou ausentar-se ou desistiu do atendimento.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200">
                  <strong className="text-rose-900 block font-bold text-[11px] mb-0.5">Excluir Definitivamente:</strong>
                  <p className="text-slate-700 text-[10.5px] leading-tight">
                    Remove completamente o registro da base de dados. Utilizado exclusivamente em casos de <strong>erro de digitação ou cadastro duplicado acidental</strong>.
                  </p>
                </div>
              </div>

              {/* Callout on ticket print */}
              <div className="p-2.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl text-xs text-emerald-900 space-y-0.5">
                <strong className="block font-bold flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Comprovante Impresso & Modais Visuais de Confirmação:
                </strong>
                <p className="text-[10px] text-emerald-800 leading-tight">
                  Toda exclusão na fila aciona modal visual seguro exibindo nome, RE, posto e senha, eliminando erros acidentais e substituindo diálogos nativos do navegador.
                </p>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Unidade Integrada de Saúde - UIS / ESSgt • SGF</span>
            <span>Edição Oficial 2026</span>
            <span className="font-bold">Página 3 de 6</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 4: PAINEL TV DA SALA DE ESPERA */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[3] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl rounded-sm p-10 flex flex-col justify-between border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          <div>
            {/* Standard Header */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border-b-2 border-red-600 flex items-center justify-between mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  MÓDULO 3 | PAINEL TV DE CHAMADA & SALA DE ESPERA
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-[10px] font-mono font-bold text-white">
                PÁG. 4/6
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">3.1</span>
                  Instalação e Operação do Painel TV
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                O Painel TV é o ponto focal da sala de espera da UIS. Ele mantém os pacientes informados visual e sonoramente a respeito das senhas chamadas, reduzindo a ansiedade e orientando o deslocamento imediato para a sala correta.
              </p>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <Tv className="w-4 h-4 text-indigo-600" />
                  <span>Procedimento para TV ou Monitor Dedicado:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  <li>Ligue o televisor ou monitor conectado ao computador do saguão.</li>
                  <li>Na tela de login do sistema, clique no perfil <strong>&quot;Totem Painel TV&quot;</strong> ou faça login com o usuário <code>painel_tv</code>.</li>
                  <li>O sistema entrará diretamente no modo de exibição contínua (sem barras de menus ou botões operacionais).</li>
                  <li>Pressione a tecla <strong>F11</strong> no teclado do computador para colocar o navegador em <strong>Tela Cheia (Full Screen)</strong>.</li>
                </ol>
              </div>

              {/* Section 3.2 */}
              <div className="border-b border-slate-200 pb-2 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">3.2</span>
                  Sintetizador de Voz (TTS) & Alerta Harmônico
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Toque Harmônico Suave</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Antes de cada anúncio de voz, o sistema emite um sinal sonoro agradável e projetado para ambientes de saúde, evitando sustos ou ruídos estridentes.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Pronúncia Militar Padrão</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    O motor de fala reconhece as siglas militares e pronuncia formalmente: &quot;Coronel PM&quot;, &quot;Capitão PM&quot;, &quot;1º Sargento PM&quot;, &quot;Cabo PM&quot;, &quot;Soldado PM&quot;.
                  </p>
                </div>
              </div>

              {/* Section 3.3 */}
              <div className="border-b border-slate-200 pb-2 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">3.3</span>
                  Resolução de Bloqueio de Áudio nos Navegadores
                </h4>
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl space-y-2 text-xs text-amber-950">
                <strong className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  O som da TV não está tocando? Saiba como resolver:
                </strong>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Os navegadores modernos (Google Chrome, Microsoft Edge, Mozilla Firefox) bloqueiam a reprodução automática de áudio sem antes haver uma interação física com a página.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-[11px] space-y-1 font-medium text-slate-800">
                  <p><strong>Solução Rápida:</strong> Dê um clique com o mouse em qualquer parte da tela da TV.</p>
                  <p><strong>Verificação de Volume:</strong> Na barra superior ou no menu Configurações, verifique se o botão &quot;Sons On&quot; está verde e com volume confortável.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Unidade Integrada de Saúde - UIS / ESSgt • SGF</span>
            <span>Edição Oficial 2026</span>
            <span className="font-bold">Página 4 de 6</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 5: CONSULTÓRIOS DE ATENDIMENTO */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[4] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl rounded-sm p-10 flex flex-col justify-between border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          <div>
            {/* Standard Header */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border-b-2 border-red-600 flex items-center justify-between mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  MÓDULO 4 | CONSULTÓRIOS MÉDICOS, ODONTOLOGIA & ENFERMAGEM
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-[10px] font-mono font-bold text-white">
                PÁG. 5/6
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">4.1</span>
                  Painel de Trabalho do Profissional de Saúde
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Este módulo é utilizado diretamente pelos médicos, dentistas e enfermeiros dentro de suas salas de atendimento. A interface foi otimizada para requerer o mínimo de cliques e garantir alta produtividade.
              </p>

              {/* Steps in Doctor room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase">1. Chamar Próximo</span>
                  <p className="text-slate-700 text-[11px] mt-1">
                    Clica no botão <strong>&quot;Chamar Próximo&quot;</strong>. A senha do paciente pisca na tela da TV e a voz sintetizada faz o anúncio sonoro imediato.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px] uppercase">2. Chamar Novamente</span>
                  <p className="text-slate-700 text-[11px] mt-1">
                    Se o paciente não comparecer em 2 minutos, clique em <strong>&quot;Re-chamar&quot;</strong> para reforçar o alerta no saguão.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] uppercase">3. Iniciar Consulta</span>
                  <p className="text-slate-700 text-[11px] mt-1">
                    Assim que o paciente entra no consultório, clique em <strong>&quot;Iniciar Consulta&quot;</strong> para disparar o cronômetro do atendimento.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px] uppercase">4. Concluir / Encaminhar</span>
                  <p className="text-slate-700 text-[11px] mt-1">
                    Ao finalizar, clique em <strong>&quot;Concluir Atendimento&quot;</strong> ou transfira diretamente para a Sala de Medicação se houver necessidade.
                  </p>
                </div>
              </div>

              {/* Section 4.2 */}
              <div className="border-b border-slate-200 pb-2 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs flex items-center justify-center font-bold">4.2</span>
                  Salas e Especialidades Padrão da UIS
                </h4>
              </div>

              {/* Room Mapping Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-2">Consultório</th>
                      <th className="p-2">Especialidade</th>
                      <th className="p-2">Prefixo</th>
                      <th className="p-2">Responsável Padrão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-slate-900">Consultório 01</td>
                      <td className="p-2 text-slate-600">Clínica Geral & Triagem Médica</td>
                      <td className="p-2 font-mono font-bold text-blue-600">CLI-XXX</td>
                      <td className="p-2 text-slate-600">Dr. Roberto Silveira (CRM 128.450)</td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-2 font-bold text-slate-900">Consultório 02</td>
                      <td className="p-2 text-slate-600">Cardiologia & Especialidades</td>
                      <td className="p-2 font-mono font-bold text-sky-600">ESP-XXX</td>
                      <td className="p-2 text-slate-600">Dra. Juliana Mendes (CRM 142.890)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-slate-900">Odontologia 01</td>
                      <td className="p-2 text-slate-600">Dentística & Cirurgia Oral</td>
                      <td className="p-2 font-mono font-bold text-emerald-600">ODO-XXX</td>
                      <td className="p-2 text-slate-600">Dr. Lucas Ferreira (CRO 45.123)</td>
                    </tr>
                    <tr className="bg-slate-50/60">
                      <td className="p-2 font-bold text-slate-900">Odontologia 02</td>
                      <td className="p-2 text-slate-600">Ortodontia & Profilaxia</td>
                      <td className="p-2 font-mono font-bold text-teal-600">OD2-XXX</td>
                      <td className="p-2 text-slate-600">Dra. Patricia Alencar (CRO 52.880)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-slate-900">Sala de Medicação</td>
                      <td className="p-2 text-slate-600">Injetáveis, Curativos & Sinais</td>
                      <td className="p-2 font-mono font-bold text-amber-600">MED-XXX</td>
                      <td className="p-2 text-slate-600">Enfª Amanda Rocha (COREN 245.110)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Absent policy */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <strong className="text-slate-900 block font-bold">Paciente Ausente ou Faltoso:</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Caso o paciente não se apresente após 3 chamadas consecutivas, o profissional pode acionar o botão &quot;Marcar Ausente&quot;. A vaga é liberada imediatamente para o próximo paciente da fila e o caso é registrado nas estatísticas.
                </p>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Unidade Integrada de Saúde - UIS / ESSgt • SGF</span>
            <span>Edição Oficial 2026</span>
            <span className="font-bold">Página 5 de 6</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PÁGINA 6: ADMINISTRAÇÃO, RELATÓRIOS E FAQ */}
        {/* ========================================================================= */}
        <div 
          ref={el => { pagesRef.current[5] = el; }}
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl rounded-sm p-10 flex flex-col justify-between border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:min-h-screen a4-page"
        >
          <div>
            {/* Standard Header */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border-b-2 border-red-600 flex items-center justify-between mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  MÓDULO 5 | ADMINISTRAÇÃO GERAL, RELATÓRIOS & FAQ
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-[10px] font-mono font-bold text-white">
                PÁG. 6/6
              </span>
            </div>

            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-purple-900 text-white text-[11px] flex items-center justify-center font-bold">5.1</span>
                  Gestão Centralizada: Os 4 Módulos do Painel Administrador
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <strong className="text-purple-900 font-bold block mb-0.5 text-[11px]">1. Consultórios & Salas:</strong>
                  <p className="text-slate-600 text-[10px] leading-tight">
                    Adicionar salas, personalizar siglas (CLI, ODO, ESP, MED), cores e médicos padrão. Inclui trava de segurança que <strong>impede a exclusão do último consultório ativo</strong>.
                  </p>
                </div>

                <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <strong className="text-purple-900 font-bold block mb-0.5 text-[11px]">2. Usuários & Profissionais:</strong>
                  <p className="text-slate-600 text-[10px] leading-tight">
                    Cadastrar médicos, dentistas, equipe de enfermagem e recepcionistas. Controle de conselhos (CRM/CRO/COREN), redefinição de senhas e exclusão com modal de confirmação.
                  </p>
                </div>

                <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <strong className="text-purple-900 font-bold block mb-0.5 text-[11px]">3. Base Geral de Pacientes:</strong>
                  <p className="text-slate-600 text-[10px] leading-tight">
                    Consulta histórica de policiais militares e dependentes civis, com filtros imediatos por RE, Nome ou OPM, edição cadastral e exclusão protegida por confirmação.
                  </p>
                </div>

                <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <strong className="text-purple-900 font-bold block mb-0.5 text-[11px]">4. Postos, OPMs & Convênios (Apoio):</strong>
                  <p className="text-slate-600 text-[10px] leading-tight">
                    Gestão dinâmica das tabelas que alimentam a recepção: adicionar e remover Postos/Graduações da PMESP, OPMs e Assistências Médicas com modais de confirmação visual.
                  </p>
                </div>
              </div>

              {/* Section 5.2 */}
              <div className="border-b border-slate-200 pb-1 pt-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] flex items-center justify-center font-bold">5.2</span>
                  Relatórios Estatísticos & Ações Globais de Sistema
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-900 block text-[10.5px]">Métricas TME & TMA:</strong>
                  <span className="text-slate-600 text-[10px] leading-tight block">
                    Monitoramento do Tempo Médio de Espera e Duração de Consultas por especialidade, com gráficos analíticos e exportação em PDF e CSV.
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-blue-900 block text-[10.5px]">Ações Globais Seguras:</strong>
                  <span className="text-slate-600 text-[10px] leading-tight block">
                    Na aba Configurações: botões para zerar relatórios, zerar fila ou recarregar 30 dias de histórico (120 atendimentos), todos com modais visuais.
                  </span>
                </div>
              </div>

              {/* Section 5.3 */}
              <div className="border-b border-slate-200 pb-1 pt-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] flex items-center justify-center font-bold">5.3</span>
                  Perguntas Frequentes & Procedimentos Rápidos (FAQ)
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block text-[10.5px]">P: Como adicionar uma nova OPM ou Posto/Graduação na Recepção?</strong>
                  <p className="text-slate-600 text-[10px] mt-0.5">
                    R: Acesse &quot;Administrador &gt; 4. Postos, OPMs &amp; Assistência&quot;. Digite o nome da nova unidade ou posto e clique em &quot;Adicionar&quot;. Ficará disponível imediatamente na triagem.
                  </p>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block text-[10.5px]">P: É seguro excluir um paciente ou consultório?</strong>
                  <p className="text-slate-600 text-[10px] mt-0.5">
                    R: Sim. Todos os botões de lixeira acionam modais de confirmação específicos com os dados do registro, prevenindo toques acidentais e travando a exclusão se for o único consultório restante.
                  </p>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 font-bold block text-[10.5px]">P: O sistema opera se houver instabilidade na rede?</strong>
                  <p className="text-slate-600 text-[10px] mt-0.5">
                    R: Sim. As filas, configurações e relatórios possuem persistência autônoma no navegador, permitindo continuidade total do atendimento na UIS.
                  </p>
                </div>
              </div>

              {/* Institutional Seal Box */}
              <div className="p-2.5 bg-slate-900 text-white rounded-xl text-center space-y-0.5 mt-2">
                <p className="text-[11px] font-black uppercase text-blue-300">
                  Polícia Militar do Estado de São Paulo • ESSgt / UIS
                </p>
                <p className="text-[9.5px] text-slate-400">
                  &quot;Nós, Policiais Militares, sob a proteção de Deus, estamos compromissados com a Defesa da Vida e da Saúde.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Unidade Integrada de Saúde - UIS / ESSgt • SGF</span>
            <span>Edição Oficial 2026</span>
            <span className="font-bold">Página 6 de 6 (Fim do Manual)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
