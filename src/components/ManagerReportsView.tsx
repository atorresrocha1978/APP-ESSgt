import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  Building, 
  Stethoscope, 
  FileSpreadsheet, 
  Award,
  Search,
  ArrowUpRight,
  X,
  Activity,
  FileText,
  Building2,
  Check,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { useClinic } from '../context/ClinicContext';
import { ROOMS, ROOM_LIST } from '../constants/rooms';
import { RoomId } from '../types';

export const ManagerReportsView: React.FC = () => {
  const { attendanceRecords, getMetrics, clearReports, resetToDefaultData } = useClinic();

  const [period, setPeriod] = useState<'month' | 'today' | '7days' | 'all'>('month');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [roomFilter, setRoomFilter] = useState<RoomId | 'all'>('all');
  const [searchTable, setSearchTable] = useState('');
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

  // Compute live metrics from context
  const metrics = useMemo(() => {
    return getMetrics(period, selectedMonth, roomFilter);
  }, [getMetrics, period, selectedMonth, roomFilter]);

  // Filtered records for the detailed table
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      if (roomFilter !== 'all' && r.roomId !== roomFilter) return false;
      if (period === 'month' && r.monthYear !== selectedMonth) return false;
      if (period === 'today' && r.dayString !== new Date().toISOString().split('T')[0]) return false;
      if (searchTable.trim()) {
        const q = searchTable.toLowerCase();
        return (
          r.patientName.toLowerCase().includes(q) ||
          r.ticketNumber.toLowerCase().includes(q) ||
          r.doctorName.toLowerCase().includes(q) ||
          r.roomName.toLowerCase().includes(q) ||
          r.document.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [attendanceRecords, roomFilter, period, selectedMonth, searchTable]);

  // Data formatted for Room Comparison Chart
  const roomChartData = [
    { name: 'Consultório 01 (Clínico)', atendimentos: metrics.byRoom.consultorio_01.count, espera: metrics.byRoom.consultorio_01.avgWait, consulta: metrics.byRoom.consultorio_01.avgAttendance, color: '#2563eb' },
    { name: 'Consultório 02 (Espec.)', atendimentos: metrics.byRoom.consultorio_02.count, espera: metrics.byRoom.consultorio_02.avgWait, consulta: metrics.byRoom.consultorio_02.avgAttendance, color: '#8b5cf6' },
    { name: 'Sala de Medicação', atendimentos: metrics.byRoom.medicacao.count, espera: metrics.byRoom.medicacao.avgWait, consulta: metrics.byRoom.medicacao.avgAttendance, color: '#f59e0b' },
    { name: 'Odontológico 01', atendimentos: metrics.byRoom.odonto_01.count, espera: metrics.byRoom.odonto_01.avgWait, consulta: metrics.byRoom.odonto_01.avgAttendance, color: '#059669' },
    { name: 'Odontológico 02', atendimentos: metrics.byRoom.odonto_02.count, espera: metrics.byRoom.odonto_02.avgWait, consulta: metrics.byRoom.odonto_02.avgAttendance, color: '#0284c7' },
  ];

  // Priority Pie Chart Data
  const priorityChartData = [
    { name: 'Normal', value: metrics.byPriority.normal, color: '#059669' },
    { name: 'Preferencial', value: metrics.byPriority.preferencial, color: '#f59e0b' },
    { name: 'Urgência', value: metrics.byPriority.urgente, color: '#e11d48' },
  ];

  // Helper description of current selected period
  const periodLabel = useMemo(() => {
    if (period === 'month') {
      const [year, month] = selectedMonth.split('-');
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return `${months[parseInt(month, 10) - 1]} de ${year}`;
    }
    if (period === 'today') return 'Hoje (' + new Date().toLocaleDateString('pt-BR') + ')';
    if (period === '7days') return 'Últimos 7 Dias';
    return 'Histórico Completo';
  }, [period, selectedMonth]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Senha', 'Posto/Grad', 'Paciente', 'RE', 'OPM', 'Idade', 'Prioridade', 'Consultório', 'Especialidade', 'Médico/Profissional', 'Convênio', 'Data/Hora Entrada', 'Hora Chamado', 'Hora Fim', 'TME (min)', 'TMA (min)', 'Status', 'Observações'];
    
    const rows = filteredRecords.map(r => [
      r.ticketNumber,
      `"${r.rank || 'Militar'}"`,
      `"${r.patientName}"`,
      r.re || r.document,
      `"${r.opm || 'ESSgt'}"`,
      r.age || '',
      r.priority,
      `"${r.roomName}"`,
      r.category,
      `"${r.doctorName}"`,
      r.insurance || 'CMed',
      r.registeredAt,
      r.calledAt,
      r.completedAt,
      r.waitTimeMinutes,
      r.attendanceTimeMinutes,
      r.status,
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Relatorio_Atendimento_ESSgt_UIS_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Report Actions */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
              <BarChart3 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Relatório de Atendimento & Métricas
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Métricas mensais de tempo de espera (TME), consulta (TMA) e produtividade da <span className="text-red-600 font-bold">U.I.S.</span> ESSgt.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export, Print & Reset */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="btn-clear-reports"
            onClick={() => setShowClearConfirmModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all shadow-xs cursor-pointer"
            title="Zerar todos os relatórios e histórico de atendimentos"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            <span>Zerar Relatórios</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-200 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Exportar CSV</span>
          </button>

          <button
            id="btn-print-report"
            onClick={() => setShowPrintReport(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        {/* Period Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" /> Período:
          </span>

          <div className="flex items-center gap-1 bg-sky-50/70 p-1.5 rounded-2xl border border-sky-100">
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === 'month' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mês Completo
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === '7days' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Últimos 7 Dias
            </button>
            <button
              onClick={() => setPeriod('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === 'today' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo Histórico
            </button>
          </div>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-black bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          )}
        </div>

        {/* Room Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" /> Consultório:
          </span>
          <select
            id="report-select-room-filter"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value as RoomId | 'all')}
            className="text-xs font-black bg-sky-50 border border-sky-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          >
            <option value="all">Todos os Consultórios (5)</option>
            {ROOM_LIST.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.subname})</option>
            ))}
          </select>
        </div>

      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Atendidos */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-2">
            <span>Atendimentos</span>
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 font-mono">
              {metrics.totalAttended}
            </span>
            <span className="text-xs font-bold text-emerald-600">pacientes</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Comparecimento: <strong className="text-emerald-600 font-bold">{metrics.efficiencyRate}%</strong>
          </span>
        </div>

        {/* Card 2: Tempo Médio de Espera (TME) */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-2">
            <span>Tempo Espera (TME)</span>
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-700 font-mono">
              {metrics.avgWaitTimeMinutes}
            </span>
            <span className="text-xs font-bold text-slate-400">minutos</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Meta: <strong className="text-slate-700 font-bold">&lt; 20 min</strong>
          </span>
        </div>

        {/* Card 3: Tempo Médio de Atendimento (TMA) */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-2">
            <span>Consulta (TMA)</span>
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-600">
              <Stethoscope className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-700 font-mono">
              {metrics.avgAttendanceTimeMinutes}
            </span>
            <span className="text-xs font-bold text-slate-400">minutos</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Duração média em sala
          </span>
        </div>

        {/* Card 4: Taxa de Efetividade */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-2">
            <span>Efetividade da Fila</span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-mono">
              {metrics.efficiencyRate}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            {metrics.totalAbsent} ausência(s)
          </span>
        </div>

        {/* Card 5: Em Espera Agora */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-2">
            <span>Fila em Espera</span>
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-600">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">
              {metrics.totalWaiting}
            </span>
            <span className="text-xs font-bold text-slate-400">aguardando</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            {metrics.totalInProgress} em atendimento
          </span>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: Volume Diário no Mês (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-base text-slate-800">
                Evolução Diária de Atendimentos
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Número de pacientes atendidos dia a dia no período
              </p>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              {selectedMonth}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.byDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f9ff" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px', padding: '10px 14px' }}
                />
                <Area type="monotone" dataKey="count" name="Atendimentos" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Distribuição por Prioridade (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-slate-800">
              Distribuição por Prioridade
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-2">
              Proporção Normal vs Preferencial vs Urgência
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-sky-100 text-center text-xs">
            <div>
              <span className="block font-black text-emerald-700 text-sm">{metrics.byPriority.normal}</span>
              <span className="text-[10px] text-slate-400 font-bold">Normal</span>
            </div>
            <div>
              <span className="block font-black text-amber-700 text-sm">{metrics.byPriority.preferencial}</span>
              <span className="text-[10px] text-slate-400 font-bold">Preferencial</span>
            </div>
            <div>
              <span className="block font-black text-rose-700 text-sm">{metrics.byPriority.urgente}</span>
              <span className="text-[10px] text-slate-400 font-bold">Urgência</span>
            </div>
          </div>
        </div>

        {/* CHART 3: Comparativo de Volume e Tempos por Consultório (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-black text-base text-slate-800">
              Atendimentos e TME por Consultório
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Comparativo de volume e tempo de espera entre as 5 salas
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomChartData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f9ff" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: '#334155', fontWeight: 700 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 600 }} />
                <Bar dataKey="atendimentos" name="Pacientes Atendidos" fill="#2563eb" radius={[0, 8, 8, 0]} />
                <Bar dataKey="espera" name="TME Médio (min)" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Horários de Pico (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-black text-base text-slate-800">
              Horários de Pico de Atendimento
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Concentração de fluxo de pacientes ao longo das horas do dia (07h às 19h)
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.byHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f9ff" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }} />
                <Bar dataKey="count" name="Pacientes Atendidos" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical Detailed Table */}
      <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-800">
              Histórico Detalhado de Atendimentos
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Registros individuais com carimbo de tempo, duração e médico responsável
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Buscar no histórico..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-sky-50/60 border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-sky-50/50 text-slate-500 font-black uppercase text-[10px] border-b border-sky-100 sticky top-0">
              <tr>
                <th className="px-5 py-3.5">Senha</th>
                <th className="px-5 py-3.5">Data / Hora</th>
                <th className="px-5 py-3.5">Posto / Paciente</th>
                <th className="px-5 py-3.5">RE / OPM</th>
                <th className="px-5 py-3.5">Consultório</th>
                <th className="px-5 py-3.5">Médico / Responsável</th>
                <th className="px-5 py-3.5">Espera (TME)</th>
                <th className="px-5 py-3.5">Consulta (TMA)</th>
                <th className="px-5 py-3.5">Assistência</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filteredRecords.length > 0 ? (
                filteredRecords.slice(0, 50).map((record) => (
                  <tr key={record.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-black text-blue-700">
                      {record.ticketNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono font-semibold whitespace-nowrap">
                      {new Date(record.completedAt).toLocaleDateString('pt-BR')} {new Date(record.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {record.rank && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-800 text-white">
                            {record.rank}
                          </span>
                        )}
                        <span className="font-black text-slate-800">{record.patientName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {record.age ? `${record.age} anos` : 'Idade N/I'} {record.gender ? `• ${record.gender}` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-700">
                        {record.re || record.document}
                      </div>
                      <div className="text-[10px] font-bold text-blue-600">
                        {record.opm || 'ESSgt'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{record.roomName}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                      {record.doctorName}
                    </td>
                    <td className="px-5 py-3.5 font-mono whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-xl font-black ${
                        record.waitTimeMinutes > 25 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {record.waitTimeMinutes} min
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 font-bold whitespace-nowrap">
                      {record.attendanceTimeMinutes} min
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      {record.insurance || 'CMed'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {record.status === 'concluido' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Concluído</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">Ausente</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    Nenhum registro encontrado no histórico.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Modal */}
      {showPrintReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs p-2 sm:p-6 flex flex-col items-center">
          
          {/* Top Floating Control Bar (Hidden on Print) */}
          <div className="no-print w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl p-4 mb-4 border border-slate-200 shadow-xl flex items-center justify-between gap-4 sticky top-4 z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Pré-visualização do Relatório Oficial de Atendimento
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Formato A4 oficial da UIS ESSgt • Pronto para impressão ou exportação em PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Imprimir Agora (A4 / PDF)</span>
              </button>

              <button
                onClick={() => setShowPrintReport(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Fechar Pré-visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Report Paper Container (Printed Content) */}
          <div className="print-area w-full max-w-5xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-6 text-slate-800 font-sans mb-12">
            
            {/* Official Institutional Header */}
            <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                  Polícia Militar do Estado de São Paulo
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-wide">
                Escola Superior de Sargentos • 2º B.G.
              </h2>
              <h3 className="text-base font-black text-slate-800">
                Unidade Integrada de Saúde - <span className="text-red-600 font-black">UIS</span>
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-1">
                Relatório Consolidado de Atendimento, Fila de Espera & Produtividade
              </p>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Período Avaliado:</span>
                <span className="font-black text-slate-900">{periodLabel}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Filtro de Sala:</span>
                <span className="font-black text-slate-900">
                  {roomFilter === 'all' ? 'Todos os Consultórios' : ROOMS[roomFilter]?.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Data de Emissão:</span>
                <span className="font-black text-slate-900">
                  {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total de Atendimentos:</span>
                <span className="font-black text-blue-700">{filteredRecords.length} pacientes</span>
              </div>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Atendidos</span>
                <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Tempo Médio Espera (TME)</span>
                <span className="text-2xl font-black text-blue-600">{metrics.avgWait} <span className="text-xs font-bold text-slate-500">min</span></span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Tempo Médio Consulta (TMA)</span>
                <span className="text-2xl font-black text-emerald-600">{metrics.avgAttendance} <span className="text-xs font-bold text-slate-500">min</span></span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Taxa de Conclusão</span>
                <span className="text-2xl font-black text-indigo-600">{metrics.completionRate}%</span>
              </div>
            </div>

            {/* Priority Distribution Summary */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-around gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Atendimento Normal:</span>{' '}
                <strong className="text-slate-900">{metrics.byPriority.normal}</strong> ({metrics.total > 0 ? Math.round((metrics.byPriority.normal / metrics.total) * 100) : 0}%)
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Preferencial (Idoso/Gestante/PCD):</span>{' '}
                <strong className="text-amber-700">{metrics.byPriority.preferencial}</strong> ({metrics.total > 0 ? Math.round((metrics.byPriority.preferencial / metrics.total) * 100) : 0}%)
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Urgência Médica:</span>{' '}
                <strong className="text-rose-700">{metrics.byPriority.urgente}</strong> ({metrics.total > 0 ? Math.round((metrics.byPriority.urgente / metrics.total) * 100) : 0}%)
              </div>
            </div>

            {/* Room Productivity Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Desempenho por Consultório / Sala da UIS
              </h4>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Consultório / Sala</th>
                    <th className="px-3 py-2">Especialidade / Finalidade</th>
                    <th className="px-3 py-2 text-center">Atendimentos</th>
                    <th className="px-3 py-2 text-center">TME (Espera)</th>
                    <th className="px-3 py-2 text-center">TMA (Consulta)</th>
                    <th className="px-3 py-2 text-center">% do Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ROOM_LIST.map((room) => {
                    const roomMetric = metrics.byRoom[room.id] || { count: 0, avgWait: 0, avgAttendance: 0 };
                    const share = metrics.total > 0 ? Math.round((roomMetric.count / metrics.total) * 100) : 0;
                    return (
                      <tr key={room.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-black text-slate-900">{room.name}</td>
                        <td className="px-3 py-2 text-slate-600">{room.subname} ({room.category})</td>
                        <td className="px-3 py-2 font-bold text-center">{roomMetric.count}</td>
                        <td className="px-3 py-2 font-mono text-center">{roomMetric.avgWait} min</td>
                        <td className="px-3 py-2 font-mono text-center">{roomMetric.avgAttendance} min</td>
                        <td className="px-3 py-2 font-bold text-center text-slate-700">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Detailed Table of Filtered Records */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Relação Analítica de Pacientes Atendidos ({filteredRecords.length})
              </h4>
              <table className="w-full text-left text-[11px] border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[9px] border-b border-slate-200">
                  <tr>
                    <th className="px-2.5 py-2">Senha</th>
                    <th className="px-2.5 py-2">Data/Hora</th>
                    <th className="px-2.5 py-2">Posto / Paciente</th>
                    <th className="px-2.5 py-2">RE / Doc</th>
                    <th className="px-2.5 py-2">OPM</th>
                    <th className="px-2.5 py-2">Consultório</th>
                    <th className="px-2.5 py-2">Profissional</th>
                    <th className="px-2.5 py-2 text-center">TME</th>
                    <th className="px-2.5 py-2 text-center">TMA</th>
                    <th className="px-2.5 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="print-page-break-inside-avoid">
                        <td className="px-2.5 py-1.5 font-mono font-bold text-blue-700">{r.ticketNumber}</td>
                        <td className="px-2.5 py-1.5 font-mono text-slate-600 whitespace-nowrap">
                          {new Date(r.completedAt).toLocaleDateString('pt-BR')} {new Date(r.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-2.5 py-1.5 font-bold text-slate-900">
                          {r.rank ? `${r.rank} ` : ''}{r.patientName}
                        </td>
                        <td className="px-2.5 py-1.5 font-mono text-slate-700">{r.re || r.document}</td>
                        <td className="px-2.5 py-1.5 text-slate-600">{r.opm || 'ESSgt'}</td>
                        <td className="px-2.5 py-1.5 text-slate-800 font-medium">{r.roomName}</td>
                        <td className="px-2.5 py-1.5 text-slate-700">{r.doctorName}</td>
                        <td className="px-2.5 py-1.5 font-mono text-center">{r.waitTimeMinutes}m</td>
                        <td className="px-2.5 py-1.5 font-mono text-center">{r.attendanceTimeMinutes}m</td>
                        <td className="px-2.5 py-1.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            r.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {r.status === 'concluido' ? 'Concluído' : 'Ausente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-slate-400">
                        Nenhum atendimento registrado no período selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Institutional Signatures & Footer */}
            <div className="print-page-break-inside-avoid pt-8 border-t border-slate-200 mt-8 space-y-8">
              <div className="text-[11px] text-slate-500 text-center italic">
                Documento emitido eletronicamente pelo Sistema de Gestão de Senhas e Consultórios da Unidade Integrada de Saúde (UIS) da Escola Superior de Sargentos (ESSgt) - Polícia Militar do Estado de São Paulo.
              </div>

              <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4">
                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-4/5 mx-auto mb-2"></div>
                  <p className="font-black text-slate-900">Encarregado / Oficial Médico de Dia</p>
                  <p className="text-[10px] text-slate-500">Unidade Integrada de Saúde - ESSgt</p>
                </div>
                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-4/5 mx-auto mb-2"></div>
                  <p className="font-black text-slate-900">Chefe da U.I.S. / Comandante da ESSgt</p>
                  <p className="text-[10px] text-slate-500">Escola Superior de Sargentos - 2º B.G.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Clear Reports Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Zerar Todos os Relatórios?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Tem certeza que deseja zerar o histórico de atendimentos e todas as métricas da <strong className="text-slate-800 font-bold">UIS ESSgt</strong>?
              </p>
              
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs text-left mt-2 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  Atenção:
                </p>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Todos os <strong>{attendanceRecords.length} atendimentos</strong> registrados no histórico serão apagados permanentemente, zerando as médias de espera (TME), tempos de consulta (TMA) e gráficos de produtividade.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="btn-cancel-clear-reports"
                onClick={() => setShowClearConfirmModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-confirm-clear-reports"
                onClick={() => {
                  clearReports();
                  setShowClearConfirmModal(false);
                  setShowSuccessFeedback(true);
                  setTimeout(() => setShowSuccessFeedback(false), 4000);
                }}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors shadow-lg shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Sim, Zerar Tudo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Feedback Toast */}
      {showSuccessFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-black text-white">Relatórios Zerados com Sucesso!</p>
            <p className="text-[10px] text-slate-400">Todos os registros e gráficos foram redefinidos para zero.</p>
          </div>
        </div>
      )}

    </div>
  );
};
