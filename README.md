# ESSgt - UIS (Unidade Integrada de Saúde)
## Sistema de Chamada de Senhas e Gestão de Consultórios

Sistema para recepção, triagem militar/civil, consultórios médicos/odontológicos/especialidades, painel de TV para sala de espera e relatórios gerenciais.

---

## 🚀 Como Rodar o Aplicativo no Servidor Local via Navegador

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada): [https://nodejs.org](https://nodejs.org)

---

### Opção 1: Modo de Desenvolvimento (Rápido)

1. **Baixe ou clone os arquivos** do projeto para uma pasta em seu computador.
2. Abra o terminal (Prompt de Comando, PowerShell ou Terminal do Linux/Mac) na pasta do projeto.
3. Instale as dependências executando:
   ```bash
   npm install
   ```
4. Inicie o servidor local:
   ```bash
   npm run dev
   ```
5. Abra o navegador e acesse:
   ```
   http://localhost:3000
   ```
   *(ou o endereço IP local mostrado no terminal para acessar a partir de outros computadores ou da TV da sala de espera na mesma rede Wi-Fi/Ethernet)*.

---

### Opção 2: Publicação no Servidor Web Local (Apache / Nginx / IIS / WAMP / XAMPP) em `http://10.43.225.80/essgtuis_v4`

O projeto já está configurado com `base: './'` no `vite.config.ts` para funcionar perfeitamente dentro de qualquer subpasta do servidor:

1. Gere o pacote de produção otimizado:
   ```bash
   npm run build
   ```
2. Uma pasta chamada **`dist/`** será gerada.
3. Copie todo o conteúdo da pasta `dist/` para a pasta do seu servidor web correspondente ao caminho `/essgtuis_v4` (exemplo: `C:/xampp/htdocs/essgtuis_v4` ou `/var/www/html/essgtuis_v4`).
4. Acesse diretamente em qualquer computador ou TV da rede através do link:
   ```
   http://10.43.225.80/essgtuis_v4/
   ```

---

### Opção 3: Executar via Node.js Preview na Rede Local

1. Gere o pacote de produção:
   ```bash
   npm run build
   ```
2. Inicie o servidor de pré-visualização integrado:
   ```bash
   npm run preview
   ```
   *(O servidor iniciará escutando em todos os IPs da rede `0.0.0.0:4173`)*.
3. Acesse pelo IP do seu servidor:
   ```
   http://10.43.225.80:4173/
   ```

---

## 📺 Acesso na Sala de Espera (TV / Smart TV)
Para abrir o Painel da Sala de Espera em uma TV ou monitor conectado na rede local:
1. Verifique o endereço IP do computador onde o sistema está rodando (ex: `http://192.168.1.100:3000`).
2. No navegador da TV ou computador conectado à TV, abra o endereço e clique no perfil **"Painel TV - Sala de Espera"** (ou ative o modo Tela Cheia pressionando `F11`).
