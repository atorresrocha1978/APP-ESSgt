export type UserRole = 
  | 'medico' 
  | 'dentista' 
  | 'enfermeiro' 
  | 'recepcao' 
  | 'admin' 
  | 'painel_tv';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  councilType?: 'CRM' | 'CRO' | 'COREN' | 'OUTRO';
  councilNumber?: string;
  specialty?: string;
  assignedRoomId?: RoomId | 'all';
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  avatarBg?: string;
}

export type RoomId = 
  | 'consultorio_01' 
  | 'consultorio_02' 
  | 'medicacao' 
  | 'odonto_01' 
  | 'odonto_02';

export type RoomCategory = 'clinico' | 'especialidade' | 'medicacao' | 'odonto';

export type Priority = 'normal' | 'preferencial' | 'urgente';

export type MilitaryRank = 
  | 'Cel PM'
  | 'Ten Cel PM'
  | 'Maj PM'
  | 'Cap PM'
  | '1º Ten PM'
  | '2º Ten PM'
  | 'Subten PM'
  | '1º Sgt PM'
  | '2º Sgt PM'
  | '3º Sgt PM'
  | 'Aluno Sgt PM'
  | 'Cb PM'
  | 'Sd PM'
  | 'Aluno Oficial'
  | 'Civil';

export const MILITARY_RANKS: MilitaryRank[] = [
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

export const COMMON_OPMS = [
  'ESSgt',
  'APMBB',
  '1º BPM/M',
  '2º BPM/M',
  '3º BPM/M',
  '4º BPM/M',
  '5º BPM/M',
  '1º BPChq',
  '2º BPChq',
  '3º BPChq',
  'RPMon',
  'CMed',
  'COI',
  'CPOR',
  'Corregedoria',
  'CPI-1',
  'CPI-2',
  'CPI-3',
  'CPI-4',
  'CPI-5',
  'CPI-6',
  'CPI-7',
  'CPI-8',
  'CPI-9',
  'CPI-10',
  'DS (Diretoria de Saúde)',
  'Outra OPM'
];

export type PatientStatus = 
  | 'aguardando' 
  | 'chamado' 
  | 'em_atendimento' 
  | 'concluido' 
  | 'ausente' 
  | 'cancelado';

export interface Patient {
  id: string;
  ticketNumber: string; // e.g. "CLI-012", "ESP-008", "MED-003", "ODO-015"
  rank?: MilitaryRank | string; // Cel PM, Ten Cel PM, 1º Sgt PM, Sd PM, Civil, etc.
  re: string; // RE format: 999999-9
  name: string;
  document: string; // compatibility field
  age?: number;
  gender?: 'M' | 'F' | 'Outro';
  opm?: string; // e.g. "ESSgt", "1º BPM/M", "APMBB"
  priority: Priority;
  targetRoomId: RoomId;
  category: RoomCategory;
  insurance?: string; // CMed, CBPM, Cruz Azul, SUS, Particular
  notes?: string;
  registeredAt: string; // ISO string
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
  status: PatientStatus;
  callCount: number;
  lastCalledRoomId?: RoomId;
  doctorName?: string;
  consultationNotes?: string;
}

export interface CallNotification {
  id: string;
  patientId: string;
  ticketNumber: string;
  rank?: MilitaryRank | string;
  patientName: string;
  re?: string;
  opm?: string;
  roomId: RoomId;
  roomName: string;
  roomTypeLabel: string;
  category: RoomCategory;
  timestamp: string;
  priority: Priority;
  doctorName?: string;
}

export interface RoomConfig {
  id: RoomId;
  name: string;
  subname: string;
  description: string;
  category: RoomCategory;
  prefix: string;
  colorName: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  defaultDoctor: string;
  soundType: 'clinico' | 'especialidade' | 'medicacao' | 'odonto1' | 'odonto2';
  icon: string;
}

export interface AttendanceRecord {
  id: string;
  ticketNumber: string;
  rank?: MilitaryRank | string;
  patientName: string;
  re?: string;
  opm?: string;
  document: string;
  age?: number;
  gender?: 'M' | 'F' | 'Outro';
  priority: Priority;
  roomId: RoomId;
  roomName: string;
  category: RoomCategory;
  doctorName: string;
  registeredAt: string;
  calledAt: string;
  startedAt: string;
  completedAt: string;
  waitTimeMinutes: number; // Registered to started/called
  attendanceTimeMinutes: number; // Started to completed
  totalTimeMinutes: number;
  status: 'concluido' | 'ausente' | 'cancelado';
  insurance: string;
  notes?: string;
  monthYear: string; // "2026-08"
  dayString: string; // "2026-08-29"
  hour: number; // 0-23
}

export interface ClinicMetrics {
  totalAttended: number;
  totalWaiting: number;
  totalInProgress: number;
  totalAbsent: number;
  avgWaitTimeMinutes: number;
  avgAttendanceTimeMinutes: number;
  efficiencyRate: number;
  byRoom: Record<RoomId, {
    count: number;
    avgWait: number;
    avgAttendance: number;
  }>;
  byPriority: {
    normal: number;
    preferencial: number;
    urgente: number;
  };
  byHour: Array<{
    hour: string;
    count: number;
    avgWait: number;
  }>;
  byDay: Array<{
    date: string;
    dayLabel: string;
    count: number;
    avgWait: number;
  }>;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  voiceEnabled: boolean;
  voiceVolume: number;
  voiceSpeed: number;
  repeatCallAlert: boolean;
}
