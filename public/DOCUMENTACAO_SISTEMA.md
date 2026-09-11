# Documentação Técnica e Operacional do Sistema
## Sistema de Chamada de Senhas, Triagem Militar e Gestão Ambulatorial
### Polícia Militar do Estado de São Paulo (PMESP) • Escola Superior de Sargentos (ESSgt)
### Unidade Integrada de Saúde (UIS) — Edição 2026 • Versão 2.5 Oficial

---

## 1. Visão Geral e Contexto Institucional

O **Sistema de Chamada de Senhas e Gestão Ambulatorial da UIS / ESSgt** é uma plataforma web progressiva desenvolvida sob medida para atender às rotinas médicas, odontológicas, de enfermagem e de triagem militar da Unidade Integrada de Saúde da Escola Superior de Sargentos.

### 1.1 Missão e Objetivos Estratégicos
- **Acolhimento Humanizado e Eficiente**: Agilizar o atendimento de Policiais Militares (da ativa, inativos, adidos, alunos de cursos de formação) e de seus dependentes civis.
- **Triagem Normativa Rigorosa**: Aplicação de prioridades legais (Lei Federal nº 10.048/2000) e critérios de urgência médica alinhados aos regulamentos de saúde da PMESP.
- **Comunicação Multimídia em Tempo Real**: Alertas sonoros harmônicos polifônicos e sintetizador de voz (TTS) em português brasileiro com tratamento de terminologia militar para monitores e televisores do saguão de espera.
- **Rastreabilidade e Indicadores de Comando**: Monitoramento contínuo do Tempo Médio de Espera (TME), Tempo Médio de Atendimento (TMA), taxa de eficiência e relatórios exportáveis em PDF e CSV para a Diretoria de Saúde e Comando da ESSgt.
- **Alta Disponibilidade e Operação Offline-First**: O sistema mantém persistência contínua no navegador, operando sem perda de dados mesmo diante de instabilidades de rede interna da caserna.

---

## 2. Arquitetura de Software e Stack Tecnológico

O sistema foi arquitetado como uma Single-Page Application (SPA) modular, resiliente e de alta performance.

| Componente / Camada | Tecnologia / Biblioteca | Função no Sistema |
| :--- | :--- | :--- |
| **Framework Base** | React 18+ com TypeScript | Gerenciamento de estado reativo, tipagem estrita de dados clínicos e componentes modulares. |
| **Build Tool & Servidor** | Vite | Empacotamento de alta velocidade, compilação de TypeScript e servidor de desenvolvimento. |
| **Estilização & UI** | Tailwind CSS | Design responsivo, tipografia com contraste acessível (WCAG AA) e adaptação a TVs industriais e monitores de recepção. |
| **Síntese de Voz (TTS)** | Web Speech API (`SpeechSynthesis`) | Anúncio audível do nome do paciente, posto/graduação e consultório com dicionário fonético militar. |
| **Geração de Áudio (Gongo)**| Web Audio API (`AudioContext`) | Síntese harmônica pura com 3 osciladores senoidais simultâneos (Chime harmônico), sem depender de arquivos de áudio externos. |
| **Geração de Documentos** | jsPDF | Emissão do Manual do Usuário A4 oficial (6 páginas diagramadas) e relatórios executivos em PDF. |
| **Ícones Vetoriais** | Lucide React | Iconografia consistente para postos de trabalho, especialidades médicas e sinalizações de status. |
| **Persistência de Dados** | Web Storage API (LocalStorage) | Persistência autônoma com serialização JSON e migração automática de esquemas legados. |

---

## 3. Estrutura de Diretórios do Projeto

```
/
├── index.html                   # Entry point HTML com fontes e tags OpenGraph da UIS
├── metadata.json                # Metadados oficiais e permissões do aplicativo
├── package.json                 # Dependências e scripts de build
├── DOCUMENTACAO_SISTEMA.md      # Este documento técnico oficial
├── src/
│   ├── main.tsx                 # Ponto de entrada React DOM
│   ├── App.tsx                  # Gerenciador de rotas de abas e controle de sessão
│   ├── index.css                # Importação do Tailwind CSS e estilos globais
│   ├── types/
│   │   └── index.ts             # Interfaces TypeScript (Patient, User, RoomConfig, etc.)
│   ├── constants/
│   │   ├── rooms.ts             # Consultórios e salas pré-configuradas da UIS
│   │   ├── users.ts             # Usuários padrão (médicos, dentistas, admin, etc.)
│   │   └── mockData.ts          # Carga de demonstração com 120 atendimentos históricos
│   ├── context/
│   │   └── ClinicContext.tsx    # Contexto global: estado de pacientes, chamadas, salas e usuários
│   ├── utils/
│   │   ├── audio.ts             # Web Audio API (gongos harmônicos) e SpeechSynthesis (TTS)
│   │   └── generatePdfManual.ts # Gerador de PDF em formato A4 do Manual Operacional
│   └── components/
│       ├── Navbar.tsx           # Barra de navegação superior, relógio e atalhos rápidos
│       ├── MainMenuHub.tsx      # Hub central de acesso operacional aos módulos
│       ├── LoginView.tsx        # Tela de autenticação com atalhos de demonstração
│       ├── ReceptionView.tsx    # Módulo de Recepção, Triagem e Emissão de Senhas
│       ├── WaitingRoomTV.tsx    # Painel multimídia para a TV da Sala de Espera
│       ├── DoctorRoomView.tsx   # Painel dos Consultórios Médicos e Odontológicos
│       ├── AdminDashboardView.tsx # Painel do Administrador (4 abas centrais)
│       ├── AdminUsersView.tsx   # Submódulo de gestão de profissionais e credenciais
│       ├── ManagerReportsView.tsx # Módulo analítico, gráficos de desempenho e relatórios
│       ├── SettingsView.tsx     # Parâmetros de som, manutenção e ações globais de sistema
│       ├── UserManualA4View.tsx # Visualizador interativo do Manual Operacional A4
│       ├── SystemDocsView.tsx   # Visualizador interativo da documentação do sistema na UI
│       └── CallModalAlert.tsx   # Alerta flutuante de chamada ativa em todas as telas
```

---

## 4. Módulos Operacionais e Regras de Negócio

### 4.1 Módulo de Autenticação, Perfis de Usuário & Segurança
O sistema adota o modelo de Controle de Acesso Baseado em Papéis (RBAC - *Role-Based Access Control*):

| Perfil (`role`) | Posto / Função Típica | Permissões no Sistema |
| :--- | :--- | :--- |
| **`admin`** | Coordenador da UIS / Oficial de Saúde | Acesso total: gestão de consultórios, usuários, pacientes, tabelas de apoio e manutenção do sistema. |
| **`medico`** | Médico Clínico Geral / Especialista | Acesso a consultórios, chamada de pacientes, evolução clínica, encaminhamento para medicação e finalização. |
| **`dentista`** | Cirurgião-Dentista | Acesso aos consultórios odontológicos, controle de fila e histórico do atendimento bucal. |
| **`enfermeiro`** | Enfermeiro / Técnico de Enfermagem | Acesso à Sala de Medicação e consultórios de enfermagem, registro de procedimentos. |
| **`recepcao`** | Atendente da Triagem / Policial Militar | Cadastro de pacientes, seleção de prioridades, emissão de senhas e cancelamento de fila. |
| **`painel_tv`** | Terminal da Sala de Espera (Totem) | Modo exclusivo de exibição fullscreen da fila e reprodução de voz e gongo, sem controles de gestão. |

#### Segurança de Exclusão e Interações Críticas
- Todas as operações destrutivas (exclusão de paciente, remoção de usuário, exclusão de sala ou limpeza de dados) foram migradas de diálogos nativos do navegador (`window.confirm`) para **modais visuais de confirmação dedicados**.
- Os modais exibem claramente o nome do registro, o RE militar ou conselho profissional, evitando exclusões acidentais e bloqueios de pop-up pelo navegador.

---

### 4.2 Módulo de Recepção, Triagem Militar & Emissão de Senhas
A recepção é a porta de entrada da UIS, operada segundo fluxo padronizado:

1. **Classificação Militar vs. Dependente Civil**:
   - Se Militar Estadual: seleção do Posto/Graduação oficial (desde Soldado PM até Coronel PM, Alunos e Oficiais).
   - Se Dependente Civil: registro do nome do titular e vínculo familiar.
2. **Registro Estatístico (RE) e OPM de Lotação**:
   - Campo padronizado para digitação do RE militar (formato `999999-9`).
   - Seletor de Unidades da Polícia Militar (ESSgt, APMBB, 1º BPM/M, BPChq, RPMon, CPIs, etc.), alimentado por lista dinâmica gerenciada pelo administrador.
3. **Assistência à Saúde / Convênio**:
   - Opções integradas: *CMed / CBPM*, *Cruz Azul de São Paulo*, *IAMSPE*, *SUS* ou *Particular*.
4. **Classificação de Risco e Prioridade Legal**:
   - **Normal (Azul)**: Atendimento eletivo e consultas de rotina (ordem cronológica de emissão).
   - **Preferencial (Amarelo)**: Amparado pela Lei Federal nº 10.048/2000 (Idosos ≥60 anos, gestantes, lactantes, pessoas com deficiência).
   - **Urgência Clínica (Vermelho)**: Casos agudos, crises hipertensivas e traumas imediatos. Posiciona o paciente automaticamente no **topo absoluto da fila**.
5. **Emissão da Senha e Comprovante de Chegada**:
   - Geração automática de código mnemônico sequencial por sala (ex.: `CLI-001`, `ODO-002`, `ESP-005`, `MED-003`).
   - Botão para emissão de comprovante impresso com QR Code de identificação.
6. **Gestão Segura da Fila de Espera (Cancelar vs. Excluir)**:
   - **Marcar como Cancelado**: Para pacientes que desistiram ou precisaram retirar-se antes do atendimento. O registro é retirado da fila ativa, porém é **preservado na base histórica para auditoria e cálculo de taxas de absenteísmo**.
   - **Excluir Definitivamente**: Exclusivo para correção imediata de erros cadastrais ou senhas emitidas por engano. Remove completamente o registro após confirmação em modal visual.

---

### 4.3 Módulo do Painel TV da Sala de Espera
O Painel TV é projetado para telas grandes e televisores instalados na área de convivência dos pacientes da UIS:

- **Identidade Visual Militar**: Design escuro de alto contraste (slate-950), tipografia legível a grandes distâncias e moldura com o brasão institucional da PMESP / ESSgt.
- **Chamada em Destaque Visual**:
  - Quando um médico aciona a chamada no consultório, o painel projeta um card central animado com o número da senha, nome completo do paciente, posto/graduação, RE e indicação clara do consultório de destino com indicação por cores temáticas.
- **Mecanismo Polifônico de Alerta Sonoro**:
  - Aciona 3 frequências senoidais puras simultâneas (ex.: Lá maior / Mi) com curva de decaimento suave via Web Audio API, simulando com fidelidade um gongo hospitalar moderno.
- **Sintetizador de Voz TTS Inteligente**:
  - Converte texto em áudio através da `SpeechSynthesis API`.
  - Contém módulo de normalização para vocabulário militar: pronuncia corretamente abreviações como *"Soldado PM"*, *"Primeiro Sargento PM"*, soletrando as siglas das salas e números das senhas.
- **Histórico das Últimas Chamadas**:
  - Grade lateral com as 5 últimas senhas chamadas para conferência de pacientes que se atrasaram momentaneamente.

---

### 4.4 Módulo dos Consultórios Médicos e Odontológicos
Posto de trabalho dos profissionais de saúde da UIS:

- **Seleção Dinâmica do Consultório**: Permite ao profissional vincular seu posto de trabalho à sala física desejada (Clínico Geral, Odontologia 1 e 2, Cardiologia, Especialidades ou Sala de Medicação).
- **Controle de Fila Dedicado**:
  - Visualização da fila em espera exclusiva para a especialidade ou compartilhada.
  - Indicadores de tempo decorrido desde a emissão da senha em minutos.
- **Chamada e Rechamada**:
  - Botão *"Chamar Paciente"* que aciona o Painel TV e altera o status para `chamado`.
  - Botão *"Rechamar"* com emissão de novo alerta sonoro e reforço visual.
- **Cronômetro de Consulta em Tempo Real**:
  - Inicia a contagem de tempo de atendimento ao clicar em *"Iniciar Consulta"*, calculando com exatidão a duração do procedimento clínico.
- **Prontuário e Evolução Clínica**:
  - Campo estruturado para anotação de queixa principal, diagnóstico provisório e conduta médica/odontológica.
- **Encaminhamento para Sala de Medicação**:
  - Botão de transferência que envia o paciente diretamente para a fila da enfermagem (`MED`), preservando o histórico clínico registrado.
- **Finalização e Desocupação de Sala**:
  - Registra a hora de conclusão (`completedAt`), calcula automaticamente os tempos de espera e atendimento e alimenta as estatísticas globais da UIS.

---

### 4.5 Módulo de Administração Central (Painel do Administrador)
O Painel Administrativo conta com 4 abas estruturadas:

1. **Aba 1: Consultórios & Salas**:
   - Cadastro e edição de salas de atendimento.
   - Configuração de nome, especialidade, médico padrão, sigla mnemônica de senha e tema de cor.
   - **Trava de Segurança**: O sistema impede a exclusão do último consultório ativo, assegurando que o ambulatório nunca permaneça sem salas disponíveis.
2. **Aba 2: Usuários & Profissionais**:
   - Gestão de credenciais de acesso para médicos, dentistas, enfermeiros e recepcionistas.
   - Controle de registro profissional nos conselhos de classe (CRM, CRO, COREN).
   - Redefinição rápida de senhas e alternância de status (ativo/inativo).
   - Exclusão protegida por modal visual com nome e papel do usuário.
3. **Aba 3: Base Geral de Pacientes**:
   - Consulta centralizada de todo o histórico de militares e dependentes atendidos na UIS.
   - Filtros instantâneos por RE, Nome, OPM ou Especialidade.
   - Acesso ao prontuário resumido e botão de exclusão protegido por modal de confirmação.
4. **Aba 4: Postos, OPMs & Assistência à Saúde (Tabelas de Apoio)**:
   - Adição e remoção dinâmica de Postos/Graduações da PMESP.
   - Gestão da lista de OPMs de lotação.
   - Configuração das operadoras e convênios de saúde aceitos na UIS.
   - Atualização automática e imediata de todos os seletores da Recepção.

---

### 4.6 Módulo de Relatórios Gerenciais & Indicadores Estatísticos
Módulo estratégico para análise de produtividade e dimensionamento de escalas:

- **Indicadores Principais**:
  - **TME (Tempo Médio de Espera)**: Intervalo entre a emissão da senha na triagem e a entrada do paciente no consultório.
  - **TMA (Tempo Médio de Atendimento)**: Duração efetiva da consulta médica/odontológica.
  - **Taxa de Eficiência Operacional**: Razão entre pacientes concluídos com sucesso e desistências/faltas.
- **Gráficos Analíticos**:
  - Distribuição de atendimentos por consultório e especialidade.
  - Volume por faixa horária (picos de fluxo das 08h às 18h).
  - Histórico cronológico dia a dia.
- **Exportação de Dados**:
  - **Exportar CSV**: Planilha completa compatível com Microsoft Excel e Google Sheets para auditoria.
  - **Gerar Relatório em PDF**: Documento oficial formatado com cabeçalho da PMESP, dados consolidados e assinaturas institucionais.

---

### 4.7 Módulo de Configurações, Parâmetros de Áudio e Manutenção
- **Calibração Sonora**: Ajuste individual do volume do gongo, volume da voz TTS, velocidade da fala e repetição de alerta.
- **Ações Globais Seguras com Modais de Confirmação**:
  - **Zerar Histórico & Relatórios**: Limpa os relatórios passados e reinicia os cálculos estatísticos, preservando os pacientes que estão aguardando na fila hoje.
  - **Zerar Fila de Espera**: Remove todos os pacientes da fila ativa no encerramento do expediente diário da UIS.
  - **Recarregar Dados de Demonstração**: Popula a base com 120 atendimentos históricos distribuídos nos últimos 30 dias, ideal para treinamentos e demonstrações de auditoria.

---

## 5. Modelos de Dados e Tipos TypeScript

### 5.1 Paciente (`Patient`)
```typescript
export interface Patient {
  id: string;
  ticketNumber: string;         // Ex: "CLI-012", "ODO-003", "MED-001"
  rank?: MilitaryRank | string; // Ex: "Cap PM", "1º Sgt PM", "Sd PM", "Civil"
  re: string;                   // Formato: "123456-7"
  name: string;
  document: string;             // CPF ou RG para compatibilidade
  age?: number;
  gender?: 'M' | 'F' | 'Outro';
  opm?: string;                 // Ex: "ESSgt", "1º BPM/M", "APMBB"
  priority: 'normal' | 'preferencial' | 'urgente';
  targetRoomId: string;
  category: 'clinico' | 'especialidade' | 'medicacao' | 'odonto' | 'geral';
  insurance?: string;           // Ex: "CBPM / CMed", "Cruz Azul de SP"
  notes?: string;
  registeredAt: string;         // Data/Hora ISO de emissão
  calledAt?: string;            // Data/Hora ISO da chamada na TV
  startedAt?: string;           // Data/Hora ISO do início da consulta
  completedAt?: string;         // Data/Hora ISO da finalização
  status: 'aguardando' | 'chamado' | 'em_atendimento' | 'concluido' | 'ausente' | 'cancelado';
  callCount: number;
  lastCalledRoomId?: string;
  doctorName?: string;
  consultationNotes?: string;   // Prontuário clínico
}
```

### 5.2 Consultório / Sala (`RoomConfig`)
```typescript
export interface RoomConfig {
  id: string;
  name: string;                 // Ex: "Consultório 1"
  subname: string;              // Ex: "Clínica Geral & Medicina de Família"
  description: string;
  category: RoomCategory;
  prefix: string;               // Ex: "CLI", "ODO", "MED", "ESP"
  colorName: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  defaultDoctor: string;
  soundType: string;
  icon: string;
}
```

### 5.3 Registro Histórico de Atendimento (`AttendanceRecord`)
```typescript
export interface AttendanceRecord {
  id: string;
  ticketNumber: string;
  rank?: string;
  patientName: string;
  re?: string;
  opm?: string;
  priority: Priority;
  roomId: string;
  roomName: string;
  doctorName: string;
  registeredAt: string;
  calledAt: string;
  startedAt: string;
  completedAt: string;
  waitTimeMinutes: number;       // registeredAt -> startedAt
  attendanceTimeMinutes: number; // startedAt -> completedAt
  totalTimeMinutes: number;
  status: 'concluido' | 'ausente' | 'cancelado';
  insurance: string;
  notes?: string;
  monthYear: string;            // Formato "YYYY-MM"
  dayString: string;            // Formato "YYYY-MM-DD"
  hour: number;                 // 0-23
}
```

---

## 6. Procedimentos de Instalação, Execução e Build

### 6.1 Pré-requisitos
- Node.js 18.x ou superior.
- NPM 9.x ou superior.

### 6.2 Execução no Servidor Local (IP 10.43.225.80)
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor local (escuta em 0.0.0.0:3000)
npm run dev

# 3. Execução em produção standalone
npm run build
npm start
```
O aplicativo será disponibilizado na porta padrão `3000`:
- **Acesso local na máquina**: `http://localhost:3000`
- **Acesso por qualquer computador ou TV na rede local**: `http://10.43.225.80:3000`

#### Liberação de Firewall (Porta 3000 TCP):
- **Windows Server / Windows 10/11** (Prompt de Comando como Administrador):
  ```cmd
  netsh advfirewall firewall add rule name="UIS ESSgt Porta 3000" dir=in action=allow protocol=TCP localport=3000
  ```
- **Linux** (UFW):
  ```bash
  sudo ufw allow 3000/tcp
  ```

#### Sincronização em Tempo Real (LAN):
O servidor Express integrado provê um canal nativo **Server-Sent Events (SSE)** em `/api/events`. Quando qualquer médico ou atendente emite uma chamada ou atualiza a fila a partir de seu navegador (`http://10.43.225.80:3000`), a alteração é instantaneamente propagada via rede para a Smart TV da sala de espera e para as demais estações sem necessidade de recarregar a página.

### 6.3 Verificação de Sintaxe e Compilação
```bash
# Executar a validação rigorosa de tipos TypeScript
npm run lint

# Executar o build otimizado para produção
npm run build
```
Os artefatos compilados serão gerados no diretório `dist/` e o servidor compilado em `dist/server.cjs`.

---

## 7. Diretrizes de Segurança, Integridade e Privacidade

1. **Proteção de Dados do Paciente**: Os dados cadastrais, patentes e prontuários permanecem restritos ao domínio do navegador da UIS, sem envio para servidores externos desprotegidos.
2. **Prevenção de Falhas em Quiosque (Totem)**: A tela do Painel TV conta com tratamento resiliente que impede a abertura indevida de diálogos de alerta, permitindo operação contínua por múltiplos dias.
3. **Resiliência do Áudio**: Caso as políticas de reprodução automática do navegador restrinjam o áudio antes da primeira interação do usuário, o sistema exibe aviso discreto para ativação do contexto de som (`AudioContext.resume()`).
4. **Rastreabilidade de Desistências**: A retenção do status `cancelado` garante que a coordenação médica quantifique o absenteísmo e adeque o dimensionamento da equipe.

---

### Compromisso Institucional
> *"Nós, Policiais Militares, sob a proteção de Deus, estamos compromissados com a Defesa da Vida, da Integridade Física e da Dignidade da Pessoa Humana."*  
> **Escola Superior de Sargentos (ESSgt) • Unidade Integrada de Saúde (UIS)**  
> São Paulo - SP, 2026.
