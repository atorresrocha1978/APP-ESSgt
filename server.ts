import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const SERVER_IP = "10.43.225.80";

// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const STATE_FILE = path.join(DATA_DIR, "clinic_state.json");

// Middleware
app.use(express.json({ limit: "15mb" }));

// Permissive CORS for intranet / local network access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// SSE Clients list for real-time synchronization across LAN
interface SSEClient {
  id: string;
  res: Response;
  ip: string;
  connectedAt: string;
}
let sseClients: SSEClient[] = [];

// Helper to broadcast SSE event to all connected browsers on the local network
function broadcastSSE(type: string, payload: any, senderClientId?: string) {
  const message = `event: message\ndata: ${JSON.stringify({ type, payload, timestamp: new Date().toISOString() })}\n\n`;
  sseClients.forEach((client) => {
    if (!senderClientId || client.id !== senderClientId) {
      try {
        client.res.write(message);
      } catch (e) {
        console.error(`[SSE] Erro ao enviar para cliente ${client.id}:`, e);
      }
    }
  });
}

// In-memory state cache
let sharedState: Record<string, any> = {
  patients: null,
  callHistory: null,
  currentCall: null,
  records: null,
  rooms: null,
  users: null,
  militaryRanks: null,
  opms: null,
  healthInsurances: null,
  audioSettings: null,
  lastUpdated: new Date().toISOString(),
};

// Load saved state from disk if exists
try {
  if (fs.existsSync(STATE_FILE)) {
    const raw = fs.readFileSync(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      sharedState = { ...sharedState, ...parsed };
      console.log("[UIS ESSgt] Estado da clínica carregado do arquivo local.");
    }
  }
} catch (e) {
  console.warn("[UIS ESSgt] Não foi possível ler arquivo de estado local:", e);
}

// Helper to save state to disk
function saveStateToDisk() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(sharedState, null, 2), "utf-8");
  } catch (e) {
    console.error("[UIS ESSgt] Erro ao gravar estado em disco:", e);
  }
}

// ------------------- API ENDPOINTS -------------------

// 1. Health check & Network information
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    system: "ESSgt - UIS", 
    serverIp: SERVER_IP,
    port: PORT,
    localUrl: `http://localhost:${PORT}`,
    networkUrl: `http://${SERVER_IP}:${PORT}`,
    connectedClients: sseClients.length,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/network-info", (req: Request, res: Response) => {
  res.json({
    serverIp: SERVER_IP,
    port: PORT,
    accessUrl: `http://${SERVER_IP}:${PORT}`,
    connectedClients: sseClients.length,
    status: "operacional",
    serverTime: new Date().toISOString()
  });
});

// 2. SSE Stream for Real-Time synchronization across all browsers
app.get("/api/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "desconhecido";

  const newClient: SSEClient = {
    id: clientId,
    res,
    ip: String(clientIp),
    connectedAt: new Date().toISOString(),
  };

  sseClients.push(newClient);
  console.log(`[SSE] Novo navegador conectado (${newClient.ip}). Total conectados: ${sseClients.length}`);

  // Send initial connection confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ 
    clientId, 
    serverIp: SERVER_IP, 
    port: PORT,
    message: "Conexão de sincronização em tempo real ativa",
    connectedClients: sseClients.length 
  })}\n\n`);

  // Heartbeat ping every 25 seconds to keep connection alive through firewalls/routers
  const pingInterval = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(pingInterval);
    sseClients = sseClients.filter((c) => c.id !== clientId);
    console.log(`[SSE] Cliente desconectado (${clientId}). Restantes: ${sseClients.length}`);
  });
});

// 3. Full / Partial State Synchronization
app.get("/api/state", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: sharedState,
    timestamp: sharedState.lastUpdated || new Date().toISOString()
  });
});

app.post("/api/state", (req: Request, res: Response) => {
  const { updates, clientId } = req.body;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ success: false, error: "Dados inválidos" });
    return;
  }

  // Merge updates
  sharedState = {
    ...sharedState,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  saveStateToDisk();

  // Broadcast to all other workstations and TV
  broadcastSSE("STATE_UPDATED", {
    updates,
    senderId: clientId,
    lastUpdated: sharedState.lastUpdated
  }, clientId);

  res.json({ success: true, lastUpdated: sharedState.lastUpdated });
});

// 4. Dedicated Instant Patient Call (Triggers visual alert & audio chime on TV immediately)
app.post("/api/call", (req: Request, res: Response) => {
  const { call, audioSettings, patients, clientId } = req.body;

  if (!call || !call.patientId) {
    res.status(400).json({ success: false, error: "Dados da chamada incompletos" });
    return;
  }

  // Update currentCall and callHistory in shared state
  sharedState.currentCall = call;
  const prevHistory = Array.isArray(sharedState.callHistory) ? sharedState.callHistory : [];
  sharedState.callHistory = [call, ...prevHistory.filter((c: any) => c.id !== call.id).slice(0, 19)];
  
  // If updated patients queue was passed, update it too
  if (Array.isArray(patients)) {
    sharedState.patients = patients;
  }

  sharedState.lastUpdated = new Date().toISOString();
  saveStateToDisk();

  // Broadcast the call event to ALL connected browsers (including TV panel for chime/voice)
  broadcastSSE("CALL_PATIENT", {
    call,
    audioSettings: audioSettings || sharedState.audioSettings,
    patients: sharedState.patients,
    callHistory: sharedState.callHistory,
    currentCall: call
  });

  console.log(`[CHAMADA REALIZADA] Senha ${call.ticketNumber} - ${call.patientName} -> ${call.roomName}`);

  res.json({ success: true, call });
});

// 5. Patient queue management endpoint (fast updates)
app.post("/api/patients", (req: Request, res: Response) => {
  const { patients, clientId } = req.body;
  if (!Array.isArray(patients)) {
    res.status(400).json({ success: false, error: "Lista de pacientes inválida" });
    return;
  }

  sharedState.patients = patients;
  sharedState.lastUpdated = new Date().toISOString();
  saveStateToDisk();

  broadcastSSE("PATIENTS_SYNC", {
    patients,
    senderId: clientId
  }, clientId);

  res.json({ success: true, count: patients.length });
});

// ------------------- VITE / STATIC SERVING -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: "0.0.0.0",
        port: PORT,
        allowedHosts: true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(`[UIS - ESSgt] Servidor Operacional Iniciado com Sucesso!`);
    console.log(`[UIS - ESSgt] IP Local da Máquina: http://localhost:${PORT}`);
    console.log(`[UIS - ESSgt] Acesso em Rede Local: http://${SERVER_IP}:${PORT}`);
    console.log(`[UIS - ESSgt] Porta de Conexão: ${PORT} (TCP)`);
    console.log(`[UIS - ESSgt] Sincronização em Tempo Real (SSE): Ativa`);
    console.log(`=======================================================`);
  });
}

startServer();
