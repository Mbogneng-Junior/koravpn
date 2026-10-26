import { VpnStatus, VpnServer, TrafficStats, SubscriptionPlan, LogEntry, ConnectionHistory } from '../types/vpn';

export const DEFAULT_SERVERS: VpnServer[] = [
  {
    id: 'fr-par-01',
    name: 'Paris Ultra-Fast',
    country: 'France',
    flag: '🇫🇷',
    city: 'Paris',
    ip: '185.12.45.10',
    port: 443,
    protocol: 'vless',
    pingMs: 18,
    loadPercent: 42,
  },
  {
    id: 'de-fra-01',
    name: 'Frankfurt Direct',
    country: 'Allemagne',
    flag: '🇩🇪',
    city: 'Francfort',
    ip: '194.50.21.88',
    port: 443,
    protocol: 'vless',
    pingMs: 26,
    loadPercent: 65,
  },
  {
    id: 'nl-ams-01',
    name: 'Amsterdam Stealth',
    country: 'Pays-Bas',
    flag: '🇳🇱',
    city: 'Amsterdam',
    ip: '45.132.1.200',
    port: 8443,
    protocol: 'ssh_ws',
    pingMs: 29,
    loadPercent: 38,
  },
  {
    id: 'us-nyc-01',
    name: 'New York WireGuard',
    country: 'États-Unis',
    flag: '🇺🇸',
    city: 'New York',
    ip: '198.51.100.4',
    port: 51820,
    protocol: 'wireguard',
    pingMs: 84,
    loadPercent: 55,
  },
  {
    id: 'sg-sin-01',
    name: 'Singapore DNS-Tunnel',
    country: 'Singapour',
    flag: '🇸🇬',
    city: 'Singapour',
    ip: '103.21.244.2',
    port: 53,
    protocol: 'dnstt',
    pingMs: 175,
    loadPercent: 22,
  },
];

export const INITIAL_PLAN: SubscriptionPlan = {
  id: 'plan-unlimited-2026',
  name: 'Pass Découverte VIP',
  status: 'active',
  totalGB: 50,
  remainingGB: 46.8,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  ticket: 'v1:TICKET_DE_DEMO_REVERSE_ENG',
  session: 'sess_99214_alpha',
};

const INITIAL_HISTORY: ConnectionHistory[] = [
  {
    id: 'hist-1',
    serverName: 'Paris Ultra-Fast',
    flag: '🇫🇷',
    protocol: 'vless',
    connectedAt: 'Aujourd’hui, 08:15',
    durationSeconds: 3840,
    totalBytes: 1024 * 1024 * 420, // 420 Mo
  },
  {
    id: 'hist-2',
    serverName: 'Amsterdam Stealth',
    flag: '🇳🇱',
    protocol: 'ssh_ws',
    connectedAt: 'Hier, 21:30',
    durationSeconds: 7200,
    totalBytes: 1024 * 1024 * 1024 * 1.8, // 1.8 Go
  },
  {
    id: 'hist-3',
    serverName: 'Frankfurt Direct',
    flag: '🇩🇪',
    protocol: 'vless',
    connectedAt: '23 Octobre, 14:10',
    durationSeconds: 1500,
    totalBytes: 1024 * 1024 * 180, // 180 Mo
  },
];

type StateListener = (status: VpnStatus) => void;
type TrafficListener = (stats: TrafficStats) => void;
type LogListener = (logs: LogEntry[]) => void;

class VpnServiceManager {
  private status: VpnStatus = 'disconnected';
  private selectedServer: VpnServer = DEFAULT_SERVERS[0];
  private currentPlan: SubscriptionPlan = INITIAL_PLAN;
  private stateListeners: Set<StateListener> = new Set();
  private trafficListeners: Set<TrafficListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private logs: LogEntry[] = [];
  private history: ConnectionHistory[] = INITIAL_HISTORY;
  private trafficInterval: any = null;

  private stats: TrafficStats = {
    uploadBytes: 0,
    downloadBytes: 0,
    uploadSpeedKbps: 0,
    downloadSpeedKbps: 0,
    connectedSinceMs: null,
  };

  constructor() {
    this.addLog('info', 'Système Kora VPN prêt (Moteur Sing-box v1.11)', 'CORE');
    this.addLog('info', 'Empreinte appareil liée avec succès', 'AUTH');
  }

  getStatus(): VpnStatus {
    return this.status;
  }

  getSelectedServer(): VpnServer {
    return this.selectedServer;
  }

  setSelectedServer(server: VpnServer) {
    this.selectedServer = server;
    this.addLog('info', `Nœud cible sélectionné : ${server.name} (${server.protocol.toUpperCase()})`, 'ROUTER');
  }

  getPlan(): SubscriptionPlan {
    return this.currentPlan;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getHistory(): ConnectionHistory[] {
    return [...this.history];
  }

  clearLogs() {
    this.logs = [];
    this.notifyLogs();
  }

  addLog(level: LogEntry['level'], message: string, tag?: string) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour12: false }),
      level,
      message,
      tag: tag || 'VPN',
    };
    this.logs.push(entry);
    if (this.logs.length > 200) this.logs.shift();
    this.notifyLogs();
  }

  activateTicket(ticketValue: string): boolean {
    if (!ticketValue || ticketValue.trim().length < 6) return false;
    this.currentPlan = {
      ...this.currentPlan,
      status: 'active',
      ticket: ticketValue.trim(),
      remainingGB: 50.0,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
    this.addLog('success', 'Jeton validé : Forfait 50 Go activé (7 jours)', 'TICKET');
    return true;
  }

  async connect(): Promise<boolean> {
    if (this.status !== 'disconnected') return false;

    this.setStatus('connecting');
    this.addLog('info', `Démarrage du tunnel vers ${this.selectedServer.ip}:${this.selectedServer.port}...`, 'TUNNEL');
    this.addLog('debug', `Création interface virtuelle TUN (MTU 1500, Anti-QUIC activé)`, 'TUN');

    await new Promise((res) => setTimeout(res, 600));
    this.addLog('debug', `Négociation protocole ${this.selectedServer.protocol.toUpperCase()} Reality...`, 'SECURITY');

    await new Promise((res) => setTimeout(res, 800));
    this.addLog('success', `Handshake chiffré réussi avec ${this.selectedServer.name} (${this.selectedServer.pingMs} ms)`, 'CONNECTED');

    this.stats = {
      uploadBytes: 12400,
      downloadBytes: 45600,
      uploadSpeedKbps: 0,
      downloadSpeedKbps: 0,
      connectedSinceMs: Date.now(),
    };

    this.setStatus('connected');
    this.startTrafficOdometer();
    return true;
  }

  async disconnect(): Promise<void> {
    if (this.status === 'disconnected') return;

    this.stopTrafficOdometer();
    this.addLog('warn', `Fermeture de l'interface réseau TUN`, 'DISCONNECT');

    // Sauvegarde dans l'historique
    if (this.stats.connectedSinceMs) {
      const durationSec = Math.round((Date.now() - this.stats.connectedSinceMs) / 1000);
      const newHistoryItem: ConnectionHistory = {
        id: Math.random().toString(36).substring(2, 9),
        serverName: this.selectedServer.name,
        flag: this.selectedServer.flag,
        protocol: this.selectedServer.protocol,
        connectedAt: 'À l’instant',
        durationSeconds: Math.max(1, durationSec),
        totalBytes: this.stats.uploadBytes + this.stats.downloadBytes,
      };
      this.history = [newHistoryItem, ...this.history];
    }

    this.stats.uploadSpeedKbps = 0;
    this.stats.downloadSpeedKbps = 0;
    this.stats.connectedSinceMs = null;
    this.notifyTraffic();

    this.setStatus('disconnected');
    this.addLog('info', `Tunnel fermé proprement`, 'IDLE');
  }

  private setStatus(newStatus: VpnStatus) {
    this.status = newStatus;
    this.stateListeners.forEach((fn) => fn(this.status));
  }

  private startTrafficOdometer() {
    this.stopTrafficOdometer();
    this.trafficInterval = setInterval(() => {
      if (this.status !== 'connected') return;

      const upDelta = Math.floor(Math.random() * 80 + 20) * 1024;
      const downDelta = Math.floor(Math.random() * 350 + 80) * 1024;

      this.stats.uploadBytes += upDelta;
      this.stats.downloadBytes += downDelta;
      this.stats.uploadSpeedKbps = Math.round((upDelta * 8) / 1024);
      this.stats.downloadSpeedKbps = Math.round((downDelta * 8) / 1024);

      const mbConsumed = (upDelta + downDelta) / (1024 * 1024);
      const gbConsumed = mbConsumed / 1024;
      this.currentPlan.remainingGB = Math.max(0, this.currentPlan.remainingGB - gbConsumed);

      this.notifyTraffic();
    }, 1000);
  }

  private stopTrafficOdometer() {
    if (this.trafficInterval) {
      clearInterval(this.trafficInterval);
      this.trafficInterval = null;
    }
  }

  private notifyTraffic() {
    this.trafficListeners.forEach((fn) => fn({ ...this.stats }));
  }

  private notifyLogs() {
    this.logListeners.forEach((fn) => fn([...this.logs]));
  }

  onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.status);
    return () => this.stateListeners.delete(listener);
  }

  onTrafficUpdate(listener: TrafficListener): () => void {
    this.trafficListeners.add(listener);
    listener({ ...this.stats });
    return () => this.trafficListeners.delete(listener);
  }

  onLog(listener: LogListener): () => void {
    this.logListeners.add(listener);
    listener([...this.logs]);
    return () => this.logListeners.delete(listener);
  }
}

export const VpnService = new VpnServiceManager();

