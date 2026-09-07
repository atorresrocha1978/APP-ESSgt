import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Volume2, 
  ArrowRightLeft, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Stethoscope, 
  Sparkles, 
  Syringe, 
  Smile, 
  ShieldCheck,
  Building2,
  X,
  FileText,
  BadgePercent,
  Award
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS, ROOM_LIST } from '../constants/rooms';
import { RoomId, Priority, Patient, MilitaryRank, COMMON_OPMS } from '../types';

const MILITARY_RANKS: MilitaryRank[] = [
  'Cel PM',
  'Ten Cel PM',
  'Maj PM',
  'Cap PM',
  '1º Ten PM',
  '2º Ten PM',
  'Subten PM',
  '1º Sgt PM',
  '2º Sgt PM',
  '3º Sgt PM',
  'Aluno Sgt PM',
  'Cb PM',
  'Sd PM',
  'Aluno Oficial',
  'Civil'
];

export const ReceptionView: React.FC = () => {
  const { 
    patients, 
    addPatient, 
    callPatient, 
    cancelPatient, 
    deletePatient,
    transferPatient, 
    currentCall,
    rooms,
    roomList,
    users,
    militaryRanks,
    opms,
    healthInsurances
  } = useClinic();

  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const effectiveRoomList = (roomList && roomList.length > 0) ? roomList : ROOM_LIST;
  const availableRanks = (militaryRanks && militaryRanks.length > 0) ? militaryRanks : MILITARY_RANKS;
  const availableOpms = (opms && opms.length > 0) ? opms : COMMON_OPMS;
  const availableInsurances = (healthInsurances && healthInsurances.length > 0) 
    ? healthInsurances 
    : ['CMed / CBPM', 'Cruz Azul de SP', 'SUS', 'Particular'];
  const effectiveRooms = rooms || ROOMS;

  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rank, setRank] = useState<MilitaryRank>('Sd PM');
  const [re, setRe] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'M' | 'F' | 'Outro'>('M');
  const [opm, setOpm] = useState('ESSgt');
  const [customOpm, setCustomOpm] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [targetRoomId, setTargetRoomId] = useState<RoomId>('consultorio_01');
  const [insurance, setInsurance] = useState('CMed / CBPM');
  const [notes, setNotes] = useState('');

  // Ticket Voucher Print Preview State
  const [createdTicket, setCreatedTicket] = useState<Patient | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<RoomId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);
  const [selectedNewRoom, setSelectedNewRoom] = useState<RoomId>('consultorio_01');

  // Format RE: 999999-9
  const handleReChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
    if (raw.length > 6) {
      setRe(`${raw.slice(0, 6)}-${raw.slice(6)}`);
    } else {
      setRe(raw);
    }
  };

  // Handle Form Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalOpm = opm === 'Outra OPM' ? (customOpm.trim() || 'Outra OPM') : opm;

    const newPat = addPatient({
      rank,
      re: re.trim() || '000000-0',
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      gender,
      opm: finalOpm,
      priority,
      targetRoomId,
      insurance,
      notes: notes.trim()
    });

    // Reset Form
    setRank('Sd PM');
    setRe('');
    setName('');
    setAge('');
    setGender('M');
    setOpm('ESSgt');
    setCustomOpm('');
    setNotes('');
    setPriority('normal');
    setIsModalOpen(false);

    // Show printed ticket modal
    setCreatedTicket(newPat);
  };

  // Filtered Patients List
  const filteredPatients = patients.filter(p => {
    if (roomFilter !== 'all' && p.targetRoomId !== roomFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.ticketNumber.toLowerCase().includes(q) ||
        (p.re && p.re.toLowerCase().includes(q)) ||
        (p.document && p.document.toLowerCase().includes(q)) ||
        (p.rank && p.rank.toLowerCase().includes(q)) ||
        (p.opm && p.opm.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Urgente
          </span>
        );
      case 'preferencial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Preferencial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'aguardando':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Aguardando</span>;
      case 'chamado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">Chamado na TV</span>;
      case 'em_atendimento':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Em Atendimento</span>;
      case 'concluido':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">Concluído</span>;
      case 'ausente':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Ausente</span>;
      default:
        return null;
    }
  };

  const getWaitDuration = (registeredAt: string) => {
    const mins = Math.max(0, Math.floor((Date.now() - new Date(registeredAt).getTime()) / 60000));
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (mins > 30) color = 'text-rose-700 bg-rose-50 border-rose-200';
    else if (mins > 15) color = 'text-amber-700 bg-amber-50 border-amber-200';
    return <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${color}`}>{mins} min</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Live Reception Header & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Recepção & Triagem de Pacientes
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-200">
                Ativo
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Cadastre novos pacientes militares e civis, emita senhas de atendimento e acompanhe a fila em tempo real na <span className="text-red-600 font-bold">U.I.S.</span>
            </p>
          </div>
        </div>

        {/* Big Action Button: Cadastrar Paciente */}
        <button
          id="btn-open-register-modal"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <UserPlus className="w-5 h-5 stroke-[2.5]" />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {/* Real-time Room Status Overview Cards (5 Rooms) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {effectiveRoomList.map((room) => {
          const roomQueue = patients.filter(p => p.targetRoomId === room.id && p.status === 'aguardando');
          const currentPatient = patients.find(p => p.targetRoomId === room.id && (p.status === 'em_atendimento' || p.status === 'chamado'));
          const assignedDoc = users.find(u => u.active && u.assignedRoomId === room.id && (u.role === 'medico' || u.role === 'dentista' || u.role === 'enfermeiro'));
          const docName = assignedDoc ? assignedDoc.name : (room.defaultDoctor || 'Plantão');

          return (
            <div
              key={room.id}
              onClick={() => setRoomFilter(roomFilter === room.id ? 'all' : room.id)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                roomFilter === room.id
                  ? 'bg-blue-50/90 border-blue-500 shadow-md shadow-blue-100 ring-2 ring-blue-500/20'
                  : 'bg-white border-sky-100 hover:border-blue-200 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg ${room.badgeBg} ${room.badgeText}`}>
                  {room.prefix}
                </span>
                <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {roomQueue.length} na fila
                </span>
              </div>

              <h3 className="font-black text-sm text-slate-800 line-clamp-1">{room.name}</h3>
              <p className="text-[11px] font-semibold text-slate-400 line-clamp-1">{room.subname}</p>
              <p className="text-[11px] font-bold text-blue-700 line-clamp-1 mt-0.5">{docName}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                {currentPatient ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="truncate">{currentPatient.name.split(' ')[0]}</span>
                    <span className="font-mono text-[10px] text-emerald-600 font-black">({currentPatient.ticketNumber})</span>
                  </div>
                ) : (
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Consultório Livre
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-patients"
              type="text"
              placeholder="Buscar por nome, senha (ex: CLI-014) ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-sky-50/60 border border-sky-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              <Filter className="w-3.5 h-3.5" /> Sala:
            </div>
            <select
              id="select-filter-room"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value as RoomId | 'all')}
              className="text-xs font-bold bg-sky-50/60 border border-sky-100 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Salas ({effectiveRoomList.length})</option>
              {effectiveRoomList.map(r => (
                <option key={r.id} value={r.id}>{r.name} - {r.subname}</option>
              ))}
            </select>

            <select
              id="select-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-sky-50/60 border border-sky-100 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="aguardando">Aguardando</option>
              <option value="chamado">Chamado</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="concluido">Concluído</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Patient Queue Table */}
      <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-black text-base text-slate-800">
              Fila Geral de Atendimento
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
              {filteredPatients.length} pacientes listados
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sky-50/70 text-slate-500 font-bold uppercase text-[11px] border-b border-sky-100">
              <tr>
                <th className="px-5 py-3.5">Senha</th>
                <th className="px-5 py-3.5">Posto / Paciente</th>
                <th className="px-5 py-3.5">RE / OPM</th>
                <th className="px-5 py-3.5">Consultório / Destino</th>
                <th className="px-5 py-3.5">Prioridade</th>
                <th className="px-5 py-3.5">Tempo Espera</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const room = effectiveRooms[patient.targetRoomId] || ROOMS[patient.targetRoomId];
                  return (
                    <tr 
                      key={patient.id} 
                      className={`hover:bg-sky-50/40 transition-colors ${
                        patient.status === 'chamado' ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Ticket */}
                      <td className="px-5 py-4 font-mono font-black text-sm text-blue-700 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200">
                          {patient.ticketNumber}
                        </span>
                      </td>

                      {/* Rank & Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {patient.rank && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-800 text-white tracking-wider">
                              {patient.rank}
                            </span>
                          )}
                          <span className="font-bold text-slate-900">
                            {patient.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          {patient.age && <span>{patient.age} anos</span>}
                          {patient.gender && <span>• {patient.gender === 'M' ? 'Masc' : patient.gender === 'F' ? 'Fem' : patient.gender}</span>}
                          <span>• {patient.insurance || 'CMed / CBPM'}</span>
                        </div>
                        {patient.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                            "{patient.notes}"
                          </p>
                        )}
                      </td>

                      {/* RE & OPM */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-800 text-xs">
                          RE: {patient.re || patient.document}
                        </div>
                        <div className="text-[11px] font-bold text-blue-600 mt-0.5">
                          OPM: {patient.opm || 'ESSgt'}
                        </div>
                      </td>

                      {/* Room */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">
                          {room?.name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {room?.subname}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getPriorityBadge(patient.priority)}
                      </td>

                      {/* Wait Time */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {patient.status === 'concluido' ? (
                          <span className="text-xs text-slate-400 font-semibold">Finalizado</span>
                        ) : (
                          getWaitDuration(patient.registeredAt)
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Call Button (Triggers Voice & Chime) */}
                          <button
                            id={`btn-reception-call-${patient.id}`}
                            onClick={() => callPatient(patient.id)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors shadow-xs"
                            title="Chamar Paciente no Painel da TV"
                          >
                            <Volume2 className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          {/* Transfer Room */}
                          <button
                            id={`btn-reception-transfer-${patient.id}`}
                            onClick={() => {
                              setTransferTargetId(patient.id);
                              setSelectedNewRoom(patient.targetRoomId);
                            }}
                            className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-200 transition-colors"
                            title="Transferir de Consultório"
                          >
                            <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          {/* Print ticket */}
                          <button
                            id={`btn-reception-print-${patient.id}`}
                            onClick={() => setCreatedTicket(patient)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="Ver / Imprimir Senha"
                          >
                            <Printer className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          {/* Cancel / Delete */}
                          <button
                            id={`btn-reception-delete-${patient.id}`}
                            onClick={() => setPatientToDelete(patient)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Excluir ou Cancelar Paciente"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                    Nenhum paciente encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-200 shrink-0">
                <UserPlus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Cadastrar Paciente na Fila da <span className="text-red-600">U.I.S.</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Preencha os dados militares do paciente para emissão imediata da senha.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Row 1: Posto / Graduação + RE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Posto / Graduação *
                  </label>
                  <select
                    id="modal-select-rank"
                    value={rank}
                    onChange={(e) => setRank(e.target.value as MilitaryRank)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  >
                    {availableRanks.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    RE (999999-9) *
                  </label>
                  <input
                    id="modal-input-re"
                    type="text"
                    required
                    placeholder="999999-9"
                    maxLength={8}
                    value={re}
                    onChange={handleReChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <input
                  id="modal-input-name"
                  type="text"
                  required
                  placeholder="Ex: João Carlos da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>

              {/* Row 3: Idade, Sexo & OPM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Idade
                  </label>
                  <input
                    id="modal-input-age"
                    type="number"
                    min={0}
                    max={120}
                    placeholder="Ex: 34"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <select
                    id="modal-select-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'Outro')}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    OPM (Unidade) *
                  </label>
                  <select
                    id="modal-select-opm"
                    value={opm}
                    onChange={(e) => setOpm(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700"
                  >
                    {availableOpms.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom OPM input if 'Outra OPM' selected */}
              {opm === 'Outra OPM' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Especifique a OPM
                  </label>
                  <input
                    id="modal-input-custom-opm"
                    type="text"
                    required
                    placeholder="Ex: 45º BPM/I, CAvPM, Gab Cmt Geral..."
                    value={customOpm}
                    onChange={(e) => setCustomOpm(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              )}

              {/* Row 4: Consultório de Destino */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Consultório de Atendimento *
                </label>
                <select
                  id="modal-select-room"
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value as RoomId)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                >
                  <option value="consultorio_01">Consultório 01 - Clínico Geral (Prefixo: CLI)</option>
                  <option value="consultorio_02">Consultório 02 - Especialidades Médicas (Prefixo: ESP)</option>
                  <option value="medicacao">Sala de Medicação & Procedimentos (Prefixo: MED)</option>
                  <option value="odonto_01">Odontológico 01 - Geral & Estética (Prefixo: OD1)</option>
                  <option value="odonto_02">Odontológico 02 - Cirurgia & Canal (Prefixo: OD2)</option>
                </select>
              </div>

              {/* Row 5: Prioridade & Convênio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Classificação de Prioridade
                  </label>
                  <select
                    id="modal-select-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="normal">Normal (Ordem de Chegada)</option>
                    <option value="preferencial">Preferencial (Idoso, Gestante, PCD)</option>
                    <option value="urgente">Urgência Clínica (Prioridade Máxima)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assistência à Saúde
                  </label>
                  <select
                    id="modal-select-insurance"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {availableInsurances.map((ins) => (
                      <option key={ins} value={ins}>
                        {ins}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Queixa Principal / Observações */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Queixa Principal / Observações
                </label>
                <textarea
                  id="modal-textarea-notes"
                  rows={2}
                  placeholder="Ex: Cefaleia intensa durante o serviço, aferição de PA, curativo em MID, atendimento odontológico de rotina..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  id="btn-submit-patient-register"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Emitir Senha & Inserir na Fila
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Ticket Voucher Modal (Simulates Physical Receipt) */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setCreatedTicket(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
              ESSgt • <span className="text-red-600 font-bold">UIS</span> • Comprovante de Senha
            </span>

            {/* Huge Password */}
            <div className="my-3 p-4 bg-slate-900 text-white rounded-2xl shadow-inner">
              <span className="text-xs text-blue-400 uppercase font-bold block mb-1">
                Sua Senha
              </span>
              <span className="text-4xl font-mono font-black tracking-wider text-white">
                {createdTicket.ticketNumber}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
              <p>
                <strong>Posto / Paciente:</strong> {createdTicket.rank ? `${createdTicket.rank} ` : ''}{createdTicket.name}
              </p>
              <p>
                <strong>RE:</strong> {createdTicket.re || createdTicket.document} • <strong>OPM:</strong> {createdTicket.opm || 'ESSgt'}
              </p>
              <p>
                <strong>Destino:</strong> {effectiveRooms[createdTicket.targetRoomId]?.name || ROOMS[createdTicket.targetRoomId]?.name} ({effectiveRooms[createdTicket.targetRoomId]?.subname || ROOMS[createdTicket.targetRoomId]?.subname})
              </p>
              <p>
                <strong>Prioridade:</strong> <span className="capitalize font-bold">{createdTicket.priority}</span>
              </p>
              <p>
                <strong>Emissão:</strong> {new Date(createdTicket.registeredAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              Aguarde na sala de espera. O número da sua senha será anunciado no painel visual e sonoro da TV.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCreatedTicket(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Room Modal */}
      {transferTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Transferir Paciente para Outra Sala
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Selecione o novo consultório de destino. A prioridade e posição serão ajustadas.
            </p>

            <select
              value={selectedNewRoom}
              onChange={(e) => setSelectedNewRoom(e.target.value as RoomId)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl mb-4 font-semibold"
            >
              {effectiveRoomList.map(r => (
                <option key={r.id} value={r.id}>{r.name} - {r.subname}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTransferTargetId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  transferPatient(transferTargetId, selectedNewRoom);
                  setTransferTargetId(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs"
              >
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete / Cancel Patient from Queue */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Remover ou Cancelar Paciente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Senha: <strong className="font-mono text-blue-700">{patientToDelete.ticketNumber}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPatientToDelete(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <p className="font-bold text-slate-800 text-sm">{patientToDelete.name}</p>
                <p className="text-slate-500">
                  RE: <span className="font-mono font-bold text-slate-700">{patientToDelete.re}</span> | Posto: <span className="font-bold text-slate-700">{patientToDelete.rank}</span> | OPM: <span className="font-bold text-slate-700">{patientToDelete.opm}</span>
                </p>
                <p className="text-slate-500">
                  Destino: <span className="font-bold text-blue-700">{effectiveRoomList.find(r => r.id === patientToDelete.targetRoomId)?.name || patientToDelete.targetRoomId}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Escolha o tipo de remoção desejada para este paciente:
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  deletePatient(patientToDelete.id);
                  setPatientToDelete(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-rose-200 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Definitivamente do Sistema
              </button>

              <button
                type="button"
                onClick={() => {
                  cancelPatient(patientToDelete.id);
                  setPatientToDelete(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-amber-200 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                Marcar como Cancelado (Manter Histórico)
              </button>

              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-colors text-center mt-1"
              >
                Voltar / Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
