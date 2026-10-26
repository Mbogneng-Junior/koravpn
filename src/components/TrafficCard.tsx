import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { TrafficStats, SubscriptionPlan } from '../types/vpn';

interface Props {
  stats: TrafficStats;
  plan: SubscriptionPlan;
  isConnected: boolean;
}

export const TrafficCard: React.FC<Props> = ({ stats, plan, isConnected }) => {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  const formatSpeed = (kbps: number) => {
    if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mb/s`;
    return `${kbps} Kb/s`;
  };

  const progressPercent = Math.min(100, Math.max(0, (plan.remainingGB / plan.totalGB) * 100));

  return (
    <View style={styles.card}>
      {/* Ligne des débits instantanés */}
      <View style={styles.speedRow}>
        <View style={styles.speedCol}>
          <Text style={styles.speedIcon}>⬇️</Text>
          <View>
            <Text style={styles.speedLabel}>RÉCEPTION</Text>
            <Text style={[styles.speedValue, isConnected && { color: colors.accentEmerald }]}>
              {isConnected ? formatSpeed(stats.downloadSpeedKbps) : '0 Kb/s'}
            </Text>
            <Text style={styles.totalDataText}>{formatBytes(stats.downloadBytes)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.speedCol}>
          <Text style={styles.speedIcon}>⬆️</Text>
          <View>
            <Text style={styles.speedLabel}>ÉMISSION</Text>
            <Text style={[styles.speedValue, isConnected && { color: colors.accentCyan }]}>
              {isConnected ? formatSpeed(stats.uploadSpeedKbps) : '0 Kb/s'}
            </Text>
            <Text style={styles.totalDataText}>{formatBytes(stats.uploadBytes)}</Text>
          </View>
        </View>
      </View>

      {/* Barre de quota du forfait */}
      <View style={styles.quotaSection}>
        <View style={styles.quotaHeader}>
          <Text style={styles.quotaTitle}>FORFAIT INTERNET RESTANT</Text>
          <Text style={styles.quotaFigures}>
            <Text style={styles.quotaRemaining}>{plan.remainingGB.toFixed(2)} Go</Text>
            <Text style={styles.quotaTotal}> / {plan.totalGB} Go</Text>
          </Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor:
                  progressPercent < 20 ? colors.accentRed : colors.accentCyan,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: 12,
  },
  speedIcon: {
    fontSize: 22,
  },
  speedLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  speedValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1,
  },
  totalDataText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  quotaSection: {
    marginTop: 14,
  },
  quotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quotaTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  quotaFigures: {
    fontSize: 11,
  },
  quotaRemaining: {
    color: colors.accentEmerald,
    fontWeight: '800',
  },
  quotaTotal: {
    color: colors.textMuted,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
