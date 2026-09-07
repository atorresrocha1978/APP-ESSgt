import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Plus, 
  Edit3, 
  Trash2, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Smile, 
  Syringe, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Save, 
  X,
  Phone,
  Mail,
  UserCheck,
  RotateCcw,
  Activity,
  Layers
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { RoomConfig, RoomCategory, RoomId, MilitaryRank, Priority, Patient } from '../types';
import { AdminUsersView } from './AdminUsersView';

type AdminTab = 'consultorios' | 'usuarios' | 'pacientes';

export const AdminDashboardView: React.FC = () => {
  const { 
    roomList, 
    rooms, 
    addRoom, 
    updateRoom, 
    deleteRoom, 
    testRoomSound,
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    callPatient
  } = useClinic();

  const [activeSubTab, setActiveSubTab] = useState<AdminTab>('consultorios');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // ==========================================
  // 1. CONSULTÓRIOS STATE & LOGIC
  // ==========================================
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState<{
    id: string;
    name: string;
    subname: string;
    description: string;
    category: RoomCategory;
    prefix: string;
    colorName: string;
    defaultDoctor: string;
    soundType: string;
  }>({
    id: '',
    name: '',
    subname: '',
    description: '',
    category: 'clinico',
    prefix: 'CLI',
    colorName: 'blue',
    defaultDoctor: 'Médico(a) de Plantão',
    soundType: 'clinico'
  });

  const handleOpenAddRoom = () => {
    const nextIndex = roomList.length + 1;
    setEditingRoomId(null);
    setRoomFormData({
      id: `consultorio_0${nextIndex}`,
      name: `Consultório 0${nextIndex}`,
      subname: 'Clínica Geral',
      description: 'Atendimento e consultas ambulatoriais',
      category: 'clinico',
      prefix: 'CLI',
      colorName: 'blue',
      defaultDoctor: 'Médico(a) de Plantão',
      soundType: 'clinico'
    });
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: RoomConfig) => {
    setEditingRoomId(room.id);
    setRoomFormData({
      id: room.id,
      name: room.name,
      subname: room.subname,
      description: room.description || '',
      category: room.category,
      prefix: room.prefix,
      colorName: room.colorName || 'blue',
      defaultDoctor: room.defaultDoctor || 'Profissional de Saúde',
      soundType: room.soundType || 'clinico'
    });
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name.trim() || !roomFormData.prefix.trim()) {
      alert('Por favor, informe o nome e o prefixo do consultório.');
      return;
    }

    const getColorClasses = (color: string) => {
      switch (color) {
        case 'emerald':
        case 'green':
          return { bgLight: 'bg-emerald-50', borderLight: 'border-emerald-200', textDark: 'text-emerald-900', badgeBg: 'bg-emerald-600', badgeText: 'text-white', glowColor: 'rgba(16, 185, 129, 0.4)' };
        case 'purple':
          return { bgLight: 'bg-purple-50', borderLight: 'border-purple-200', textDark: 'text-purple-900', badgeBg: 'bg-purple-600', badgeText: 'text-white', glowColor: 'rgba(147, 51, 234, 0.4)' };
        case 'orange':
        case 'amber':
          return { bgLight: 'bg-amber-50', borderLight: 'border-amber-200', textDark: 'text-amber-900', badgeBg: 'bg-amber-600', badgeText: 'text-white', glowColor: 'rgba(217, 119, 6, 0.4)' };
        case 'rose':
        case 'red':
          return { bgLight: 'bg-rose-50', borderLight: 'border-rose-200', textDark: 'text-rose-900', badgeBg: 'bg-rose-600', badgeText: 'text-white', glowColor: 'rgba(225, 29, 72, 0.4)' };
        case 'teal':
        case 'cyan':
          return { bgLight: 'bg-teal-50', borderLight: 'border-teal-200', textDark: 'text-teal-900', badgeBg: 'bg-teal-600', badgeText: 'text-white', glowColor: 'rgba(13, 148, 136, 0.4)' };
        default:
          return { bgLight: 'bg-blue-50', borderLight: 'border-blue-200', textDark: 'text-blue-900', badgeBg: 'bg-blue-600', badgeText: 'text-white', glowColor: 'rgba(37, 99, 235, 0.4)' };
      }
    };

    const colorClasses = getColorClasses(roomFormData.colorName);

    if (editingRoomId) {
      updateRoom(editingRoomId, {
        name: roomFormData.name.trim(),
        subname: roomFormData.subname.trim(),
        description: roomFormData.description.trim(),
        category: roomFormData.category,
        prefix: roomFormData.prefix.trim().toUpperCase(),
        colorName: roomFormData.colorName,
        defaultDoctor: roomFormData.defaultDoctor.trim(),
        soundType: roomFormData.soundType,
        ...colorClasses
      });
      showToast(`Consultório "${roomFormData.name}" atualizado com sucesso!`);
    } else {
      addRoom({
        id: roomFormData.id.trim() || `sala_${Date.now()}`,
        name: roomFormData.name.trim(),
        subname: roomFormData.subname.trim(),
        description: roomFormData.description.trim(),
        category: roomFormData.category,
        prefix: roomFormData.prefix.trim().toUpperCase(),
        colorName: roomFormData.colorName,
        defaultDoctor: roomFormData.defaultDoctor.trim(),
        soundType: roomFormData.soundType,
        icon: roomFormData.category === 'odonto' ? 'Smile' : roomFormData.category === 'medicacao' ? 'Syringe' : 'Stethoscope',
        ...colorClasses
      });
      showToast(`Novo consultório "${roomFormData.name}" cadastrado com sucesso!`);
    }

    setIsRoomModalOpen(false);
  };

  const handleDeleteRoom = (room: RoomConfig) => {
    if (roomList.length <= 1) {
      alert('Não é possível excluir o único consultório do sistema.');
      return;
    }
    if (window.confirm(`Tem certeza que deseja excluir o consultório "${room.name}"?`)) {
      deleteRoom(room.id);
      showToast(`Consultório "${room.name}" removido.`);
    }
  };

  // ==========================================
  // 2. CADASTRO DE PACIENTE STATE & LOGIC
  // ==========================================
  const [patientForm, setPatientForm] = useState<{
    rank: MilitaryRank | 'Civil';
    re: string;
    name: string;
    document: string;
    age: string;
    gender: 'M' | 'F' | 'Outro';
    opm: string;
    priority: Priority;
    targetRoomId: RoomId;
    insurance: string;
    notes: string;
  }>({
    rank: 'Sd PM',
    re: '',
    name: '',
    document: '',
    age: '',
    gender: 'M',
    opm: 'ESSgt',
    priority: 'normal',
    targetRoomId: roomList[0]?.id || 'consultorio_01',
    insurance: 'CMed / CBPM',
    notes: ''
  });

  const [patientSearch, setPatientSearch] = useState('');
  const [patientFilterRoom, setPatientFilterRoom] = useState('all');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name.trim()) {
      alert('Por favor, informe o nome do paciente.');
      return;
    }

    const created = addPatient({
      rank: patientForm.rank,
      re: patientForm.re.trim() || (patientForm.rank === 'Civil' ? 'CIVIL' : '000000-0'),
      name: patientForm.name.trim(),
      document: patientForm.document.trim() || patientForm.re.trim() || '---',
      age: patientForm.age ? parseInt(patientForm.age, 10) : undefined,
      gender: patientForm.gender,
      opm: patientForm.opm.trim() || 'ESSgt',
      priority: patientForm.priority,
      targetRoomId: patientForm.targetRoomId,
      insurance: patientForm.insurance.trim() || 'CMed / CBPM',
      notes: patientForm.notes.trim()
    });

    showToast(`Paciente ${created.name} (${created.ticketNumber}) cadastrado com sucesso na fila!`);

    // Reset form
    setPatientForm({
      rank: 'Sd PM',
      re: '',
      name: '',
      document: '',
      age: '',
      gender: 'M',
      opm: 'ESSgt',
      priority: 'normal',
      targetRoomId: roomList[0]?.id || 'consultorio_01',
      insurance: 'CMed / CBPM',
      notes: ''
    });
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    updatePatient(editingPatient.id, {
      name: editingPatient.name,
      rank: editingPatient.rank,
      re: editingPatient.re,
      opm: editingPatient.opm,
      priority: editingPatient.priority,
      targetRoomId: editingPatient.targetRoomId,
      notes: editingPatient.notes
    });

    showToast(`Dados do paciente ${editingPatient.name} atualizados.`);
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.ticketNumber.toLowerCase().includes(patientSearch.toLowerCase()) ||
      (p.re && p.re.toLowerCase().includes(patientSearch.toLowerCase())) ||
      (p.opm && p.opm.toLowerCase().includes(patientSearch.toLowerCase()));

    const matchRoom = patientFilterRoom === 'all' || p.targetRoomId === patientFilterRoom;
    return matchSearch && matchRoom;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Painel Geral de Administração da UIS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Central de Gestão e Configurações
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Controle centralizado: gerencie consultórios e salas de atendimento, cadastre e edite profissionais do corpo de saúde, e registre pacientes militares e civis.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-purple-900/40 border border-purple-800/60 rounded-2xl p-4 text-center min-w-[110px]">
              <span className="text-xs text-purple-300 font-bold block">Consultórios</span>
              <span className="text-2xl font-black text-white">{roomList.length}</span>
            </div>
            <div className="bg-purple-900/40 border border-purple-800/60 rounded-2xl p-4 text-center min-w-[110px]">
              <span className="text-xs text-purple-300 font-bold block">Pacientes Ativos</span>
              <span className="text-2xl font-black text-emerald-400">{patients.length}</span>
            </div>
          </div>
        </div>

        {/* Segmented Tab Navigation for Admin Sub-Modules */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-purple-900/50 overflow-x-auto">
          <button
            id="admin-tab-consultorios"
            onClick={() => setActiveSubTab('consultorios')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'consultorios'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Criar e Editar Consultórios</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              {roomList.length}
            </span>
          </button>

          <button
            id="admin-tab-usuarios"
            onClick={() => setActiveSubTab('usuarios')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'usuarios'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Criar e Gerenciar Usuários</span>
          </button>

          <button
            id="admin-tab-pacientes"
            onClick={() => setActiveSubTab('pacientes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'pacientes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>3. Cadastro de Paciente</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              {patients.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CRIAR E EDITAR CONSULTÓRIOS */}
      {/* ========================================================================= */}
      {activeSubTab === 'consultorios' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Consultórios e Salas de Atendimento da UIS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Crie novas salas de atendimento, altere especialidades, siglas de senhas e configure profissionais responsáveis.
              </p>
            </div>

            <button
              id="btn-add-new-room"
              onClick={handleOpenAddRoom}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Consultório
            </button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roomList.map((room) => {
              const currentInRoom = patients.filter(p => p.targetRoomId === room.id && p.status === 'aguardando').length;
              
              return (
                <div 
                  key={room.id}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-purple-300 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                        Prefixo: {room.prefix}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-600 capitalize">
                        {room.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {room.name}
                    </h3>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">
                      {room.subname}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {room.description || 'Consultório preparado para consultas e atendimentos clínicos.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Responsável:</span>
                        <strong className="text-slate-800 truncate max-w-[180px]">{room.defaultDoctor || 'Plantão'}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Pacientes na Fila:</span>
                        <span className="font-bold text-emerald-600">{currentInRoom} aguardando</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Som de Chamada:</span>
                        <span className="font-mono text-[11px] uppercase text-slate-500">{room.soundType || 'Padrão'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => testRoomSound(room.id)}
                      title="Testar som desta sala"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Som</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditRoom(room)}
                        className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Editar consultório"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Excluir consultório"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal: Create or Edit Room */}
          {isRoomModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    {editingRoomId ? 'Editar Consultório' : 'Criar Novo Consultório'}
                  </h3>
                  <button 
                    onClick={() => setIsRoomModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveRoom} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome da Sala *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomFormData.name}
                        onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                        placeholder="Ex: Consultório 03"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prefixo da Senha *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={roomFormData.prefix}
                        onChange={(e) => setRoomFormData({ ...roomFormData, prefix: e.target.value.toUpperCase() })}
                        placeholder="Ex: CLI, MED, OD3"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-black text-purple-700 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Especialidade / Subtítulo
                      </label>
                      <input
                        type="text"
                        value={roomFormData.subname}
                        onChange={(e) => setRoomFormData({ ...roomFormData, subname: e.target.value })}
                        placeholder="Ex: Cardiologia / Clínica"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Categoria da Sala
                      </label>
                      <select
                        value={roomFormData.category}
                        onChange={(e) => setRoomFormData({ ...roomFormData, category: e.target.value as RoomCategory })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="clinico">Clínico / Médico</option>
                        <option value="odonto">Odontológico</option>
                        <option value="medicacao">Medicação / Enfermagem</option>
                        <option value="geral">Geral / Procedimentos</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Profissional de Plantão Responsável
                    </label>
                    <input
                      type="text"
                      value={roomFormData.defaultDoctor}
                      onChange={(e) => setRoomFormData({ ...roomFormData, defaultDoctor: e.target.value })}
                      placeholder="Ex: Cap PM Dr. Oliveira"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tema de Cor
                      </label>
                      <select
                        value={roomFormData.colorName}
                        onChange={(e) => setRoomFormData({ ...roomFormData, colorName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="blue">Azul (Padrão Médico)</option>
                        <option value="emerald">Verde Esmeralda</option>
                        <option value="purple">Roxo / Violeta</option>
                        <option value="amber">Âmbar / Laranja</option>
                        <option value="rose">Rosa / Vermelho</option>
                        <option value="teal">Verde-Água / Ciano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tipo de Som
                      </label>
                      <select
                        value={roomFormData.soundType}
                        onChange={(e) => setRoomFormData({ ...roomFormData, soundType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="clinico">Clínico (Harmônico 3 Beeps)</option>
                        <option value="odonto">Odontológico (Suave 4 Notas)</option>
                        <option value="medicacao">Medicação (Alerta Clínico)</option>
                        <option value="geral">Geral / Padrão</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descrição / Finalidade
                    </label>
                    <textarea
                      rows={2}
                      value={roomFormData.description}
                      onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                      placeholder="Descrição breve das atividades realizadas nesta sala..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsRoomModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingRoomId ? 'Atualizar Consultório' : 'Salvar Consultório'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CRIAR E GERENCIAR USUÁRIOS */}
      {/* ========================================================================= */}
      {activeSubTab === 'usuarios' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Directly embed AdminUsersView which has the full user CRUD already configured */}
          <AdminUsersView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: CADASTRO DE PACIENTE */}
      {/* ========================================================================= */}
      {activeSubTab === 'pacientes' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Patient Registration Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                  Novo Cadastro de Paciente
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cadastre policiais militares e dependentes civis para atendimento imediato na Unidade Integrada de Saúde.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Posto / Graduação *
                  </label>
                  <select
                    value={patientForm.rank}
                    onChange={(e) => setPatientForm({ ...patientForm, rank: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Cel">Cel PM</option>
                    <option value="Ten Cel">Ten Cel PM</option>
                    <option value="Maj">Maj PM</option>
                    <option value="Cap">Cap PM</option>
                    <option value="1º Ten">1º Ten PM</option>
                    <option value="2º Ten">2º Ten PM</option>
                    <option value="Subten">Subten PM</option>
                    <option value="1º Sgt">1º Sgt PM</option>
                    <option value="2º Sgt">2º Sgt PM</option>
                    <option value="3º Sgt">3º Sgt PM</option>
                    <option value="Cb PM">Cb PM</option>
                    <option value="Sd PM">Sd PM</option>
                    <option value="Al Of">Al Of PM</option>
                    <option value="Al Sgt">Al Sgt PM</option>
                    <option value="Civil">Dependente Civil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    RE Militar / Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.re}
                    onChange={(e) => setPatientForm({ ...patientForm, re: e.target.value })}
                    placeholder="Ex: 123456-7 ou RG civil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OPM / Unidade Militar
                  </label>
                  <input
                    type="text"
                    value={patientForm.opm}
                    onChange={(e) => setPatientForm({ ...patientForm, opm: e.target.value })}
                    placeholder="Ex: ESSgt, 1º BPChq, CPA/M"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Classificação de Prioridade
                  </label>
                  <select
                    value={patientForm.priority}
                    onChange={(e) => setPatientForm({ ...patientForm, priority: e.target.value as Priority })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="normal">Normal (Ordem de Chegada)</option>
                    <option value="preferencial">Preferencial (Idoso / Lei 10.048)</option>
                    <option value="urgente">Urgência / Emergência Médica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consultório de Destino *
                  </label>
                  <select
                    value={patientForm.targetRoomId}
                    onChange={(e) => setPatientForm({ ...patientForm, targetRoomId: e.target.value as RoomId })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {roomList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} • {r.subname} ({r.prefix})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Convênio / Assistência
                  </label>
                  <input
                    type="text"
                    value={patientForm.insurance}
                    onChange={(e) => setPatientForm({ ...patientForm, insurance: e.target.value })}
                    placeholder="CMed / CBPM ou Cruz Azul"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações / Queixa Principal (Opcional)
                </label>
                <input
                  type="text"
                  value={patientForm.notes}
                  onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                  placeholder="Ex: Cefaleia intensa, troca de curativo, exame admissional..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md shadow-purple-200 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Cadastrar e Enviar para a Fila
                </button>
              </div>
            </form>
          </div>

          {/* Registered Patients Directory */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Base de Pacientes em Atendimento
                </h3>
                <p className="text-xs text-slate-500">
                  Total de {patients.length} pacientes registrados no sistema no momento.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Buscar nome, RE, senha..."
                    className="pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={patientFilterRoom}
                  onChange={(e) => setPatientFilterRoom(e.target.value)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
                >
                  <option value="all">Todos Consultórios</option>
                  {roomList.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Senha</th>
                    <th className="py-3 px-4">Paciente</th>
                    <th className="py-3 px-4">RE / OPM</th>
                    <th className="py-3 px-4">Consultório</th>
                    <th className="py-3 px-4">Prioridade</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => {
                      const room = rooms[p.targetRoomId];
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-black text-slate-900 text-sm">
                            {p.ticketNumber}
                          </td>
                          <td className="py-3 px-4">
                            <strong className="text-slate-800 font-bold block">{p.name}</strong>
                            <span className="text-[11px] text-slate-500">{p.rank || 'Militar'}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            <div>RE: {p.re || '---'}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{p.opm || 'ESSgt'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block">{room?.name || p.targetRoomId}</span>
                            <span className="text-[10px] text-slate-400">{room?.subname}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                              p.priority === 'urgente' ? 'bg-rose-100 text-rose-700' :
                              p.priority === 'preferencial' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {p.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                              p.status === 'aguardando' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              p.status === 'em_atendimento' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {p.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => callPatient(p.id)}
                                title="Chamar paciente agora"
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingPatient(p)}
                                title="Editar dados"
                                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Remover paciente ${p.name} da lista?`)) {
                                    deletePatient(p.id);
                                    showToast(`Paciente ${p.name} removido.`);
                                  }
                                }}
                                title="Excluir paciente"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        Nenhum paciente encontrado com os filtros informados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal: Edit Patient */}
          {editingPatient && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-900">
                    Editar Cadastro do Paciente
                  </h3>
                  <button 
                    onClick={() => setEditingPatient(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePatient} className="space-y-4 mt-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={editingPatient.name}
                      onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">RE Militar</label>
                      <input
                        type="text"
                        value={editingPatient.re || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, re: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">OPM</label>
                      <input
                        type="text"
                        value={editingPatient.opm || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, opm: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Consultório</label>
                      <select
                        value={editingPatient.targetRoomId}
                        onChange={(e) => setEditingPatient({ ...editingPatient, targetRoomId: e.target.value as RoomId })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                      >
                        {roomList.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Prioridade</label>
                      <select
                        value={editingPatient.priority}
                        onChange={(e) => setEditingPatient({ ...editingPatient, priority: e.target.value as Priority })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="normal">Normal</option>
                        <option value="preferencial">Preferencial</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPatient(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
