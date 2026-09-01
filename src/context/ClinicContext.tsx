import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Patient, 
  CallNotification, 
  AttendanceRecord, 
  RoomId, 
  AudioSettings, 
  ClinicMetrics, 
  Priority, 
  RoomCategory,
  User,
  UserRole,
  MilitaryRank
} from '../types';
import { ROOMS } from '../constants/rooms';
import { INITIAL_PATIENTS, generateSeedRecords } from '../constants/mockData';
import { DEFAULT_USERS } from '../constants/users';
import { soundService } from '../utils/audio';

interface ClinicContextType {
  // Auth & Users
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  quickLoginAsUser: (userId: string) => void;
  enterTvModeDirectly: () => void;

  patients: Patient[];
  currentCall: CallNotification | null;
  callHistory: CallNotification[];
  attendanceRecords: AttendanceRecord[];
  activeRoomId: RoomId;
  setActiveRoomId: (id: RoomId) => void;
  activeTab: 'tv' | 'recepcao' | 'consultorios' | 'gestao' | 'configuracoes' | 'usuarios';
  setActiveTab: (tab: 'tv' | 'recepcao' | 'consultorios' | 'gestao' | 'configuracoes' | 'usuarios') => void;
  audioSettings: AudioSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  
  // Actions
  addPatient: (data: {
    rank?: MilitaryRank | string;
    re: string;
    name: string;
    document?: string;
    age?: number;
    gender?: 'M' | 'F' | 'Outro';
    opm?: string;
    priority: Priority;
    targetRoomId: RoomId;
    insurance?: string;
    notes?: string;
  }) => Patient;
  
  callPatient: (patientId: string, customRoomId?: RoomId) => Promise<void>;
  recallPatient: (patientId: string) => Promise<void>;
  startConsultation: (patientId: string, doctorName?: string) => void;
  finishConsultation: (patientId: string, notes?: string, forwardToRoomId?: RoomId) => void;
  markAbsent: (patientId: string) => void;
  cancelPatient: (patientId: string) => void;
  transferPatient: (patientId: string, newRoomId: RoomId) => void;
  
  // Audio
  testRoomSound: (roomId: RoomId) => Promise<void>;
  
  // Metrics
  getMetrics: (
    period: 'today' | '7days' | 'month' | 'custom', 
    monthString?: string, 
    roomFilter?: RoomId | 'all'
  ) => ClinicMetrics;
  
  // System resets
  resetToDefaultData: () => void;
  clearQueue: () => void;
  clearReports: () => void;
  dismissCurrentCallAlert: () => void;
  isCallingAnimation: boolean;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'medifila_patients_v1',
  RECORDS: 'medifila_records_v1',
  CALL_HISTORY: 'medifila_call_history_v1',
  AUDIO: 'medifila_audio_settings_v1',
  ACTIVE_ROOM: 'medifila_active_room_v1',
  USERS: 'medifila_users_v1',
  CURRENT_USER: 'medifila_current_user_v1'
};

const DEFAULT_AUDIO: AudioSettings = {
  enabled: true,
  volume: 0.85,
  voiceEnabled: true,
  voiceVolume: 0.95,
  voiceSpeed: 0.95,
  repeatCallAlert: true
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PATIENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateSeedRecords();
  });

  const [callHistory, setCallHistory] = useState<CallNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [currentCall, setCurrentCall] = useState<CallNotification | null>(null);
  const [isCallingAnimation, setIsCallingAnimation] = useState<boolean>(false);
  const [activeRoomId, setActiveRoomId] = useState<RoomId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM) as RoomId;
    return saved && ROOMS[saved] ? saved : 'consultorio_01';
  });

  const [activeTab, setActiveTab] = useState<'tv' | 'recepcao' | 'consultorios' | 'gestao' | 'configuracoes' | 'usuarios'>('recepcao');

  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIO);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_AUDIO;
  });

  // Persist state updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIO, JSON.stringify(audioSettings));
  }, [audioSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROOM, activeRoomId);
  }, [activeRoomId]);

  // BroadcastChannel for cross-tab multi-screen real-time synchronization
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('medifila_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'CALL_PATIENT') {
          setCurrentCall(payload.call);
          setCallHistory(prev => [payload.call, ...prev.slice(0, 19)]);
          setIsCallingAnimation(true);
          setTimeout(() => setIsCallingAnimation(false), 8000);

          if (payload.audioEnabled) {
            soundService.announcePatient(
              payload.call.roomId,
              payload.call.ticketNumber,
              payload.call.patientName,
              payload.call.roomName,
              ROOMS[payload.call.roomId]?.subname,
              payload.volume,
              payload.voiceEnabled,
              payload.voiceVolume
            );
          }
        } else if (type === 'SYNC_STATE') {
          setPatients(payload.patients);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    return () => {
      channel?.close();
    };
  }, []);

  const broadcastCall = (call: CallNotification) => {
    try {
      const channel = new BroadcastChannel('medifila_channel');
      channel.postMessage({
        type: 'CALL_PATIENT',
        payload: {
          call,
          audioEnabled: audioSettings.enabled,
          volume: audioSettings.volume,
          voiceEnabled: audioSettings.voiceEnabled,
          voiceVolume: audioSettings.voiceVolume
        }
      });
      channel.close();
    } catch (e) {
      console.warn(e);
    }
  };

  const updateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Authentication & User Management
  const login = useCallback((username: string, password: string): { success: boolean; message?: string; user?: User } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const foundUser = users.find(u => u.username.toLowerCase() === cleanUser);
    if (!foundUser) {
      return { success: false, message: 'Usuário não encontrado no sistema.' };
    }

    if (!foundUser.active) {
      return { success: false, message: 'Esta conta de usuário está inativa. Contate o administrador.' };
    }

    // Check password (default fallback to '123' or '123456' or 'admin123' or exact match)
    if (foundUser.password && foundUser.password !== cleanPass && cleanPass !== '123' && cleanPass !== '123456') {
      return { success: false, message: 'Senha incorreta. Verifique suas credenciais.' };
    }

    setCurrentUser(foundUser);

    // Auto route to appropriate screen based on role
    if (foundUser.role === 'medico' || foundUser.role === 'dentista' || foundUser.role === 'enfermeiro') {
      setActiveTab('consultorios');
      if (foundUser.assignedRoomId && foundUser.assignedRoomId !== 'all') {
        setActiveRoomId(foundUser.assignedRoomId);
      }
    } else if (foundUser.role === 'recepcao') {
      setActiveTab('recepcao');
    } else if (foundUser.role === 'admin') {
      setActiveTab('usuarios');
    } else if (foundUser.role === 'painel_tv') {
      setActiveTab('tv');
    }

    return { success: true, user: foundUser };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const quickLoginAsUser = useCallback((userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && targetUser.active) {
      setCurrentUser(targetUser);
      if (targetUser.role === 'medico' || targetUser.role === 'dentista' || targetUser.role === 'enfermeiro') {
        setActiveTab('consultorios');
        if (targetUser.assignedRoomId && targetUser.assignedRoomId !== 'all') {
          setActiveRoomId(targetUser.assignedRoomId);
        }
      } else if (targetUser.role === 'recepcao') {
        setActiveTab('recepcao');
      } else if (targetUser.role === 'admin') {
        setActiveTab('usuarios');
      } else if (targetUser.role === 'painel_tv') {
        setActiveTab('tv');
      }
    }
  }, [users]);

  const enterTvModeDirectly = useCallback(() => {
    const tvUser = users.find(u => u.role === 'painel_tv') || {
      id: 'usr-tv-direct',
      name: 'Painel TV Sala de Espera',
      username: 'painel.tv',
      role: 'painel_tv' as const,
      active: true,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(tvUser);
    setActiveTab('tv');
  }, [users]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>): User => {
    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-cyan-600', 'bg-amber-600', 'bg-rose-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      avatarBg: userData.avatarBg || randomColor
    };

    setUsers(prev => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...userData };
        if (currentUser?.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  }, [currentUser]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  }, [currentUser]);

  const toggleUserStatus = useCallback((id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, active: !u.active };
        if (currentUser?.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  }, [currentUser]);

  // Add new patient in Reception
  const addPatient = (data: {
    rank?: MilitaryRank | string;
    re: string;
    name: string;
    document?: string;
    age?: number;
    gender?: 'M' | 'F' | 'Outro';
    opm?: string;
    priority: Priority;
    targetRoomId: RoomId;
    insurance?: string;
    notes?: string;
  }): Patient => {
    const room = ROOMS[data.targetRoomId];
    
    // Generate sequential ticket based on room prefix + count today
    const existingCount = patients.filter(p => p.targetRoomId === data.targetRoomId).length + 1;
    const ticketNumber = `${room.prefix}-${String(existingCount).padStart(3, '0')}`;

    const cleanRe = data.re.trim();

    const newPatient: Patient = {
      id: `pat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticketNumber,
      rank: data.rank || 'Sd PM',
      re: cleanRe || '000000-0',
      name: data.name.trim(),
      document: cleanRe || data.document?.trim() || '---',
      age: data.age,
      gender: data.gender || 'Outro',
      opm: data.opm?.trim() || 'ESSgt',
      priority: data.priority,
      targetRoomId: data.targetRoomId,
      category: room.category,
      insurance: data.insurance || 'CMed / CBPM',
      notes: data.notes || '',
      registeredAt: new Date().toISOString(),
      status: 'aguardando',
      callCount: 0
    };

    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  // Call patient (triggered when doctor clicks on patient name or "Chamar Próximo")
  const callPatient = useCallback(async (patientId: string, customRoomId?: RoomId) => {
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;

    const roomId = customRoomId || targetPatient.targetRoomId;
    const room = ROOMS[roomId];
    const nowIso = new Date().toISOString();

    const callNotification: CallNotification = {
      id: `call-${Date.now()}`,
      patientId: targetPatient.id,
      ticketNumber: targetPatient.ticketNumber,
      rank: targetPatient.rank,
      patientName: targetPatient.name,
      re: targetPatient.re,
      opm: targetPatient.opm,
      roomId: roomId,
      roomName: room.name,
      roomTypeLabel: room.subname,
      category: room.category,
      timestamp: nowIso,
      priority: targetPatient.priority,
      doctorName: (currentUser && (currentUser.role === 'medico' || currentUser.role === 'dentista' || currentUser.role === 'enfermeiro')) ? currentUser.name : room.defaultDoctor
    };

    // Update patient status in state
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'chamado',
          calledAt: nowIso,
          callCount: (p.callCount || 0) + 1,
          lastCalledRoomId: roomId,
          targetRoomId: roomId
        };
      }
      return p;
    }));

    setCurrentCall(callNotification);
    setCallHistory(prev => [callNotification, ...prev.slice(0, 19)]);
    setIsCallingAnimation(true);
    setTimeout(() => setIsCallingAnimation(false), 9000);

    // Broadcast to other tabs
    broadcastCall(callNotification);

    // Play Audio & Speech (Announcing rank + name)
    if (audioSettings.enabled) {
      const displayNameForVoice = `${targetPatient.rank && targetPatient.rank !== 'Civil' ? targetPatient.rank + ' ' : ''}${targetPatient.name}`;
      await soundService.announcePatient(
        roomId,
        targetPatient.ticketNumber,
        displayNameForVoice,
        room.name,
        room.subname,
        audioSettings.volume,
        audioSettings.voiceEnabled,
        audioSettings.voiceVolume
      );
    }
  }, [patients, audioSettings, currentUser]);

  const recallPatient = async (patientId: string) => {
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;
    await callPatient(patientId, targetPatient.targetRoomId);
  };

  const startConsultation = (patientId: string, doctorName?: string) => {
    const now = new Date().toISOString();
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'em_atendimento',
          startedAt: now,
          doctorName: doctorName || ROOMS[p.targetRoomId].defaultDoctor
        };
      }
      return p;
    }));
  };

  const finishConsultation = (patientId: string, notes?: string, forwardToRoomId?: RoomId) => {
    const now = new Date();
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;

    const registered = new Date(targetPatient.registeredAt);
    const started = targetPatient.startedAt ? new Date(targetPatient.startedAt) : now;
    
    const waitTime = Math.max(1, Math.round((started.getTime() - registered.getTime()) / 60000));
    const attTime = Math.max(1, Math.round((now.getTime() - started.getTime()) / 60000));

    const room = ROOMS[targetPatient.targetRoomId];

    // Create completed attendance record for statistics
    const newRecord: AttendanceRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber: targetPatient.ticketNumber,
      rank: targetPatient.rank,
      patientName: targetPatient.name,
      re: targetPatient.re,
      opm: targetPatient.opm,
      document: targetPatient.re || targetPatient.document,
      age: targetPatient.age,
      gender: targetPatient.gender,
      priority: targetPatient.priority,
      roomId: targetPatient.targetRoomId,
      roomName: room.name,
      category: room.category,
      doctorName: targetPatient.doctorName || room.defaultDoctor,
      registeredAt: targetPatient.registeredAt,
      calledAt: targetPatient.calledAt || started.toISOString(),
      startedAt: started.toISOString(),
      completedAt: now.toISOString(),
      waitTimeMinutes: waitTime,
      attendanceTimeMinutes: attTime,
      totalTimeMinutes: waitTime + attTime,
      status: 'concluido',
      insurance: targetPatient.insurance || 'CMed / CBPM',
      notes: notes || targetPatient.notes || 'Atendimento concluído.',
      monthYear: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      dayString: now.toISOString().split('T')[0],
      hour: now.getHours()
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Check if patient is forwarded to another room (e.g. Medicação)
    if (forwardToRoomId && forwardToRoomId !== targetPatient.targetRoomId) {
      const forwardRoom = ROOMS[forwardToRoomId];
      const forwardTicket = `${forwardRoom.prefix}-${String(patients.filter(p => p.targetRoomId === forwardToRoomId).length + 1).padStart(3, '0')}`;
      
      const forwardedPatient: Patient = {
        ...targetPatient,
        id: `pat-fwd-${Date.now()}`,
        ticketNumber: forwardTicket,
        targetRoomId: forwardToRoomId,
        category: forwardRoom.category,
        registeredAt: now.toISOString(),
        status: 'aguardando',
        calledAt: undefined,
        startedAt: undefined,
        completedAt: undefined,
        callCount: 0,
        notes: `[Encaminhado de ${room.name}]: ${notes || targetPatient.notes || 'Sem observações'}`
      };

      setPatients(prev => [forwardedPatient, ...prev.filter(p => p.id !== patientId)]);
    } else {
      // Mark original patient as completed
      setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'concluido',
            completedAt: now.toISOString(),
            consultationNotes: notes
          };
        }
        return p;
      }));
    }
  };

  const markAbsent = (patientId: string) => {
    const targetPatient = patients.find(p => p.id === patientId);
    if (!targetPatient) return;

    const now = new Date();
    const registered = new Date(targetPatient.registeredAt);
    const waitTime = Math.max(1, Math.round((now.getTime() - registered.getTime()) / 60000));
    const room = ROOMS[targetPatient.targetRoomId];

    const newRecord: AttendanceRecord = {
      id: `rec-abs-${Date.now()}`,
      ticketNumber: targetPatient.ticketNumber,
      rank: targetPatient.rank,
      patientName: targetPatient.name,
      re: targetPatient.re,
      opm: targetPatient.opm,
      document: targetPatient.re || targetPatient.document,
      age: targetPatient.age,
      gender: targetPatient.gender,
      priority: targetPatient.priority,
      roomId: targetPatient.targetRoomId,
      roomName: room.name,
      category: room.category,
      doctorName: room.defaultDoctor,
      registeredAt: targetPatient.registeredAt,
      calledAt: targetPatient.calledAt || now.toISOString(),
      startedAt: now.toISOString(),
      completedAt: now.toISOString(),
      waitTimeMinutes: waitTime,
      attendanceTimeMinutes: 0,
      totalTimeMinutes: waitTime,
      status: 'ausente',
      insurance: targetPatient.insurance || 'CMed / CBPM',
      notes: 'Paciente não compareceu ao consultório após chamada.',
      monthYear: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      dayString: now.toISOString().split('T')[0],
      hour: now.getHours()
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: 'ausente' };
      }
      return p;
    }));
  };

  const cancelPatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  const transferPatient = (patientId: string, newRoomId: RoomId) => {
    const room = ROOMS[newRoomId];
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          targetRoomId: newRoomId,
          category: room.category,
          status: 'aguardando',
          calledAt: undefined,
          startedAt: undefined,
          callCount: 0
        };
      }
      return p;
    }));
  };

  const testRoomSound = async (roomId: RoomId) => {
    const room = ROOMS[roomId];
    await soundService.announcePatient(
      roomId,
      `${room.prefix}-001`,
      'Paciente Demonstração',
      room.name,
      room.subname,
      audioSettings.volume,
      audioSettings.voiceEnabled,
      audioSettings.voiceVolume
    );
  };

  const dismissCurrentCallAlert = () => {
    setIsCallingAnimation(false);
  };

  // Metrics computation function with filtering
  const getMetrics = useCallback((
    period: 'today' | '7days' | 'month' | 'custom',
    monthString?: string,
    roomFilter: RoomId | 'all' = 'all'
  ): ClinicMetrics => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = monthString || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let filteredRecords = attendanceRecords.filter(r => {
      if (roomFilter !== 'all' && r.roomId !== roomFilter) {
        return false;
      }

      if (period === 'today') {
        return r.dayString === todayStr;
      }
      if (period === '7days') {
        const diffDays = (now.getTime() - new Date(r.completedAt).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (period === 'month') {
        return r.monthYear === currentMonthStr;
      }
      return true;
    });

    const attendedRecords = filteredRecords.filter(r => r.status === 'concluido');
    const absentRecords = filteredRecords.filter(r => r.status === 'ausente');

    const totalAttended = attendedRecords.length;
    const totalAbsent = absentRecords.length;
    const totalWaiting = patients.filter(p => p.status === 'aguardando' && (roomFilter === 'all' || p.targetRoomId === roomFilter)).length;
    const totalInProgress = patients.filter(p => p.status === 'em_atendimento' && (roomFilter === 'all' || p.targetRoomId === roomFilter)).length;

    const avgWaitTime = attendedRecords.length > 0
      ? Math.round(attendedRecords.reduce((acc, r) => acc + r.waitTimeMinutes, 0) / attendedRecords.length)
      : 0;

    const avgAttendanceTime = attendedRecords.length > 0
      ? Math.round(attendedRecords.reduce((acc, r) => acc + r.attendanceTimeMinutes, 0) / attendedRecords.length)
      : 0;

    const efficiencyRate = (totalAttended + totalAbsent) > 0
      ? Math.round((totalAttended / (totalAttended + totalAbsent)) * 100)
      : 100;

    // Room breakdown
    const byRoom: Record<RoomId, { count: number; avgWait: number; avgAttendance: number }> = {
      consultorio_01: { count: 0, avgWait: 0, avgAttendance: 0 },
      consultorio_02: { count: 0, avgWait: 0, avgAttendance: 0 },
      medicacao: { count: 0, avgWait: 0, avgAttendance: 0 },
      odonto_01: { count: 0, avgWait: 0, avgAttendance: 0 },
      odonto_02: { count: 0, avgWait: 0, avgAttendance: 0 }
    };

    (Object.keys(byRoom) as RoomId[]).forEach(rId => {
      const roomRecs = attendedRecords.filter(r => r.roomId === rId);
      byRoom[rId] = {
        count: roomRecs.length,
        avgWait: roomRecs.length ? Math.round(roomRecs.reduce((a, b) => a + b.waitTimeMinutes, 0) / roomRecs.length) : 0,
        avgAttendance: roomRecs.length ? Math.round(roomRecs.reduce((a, b) => a + b.attendanceTimeMinutes, 0) / roomRecs.length) : 0
      };
    });

    // Priority breakdown
    const byPriority = {
      normal: filteredRecords.filter(r => r.priority === 'normal').length,
      preferencial: filteredRecords.filter(r => r.priority === 'preferencial').length,
      urgente: filteredRecords.filter(r => r.priority === 'urgente').length
    };

    // Hourly distribution (7:00 to 19:00)
    const byHour: Array<{ hour: string; count: number; avgWait: number }> = [];
    for (let h = 7; h <= 19; h++) {
      const hourRecs = attendedRecords.filter(r => r.hour === h);
      byHour.push({
        hour: `${String(h).padStart(2, '0')}:00`,
        count: hourRecs.length,
        avgWait: hourRecs.length ? Math.round(hourRecs.reduce((a, b) => a + b.waitTimeMinutes, 0) / hourRecs.length) : 0
      });
    }

    // Daily distribution for the month
    const dayMap = new Map<string, { count: number; totalWait: number }>();
    attendedRecords.forEach(r => {
      const d = r.dayString;
      const current = dayMap.get(d) || { count: 0, totalWait: 0 };
      dayMap.set(d, {
        count: current.count + 1,
        totalWait: current.totalWait + r.waitTimeMinutes
      });
    });

    const byDay = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        const parts = date.split('-');
        const dayLabel = `${parts[2]}/${parts[1]}`;
        return {
          date,
          dayLabel,
          count: data.count,
          avgWait: Math.round(data.totalWait / data.count)
        };
      });

    return {
      totalAttended,
      totalWaiting,
      totalInProgress,
      totalAbsent,
      avgWaitTimeMinutes: avgWaitTime,
      avgAttendanceTimeMinutes: avgAttendanceTime,
      efficiencyRate,
      byRoom,
      byPriority,
      byHour,
      byDay
    };
  }, [attendanceRecords, patients]);

  const resetToDefaultData = () => {
    setPatients(INITIAL_PATIENTS);
    setAttendanceRecords(generateSeedRecords());
    setCallHistory([]);
    setCurrentCall(null);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.CALL_HISTORY);
  };

  const clearQueue = () => {
    setPatients([]);
    setCurrentCall(null);
  };

  const clearReports = () => {
    setAttendanceRecords([]);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([]));
  };

  const contextValue = useMemo(() => ({
    currentUser,
    users,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    quickLoginAsUser,
    enterTvModeDirectly,
    patients,
    currentCall,
    callHistory,
    attendanceRecords,
    activeRoomId,
    setActiveRoomId,
    activeTab,
    setActiveTab,
    audioSettings,
    updateAudioSettings,
    addPatient,
    callPatient,
    recallPatient,
    startConsultation,
    finishConsultation,
    markAbsent,
    cancelPatient,
    transferPatient,
    testRoomSound,
    getMetrics,
    resetToDefaultData,
    clearQueue,
    clearReports,
    dismissCurrentCallAlert,
    isCallingAnimation
  }), [
    currentUser,
    users,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    quickLoginAsUser,
    enterTvModeDirectly,
    patients,
    currentCall,
    callHistory,
    attendanceRecords,
    activeRoomId,
    activeTab,
    audioSettings,
    callPatient,
    getMetrics,
    isCallingAnimation
  ]);

  return (
    <ClinicContext.Provider value={contextValue}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = (): ClinicContextType => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
