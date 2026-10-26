export type VpnStatus = 'disconnected' | 'connecting' | 'connected';

export type VpnProtocol =
  | 'vless'
  | 'wireguard'
  | 'ssh_ws'
  | 'shadowsocks'
  | 'trojan'
  | 'hysteria2'
  | 'dnstt';

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  ip: string;
  port: number;
  protocol: VpnProtocol;
  pingMs: number;
  loadPercent: number;
  isPremium?: boolean;
}

export interface TrafficStats {
  uploadBytes: number;
  downloadBytes: number;
  uploadSpeedKbps: number;
  downloadSpeedKbps: number;
  connectedSinceMs: number | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  totalGB: number;
  remainingGB: number;
  expiresAt: string; // ISO date string
  ticket: string;
  session: string;
}

export interface DeviceBinding {
  deviceId: string;
  deviceName: string;
  enrolledAt: string;
  status: 'active' | 'disabled' | 'pending';
}

export interface VpnSettings {
  killSwitch: boolean;
  autoReconnect: boolean;
  antiQuic: boolean;
  dnsTunnelFallback: boolean;
  dnsServer: string;
  apiBaseUrl: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
  tag?: string;
}

export interface ConnectionHistory {
  id: string;
  serverName: string;
  flag: string;
  protocol: VpnProtocol;
  connectedAt: string;
  durationSeconds: number;
  totalBytes: number;
}

