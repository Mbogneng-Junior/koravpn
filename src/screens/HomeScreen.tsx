import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { ConnectButton } from '../components/ConnectButton';
import { TrafficCard } from '../components/TrafficCard';
import { VpnService } from '../services/vpnService';
import { VpnStatus, VpnServer, TrafficStats, SubscriptionPlan } from '../types/vpn';

interface Props {
  onNavigateToServers: () => void;
  onNavigateToPlan: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onNavigateToServers, onNavigateToPlan }) => {
  const [status, setStatus] = useState<VpnStatus>(VpnService.getStatus());
  const [server, setServer] = useState<VpnServer>(VpnService.getSelectedServer());
  const [stats, setStats] = useState<TrafficStats>({
    uploadBytes: 0,
    downloadBytes: 0,
    uploadSpeedKbps: 0,
    downloadSpeedKbps: 0,
    connectedSinceMs: null,
  });
  const [plan, setPlan] = useState<SubscriptionPlan>(VpnService.getPlan());

  useEffect(() => {
    const unsubState = VpnService.onStateChange(setStatus);
    const unsubTraffic = VpnService.onTrafficUpdate(setStats);
    return () => {
      unsubState();
      unsubTraffic();
    };
  }, []);

  const handleToggleConnect = () => {
    if (status === 'connected') {
      VpnService.disconnect();
    } else {
      VpnService.connect();
    }
  };

  const isConnected = status === 'connected';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête statut & protocole */}
      <View style={styles.topBadgeRow}>
        <View style={styles.badge}>
          <View
            style={[
              styles.badgeDot,
              {
                backgroundColor: isConnected
                  ? colors.accentEmerald
                  : status === 'connecting'
                  ? colors.accentAmber
                  : colors.accentRed,
              },
            ]}
          />
          <Text style={styles.badgeText}>
            {isConnected ? 'TUNNEL CHIFFRÉ' : status === 'connecting' ? 'NÉGOCIATION' : 'NON PROTÉGÉ'}
          </Text>
        </View>

        <TouchableOpacity style={styles.forfaitBadge} onPress={onNavigateToPlan}>
          <Text style={styles.forfaitBadgeText}>🎟️ {plan.remainingGB.toFixed(1)} Go</Text>
        </TouchableOpacity>
      </View>

      {/* Gros bouton interactif */}
      <ConnectButton status={status} onPress={handleToggleConnect} />

      {/* Sélecteur de serveur actif */}
      <TouchableOpacity
        style={styles.serverSelectorCard}
        onPress={onNavigateToServers}
        activeOpacity={0.8}
      >
        <Text style={styles.flagIcon}>{server.flag}</Text>
        <View style={styles.serverInfo}>
          <Text style={styles.serverName}>{server.name}</Text>
          <Text style={styles.serverMeta}>
            {server.city} • Protocole : {server.protocol.toUpperCase()}
          </Text>
        </View>
        <View style={styles.pingBadge}>
          <Text style={styles.pingText}>{server.pingMs} ms</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Carte des flux et forfait */}
      <TrafficCard stats={stats} plan={plan} isConnected={isConnected} />

      {/* Carte d'information de sécurité */}
      <View style={styles.securityPill}>
        <Text style={styles.securityIcon}>🛡️</Text>
        <Text style={styles.securityText}>
          {isConnected
            ? `IP Masquée (${server.ip}) • Chiffrement actif`
            : 'Votre adresse IP réelle et votre trafic sont visibles'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  forfaitBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: colors.accentCyan,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  forfaitBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentCyan,
  },
  serverSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  flagIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  serverMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pingBadge: {
    backgroundColor: 'rgba(0, 255, 163, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  pingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentEmerald,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '300',
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityIcon: {
    fontSize: 16,
  },
  securityText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
});
