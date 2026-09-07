import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  Syringe, 
  Smile, 
  ShieldCheck, 
  Volume2, 
  Play, 
  CheckCircle, 
  UserX, 
  ArrowRight, 
  Clock, 
  FileText, 
  AlertCircle, 
  Bell, 
  Share2, 
  UserCheck,
  Send,
  Plus,
  User,
  ChevronDown
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS, ROOM_LIST } from '../constants/rooms';
import { RoomId, Priority } from '../types';

export const DoctorRoomView: React.FC = () => {
  const { 
    patients, 
    activeRoomId, 
    setActiveRoomId, 
    callPatient, 
    recallPatient, 
    startConsultation, 
    finishConsultation, 
    markAbsent,
    testRoomSound,
    currentUser,
    users,
    rooms,
    roomList
  } = useClinic();

  const currentRoomList = (roomList && roomList.length > 0) ? roomList : ROOM_LIST;
  const activeRoom = (rooms && rooms[activeRoomId]) || ROOMS[activeRoomId] || currentRoomList[0];

  // Dedicated doctor assigned specifically to this room in users list
  const assignedDoctor = users.find(
    u => u.active && (u.role === 'medico' || u.role === 'dentista' || u.role === 'enfermeiro') && u.assignedRoomId === activeRoomId
  ) || users.find(
    u => u.active && (u.role === 'medico' || u.role === 'dentista' || u.role === 'enfermeiro') && u.assignedRoomId === 'all'
  );

  // List of all active healthcare professionals registered in the system
  const allMedicalStaff = users.filter(
    u => u.active && (u.role === 'medico' || u.role === 'dentista' || u.role === 'enfermeiro')
  );

  // Optional manual switch for attending professional
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // When room changes, clear manual doctor selection
  useEffect(() => {
    setSelectedDoctorId(null);
  }, [activeRoomId]);

  // Determine effective attending professional
  const effectiveDoctor = (() => {
    if (selectedDoctorId) {
      const doc = users.find(u => u.id === selectedDoctorId);
      if (doc) return doc;
    }
    if (currentUser && (currentUser.role === 'medico' || currentUser.role === 'dentista' || currentUser.role === 'enfermeiro') && (currentUser.assignedRoomId === activeRoomId || currentUser.assignedRoomId === 'all')) {
      return currentUser;
    }
    if (assignedDoctor) {
      return assignedDoctor;
    }
    return null;
  })();

  const doctorDisplayName = effectiveDoctor 
    ? effectiveDoctor.name 
    : (activeRoom.defaultDoctor || 'Profissional de Saúde');

  const doctorSubtitle = effectiveDoctor
    ? `${effectiveDoctor.councilNumber ? `${effectiveDoctor.councilType || 'CRM'} ${effectiveDoctor.councilNumber} • ` : ''}${effectiveDoctor.specialty || activeRoom.description}`
    : (activeRoom.description || activeRoom.subname);

  // Consultation state
  const [consultationNotes, setConsultationNotes] = useState('');
  const [forwardRoom, setForwardRoom] = useState<RoomId>('medicacao');
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);

  // Find currently active patient for this room (called or in attendance)
  const currentPatient = patients.find(
    p => p.targetRoomId === activeRoomId && (p.status === 'em_atendimento' || p.status === 'chamado')
  );

  // Queue of patients waiting for this specific room
  const waitingPatients = patients.filter(
    p => p.targetRoomId === activeRoomId && p.status === 'aguardando'
  );

  // Timer for active consultation
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentPatient && currentPatient.status === 'em_atendimento' && currentPatient.startedAt) {
      const startTime = new Date(currentPatient.startedAt).getTime();
      const update = () => {
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
      };
      update();
      interval = setInterval(update, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [currentPatient]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    if (waitingPatients.length > 0) {
      // Prioritize urgente -> preferencial -> normal
      const urgent = waitingPatients.find(p => p.priority === 'urgente');
      const pref = waitingPatients.find(p => p.priority === 'preferencial');
      const nextPat = urgent || pref || waitingPatients[0];
      callPatient(nextPat.id, activeRoomId);
    }
  };

  const handleFinishAndSave = (forwardTo?: RoomId) => {
    if (!currentPatient) return;
    finishConsultation(currentPatient.id, consultationNotes, forwardTo);
    setConsultationNotes('');
    setShowForwardDropdown(false);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgente':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200">Urgência</span>;
      case 'preferencial':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Preferencial</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">Normal</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Workstation / Room Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Estação Ativa:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {currentRoomList.map((room) => {
            const isSelected = activeRoomId === room.id;
            const waitingCount = patients.filter(p => p.targetRoomId === room.id && p.status === 'aguardando').length;
            
            // Find registered doctor for this room
            const assignedDocForRoom = users.find(
              u => u.active && (u.role === 'medico' || u.role === 'dentista' || u.role === 'enfermeiro') && u.assignedRoomId === room.id
            );
            const docName = assignedDocForRoom ? assignedDocForRoom.name : (room.defaultDoctor || 'Plantão');

            return (
              <button
                key={room.id}
                id={`btn-select-room-${room.id}`}
                onClick={() => {
                  setActiveRoomId(room.id);
                  setConsultationNotes('');
                }}
                className={`flex flex-col items-start px-4 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${room.badgeBg} ${room.badgeText} shadow-lg shadow-blue-200 ring-2 ring-blue-400/40`
                    : 'bg-sky-50/70 text-slate-700 hover:bg-sky-100 border border-sky-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm">{room.name}</span>
                  {waitingCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-white text-slate-900 shadow-xs' : 'bg-blue-200 text-blue-900'
                    }`}>
                      {waitingCount}
                    </span>
                  )}
                </div>
                <div className={`text-[11px] font-bold truncate max-w-[180px] ${
                  isSelected ? 'opacity-90 text-white' : 'text-blue-700'
                }`}>
                  {docName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Test Audio Button for current room */}
        <button
          id="btn-test-room-audio"
          onClick={() => testRoomSound(activeRoomId)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-black border border-sky-200 transition-colors shadow-xs cursor-pointer"
          title="Testar sinal sonoro personalizado deste consultório"
        >
          <Volume2 className="w-4 h-4 stroke-[2.5]" />
          <span>Testar Som ({activeRoom.name})</span>
        </button>
      </div>

      {/* Main Grid: Active Consultation (Left 7 Cols) & Room Queue (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Active Patient in Consultation Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-7 shadow-sm flex flex-col justify-between min-h-[480px]">
            
            {/* Header info of the room */}
            <div className="flex items-start sm:items-center justify-between border-b border-sky-100 pb-4 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase ${activeRoom.badgeBg} ${activeRoom.badgeText} shadow-xs`}>
                    {activeRoom.name} • {activeRoom.subname}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    Profissional Cadastrado
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                    {doctorDisplayName}
                  </h2>

                  {/* Doctor switcher if multiple doctors registered */}
                  {allMedicalStaff.length > 1 && (
                    <div className="relative inline-block">
                      <select
                        aria-label="Trocar Profissional"
                        value={effectiveDoctor?.id || ''}
                        onChange={(e) => setSelectedDoctorId(e.target.value || null)}
                        className="text-[11px] font-bold bg-sky-50 text-blue-800 border border-sky-200 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        title="Selecione outro profissional cadastrado para atender neste consultório"
                      >
                        {allMedicalStaff.map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} ({doc.specialty || doc.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {doctorSubtitle}
                </p>
              </div>

              {currentPatient && currentPatient.status === 'em_atendimento' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                  <Clock className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="font-mono text-base font-black">{formatTimer(elapsedSeconds)}</span>
                </div>
              )}
            </div>

            {/* Current Patient Card */}
            {currentPatient ? (
              <div className="my-4 space-y-4 flex-1">
                
                {/* Status Banner */}
                <div className={`p-5 rounded-3xl border flex items-center justify-between ${
                  currentPatient.status === 'chamado'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-black text-2xl px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-200 text-blue-700">
                      {currentPatient.ticketNumber}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                        {currentPatient.status === 'chamado' ? 'Paciente Chamado no Painel' : 'Em Atendimento no Consultório'}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {currentPatient.rank && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-black uppercase bg-slate-900 text-white tracking-wider shadow-xs">
                            {currentPatient.rank}
                          </span>
                        )}
                        <h3 className="text-xl font-black">
                          {currentPatient.name}
                        </h3>
                      </div>
                      <div className="text-xs font-bold mt-0.5 text-blue-800">
                        RE: {currentPatient.re || currentPatient.document} • OPM: {currentPatient.opm || 'ESSgt'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {getPriorityBadge(currentPatient.priority)}
                    <span className="text-xs block mt-1.5 font-semibold opacity-80">
                      {currentPatient.insurance || 'CMed'} • {currentPatient.age ? `${currentPatient.age} anos` : 'Idade N/I'}
                    </span>
                  </div>
                </div>

                {/* Patient Details & Chief complaint */}
                <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2 text-xs text-slate-700">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-semibold">
                    <div><span className="text-slate-400">Posto/Grad:</span> <strong className="text-slate-900">{currentPatient.rank || 'Militar'}</strong></div>
                    <div><span className="text-slate-400">RE:</span> <strong className="text-slate-900">{currentPatient.re || currentPatient.document}</strong></div>
                    <div><span className="text-slate-400">OPM:</span> <strong className="text-blue-700">{currentPatient.opm || 'ESSgt'}</strong></div>
                    <div><span className="text-slate-400">Chegada:</span> {new Date(currentPatient.registeredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {currentPatient.notes && (
                    <div className="pt-2 border-t border-sky-100">
                      <span className="font-bold text-slate-800">Queixa / Observação da Recepção:</span>
                      <p className="mt-0.5 italic text-slate-600 bg-white p-2.5 rounded-xl border border-sky-100">
                        "{currentPatient.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Clinical Notes / Quick Evolution */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    Evolução Clínica / Prescrição & Conduta
                  </label>
                  <textarea
                    id="doctor-textarea-notes"
                    rows={3}
                    placeholder="Registrar diagnóstico, medicação administrada, prescrição ou orientações ao paciente..."
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    className="w-full p-3.5 text-xs bg-sky-50/50 border border-sky-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  
                  <div className="flex items-center gap-2">
                    {/* Re-call Button */}
                    <button
                      id="btn-doctor-recall"
                      onClick={() => recallPatient(currentPatient.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200 cursor-pointer"
                      title="Chamar paciente novamente no painel e disparar som"
                    >
                      <Volume2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Chamar Novamente ({currentPatient.callCount}x)</span>
                    </button>

                    {/* Start Consultation (if still in 'chamado') */}
                    {currentPatient.status === 'chamado' && (
                      <button
                        id="btn-doctor-start-consultation"
                        onClick={() => startConsultation(currentPatient.id, doctorDisplayName)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 cursor-pointer"
                      >
                        <Play className="w-4 h-4 stroke-[2.5]" />
                        <span>Entrou na Sala / Iniciar</span>
                      </button>
                    )}

                    {/* Mark Absent */}
                    <button
                      id="btn-doctor-mark-absent"
                      onClick={() => markAbsent(currentPatient.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                      title="Paciente não compareceu"
                    >
                      <UserX className="w-4 h-4 stroke-[2.5]" />
                      <span>Ausente</span>
                    </button>
                  </div>

                  {/* Finish / Forward Options */}
                  <div className="flex items-center gap-2">
                    
                    {/* Forward to Medication / Another room */}
                    <div className="relative">
                      <button
                        id="btn-toggle-forward"
                        onClick={() => setShowForwardDropdown(!showForwardDropdown)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-sky-50 text-blue-700 hover:bg-blue-100 border border-sky-200 cursor-pointer"
                      >
                        <Syringe className="w-4 h-4 stroke-[2.5]" />
                        <span>Encaminhar</span>
                      </button>

                      {showForwardDropdown && (
                        <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-20 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 px-2 block">
                            Encaminhar paciente para:
                          </span>
                          {currentRoomList.filter(r => r.id !== activeRoomId).map(r => (
                            <button
                              key={r.id}
                              onClick={() => handleFinishAndSave(r.id)}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-sky-50 hover:text-blue-700 flex items-center justify-between font-bold"
                            >
                              <span>{r.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({r.prefix})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Finalize Consultation */}
                    <button
                      id="btn-doctor-finish-consultation"
                      onClick={() => handleFinishAndSave()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                      <span>Finalizar Consulta</span>
                    </button>

                  </div>

                </div>

              </div>
            ) : (
              <div className="my-auto py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                  <UserCheck className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Nenhum Paciente em Atendimento no Momento
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 font-medium">
                  Selecione um paciente na fila ao lado clicando sobre o nome dele, ou use o botão para chamar o próximo.
                </p>

                {waitingPatients.length > 0 ? (
                  <button
                    id="btn-doctor-call-next-big"
                    onClick={handleCallNext}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-200 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Chamar Próximo ({waitingPatients[0].rank ? `${waitingPatients[0].rank} ` : ''}{waitingPatients[0].name} - {waitingPatients[0].ticketNumber})</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 px-4 py-2.5 rounded-2xl bg-sky-50 border border-sky-100">
                    Fila de espera deste consultório está vazia
                  </span>
                )}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT: Queue for this specific room */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-sm flex flex-col h-full min-h-[480px]">
            
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <div>
                <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                  Fila de Espera
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black border border-blue-200">
                    {waitingPatients.length} aguardando
                  </span>
                </h3>
                <p className="text-[11px] text-blue-600 font-bold mt-0.5">
                  👉 Clique no nome do paciente para chamá-lo na TV!
                </p>
              </div>

              {waitingPatients.length > 0 && (
                <button
                  id="btn-doctor-call-next-top"
                  onClick={handleCallNext}
                  className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Chamar 1º</span>
                </button>
              )}
            </div>

            {/* Patients List */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[420px] pr-1 flex-1">
              {waitingPatients.length > 0 ? (
                waitingPatients.map((patient, index) => {
                  const waitMinutes = Math.max(0, Math.floor((Date.now() - new Date(patient.registeredAt).getTime()) / 60000));
                  
                  return (
                    <div
                      key={patient.id}
                      id={`patient-queue-item-${patient.id}`}
                      onClick={() => callPatient(patient.id, activeRoomId)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg hover:border-blue-500 hover:scale-[1.01] ${
                        patient.priority === 'urgente'
                          ? 'bg-rose-50/70 border-rose-200'
                          : patient.priority === 'preferencial'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-sky-50/40 border-sky-100 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2.5 py-1 rounded-xl bg-white border border-sky-100 text-blue-700 shadow-xs">
                            {patient.ticketNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {getPriorityBadge(patient.priority)}
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">
                            {waitMinutes}m espera
                          </span>
                        </div>
                      </div>

                      {/* Clickable Patient Name with Call Icon Effect */}
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {patient.rank && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-white">
                                {patient.rank}
                              </span>
                            )}
                            <h4 className="font-black text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                              {patient.name}
                            </h4>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            RE: {patient.re || patient.document} • OPM: {patient.opm || 'ESSgt'}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs shrink-0">
                          <Volume2 className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>

                      {patient.notes && (
                        <p className="text-[11px] text-slate-500 mt-1.5 italic line-clamp-1 bg-white/60 p-1.5 rounded-lg">
                          "{patient.notes}"
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Nenhum paciente aguardando para {activeRoom.name}.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
