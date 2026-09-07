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
  Layers,
  Award,
  Shield,
  HeartPulse,
  Check,
  Bookmark
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { RoomConfig, RoomCategory, RoomId, MilitaryRank, Priority, Patient } from '../types';
import { AdminUsersView } from './AdminUsersView';

type AdminTab = 'consultorios' | 'usuarios' | 'pacientes' | 'tabelas_apoio';

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
    callPatient,
    militaryRanks,
    addMilitaryRank,
    updateMilitaryRank,
    deleteMilitaryRank,
    opms,
    addOpm,
    updateOpm,
    deleteOpm,
    healthInsurances,
    addHealthInsurance,
    updateHealthInsurance,
    deleteHealthInsurance
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

  // Confirmation Modals State
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<RoomConfig | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'rank' | 'opm' | 'insurance'; name: string } | null>(null);

  const handleDeleteRoom = (room: RoomConfig) => {
    if (roomList.length <= 1) {
      showToast('Não é possível excluir o único consultório do sistema.');
      return;
    }
    setRoomToDelete(room);
  };

  // ==========================================
  // 2. CADASTRO DE PACIENTE STATE & LOGIC
  // ==========================================
  const [patientForm, setPatientForm] = useState<{
    rank: string;
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

  // Quick inline creation state for patient registration form
  const [isAddingCustomRank, setIsAddingCustomRank] = useState(false);
  const [newRankInput, setNewRankInput] = useState('');

  const [isAddingCustomOpm, setIsAddingCustomOpm] = useState(false);
  const [newOpmInput, setNewOpmInput] = useState('');

  const [isAddingCustomInsurance, setIsAddingCustomInsurance] = useState(false);
  const [newInsuranceInput, setNewInsuranceInput] = useState('');

  // Support table management sub-tab states (Postos, OPMs, Assistência à Saúde)
  const [supportSearch, setSupportSearch] = useState('');
  const [editingRankItem, setEditingRankItem] = useState<{ oldName: string; newName: string } | null>(null);
  const [editingOpmItem, setEditingOpmItem] = useState<{ oldName: string; newName: string } | null>(null);
  const [editingInsuranceItem, setEditingInsuranceItem] = useState<{ oldName: string; newName: string } | null>(null);

  const [supportNewRank, setSupportNewRank] = useState('');
  const [supportNewOpm, setSupportNewOpm] = useState('');
  const [supportNewInsurance, setSupportNewInsurance] = useState('');

  const [patientSearch, setPatientSearch] = useState('');
  const [patientFilterRoom, setPatientFilterRoom] = useState('all');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Quick addition handlers
  const handleQuickAddRank = () => {
    const val = newRankInput.trim();
    if (!val) return;
    addMilitaryRank(val);
    setPatientForm(prev => ({ ...prev, rank: val }));
    setNewRankInput('');
    setIsAddingCustomRank(false);
    showToast(`Posto/Graduação "${val}" criado com sucesso.`);
  };

  const handleQuickAddOpm = () => {
    const val = newOpmInput.trim();
    if (!val) return;
    addOpm(val);
    setPatientForm(prev => ({ ...prev, opm: val }));
    setNewOpmInput('');
    setIsAddingCustomOpm(false);
    showToast(`OPM "${val}" criada com sucesso.`);
  };

  const handleQuickAddInsurance = () => {
    const val = newInsuranceInput.trim();
    if (!val) return;
    addHealthInsurance(val);
    setPatientForm(prev => ({ ...prev, insurance: val }));
    setNewInsuranceInput('');
    setIsAddingCustomInsurance(false);
    showToast(`Assistência à Saúde "${val}" criada com sucesso.`);
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name.trim()) {
      alert('Por favor, informe o nome do paciente.');
      return;
    }

    const finalRank = patientForm.rank.trim() || 'Sd PM';
    const finalOpm = patientForm.opm.trim() || 'ESSgt';
    const finalInsurance = patientForm.insurance.trim() || 'CMed / CBPM';

    // Auto register custom values if not in list
    if (finalRank && !militaryRanks.includes(finalRank)) {
      addMilitaryRank(finalRank);
    }
    if (finalOpm && !opms.includes(finalOpm)) {
      addOpm(finalOpm);
    }
    if (finalInsurance && !healthInsurances.includes(finalInsurance)) {
      addHealthInsurance(finalInsurance);
    }

    const created = addPatient({
      rank: finalRank,
      re: patientForm.re.trim() || (finalRank === 'Civil' ? 'CIVIL' : '000000-0'),
      name: patientForm.name.trim(),
      document: patientForm.document.trim() || patientForm.re.trim() || '---',
      age: patientForm.age ? parseInt(patientForm.age, 10) : undefined,
      gender: patientForm.gender,
      opm: finalOpm,
      priority: patientForm.priority,
      targetRoomId: patientForm.targetRoomId,
      insurance: finalInsurance,
      notes: patientForm.notes.trim()
    });

    showToast(`Paciente ${created.name} (${created.ticketNumber}) cadastrado com sucesso na fila!`);

    // Reset form
    setPatientForm({
      rank: militaryRanks[0] || 'Sd PM',
      re: '',
      name: '',
      document: '',
      age: '',
      gender: 'M',
      opm: opms[0] || 'ESSgt',
      priority: 'normal',
      targetRoomId: roomList[0]?.id || 'consultorio_01',
      insurance: healthInsurances[0] || 'CMed / CBPM',
      notes: ''
    });
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    const finalRank = editingPatient.rank?.trim() || 'Sd PM';
    const finalOpm = editingPatient.opm?.trim() || 'ESSgt';
    const finalInsurance = editingPatient.insurance?.trim() || 'CMed / CBPM';

    if (finalRank && !militaryRanks.includes(finalRank)) {
      addMilitaryRank(finalRank);
    }
    if (finalOpm && !opms.includes(finalOpm)) {
      addOpm(finalOpm);
    }
    if (finalInsurance && !healthInsurances.includes(finalInsurance)) {
      addHealthInsurance(finalInsurance);
    }

    updatePatient(editingPatient.id, {
      name: editingPatient.name,
      rank: finalRank,
      re: editingPatient.re,
      opm: finalOpm,
      insurance: finalInsurance,
      priority: editingPatient.priority,
      targetRoomId: editingPatient.targetRoomId,
      status: editingPatient.status,
      notes: editingPatient.notes
    });

    showToast(`Dados do paciente ${editingPatient.name} atualizados com sucesso.`);
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

          <button
            id="admin-tab-tabelas-apoio"
            onClick={() => setActiveSubTab('tabelas_apoio')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tabelas_apoio'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Postos, OPMs & Assistência à Saúde</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              {militaryRanks.length + opms.length + healthInsurances.length}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                  Novo Cadastro de Paciente
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cadastre policiais militares e dependentes civis para atendimento imediato na Unidade Integrada de Saúde.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('tabelas_apoio')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Layers className="w-3.5 h-3.5" />
                Gerenciar Lista de Postos, OPMs e Convênios
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Posto / Graduação */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Posto / Graduação *
                    </label>
                    {!isAddingCustomRank && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomRank(true)}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                      >
                        + Criar Novo
                      </button>
                    )}
                  </div>

                  {isAddingCustomRank ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newRankInput}
                        onChange={(e) => setNewRankInput(e.target.value)}
                        placeholder="Ex: Aluno CFO"
                        className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs font-bold text-purple-950 bg-purple-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddRank}
                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        title="Salvar Posto"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomRank(false);
                          setNewRankInput('');
                        }}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-xs cursor-pointer"
                        title="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={patientForm.rank}
                      onChange={(e) => {
                        if (e.target.value === '__NEW_RANK__') {
                          setIsAddingCustomRank(true);
                        } else {
                          setPatientForm({ ...patientForm, rank: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {militaryRanks.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                      <option value="__NEW_RANK__" className="font-bold text-purple-600">
                        + Cadastrar Novo Posto / Graduação...
                      </option>
                    </select>
                  )}
                </div>

                {/* RE Militar / Documento */}
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

                {/* Nome Completo */}
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
                {/* OPM / Unidade */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      OPM / Unidade Militar *
                    </label>
                    {!isAddingCustomOpm && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomOpm(true)}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                      >
                        + Criar Nova
                      </button>
                    )}
                  </div>

                  {isAddingCustomOpm ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newOpmInput}
                        onChange={(e) => setNewOpmInput(e.target.value)}
                        placeholder="Ex: 45º BPM/I"
                        className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs font-bold text-purple-950 bg-purple-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddOpm}
                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        title="Salvar OPM"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomOpm(false);
                          setNewOpmInput('');
                        }}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-xs cursor-pointer"
                        title="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={patientForm.opm}
                      onChange={(e) => {
                        if (e.target.value === '__NEW_OPM__') {
                          setIsAddingCustomOpm(true);
                        } else {
                          setPatientForm({ ...patientForm, opm: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {opms.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                      <option value="__NEW_OPM__" className="font-bold text-purple-600">
                        + Cadastrar Nova OPM (Unidade)...
                      </option>
                    </select>
                  )}
                </div>

                {/* Classificação de Prioridade */}
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

                {/* Consultório de Destino */}
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

                {/* Assistência à Saúde */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Assistência à Saúde *
                    </label>
                    {!isAddingCustomInsurance && (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomInsurance(true)}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                      >
                        + Criar Nova
                      </button>
                    )}
                  </div>

                  {isAddingCustomInsurance ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newInsuranceInput}
                        onChange={(e) => setNewInsuranceInput(e.target.value)}
                        placeholder="Ex: Bradesco Saúde"
                        className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs font-bold text-purple-950 bg-purple-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddInsurance}
                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        title="Salvar Assistência"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomInsurance(false);
                          setNewInsuranceInput('');
                        }}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-xs cursor-pointer"
                        title="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={patientForm.insurance}
                      onChange={(e) => {
                        if (e.target.value === '__NEW_INSURANCE__') {
                          setIsAddingCustomInsurance(true);
                        } else {
                          setPatientForm({ ...patientForm, insurance: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {healthInsurances.map((ins) => (
                        <option key={ins} value={ins}>
                          {ins}
                        </option>
                      ))}
                      <option value="__NEW_INSURANCE__" className="font-bold text-purple-600">
                        + Cadastrar Nova Assistência / Convênio...
                      </option>
                    </select>
                  )}
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
                    <th className="py-3 px-4">Assistência</th>
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
                            <span className="text-[11px] text-purple-700 font-bold">{p.rank || 'Militar'}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            <div>RE: {p.re || '---'}</div>
                            <div className="text-[10px] text-slate-500 font-sans font-bold">{p.opm || 'ESSgt'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                              <HeartPulse className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{p.insurance || 'CMed / CBPM'}</span>
                            </span>
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
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingPatient(p)}
                                title="Editar dados"
                                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
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
                      <td colSpan={8} className="text-center py-8 text-slate-400 text-xs">
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
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Editar Cadastro do Paciente
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Senha: <span className="font-bold text-purple-700">{editingPatient.ticketNumber}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setEditingPatient(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePatient} className="space-y-4 mt-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo do Paciente *</label>
                    <input
                      type="text"
                      required
                      value={editingPatient.name}
                      onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Posto / Graduação */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Posto / Graduação
                      </label>
                      <div className="space-y-1.5">
                        <select
                          value={militaryRanks.includes(editingPatient.rank || '') ? editingPatient.rank : '__CUSTOM__'}
                          onChange={(e) => {
                            if (e.target.value === '__CUSTOM__') {
                              // keep current or open text prompt
                            } else {
                              setEditingPatient({ ...editingPatient, rank: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                        >
                          {militaryRanks.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                          {!militaryRanks.includes(editingPatient.rank || '') && editingPatient.rank && (
                            <option value="__CUSTOM__">{editingPatient.rank} (Personalizado)</option>
                          )}
                        </select>
                        <input
                          type="text"
                          value={editingPatient.rank || ''}
                          onChange={(e) => setEditingPatient({ ...editingPatient, rank: e.target.value })}
                          placeholder="Ou digite outro posto..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-purple-900 bg-purple-50/40"
                        />
                      </div>
                    </div>

                    {/* RE Militar */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">RE Militar / Documento</label>
                      <input
                        type="text"
                        value={editingPatient.re || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, re: e.target.value })}
                        placeholder="Ex: 123456-7"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* OPM (Unidade) */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        OPM (Unidade Militar)
                      </label>
                      <div className="space-y-1.5">
                        <select
                          value={opms.includes(editingPatient.opm || '') ? editingPatient.opm : '__CUSTOM__'}
                          onChange={(e) => {
                            if (e.target.value === '__CUSTOM__') {
                              // keep current or open text prompt
                            } else {
                              setEditingPatient({ ...editingPatient, opm: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                        >
                          {opms.map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                          {!opms.includes(editingPatient.opm || '') && editingPatient.opm && (
                            <option value="__CUSTOM__">{editingPatient.opm} (Personalizada)</option>
                          )}
                        </select>
                        <input
                          type="text"
                          value={editingPatient.opm || ''}
                          onChange={(e) => setEditingPatient({ ...editingPatient, opm: e.target.value })}
                          placeholder="Ou digite outra OPM..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-blue-900 bg-blue-50/40"
                        />
                      </div>
                    </div>

                    {/* Assistência à Saúde */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Assistência à Saúde / Convênio
                      </label>
                      <div className="space-y-1.5">
                        <select
                          value={healthInsurances.includes(editingPatient.insurance || '') ? editingPatient.insurance : '__CUSTOM__'}
                          onChange={(e) => {
                            if (e.target.value === '__CUSTOM__') {
                              // keep current
                            } else {
                              setEditingPatient({ ...editingPatient, insurance: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                        >
                          {healthInsurances.map(ins => (
                            <option key={ins} value={ins}>{ins}</option>
                          ))}
                          {!healthInsurances.includes(editingPatient.insurance || '') && editingPatient.insurance && (
                            <option value="__CUSTOM__">{editingPatient.insurance} (Personalizada)</option>
                          )}
                        </select>
                        <input
                          type="text"
                          value={editingPatient.insurance || ''}
                          onChange={(e) => setEditingPatient({ ...editingPatient, insurance: e.target.value })}
                          placeholder="Ou digite outro convênio..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-emerald-900 bg-emerald-50/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Atendimento</label>
                      <select
                        value={editingPatient.status}
                        onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800"
                      >
                        <option value="aguardando">Aguardando</option>
                        <option value="chamado">Chamado no Painel</option>
                        <option value="em_atendimento">Em Atendimento</option>
                        <option value="concluido">Concluído</option>
                        <option value="ausente">Ausente</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Observações / Queixa</label>
                    <input
                      type="text"
                      value={editingPatient.notes || ''}
                      onChange={(e) => setEditingPatient({ ...editingPatient, notes: e.target.value })}
                      placeholder="Ex: Queixa de dor, medicação, curativo..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPatient(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-200 transition-all"
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

      {/* ========================================================================= */}
      {/* SUB-TAB 4: GESTÃO DE POSTOS, OPMS E ASSISTÊNCIA À SAÚDE */}
      {/* ========================================================================= */}
      {activeSubTab === 'tabelas_apoio' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                Tabelas de Apoio do Sistema
              </div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Postos / Graduações, OPMs e Assistência à Saúde
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Crie, edite e organize os dados de referência utilizados no cadastro de pacientes e na recepção da UIS. Todas as alterações são salvas e sincronizadas automaticamente em todo o sistema.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('pacientes')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-all cursor-pointer border border-purple-200"
              >
                <UserPlus className="w-4 h-4 text-purple-600" />
                Ir para Cadastro de Pacientes
              </button>
            </div>
          </div>

          {/* Search / Filter bar for support tables */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={supportSearch}
              onChange={(e) => setSupportSearch(e.target.value)}
              placeholder="Filtrar postos, OPMs ou convênios por nome ou sigla..."
              className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {supportSearch && (
              <button
                onClick={() => setSupportSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* 3 Columns Grid for the 3 support tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: POSTOS E GRADUAÇÕES */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50/50 border-b border-purple-100/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Posto / Graduação
                      </h3>
                      <p className="text-[11px] text-purple-700 font-bold">
                        {militaryRanks.length} opções cadastradas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add new Rank Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!supportNewRank.trim()) return;
                    addMilitaryRank(supportNewRank.trim());
                    showToast(`Posto "${supportNewRank.trim()}" adicionado com sucesso.`);
                    setSupportNewRank('');
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={supportNewRank}
                    onChange={(e) => setSupportNewRank(e.target.value)}
                    placeholder="Ex: Aluno CFO, Capelão..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar
                  </button>
                </form>
              </div>

              {/* Ranks List */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                {militaryRanks
                  .filter(r => r.toLowerCase().includes(supportSearch.toLowerCase()))
                  .map((rank) => (
                    <div key={rank} className="py-2.5 flex items-center justify-between gap-2 group hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                      {editingRankItem?.oldName === rank ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingRankItem.newName}
                            onChange={(e) => setEditingRankItem({ ...editingRankItem, newName: e.target.value })}
                            className="flex-1 px-2.5 py-1 text-xs border border-purple-300 rounded-lg font-bold text-purple-950 bg-purple-50/50 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingRankItem.newName.trim()) {
                                updateMilitaryRank(editingRankItem.oldName, editingRankItem.newName.trim());
                                showToast(`Posto renomeado para "${editingRankItem.newName.trim()}".`);
                              }
                              setEditingRankItem(null);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs cursor-pointer"
                            title="Salvar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingRankItem(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-xs cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            <span className="text-xs font-bold text-slate-800">{rank}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingRankItem({ oldName: rank, newName: rank })}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar nome"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja realmente remover o posto "${rank}"?`)) {
                                  deleteMilitaryRank(rank);
                                  showToast(`Posto "${rank}" removido.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* COLUMN 2: OPM (UNIDADE) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-sky-50/50 border-b border-blue-100/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        OPM (Unidade Policial)
                      </h3>
                      <p className="text-[11px] text-blue-700 font-bold">
                        {opms.length} unidades cadastradas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add new OPM Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!supportNewOpm.trim()) return;
                    addOpm(supportNewOpm.trim());
                    showToast(`OPM "${supportNewOpm.trim()}" adicionada com sucesso.`);
                    setSupportNewOpm('');
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={supportNewOpm}
                    onChange={(e) => setSupportNewOpm(e.target.value)}
                    placeholder="Ex: 1º BPChq, 45º BPM/I..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar
                  </button>
                </form>
              </div>

              {/* OPMs List */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                {opms
                  .filter(o => o.toLowerCase().includes(supportSearch.toLowerCase()))
                  .map((opm) => (
                    <div key={opm} className="py-2.5 flex items-center justify-between gap-2 group hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                      {editingOpmItem?.oldName === opm ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingOpmItem.newName}
                            onChange={(e) => setEditingOpmItem({ ...editingOpmItem, newName: e.target.value })}
                            className="flex-1 px-2.5 py-1 text-xs border border-blue-300 rounded-lg font-bold text-blue-950 bg-blue-50/50 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingOpmItem.newName.trim()) {
                                updateOpm(editingOpmItem.oldName, editingOpmItem.newName.trim());
                                showToast(`OPM renomeada para "${editingOpmItem.newName.trim()}".`);
                              }
                              setEditingOpmItem(null);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs cursor-pointer"
                            title="Salvar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingOpmItem(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-xs cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="text-xs font-bold text-slate-800 font-mono">{opm}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingOpmItem({ oldName: opm, newName: opm })}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar nome"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja realmente remover a OPM "${opm}"?`)) {
                                  deleteOpm(opm);
                                  showToast(`OPM "${opm}" removida.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* COLUMN 3: ASSISTÊNCIA À SAÚDE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-b border-emerald-100/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Assistência à Saúde
                      </h3>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        {healthInsurances.length} convênios cadastrados
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add new Insurance Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!supportNewInsurance.trim()) return;
                    addHealthInsurance(supportNewInsurance.trim());
                    showToast(`Assistência "${supportNewInsurance.trim()}" adicionada com sucesso.`);
                    setSupportNewInsurance('');
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={supportNewInsurance}
                    onChange={(e) => setSupportNewInsurance(e.target.value)}
                    placeholder="Ex: CMed / CBPM, Cruz Azul..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar
                  </button>
                </form>
              </div>

              {/* Insurances List */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                {healthInsurances
                  .filter(ins => ins.toLowerCase().includes(supportSearch.toLowerCase()))
                  .map((ins) => (
                    <div key={ins} className="py-2.5 flex items-center justify-between gap-2 group hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                      {editingInsuranceItem?.oldName === ins ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingInsuranceItem.newName}
                            onChange={(e) => setEditingInsuranceItem({ ...editingInsuranceItem, newName: e.target.value })}
                            className="flex-1 px-2.5 py-1 text-xs border border-emerald-300 rounded-lg font-bold text-emerald-950 bg-emerald-50/50 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingInsuranceItem.newName.trim()) {
                                updateHealthInsurance(editingInsuranceItem.oldName, editingInsuranceItem.newName.trim());
                                showToast(`Assistência renomeada para "${editingInsuranceItem.newName.trim()}".`);
                              }
                              setEditingInsuranceItem(null);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs cursor-pointer"
                            title="Salvar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingInsuranceItem(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-xs cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-slate-800">{ins}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingInsuranceItem({ oldName: ins, newName: ins })}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar nome"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja realmente remover o plano "${ins}"?`)) {
                                  deleteHealthInsurance(ins);
                                  showToast(`Assistência "${ins}" removida.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
