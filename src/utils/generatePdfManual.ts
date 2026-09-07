import { jsPDF } from 'jspdf';

/**
 * Utility to generate a high-quality, multi-page A4 PDF Manual for UIS - ESSgt PMESP
 * Format: A4 (210mm x 297mm)
 */
export function generatePdfManual(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const totalPages = 6;

  // Helper to draw standard Header on operational pages (Pages 2 to 6)
  const drawPageHeader = (pageNum: number, title: string, category: string) => {
    // Top border bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, 12, contentWidth, 16, 'F');

    // Accent line
    doc.setFillColor(220, 38, 38); // red-600
    doc.rect(margin, 28, contentWidth, 1.2, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('POLÍCIA MILITAR DO ESTADO DE SÃO PAULO • ESSgt / UIS', margin + 4, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(`${category.toUpperCase()} | ${title}`, margin + 4, 24);

    // Page badge
    doc.setFillColor(30, 58, 138); // blue-900
    doc.roundedRect(pageWidth - margin - 22, 14.5, 18, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`PÁG. ${pageNum}/${totalPages}`, pageWidth - margin - 19, 18.7);
  };

  // Helper to draw standard Footer on operational pages
  const drawPageFooter = (pageNum: number) => {
    const footerY = pageHeight - 12;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Unidade Integrada de Saúde - UIS / ESSgt • Sistema de Gestão de Filas e Atendimento Ambulatorial (SGF)', margin, footerY);

    const dateStr = 'Edição Oficial • 2026';
    doc.text(dateStr, pageWidth / 2 - doc.getTextWidth(dateStr) / 2, footerY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin - 20, footerY);
  };

  // Helper to draw section title
  const drawSectionTitle = (y: number, number: string, text: string) => {
    doc.setFillColor(30, 58, 138); // blue-900
    doc.roundedRect(margin, y, 7, 7, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(number, margin + 2, y + 5);

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(text, margin + 10, y + 5.5);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin + 10, y + 8, pageWidth - margin, y + 8);
    return y + 13;
  };

  // Helper to draw callout box
  const drawCallout = (y: number, title: string, text: string, type: 'info' | 'alert' | 'success' = 'info') => {
    const bgColors = {
      info: [239, 246, 255],     // sky-50
      alert: [254, 242, 242],    // rose-50
      success: [240, 253, 244]   // emerald-50
    };
    const borderColors = {
      info: [59, 130, 246],      // blue-500
      alert: [239, 68, 68],      // red-500
      success: [34, 197, 94]     // green-500
    };
    const titleColors = {
      info: [30, 64, 175],       // blue-800
      alert: [153, 27, 27],      // red-800
      success: [22, 101, 52]     // green-800
    };

    const lines = doc.splitTextToSize(text, contentWidth - 12);
    const boxHeight = 10 + lines.length * 4.2;

    doc.setFillColor(bgColors[type][0], bgColors[type][1], bgColors[type][2]);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'F');

    doc.setFillColor(borderColors[type][0], borderColors[type][1], borderColors[type][2]);
    doc.rect(margin, y, 2.5, boxHeight, 'F');

    doc.setTextColor(titleColors[type][0], titleColors[type][1], titleColors[type][2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(title, margin + 6, y + 5.5);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(lines, margin + 6, y + 10);

    return y + boxHeight + 4;
  };

  // =========================================================================
  // PAGE 1: CAPA OFICIAL (A4)
  // =========================================================================
  {
    // Background decoration
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Top Header Banner
    doc.setFillColor(30, 58, 138); // blue-900
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Red divider line
    doc.setFillColor(220, 38, 38); // red-600
    doc.rect(0, 55, pageWidth, 3, 'F');

    // Institutional Header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('POLÍCIA MILITAR DO ESTADO DE SÃO PAULO', pageWidth / 2, 22, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(203, 213, 225);
    doc.text('DIRETORIA DE SAÚDE • ESCOLA SUPERIOR DE SARGENTOS (ESSgt)', pageWidth / 2, 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('UNIDADE INTEGRADA DE SAÚDE - UIS', pageWidth / 2, 38, { align: 'center' });

    // Decorative Crest Shield / Emblem in Center
    const emblemY = 82;
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(pageWidth / 2 - 32, emblemY, 64, 52, 4, 4, 'F');
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(1.2);
    doc.roundedRect(pageWidth / 2 - 32, emblemY, 64, 52, 4, 4, 'S');

    // Red Cross inside Shield
    doc.setFillColor(220, 38, 38);
    doc.rect(pageWidth / 2 - 4, emblemY + 12, 8, 28, 'F');
    doc.rect(pageWidth / 2 - 14, emblemY + 22, 28, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ESSgt - UIS', pageWidth / 2, emblemY + 46, { align: 'center' });

    // Main Title Block
    const titleY = 150;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(21);
    doc.text('MANUAL DE OPERAÇÃO', pageWidth / 2, titleY, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(96, 165, 250); // blue-400
    doc.text('SISTEMA DE GESTÃO DE FILAS E ATENDIMENTO', pageWidth / 2, titleY + 9, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    doc.text('Guia Oficial de Instrução e Procedimentos Operacionais Padrão (POP)', pageWidth / 2, titleY + 17, { align: 'center' });

    // White Card for Summary / Target Users
    const cardY = 182;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 5, cardY, contentWidth - 10, 78, 3, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('SUMÁRIO EXECUTIVO & ESTRUTURA DO MANUAL', margin + 12, cardY + 10);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin + 12, cardY + 13, pageWidth - margin - 12, cardY + 13);

    const modules = [
      ['Página 2:', 'Acesso, Segurança, Credenciais de Administrador e Perfis Operacionais'],
      ['Página 3:', 'Módulo de Recepção & Triagem (Cadastro Militar/Civil e Emissão de Senhas)'],
      ['Página 4:', 'Painel TV da Sala de Espera (Sintetizador de Voz TTS e Áudio Harmônico)'],
      ['Página 5:', 'Módulo dos Consultórios (Chamada, Prontuário, Medicação e Conclusão)'],
      ['Página 6:', 'Administração Geral, Gestão de Usuários, Relatórios Estatísticos e FAQ']
    ];

    let my = cardY + 21;
    modules.forEach(([pg, desc]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text(pg, margin + 14, my);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(desc, margin + 34, my);
      my += 9.5;
    });

    // Footer of Cover Page
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Unidade Integrada de Saúde - UIS / ESSgt • São Paulo - SP', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('Classificação: Ostensivo • Documento de Apoio ao Usuário Operador', pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // =========================================================================
  // PAGE 2: ACESSO, SEGURANÇA E NAVEGAÇÃO
  // =========================================================================
  doc.addPage();
  {
    drawPageHeader(2, 'Acesso, Perfis de Usuário & Segurança', 'Módulo 1');
    drawPageFooter(2);

    let y = 36;
    y = drawSectionTitle(y, '1.1', 'Estrutura de Acesso e Credenciais');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = 'O Sistema da UIS foi projetado para operar com segurança e rastreabilidade total. Cada operador acessa o sistema mediante login e senha individualizados. Acesso de demonstração e senhas fracas foram descontinuados.';
    doc.text(doc.splitTextToSize(p1, contentWidth), margin, y);
    y += 12;

    y = drawCallout(
      y,
      'CREDENCIAIS DO ADMINISTRADOR DA UIS (CONFIDENCIAL):',
      'Usuário: admin\nSenha Oficial: E$$gt@1936\nO perfil Administrador possui permissão total para criar novos usuários, cadastrar consultórios, definir especialidades, emitir relatórios de gestão e reconfigurar a base.',
      'alert'
    );

    y = drawSectionTitle(y, '1.2', 'Tabela de Perfis de Usuário e Níveis de Permissão');

    // Table Header
    const colX = [margin, margin + 35, margin + 70, margin + 115, margin + 150];
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PERFIL', colX[0] + 2, y + 4.8);
    doc.text('RESPONSABILIDADE', colX[1] + 2, y + 4.8);
    doc.text('CONSELHO', colX[2] + 2, y + 4.8);
    doc.text('ÁREA PRINCIPAL', colX[3] + 2, y + 4.8);
    doc.text('ACESSO ADMIN', colX[4] + 2, y + 4.8);
    y += 7;

    const rolesTable = [
      ['Administrador', 'Gestão geral, salas, usuários e relatórios', 'Gestão UIS', 'Painel Geral Admin', 'Total (Irrestrito)'],
      ['Médico(a)', 'Atendimento ambulatorial e evolução', 'CRM / SP', 'Consultórios Médicos', 'Sem Acesso'],
      ['Cirurgião-Dentista', 'Atendimento odontológico e procedimentos', 'CRO / SP', 'Consultórios Odonto', 'Sem Acesso'],
      ['Enfermagem', 'Triagem clínica, sinais vitais e medicação', 'COREN / SP', 'Salas & Medicação', 'Sem Acesso'],
      ['Recepção / Triagem', 'Acolhimento, cadastro e emissão de senhas', 'Operacional', 'Módulo Recepção', 'Sem Acesso'],
      ['Painel TV (Totem)', 'Monitor exclusivo para a sala de espera', 'Autônomo', 'Painel TV Multimídia', 'Sem Acesso']
    ];

    rolesTable.forEach(([r, resp, cons, area, adm], idx) => {
      const rowBg = idx % 2 === 0 ? 255 : 248;
      doc.setFillColor(rowBg, rowBg, rowBg);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 7, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 58, 138);
      doc.text(r, colX[0] + 2, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(resp, colX[1] + 2, y + 4.8);
      doc.text(cons, colX[2] + 2, y + 4.8);
      doc.text(area, colX[3] + 2, y + 4.8);

      doc.setFont('helvetica', adm.startsWith('Total') ? 'bold' : 'normal');
      doc.setTextColor(adm.startsWith('Total') ? 185 : 100, adm.startsWith('Total') ? 28 : 116, adm.startsWith('Total') ? 28 : 139);
      doc.text(adm, colX[4] + 2, y + 4.8);

      y += 7;
    });

    y += 5;
    y = drawSectionTitle(y, '1.3', 'Navegação Integrada e Barra Superior (Navbar)');

    const navItems = [
      ['Menu:', 'Retorna ao Hub central da UIS com resumo dos pacientes e atalhos diretos.'],
      ['Recepção:', 'Acesso rápido ao formulário de cadastro, emissão de senhas e triagem militar.'],
      ['Painel TV:', 'Abre a tela de exibição para a sala de espera, com alertas visuais e sintetizador de voz.'],
      ['Consultórios:', 'Área de trabalho clínica para chamada de pacientes, prontuário e evolução médica.'],
      ['Administrador:', 'Módulo reservado para gestão de salas, cadastro de usuários e base geral.'],
      ['Relatórios:', 'Painel analítico com tempo médio de espera (TME) e volume de atendimentos.']
    ];

    navItems.forEach(([lbl, desc]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${lbl}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(desc, margin + 28, y);
      y += 5.8;
    });

    y += 3;
    drawCallout(
      y,
      'DICA DE SEGURANÇA OPERACIONAL:',
      'Ao encerrar seu turno ou deixar seu posto de trabalho, clique sempre no botão "Sair" (LogOut) no canto superior direito para bloquear o terminal e preservar o sigilo das consultas.',
      'info'
    );
  }

  // =========================================================================
  // PAGE 3: RECEPÇÃO & TRIAGEM MILITAR
  // =========================================================================
  doc.addPage();
  {
    drawPageHeader(3, 'Recepção, Triagem & Emissão de Senhas', 'Módulo 2');
    drawPageFooter(3);

    let y = 36;
    y = drawSectionTitle(y, '2.1', 'Fluxo de Acolhimento e Cadastro de Pacientes');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = 'A recepção da UIS é responsável por receber os policiais militares (ativos e inativos), alunos da Escola e seus dependentes civis, realizando a triagem prioritária e encaminhando-os para o consultório adequado.';
    doc.text(doc.splitTextToSize(p1, contentWidth), margin, y);
    y += 12;

    // Steps list
    const steps = [
      ['Passo 1: Identificação da Categoria', 'Selecione se o paciente é Militar Estadual ou Dependente Civil. Para militares, selecione o Posto ou Graduação (ex: Cel PM, Cap PM, 1º Sgt PM, Sd PM, Aluno Sgt PM).'],
      ['Passo 2: Registro Estatístico (RE) e OPM', 'Insira o RE no padrão militar (ex: 123456-7). Digite ou selecione a OPM de lotação (ex: ESSgt, 1º BPM/M, APMBB, CPI-1).'],
      ['Passo 3: Dados Pessoais do Paciente', 'Preencha o Nome Completo, Idade e Sexo. Caso seja dependente civil, informe o RE do titular para vínculo institucional.'],
      ['Passo 4: Classificação de Prioridade', 'Selecione rigorosamente a prioridade do atendimento (Normal, Preferencial ou Urgência Clínica).'],
      ['Passo 5: Seleção do Consultório de Destino', 'Indique o consultório inicial (Clínico Geral, Odontologia 1, Cardiologia, Sala de Medicação, etc.).'],
      ['Passo 6: Confirmação e Emissão da Senha', 'Clique em "Emitir Senha". O sistema gera a senha sequencial correspondente (ex: CLI-001, ODO-002) e disponibiliza o comprovante impresso.']
    ];

    steps.forEach(([stTitle, stDesc]) => {
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'F');
      doc.setDrawColor(191, 219, 254);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text(stTitle, margin + 4, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(stDesc, contentWidth - 8);
      doc.text(lines, margin + 4, y + 8.5);

      y += 14.5;
    });

    y += 2;
    y = drawSectionTitle(y, '2.2', 'Critérios Oficiais de Prioridade de Atendimento');

    // Priority Table
    const prioCols = [margin, margin + 35, margin + 85, margin + 140];
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 6.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PRIORIDADE', prioCols[0] + 2, y + 4.5);
    doc.text('PÚBLICO-ALVO / CRITÉRIO', prioCols[1] + 2, y + 4.5);
    doc.text('ORDENAÇÃO NA FILA', prioCols[2] + 2, y + 4.5);
    doc.text('COR / SINALIZADOR', prioCols[3] + 2, y + 4.5);
    y += 6.5;

    const prioData = [
      ['NORMAL', 'Consultas de rotina, exames periódicos e avaliações comuns.', 'Ordem cronológica de chegada à UIS.', 'Azul (Padrão)'],
      ['PREFERENCIAL', 'Idosos (≥60 anos), gestantes, lactantes, pessoas com deficiência (Lei 10.048).', 'Prioridade à frente da fila normal.', 'Âmbar / Amarelo'],
      ['URGÊNCIA', 'Sintomas agudos, crises hipertensivas, traumas físicos imediatos.', 'Prioridade MÁXIMA (Passa ao topo da fila).', 'Vermelho (Destaque)']
    ];

    prioData.forEach(([p, crit, ord, col]) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 7, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(p === 'URGÊNCIA' ? 185 : p === 'PREFERENCIAL' ? 180 : 30, p === 'PREFERENCIAL' ? 100 : 28, p === 'NORMAL' ? 138 : 28);
      doc.text(p, prioCols[0] + 2, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(crit, prioCols[1] + 2, y + 4.8);
      doc.text(ord, prioCols[2] + 2, y + 4.8);
      doc.text(col, prioCols[3] + 2, y + 4.8);

      y += 7;
    });

    y += 5;
    drawCallout(
      y,
      'IMPRESSÃO DO COMPROVANTE DE SENHA:',
      'Ao concluir a emissão da senha, o operador pode clicar em "Imprimir Comprovante". O ticket contém: Número da Senha, Posto/Graduação, Nome, RE, Consultório Destino, Data/Hora e QR Code de identificação para o paciente.',
      'success'
    );
  }

  // =========================================================================
  // PAGE 4: PAINEL DE CHAMADA TV (SALA DE ESPERA)
  // =========================================================================
  doc.addPage();
  {
    drawPageHeader(4, 'Painel Multimídia de Chamada TV & Sala de Espera', 'Módulo 3');
    drawPageFooter(4);

    let y = 36;
    y = drawSectionTitle(y, '3.1', 'Configuração da TV da Sala de Espera');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = 'O Painel TV é o ponto focal da recepção e sala de espera dos pacientes. Ele exibe em tela de alta visibilidade a última senha chamada, o nome do paciente, a sala de destino e o médico responsável, além de reproduzir sinais sonoros e voz sintetizada.';
    doc.text(doc.splitTextToSize(p1, contentWidth), margin, y);
    y += 14;

    y = drawCallout(
      y,
      'MODO MONITOR DEDICADO (TOTEM / TV):',
      'Para computadores ou televisores dedicados exclusivamente à sala de espera, efetue login com o usuário "painel_tv". O sistema entrará automaticamente em modo tela limpa (sem botões de navegação e sem barras administrativas). Pressione F11 no teclado para colocar em Tela Cheia.',
      'info'
    );

    y = drawSectionTitle(y, '3.2', 'Recursos Sonoros e Sintetizador de Voz (TTS)');

    const tvFeatures = [
      ['Alerta Harmônico Sonoro:', 'Antes de cada chamada, o sistema emite um sinal sonoro agradável e calibrado (bip hospitalar harmônico) para captar a atenção visual dos presentes no saguão.'],
      ['Sintetizador de Voz em Português:', 'O sistema converte o texto da chamada em fala natural de alta fidelidade: "Senha CLI-012, 1º Sargento PM Silva, comparecer ao Consultório 01".'],
      ['Pronúncia de Postos e Graduações:', 'O algoritmo de voz reconhece abreviações militares e pronuncia formalmente: "Coronel PM", "Capitão PM", "Subtenente PM", "Cabo PM", "Soldado PM".'],
      ['Personalização de Tons por Sala:', 'Cada consultório possui tonalidade e timbre diferenciados para que os pacientes habituais identifiquem a sala mesmo antes de olhar para a tela.'],
      ['Histórico Lateral das Últimas Senhas:', 'A lateral direita da TV mantém permanentemente visíveis as últimas senhas chamadas para conferência de pacientes que estavam temporariamente distraídos.']
    ];

    tvFeatures.forEach(([featTitle, featDesc]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${featTitle}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(featDesc, contentWidth - 6);
      doc.text(descLines, margin + 6, y + 4.5);
      y += 6 + descLines.length * 3.8;
    });

    y += 4;
    y = drawSectionTitle(y, '3.3', 'Resolução de Bloqueio de Áudio (Autoplay do Navegador)');

    drawCallout(
      y,
      'ATENÇÃO - POLÍTICA DE SEGURANÇA DE ÁUDIO DOS NAVEGADORES:',
      'Os navegadores modernos (Chrome, Edge, Firefox) impedem a reprodução automática de áudio sem que haja uma interação prévia do usuário. Caso o painel seja aberto e o som não toque:\n1. Clique uma vez em qualquer área da tela ou no botão "Ativar Áudio" no cabeçalho.\n2. No menu Configurações, certifique-se de que a opção "Sons Ativados" e "Sintetizador de Voz" estejam ligadas.\n3. O volume da TV ou monitor deve estar ajustado em nível confortável.',
      'alert'
    );
  }

  // =========================================================================
  // PAGE 5: CONSULTÓRIOS DE ATENDIMENTO
  // =========================================================================
  doc.addPage();
  {
    drawPageHeader(5, 'Consultórios Médicos, Odontologia & Enfermagem', 'Módulo 4');
    drawPageFooter(5);

    let y = 36;
    y = drawSectionTitle(y, '4.1', 'Rotina do Profissional no Consultório');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = 'O Módulo de Consultórios é o posto de trabalho do Médico, Cirurgião-Dentista e Enfermeiro. Ele permite gerenciar a fila do consultório em tempo real, chamar pacientes, registrar evolução e encaminhar para medicação.';
    doc.text(doc.splitTextToSize(p1, contentWidth), margin, y);
    y += 12;

    const doctorActions = [
      ['1. Seleção do Consultório Ativo', 'Ao acessar a tela, o profissional deve verificar no seletor superior se está vinculado à sua sala física correta (ex: Consultório 01, Odontologia 1, etc.).'],
      ['2. Botão "Chamar Próximo Paciente"', 'Aciona a chamada do primeiro paciente da fila (respeitando urgências e prioridades). O sistema atualiza a TV e dispara o sinal sonoro e voz imediatamente.'],
      ['3. Botão "Chamar Novamente" (Re-chamar)', 'Caso o paciente não compareça em até 2 minutos, o médico pode clicar em re-chamar. A notificação visual e sonora na TV é repetida automaticamente.'],
      ['4. Botão "Iniciar Consulta"', 'Assim que o paciente entra no consultório, o profissional clica em "Iniciar". O sistema interrompe o tempo de espera e inicia a cronometragem do atendimento.'],
      ['5. Registro Clínico e Queixa Principal', 'Campo para anotações do profissional (queixa, conduta e prescrição). Esses dados são protegidos e associados ao histórico do atendimento.'],
      ['6. Encaminhamento para Medicação', 'Se o paciente necessitar de aplicação intravenosa ou curativo, o profissional pode transferi-lo diretamente para a Sala de Medicação sem nova triagem.'],
      ['7. Botão "Concluir Atendimento"', 'Finaliza a consulta, calcula o tempo total de atendimento para as estatísticas da UIS e deixa a sala pronta para a próxima chamada.']
    ];

    doctorActions.forEach(([actTitle, actDesc]) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 11.5, 1, 1, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 11.5, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(15, 23, 42);
      doc.text(actTitle, margin + 4, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(actDesc, contentWidth - 8);
      doc.text(descLines, margin + 4, y + 8.2);

      y += 13.5;
    });

    y += 3;
    y = drawSectionTitle(y, '4.2', 'Mapeamento de Salas e Especialidades da UIS');

    // Rooms mapping table
    const roomCols = [margin, margin + 45, margin + 85, margin + 120, margin + 155];
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 6.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text('CONSULTÓRIO', roomCols[0] + 2, y + 4.5);
    doc.text('ESPECIALIDADE', roomCols[1] + 2, y + 4.5);
    doc.text('SIGLA SENHA', roomCols[2] + 2, y + 4.5);
    doc.text('COR PAINEL', roomCols[3] + 2, y + 4.5);
    doc.text('PROFISSIONAL', roomCols[4] + 2, y + 4.5);
    y += 6.5;

    const roomsData = [
      ['Consultório 01', 'Clínica Geral & Triagem', 'CLI-XXX', 'Azul Marinho', 'Médico Clínico'],
      ['Consultório 02', 'Cardiologia & Clínica', 'ESP-XXX', 'Azul Céu', 'Médico Especialista'],
      ['Odontologia 01', 'Cirurgia & Dentística', 'ODO-XXX', 'Verde Esmeralda', 'Cirurgião-Dentista'],
      ['Odontologia 02', 'Ortodontia & Profilaxia', 'OD2-XXX', 'Verde Menta', 'Cirurgião-Dentista'],
      ['Sala de Medicação', 'Injetáveis & Curativos', 'MED-XXX', 'Âmbar / Laranja', 'Equipe de Enfermagem']
    ];

    roomsData.forEach(([c, esp, sig, cor, prof]) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 6.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 58, 138);
      doc.text(c, roomCols[0] + 2, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(esp, roomCols[1] + 2, y + 4.5);
      doc.text(sig, roomCols[2] + 2, y + 4.5);
      doc.text(cor, roomCols[3] + 2, y + 4.5);
      doc.text(prof, roomCols[4] + 2, y + 4.5);

      y += 6.5;
    });

    y += 4;
    drawCallout(
      y,
      'CASO DE PACIENTE AUSENTE:',
      'Se o paciente chamado não comparecer após 3 tentativas de chamada, o operador deve clicar no botão "Marcar Ausente". A senha é retirada da fila de espera e o registro estatístico fica arquivado como ausência.',
      'info'
    );
  }

  // =========================================================================
  // PAGE 6: ADMINISTRAÇÃO, RELATÓRIOS E FAQ
  // =========================================================================
  doc.addPage();
  {
    drawPageHeader(6, 'Administração, Relatórios Gerenciais & FAQ', 'Módulo 5');
    drawPageFooter(6);

    let y = 36;
    y = drawSectionTitle(y, '5.1', 'Painel do Administrador');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = 'Disponível exclusivamente para a coordenação da UIS através do usuário admin. Possui três pilares de gerenciamento:';
    doc.text(p1, margin, y);
    y += 8;

    const adminPillars = [
      ['1. Gestão de Consultórios:', 'Criar novas salas, renomear consultórios existentes, alterar prefixo de senhas, definir médico titular e atribuir temas de cores.'],
      ['2. Gestão de Usuários:', 'Cadastrar médicos, dentistas, enfermeiros e recepcionistas. Definir conselhos de classe (CRM, CRO, COREN), senhas e status ativo/inativo.'],
      ['3. Base Geral de Pacientes:', 'Visualizar e gerenciar o cadastro centralizado de militares e dependentes atendidos na UIS, com filtros por RE, Nome e OPM.']
    ];

    adminPillars.forEach(([title, desc]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(109, 40, 217); // purple-700
      doc.text(title, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(desc, contentWidth - 6);
      doc.text(lines, margin + 4, y + 4.2);
      y += 5 + lines.length * 3.8;
    });

    y += 4;
    y = drawSectionTitle(y, '5.2', 'Relatórios Gerenciais e Indicadores de Atendimento');

    const reportMetrics = [
      ['Tempo Médio de Espera (TME):', 'Indica o intervalo médio entre a emissão da senha na recepção e o início efetivo da consulta.'],
      ['Tempo Médio de Consulta (TMC):', 'Mede a duração média das consultas por médico ou especialidade para planejamento de escalas.'],
      ['Taxa de Eficiência Operacional:', 'Percentual de pacientes atendidos com sucesso em relação aos que abandonaram ou faltaram.'],
      ['Exportação de Relatórios:', 'Possibilidade de exportar relatórios detalhados em PDF oficial, planilhas CSV e dados analíticos para comando da ESSgt.']
    ];

    reportMetrics.forEach(([title, desc]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${title}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(desc, contentWidth - 6);
      doc.text(lines, margin + 6, y + 4.2);
      y += 5 + lines.length * 3.8;
    });

    y += 4;
    y = drawSectionTitle(y, '5.3', 'Perguntas Frequentes & Resolução Rápida (FAQ)');

    const faqs = [
      ['P: O que fazer se o médico esquecer a senha?', 'R: O administrador da UIS pode acessar a aba "Administrador > Usuários", selecionar o médico e redefinir sua senha imediatamente.'],
      ['P: O sistema funciona sem internet?', 'R: Sim. A base local opera com persistência autônoma no navegador, permitindo continuidade total do atendimento ambulatorial.'],
      ['P: Como zerar a fila no final do expediente?', 'R: Na aba Configurações, o coordenador pode clicar em "Zerar Fila de Espera" para preparar o sistema para o próximo dia útil.']
    ];

    faqs.forEach(([q, a]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(30, 58, 138);
      doc.text(q, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const aLines = doc.splitTextToSize(a, contentWidth - 4);
      doc.text(aLines, margin + 4, y + 4);
      y += 5.5 + aLines.length * 3.5;
    });

    y += 2;
    // Final institutional signoff box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ESCOLA SUPERIOR DE SARGENTOS • UNIDADE INTEGRADA DE SAÚDE (UIS)', pageWidth / 2, y + 5.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Polícia Militar do Estado de São Paulo • "A Força Pública de São Paulo"', pageWidth / 2, y + 10, { align: 'center' });
  }

  // Save the generated document
  doc.save('Manual_Operacional_UIS_ESSgt_A4.pdf');
}
