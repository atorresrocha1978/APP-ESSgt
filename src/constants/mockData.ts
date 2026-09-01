import { AttendanceRecord, Patient, MilitaryRank, MILITARY_RANKS, COMMON_OPMS } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    ticketNumber: 'ESP-008',
    rank: '1º Sgt PM',
    name: 'Roberto Antunes Ramos',
    re: '134589-2',
    document: '134589-2',
    age: 48,
    gender: 'M',
    opm: 'ESSgt',
    priority: 'normal',
    targetRoomId: 'consultorio_02',
    category: 'especialidade',
    insurance: 'CMed / CBPM',
    notes: 'Avaliação cardiológica de rotina e eletrocardiograma',
    registeredAt: new Date(Date.now() - 14 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-102',
    ticketNumber: 'CLI-014',
    rank: 'Aluno Sgt PM',
    name: 'Carlos Eduardo Nogueira',
    re: '189452-7',
    document: '189452-7',
    age: 29,
    gender: 'M',
    opm: 'ESSgt',
    priority: 'normal',
    targetRoomId: 'consultorio_01',
    category: 'clinico',
    insurance: 'CMed / CBPM',
    notes: 'Quadro febril há 2 dias, tosse seca e cefaleia durante TFM',
    registeredAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-103',
    ticketNumber: 'MED-006',
    rank: 'Cb PM',
    name: 'Juliana Paes de Alcântara',
    re: '176340-1',
    document: '176340-1',
    age: 34,
    gender: 'F',
    opm: '1º BPM/M',
    priority: 'urgente',
    targetRoomId: 'medicacao',
    category: 'medicacao',
    insurance: 'Cruz Azul',
    notes: 'Aplicação de analgésico IV prescrito para enxaqueca aguda',
    registeredAt: new Date(Date.now() - 6 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-104',
    ticketNumber: 'OD1-009',
    rank: 'Subten PM',
    name: 'Marcos Aurélio Ferreira',
    re: '112890-4',
    document: '112890-4',
    age: 51,
    gender: 'M',
    opm: 'ESSgt',
    priority: 'normal',
    targetRoomId: 'odonto_01',
    category: 'odonto',
    insurance: 'CMed / CBPM',
    notes: 'Profilaxia e restauração dente 24',
    registeredAt: new Date(Date.now() - 18 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-105',
    ticketNumber: 'OD2-005',
    rank: 'Sd PM',
    name: 'Fernanda Lima Ribeiro',
    re: '198745-9',
    document: '198745-9',
    age: 26,
    gender: 'F',
    opm: '2º BPChq',
    priority: 'normal',
    targetRoomId: 'odonto_02',
    category: 'odonto',
    insurance: 'Cruz Azul',
    notes: 'Avaliação para extração de terceiros molares (siso)',
    registeredAt: new Date(Date.now() - 32 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-106',
    ticketNumber: 'CLI-015',
    rank: 'Cel PM',
    name: 'Antonio Silveira Ramos',
    re: '089776-5',
    document: '089776-5',
    age: 63,
    gender: 'M',
    opm: 'DS (Diretoria de Saúde)',
    priority: 'preferencial',
    targetRoomId: 'consultorio_01',
    category: 'clinico',
    insurance: 'CMed / CBPM',
    notes: 'Renovação de receita contínua e controle de hipertensão',
    registeredAt: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  },
  {
    id: 'p-107',
    ticketNumber: 'ESP-009',
    rank: 'Civil',
    name: 'Patrícia Souza Magalhães (Dependente)',
    re: '984521-0',
    document: '984521-0',
    age: 39,
    gender: 'F',
    opm: 'ESSgt (Dependente)',
    priority: 'normal',
    targetRoomId: 'consultorio_02',
    category: 'especialidade',
    insurance: 'Cruz Azul / CBPM',
    notes: 'Retorno com exames laboratoriais de tireoide',
    registeredAt: new Date(Date.now() - 40 * 60000).toISOString(),
    status: 'aguardando',
    callCount: 0
  }
];

// Generate realistic monthly attendance history for metrics
export function generateSeedRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const rooms = [
    { id: 'consultorio_01' as const, name: 'Consultório 01', cat: 'clinico' as const, doctor: 'Dr. Roberto Silveira' },
    { id: 'consultorio_02' as const, name: 'Consultório 02', cat: 'especialidade' as const, doctor: 'Dra. Mariana Vasconcelos' },
    { id: 'medicacao' as const, name: 'Sala de Medicação', cat: 'medicacao' as const, doctor: 'Enfª. Camila Duarte' },
    { id: 'odonto_01' as const, name: 'Odontológico 01', cat: 'odonto' as const, doctor: 'Dr. Lucas Ferreira' },
    { id: 'odonto_02' as const, name: 'Odontológico 02', cat: 'odonto' as const, doctor: 'Dra. Beatriz Mendes' }
  ];

  const firstNames = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduardo', 'Fabiana', 'Gabriel', 'Heloisa', 'Igor', 'Juliana', 'Lucas', 'Mariana', 'Nelson', 'Olívia', 'Paulo', 'Renata', 'Sérgio', 'Tatiane', 'Valter', 'Yasmin'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida'];
  const opmList = ['ESSgt', 'ESSgt', 'APMBB', '1º BPM/M', '2º BPChq', 'CMed', 'RPMon', 'Corregedoria'];
  const insurances = ['CMed / CBPM', 'Cruz Azul', 'SUS', 'Particular'];
  const priorities: ('normal' | 'preferencial' | 'urgente')[] = ['normal', 'normal', 'normal', 'preferencial', 'preferencial', 'urgente'];

  // Generate 120 historical records across the last 30 days
  const now = new Date('2026-08-29T12:00:00Z');
  
  for (let i = 1; i <= 120; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date(now.getTime() - daysAgo * 86400000);
    const hour = 7 + Math.floor(Math.random() * 12); // between 7:00 and 19:00
    const minute = Math.floor(Math.random() * 60);
    date.setHours(hour, minute, 0, 0);

    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const rank = MILITARY_RANKS[Math.floor(Math.random() * MILITARY_RANKS.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const opm = opmList[Math.floor(Math.random() * opmList.length)];
    const reDigits = String(100000 + Math.floor(Math.random() * 899999));
    const reDig = Math.floor(Math.random() * 10);
    const re = `${reDigits}-${reDig}`;
    
    // Average wait time based on priority
    let waitMinutes = 12 + Math.floor(Math.random() * 20);
    if (priority === 'urgente') waitMinutes = 3 + Math.floor(Math.random() * 8);
    if (priority === 'preferencial') waitMinutes = 8 + Math.floor(Math.random() * 12);

    // Attendance duration
    let attMinutes = 15 + Math.floor(Math.random() * 25);
    if (room.cat === 'medicacao') attMinutes = 10 + Math.floor(Math.random() * 15);
    if (room.cat === 'especialidade') attMinutes = 20 + Math.floor(Math.random() * 25);

    const isAbsent = Math.random() < 0.05; // 5% absence rate

    const regTime = new Date(date.getTime() - waitMinutes * 60000);
    const callTime = date;
    const startTime = new Date(date.getTime() + 2 * 60000);
    const compTime = new Date(startTime.getTime() + attMinutes * 60000);

    records.push({
      id: `rec-${i}`,
      ticketNumber: `${room.id.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
      rank,
      patientName: `${firstName} ${lastName}`,
      re,
      opm,
      document: re,
      age: 20 + Math.floor(Math.random() * 45),
      gender: Math.random() > 0.4 ? 'M' : 'F',
      priority,
      roomId: room.id,
      roomName: room.name,
      category: room.cat,
      doctorName: room.doctor,
      registeredAt: regTime.toISOString(),
      calledAt: callTime.toISOString(),
      startedAt: startTime.toISOString(),
      completedAt: compTime.toISOString(),
      waitTimeMinutes: waitMinutes,
      attendanceTimeMinutes: isAbsent ? 0 : attMinutes,
      totalTimeMinutes: waitMinutes + (isAbsent ? 0 : attMinutes),
      status: isAbsent ? 'ausente' : 'concluido',
      insurance: insurances[Math.floor(Math.random() * insurances.length)],
      notes: isAbsent ? 'Não compareceu à chamada do painel' : 'Atendimento e evolução concluídos',
      monthYear: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      dayString: date.toISOString().split('T')[0],
      hour
    });
  }

  return records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}
