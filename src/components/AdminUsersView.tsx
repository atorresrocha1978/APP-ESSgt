import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Stethoscope, 
  Smile, 
  Syringe, 
  ShieldCheck, 
  UserCheck, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Check, 
  X, 
  Sparkles, 
  Phone, 
  Mail, 
  Building2, 
  AlertCircle,
  LogIn,
  BadgeCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { User, UserRole, RoomId } from '../types';
import { ROOMS, ROOM_LIST } from '../constants/rooms';

export const AdminUsersView: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    quickLoginAsUser, 
    currentUser 
  } = useClinic();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    password: string;
    role: UserRole;
    councilType: 'CRM' | 'CRO' | 'COREN' | 'OUTRO';
    councilNumber: string;
    specialty: string;
    assignedRoomId: RoomId | 'all';
    email: string;
    phone: string;
    active: boolean;
  }>({
    name: '',
    username: '',
    password: '',
    role: 'medico',
    councilType: 'CRM',
    councilNumber: '',
    specialty: '',
    assignedRoomId: 'consultorio_01',
    email: '',
    phone: '',
    active: true
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.councilNumber && user.councilNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.specialty && user.specialty.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesRoom = roomFilter === 'all' || user.assignedRoomId === roomFilter || user.assignedRoomId === 'all';

    return matchesSearch && matchesRole && matchesRoom;
  });

  // KPI counts
  const totalUsers = users.length;
  const doctorsCount = users.filter(u => u.role === 'medico').length;
  const dentistsCount = users.filter(u => u.role === 'dentista').length;
  const nursesCount = users.filter(u => u.role === 'enfermeiro').length;
  const receptionCount = users.filter(u => u.role === 'recepcao' || u.role === 'admin').length;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'medico',
      councilType: 'CRM',
      councilNumber: '',
      specialty: '',
      assignedRoomId: 'consultorio_01',
      email: '',
      phone: '',
      active: true
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '',
      role: user.role,
      councilType: user.councilType || 'CRM',
      councilNumber: user.councilNumber || '',
      specialty: user.specialty || '',
      assignedRoomId: user.assignedRoomId || 'consultorio_01',
      email: user.email || '',
      phone: user.phone || '',
      active: user.active
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    let councilType: 'CRM' | 'CRO' | 'COREN' | 'OUTRO' = 'OUTRO';
    let defaultRoom: RoomId | 'all' = 'all';

    if (newRole === 'medico') {
      councilType = 'CRM';
      defaultRoom = 'consultorio_01';
    } else if (newRole === 'dentista') {
      councilType = 'CRO';
      defaultRoom = 'odonto_01';
    } else if (newRole === 'enfermeiro') {
      councilType = 'COREN';
      defaultRoom = 'medicacao';
    } else if (newRole === 'recepcao') {
      defaultRoom = 'all';
    }

    setFormData(prev => ({
      ...prev,
      role: newRole,
      councilType,
      assignedRoomId: defaultRoom
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Por favor, informe o nome completo do profissional.');
      return;
    }

    if (!formData.username.trim()) {
      setFormError('Por favor, defina um nome de usuário para login.');
      return;
    }

    if (!formData.password.trim()) {
      setFormError('Por favor, defina a senha de acesso para este usuário.');
      return;
    }

    // Check if username already exists (except for current editing user)
    const exists = users.some(
      u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.id !== editingUserId
    );

    if (exists) {
      setFormError('Este nome de usuário já está cadastrado. Escolha outro.');
      return;
    }

    if (editingUserId) {
      updateUser(editingUserId, {
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        role: formData.role,
        councilType: formData.councilType,
        councilNumber: formData.councilNumber.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        assignedRoomId: formData.assignedRoomId,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        active: formData.active
      });
      showToast(`Profissional "${formData.name}" atualizado com sucesso!`);
    } else {
      addUser({
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        role: formData.role,
        councilType: formData.councilType,
        councilNumber: formData.councilNumber.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        assignedRoomId: formData.assignedRoomId,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        active: formData.active
      });
      showToast(`Profissional "${formData.name}" cadastrado com sucesso!`);
    }

    setIsModalOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'medico':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
            <Stethoscope className="w-3 h-3" />
            <span>Médico(a)</span>
          </span>
        );
      case 'dentista':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Smile className="w-3 h-3" />
            <span>Dentista</span>
          </span>
        );
      case 'enfermeiro':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
            <Syringe className="w-3 h-3" />
            <span>Enfermagem</span>
          </span>
        );
      case 'recepcao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200">
            <UserCheck className="w-3 h-3" />
            <span>Recepção</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Administrador</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-800">
            <span>Usuário</span>
          </span>
        );
    }
  };

  const getRoomName = (roomId?: RoomId | 'all') => {
    if (!roomId || roomId === 'all') return 'Acesso Global / Recepção';
    return ROOMS[roomId]?.name || roomId;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Painel Administrativo & Gestão de Profissionais
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Cadastre médicos, cirurgiões dentistas, enfermeiros e recepcionistas com permissão para chamar senhas nos consultórios da <span className="text-red-600 font-bold">U.I.S.</span>
            </p>
          </div>
        </div>

        <button
          id="btn-add-user-modal"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Novo Profissional</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total de Usuários</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-800">{totalUsers}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Médicos (CRM)</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-blue-700">{doctorsCount}</span>
            <Stethoscope className="w-4 h-4 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Dentistas (CRO)</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">{dentistsCount}</span>
            <Smile className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Enfermagem (COREN)</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-700">{nursesCount}</span>
            <Syringe className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Recepção & Admins</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-indigo-700">{receptionCount}</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CRM/CRO/COREN, usuário ou especialidade..."
            className="w-full pl-10 pr-4 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Cargos</option>
            <option value="medico">Médicos (Clínico/Especialista)</option>
            <option value="dentista">Dentistas (Odontologia)</option>
            <option value="enfermeiro">Enfermeiros (Medicação)</option>
            <option value="recepcao">Recepção & Triagem</option>
            <option value="admin">Administradores</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Consultórios</option>
            {ROOM_LIST.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.subname})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Users Table / Grid */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-4 px-5">Profissional & Registro</th>
                <th className="py-4 px-4">Cargo / Função</th>
                <th className="py-4 px-4">Consultório Vinculado</th>
                <th className="py-4 px-4">Usuário de Login</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm text-slate-600">Nenhum profissional encontrado</p>
                    <p className="text-xs">Tente ajustar os filtros ou cadastre um novo usuário.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  const assignedRoom = user.assignedRoomId && user.assignedRoomId !== 'all' ? ROOMS[user.assignedRoomId] : null;

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-sky-50/40 transition-colors ${!user.active ? 'opacity-60 bg-slate-50/50' : ''}`}
                    >
                      {/* Name & Council */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl ${user.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-800 text-sm">{user.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                                  Você
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {user.councilNumber ? (
                                <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                                  {user.councilType} {user.councilNumber}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Sem registro de conselho</span>
                              )}
                              {user.specialty && (
                                <span className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                                  • {user.specialty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Assigned Room */}
                      <td className="py-4 px-4">
                        {assignedRoom ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${assignedRoom.badgeBg} ${assignedRoom.badgeText}`}>
                              {assignedRoom.prefix}
                            </span>
                            <span className="font-bold text-slate-700">{assignedRoom.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Todos os Postos</span>
                        )}
                      </td>

                      {/* Username */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {user.username}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider transition-colors cursor-pointer ${
                            user.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Clique para alternar status"
                        >
                          {user.active ? 'ATIVO' : 'INATIVO'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Quick Login As User */}
                          <button
                            onClick={() => quickLoginAsUser(user.id)}
                            className="p-2 rounded-xl bg-sky-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-sky-200 transition-colors cursor-pointer"
                            title="Entrar imediatamente como este profissional"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                            title="Editar Dados do Usuário"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          {user.username !== 'admin' && (
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                              title="Excluir Usuário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastrar / Editar Profissional */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  {editingUserId ? <Edit3 className="w-5 h-5 stroke-[2.5]" /> : <UserPlus className="w-5 h-5 stroke-[2.5]" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {editingUserId ? 'Editar Profissional de Saúde' : 'Cadastrar Novo Profissional'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Preencha os dados e credenciais para acesso aos consultórios e chamada de senhas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error in modal */}
            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Profissional / Cargo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('medico')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.role === 'medico'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-sky-50/60 text-slate-700 border-sky-200 hover:bg-white'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Médico(a)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('dentista')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.role === 'dentista'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-sky-50/60 text-slate-700 border-sky-200 hover:bg-white'
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                    <span>Dentista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('enfermeiro')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.role === 'enfermeiro'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-sky-50/60 text-slate-700 border-sky-200 hover:bg-white'
                    }`}
                  >
                    <Syringe className="w-4 h-4" />
                    <span>Enfermeiro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('recepcao')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      formData.role === 'recepcao'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/60 text-slate-700 border-sky-200 hover:bg-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Recepção</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all flex flex-col items-center gap-1 cursor-pointer col-span-2 sm:col-span-1 ${
                      formData.role === 'admin'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-sky-50/60 text-slate-700 border-sky-200 hover:bg-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Name & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo do Profissional *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Dr. Fernando Albuquerque"
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Especialidade / Título
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                    placeholder="Ex: Pediatria, Endodontia, Clínico Geral..."
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Council Info & Assigned Room */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Conselho Profissional
                  </label>
                  <select
                    value={formData.councilType}
                    onChange={(e) => setFormData(prev => ({ ...prev, councilType: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CRM">CRM (Médico)</option>
                    <option value="CRO">CRO (Dentista)</option>
                    <option value="COREN">COREN (Enfermagem)</option>
                    <option value="OUTRO">Outro / Nenhum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Número do Registro
                  </label>
                  <input
                    type="text"
                    value={formData.councilNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, councilNumber: e.target.value }))}
                    placeholder="Ex: 142.890/SP"
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Consultório Vinculado
                  </label>
                  <select
                    value={formData.assignedRoomId}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedRoomId: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os Postos</option>
                    {ROOM_LIST.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.prefix})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-900">
                    Credenciais de Acesso ao Sistema
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Usuário de Login *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Ex: dr.fernando"
                      className="w-full px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Senha de Acesso *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Defina a senha de acesso"
                      className="w-full px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail Institucional (Opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="medico@medifila.com.br"
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / Ramal (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">Status do Usuário</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-xs font-black text-slate-700">
                    {formData.active ? 'Ativo' : 'Inativo'}
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-sky-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-200 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingUserId ? 'Salvar Alterações' : 'Cadastrar Profissional'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete User */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Confirmar Exclusão de Usuário
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Você tem certeza que deseja excluir o usuário <strong className="text-slate-900">{userToDelete.name}</strong> (@{userToDelete.username})?
            </p>

            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
              Esta ação revogará o acesso deste usuário ao sistema imediatamente.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(userToDelete.id);
                  setSuccessToast(`Usuário "${userToDelete.name}" removido com sucesso.`);
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-200 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sim, Excluir Usuário
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
