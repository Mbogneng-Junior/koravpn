import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { VpnService } from '../services/vpnService';
import { ConnectionHistory } from '../types/vpn';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<ConnectionHistory[]>(VpnService.getHistory());

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const totalUsedBytes = history.reduce((acc, h) => acc + h.totalBytes, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Sessions</Text>
      <Text style={styles.subtitle}>Consultez l'historique et le volume de données consommées.</Text>

      {/* Résumé global */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>SESSIONS TOTALES</Text>
          <Text style={styles.summaryValue}>{history.length}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>DONNÉES ÉCHANGÉES</Text>
          <Text style={[styles.summaryValue, { color: colors.accentCyan }]}>
            {formatBytes(totalUsedBytes)}
          </Text>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.infoCol}>
              <View style={styles.rowBetween}>
                <Text style={styles.serverName}>{item.serverName}</Text>
                <Text style={styles.timeText}>{item.connectedAt}</Text>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.protoBadge}>
                  <Text style={styles.protoText}>{item.protocol.toUpperCase()}</Text>
                </View>
                <Text style={styles.metaText}>Durée : {formatDuration(item.durationSeconds)}</Text>
                <Text style={styles.metaText}>•</Text>
                <Text style={[styles.metaText, { color: colors.accentEmerald, fontWeight: '700' }]}>
                  {formatBytes(item.totalBytes)}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  list: {
    paddingBottom: 30,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 12,
    marginBottom: 10,
  },
  flag: {
    fontSize: 26,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serverName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  protoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  protoText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
