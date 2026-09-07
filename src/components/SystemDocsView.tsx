import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Tv, 
  Stethoscope, 
  Users, 
  BarChart3, 
  Settings, 
  CheckCircle2, 
  Code2, 
  Database, 
  Server, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Volume2,
  Lock,
  UserPlus
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const SystemDocsView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { setActiveTab } = useClinic();
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('visao-geral');

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab('menu');
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      const res = await fetch('/DOCUMENTACAO_SISTEMA.md');
      let text = '';
      if (res.ok) {
        text = await res.text();
      } else {
        text = `# Documentação do Sistema UIS - ESSgt (PMESP)\nVersão 2.5 Oficial • Edição 2026\nConsulte o arquivo DOCUMENTACAO_SISTEMA.md no repositório.`;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/DOCUMENTACAO_SISTEMA.md');
    element.setAttribute('download', 'DOCUMENTACAO_SISTEMA_UIS_ESSgt.md');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'visao-geral', label: '1. Visão Geral & Finalidade', icon: Activity },
    { id: 'arquitetura', label: '2. Arquitetura & Stack', icon: Layers },
    { id: 'modulos', label: '3. Os 7 Módulos do Sistema', icon: Server },
    { id: 'rbac', label: '4. Perfis & Matriz RBAC', icon: ShieldCheck },
    { id: 'triagem', label: '5. Triagem & Regras de Fila', icon: UserPlus },
    { id: 'dados', label: '6. Modelos de Dados (Types)', icon: Database },
    { id: 'seguranca', label: '7. Segurança & Exclusões', icon: Lock },
    { id: 'comandos', label: '8. Instalação & Build', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Top Floating / Sticky Action Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Voltar ao menu"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  Documentação Técnica do Sistema
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold uppercase tracking-wider">
                    v2.5 Oficial
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono">
                  PMESP • ESSgt • Unidade Integrada de Saúde (UIS)
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manual')}
              className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Visualizar Manual Operacional diagramado em formato A4"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Manual do Usuário A4</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Copiar markdown completo para a área de transferência"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar .md'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Baixar arquivo DOCUMENTACAO_SISTEMA.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
              title="Imprimir documentação"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Especificação Arquitetural e Funcional do Software
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sistema de Chamada de Senhas, Triagem Militar & Gestão Ambulatorial
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Documentação formal desenvolvida para analistas de sistemas, administradores da Unidade Integrada de Saúde (UIS) e oficiais da Escola Superior de Sargentos (ESSgt).
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 font-mono">
            <span>• Edição: 2026</span>
            <span>• Versão: 2.5 Oficial</span>
            <span>• Stack: React 18 / TypeScript / Tailwind CSS / Web Audio API / Vite</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 print:hidden">
            <div className="sticky top-20 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-3 block mb-2">
                Índice da Documentação
              </span>

              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                  <strong className="block font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Manual do Usuário A4
                  </strong>
                  <p className="text-[11px] text-blue-700 leading-tight">
                    Para o manual visual diagramado em 6 páginas A4 para treinamento prático da equipe da recepção e consultórios.
                  </p>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className="mt-2 text-[11px] font-black text-blue-800 hover:underline flex items-center gap-1"
                  >
                    Abrir Manual A4 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Documentation Content Body */}
          <main className="lg:col-span-3 space-y-10">
            
            {/* Section 1: Visão Geral */}
            <section id="visao-geral" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Visão Geral & Finalidade</h3>
                  <p className="text-xs text-slate-500 font-mono">Contexto Institucional • PMESP • ESSgt • UIS</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  O <strong>Sistema de Chamada de Senhas e Gestão Ambulatorial da UIS / ESSgt</strong> é uma solução de software projetada especificamente para o fluxo de atendimento em saúde militar da Escola Superior de Sargentos.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-xs font-bold text-slate-900 block mb-1">Público Atendido:</strong>
                    <p className="text-xs text-slate-600">
                      Policiais Militares da ativa (efetivo da ESSgt e adidos), Alunos dos Cursos de Formação de Sargentos, Inativos e Dependentes Civis vinculados à Cruz Azul, CBPM ou IAMSPE.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-xs font-bold text-slate-900 block mb-1">Propósito Clínico & Gerencial:</strong>
                    <p className="text-xs text-slate-600">
                      Eliminar filas desordenadas, garantir cumprimento rigoroso das prioridades legais (Lei nº 10.048/2000), oferecer comunicação auditiva e visual com sintetizador de voz (TTS) militar e mensurar métricas de Tempo Médio de Espera (TME).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Arquitetura & Stack */}
            <section id="arquitetura" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Arquitetura de Software & Stack Tecnológico</h3>
                  <p className="text-xs text-slate-500 font-mono">React 18+ • TypeScript • Web Audio API • Vite</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                A aplicação foi estruturada como uma <strong>Single-Page Application (SPA) autônoma e resiliente</strong>, desenhada para operar de maneira ininterrupta mesmo diante de falhas momentâneas de conexão com a rede externa:
              </p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Camada / Componente</th>
                      <th className="p-3">Tecnologia</th>
                      <th className="p-3">Responsabilidade Técnica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-blue-700">Frontend Core</td>
                      <td className="p-3 font-mono">React 18 + TypeScript</td>
                      <td className="p-3">Gerenciamento reativo de estado de filas, salas, pacientes e tipagem estrita de prontuários.</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-indigo-700">Estilização & Design</td>
                      <td className="p-3 font-mono">Tailwind CSS</td>
                      <td className="p-3">Layout responsivo de alta legibilidade para TVs da sala de espera e postos médicos.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">Gongo Harmônico</td>
                      <td className="p-3 font-mono">Web Audio API</td>
                      <td className="p-3">Síntese com 3 osciladores senoidais puros (sem dependência de arquivos de áudio externos).</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-emerald-700">Voz Sonora (TTS)</td>
                      <td className="p-3 font-mono">Web Speech API</td>
                      <td className="p-3">Sintetizador vocal inteligente com tratamento fonético para abreviações militares (RE, OPM, Patentes).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-purple-700">Geração de Documentos</td>
                      <td className="p-3 font-mono">jsPDF</td>
                      <td className="p-3">Emissão vetorial do Manual Operacional em 6 páginas A4 e relatórios estatísticos da UIS.</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Persistência Local</td>
                      <td className="p-3 font-mono">LocalStorage API</td>
                      <td className="p-3">Armazenamento offline-first tolerante a falhas com serialização segura e migração automática.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Os 7 Módulos do Sistema */}
            <section id="modulos" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Os 7 Módulos Integrados do Sistema</h3>
                  <p className="text-xs text-slate-500 font-mono">Fluxo Operacional de Ponta a Ponta</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: '3.1',
                    title: 'Autenticação & Segurança RBAC',
                    desc: 'Login por perfil (Médico, Dentista, Enfermagem, Recepção, TV e Admin), política de senha do administrador e modo Totem exclusivo.'
                  },
                  {
                    num: '3.2',
                    title: 'Recepção & Triagem Militar',
                    desc: 'Cadastro com Posto/Graduação, RE, OPM de lotação, Convênio e classificação de prioridades (Normal, Preferencial e Urgência).'
                  },
                  {
                    num: '3.3',
                    title: 'Painel TV da Sala de Espera',
                    desc: 'Interface fullscreen para televisores com gongo harmônico multi-oscilador, voz TTS em português e histórico das últimas 5 senhas.'
                  },
                  {
                    num: '3.4',
                    title: 'Consultórios Médicos & Odonto',
                    desc: 'Chamada ágil, cronômetro de consulta, evolução clínica de prontuário, transferência para sala de medicação e conclusão.'
                  },
                  {
                    num: '3.5',
                    title: 'Painel Central do Administrador',
                    desc: '4 abas estratégicas: Consultórios (com trava de sala mínima), Usuários/Conselhos, Base Geral de Pacientes e Tabelas de Apoio.'
                  },
                  {
                    num: '3.6',
                    title: 'Relatórios Estatísticos & TME',
                    desc: 'Painel de métricas analíticas (TME, TMA, taxa de eficiência), gráficos horários e diários, exportações em CSV e PDF oficial.'
                  },
                  {
                    num: '3.7',
                    title: 'Configurações & Ações Globais',
                    desc: 'Ajustes de áudio e ações com modais de confirmação visual: Zerar Relatórios, Zerar Fila ou Recarregar 120 atendimentos de demonstração.'
                  }
                ].map((mod, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {mod.num}
                      </span>
                      <strong className="text-slate-900 font-bold text-sm">{mod.title}</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Perfis RBAC */}
            <section id="rbac" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Perfis de Usuário & Matriz de Permissões (RBAC)</h3>
                  <p className="text-xs text-slate-500 font-mono">Role-Based Access Control</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Perfil (`role`)</th>
                      <th className="p-3">Profissionais / Postos</th>
                      <th className="p-3">Acesso às Telas</th>
                      <th className="p-3">Operações Críticas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-black text-purple-700">admin</td>
                      <td className="p-3">Coordenador UIS / Oficial de Saúde</td>
                      <td className="p-3">Todas as telas sem restrição</td>
                      <td className="p-3">Criar/excluir salas, usuários, editar tabelas e zerar filas.</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-black text-blue-700">medico</td>
                      <td className="p-3">Médicos Oficiais e Civis (CRM)</td>
                      <td className="p-3">Consultórios, Menu e TV</td>
                      <td className="p-3">Chamar pacientes, registrar prontuários e encaminhar medicação.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black text-teal-700">dentista</td>
                      <td className="p-3">Cirurgiões-Dentistas (CRO)</td>
                      <td className="p-3">Consultórios Odontológicos e TV</td>
                      <td className="p-3">Atendimento clínico odontológico e evolução de procedimentos.</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-black text-indigo-700">enfermeiro</td>
                      <td className="p-3">Enfermeiros / Técnicos (COREN)</td>
                      <td className="p-3">Sala de Medicação e TV</td>
                      <td className="p-3">Aplicação de medicamentos prescritos e curativos.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black text-amber-700">recepcao</td>
                      <td className="p-3">Atendentes / Policiais Militares</td>
                      <td className="p-3">Recepção, Triagem e TV</td>
                      <td className="p-3">Emissão de senhas, priorização e cancelamento de desistências.</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-black text-rose-700">painel_tv</td>
                      <td className="p-3">Terminal da Sala de Espera</td>
                      <td className="p-3">Exclusivo Painel TV (Fullscreen)</td>
                      <td className="p-3">Apenas exibição multimídia, sem acesso a menus de edição.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Triagem & Regras de Fila */}
            <section id="triagem" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Triagem Militar & Regras de Fila</h3>
                  <p className="text-xs text-slate-500 font-mono">Prioridades Legais • Cancelamento vs Exclusão</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] uppercase">Normal</span>
                    <h4 className="font-bold text-slate-900 mt-2 mb-1">Consultas Eletivas</h4>
                    <p className="text-slate-600 text-[11px]">Ordenados estritamente pela hora de emissão da senha.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] uppercase">Preferencial</span>
                    <h4 className="font-bold text-slate-900 mt-2 mb-1">Lei Federal 10.048/2000</h4>
                    <p className="text-slate-600 text-[11px]">Idosos (≥60 anos), gestantes e pessoas com deficiência. Intercalado à frente da normal.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase">Urgência</span>
                    <h4 className="font-bold text-slate-900 mt-2 mb-1">Prioridade Máxima</h4>
                    <p className="text-slate-600 text-[11px]">Casos agudos, crises hipertensivas e dores intensas. Move automaticamente ao topo da fila.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Diferenciação Crítica: Cancelar Atendimento vs. Excluir Paciente
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <strong className="text-amber-900 block font-bold mb-1">Marcar como Cancelado (Desistência):</strong>
                      <p className="text-[11px] text-slate-600">
                        Remove o paciente da espera visual do dia, mas <strong>preserva o registro histórico</strong> para fins de auditoria clínica e cálculo da taxa de absenteísmo da UIS.
                      </p>
                    </div>

                    <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                      <strong className="text-rose-900 block font-bold mb-1">Excluir Definitivamente:</strong>
                      <p className="text-[11px] text-slate-600">
                        Remove o registro permanentemente do banco de dados. Exclusivo para correções imediatas de erro cadastral ou emissão duplicada acidental.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Modelos de Dados TypeScript */}
            <section id="dados" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Modelos de Dados & Tipagem TypeScript</h3>
                  <p className="text-xs text-slate-500 font-mono">Interfaces Principais em src/types/index.ts</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Estrutura do Paciente (`Patient`):</span>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl overflow-x-auto font-mono text-[11px] leading-relaxed">
{`export interface Patient {
  id: string;
  ticketNumber: string;         // Ex: "CLI-012", "ODO-003", "MED-001"
  rank?: MilitaryRank | string; // Ex: "Cap PM", "1º Sgt PM", "Sd PM", "Civil"
  re: string;                   // Registro Estatístico PM (Ex: "123456-7")
  name: string;                 // Nome completo do policial ou dependente
  document: string;             // Documento civil para compatibilidade
  age?: number;
  gender?: 'M' | 'F' | 'Outro';
  opm?: string;                 // OPM de lotação (Ex: "ESSgt", "1º BPM/M")
  priority: 'normal' | 'preferencial' | 'urgente';
  targetRoomId: string;
  category: 'clinico' | 'especialidade' | 'medicacao' | 'odonto' | 'geral';
  insurance?: string;           // Ex: "CBPM / CMed", "Cruz Azul de SP"
  registeredAt: string;         // Timestamp ISO da emissão da senha
  calledAt?: string;            // Timestamp ISO da chamada no painel TV
  startedAt?: string;           // Timestamp ISO do início da consulta
  completedAt?: string;         // Timestamp ISO do término da consulta
  status: 'aguardando' | 'chamado' | 'em_atendimento' | 'concluido' | 'ausente' | 'cancelado';
  callCount: number;
  doctorName?: string;
  consultationNotes?: string;   // Evolução clínica e conduta registrada
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 7: Segurança & Exclusões */}
            <section id="seguranca" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  7
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Segurança de Interface & Tratamento de Exclusões</h3>
                  <p className="text-xs text-slate-500 font-mono">Modais Visuais • Validação de Integridade</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  Para garantir confiabilidade de nível corporativo e impedir toques acidentais ou bloqueios do navegador por janelas modais nativas (`window.confirm`), o sistema implementa:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">1. Modais Contextualizados:</strong>
                    <span>Cada exclusão exibe um diálogo visual com o nome, RE, posto e senha do registro em questão.</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">2. Trava de Sala Mínima:</strong>
                    <span>O sistema bloqueia a exclusão caso o administrador tente excluir o último consultório ativo da UIS.</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-bold mb-1">3. Ações Globais Seguras:</strong>
                    <span>Zerar relatórios ou zerar fila requerem confirmação explícita com avisos visuais vermelhos.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: Comandos de Build & Deploy */}
            <section id="comandos" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  8
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Instalação, Comandos de Build & Execução</h3>
                  <p className="text-xs text-slate-500 font-mono">NPM Scripts & Instruções de Ambiente</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Comandos padronizados no arquivo <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">package.json</code>:
                </p>

                <div className="space-y-2">
                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                    <span className="text-slate-500 block mb-1"># 1. Instalar dependências</span>
                    npm install
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                    <span className="text-slate-500 block mb-1"># 2. Executar servidor de desenvolvimento (porta 3000)</span>
                    npm run dev
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                    <span className="text-slate-500 block mb-1"># 3. Validar tipagem TypeScript estrita</span>
                    npm run lint
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px]">
                    <span className="text-slate-500 block mb-1"># 4. Gerar build de produção para implantação</span>
                    npm run build
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
