import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { VpnService } from '../services/vpnService';
import { LogEntry } from '../types/vpn';

export const JournalScreen: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(VpnService.getLogs());
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const unsub = VpnService.onLog((newLogs) => {
      setLogs(newLogs);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });
    return unsub;
  }, []);

  const handleClear = () => {
    VpnService.clearLogs();
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.tag}] ${l.message}`).join('\n');
    Alert.alert('Logs copiés', `${logs.length} lignes prêtes à être partagées.`);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return colors.accentEmerald;
      case 'error':
        return colors.accentRed;
      case 'warn':
        return colors.accentAmber;
      case 'debug':
        return colors.accentPurple;
      default:
        return colors.accentCyan;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Journal & Console</Text>
          <Text style={styles.subtitle}>Flux en direct du moteur de routage Sing-box</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnAction} onPress={handleCopyLogs}>
            <Text style={styles.btnActionText}>📋 Copier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnAction, styles.btnClear]} onPress={handleClear}>
            <Text style={[styles.btnActionText, { color: colors.accentRed }]}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terminal View */}
      <View style={styles.terminalBox}>
        <View style={styles.terminalTopBar}>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
            <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
            <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
          </View>
          <Text style={styles.terminalTitle}>kora-tunnel.log</Text>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>DIRECT</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.terminalContent}
          contentContainerStyle={styles.terminalScroll}
        >
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>Aucun événement enregistré. Activez le tunnel pour voir les flux.</Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logLine}>
                <Text style={styles.logTime}>{log.timestamp}</Text>
                <View style={[styles.tagBadge, { borderColor: getLevelColor(log.level) }]}>
                  <Text style={[styles.tagText, { color: getLevelColor(log.level) }]}>
                    {log.tag}
                  </Text>
                </View>
                <Text style={[styles.logMsg, { color: getLevelColor(log.level) }]}>
                  {log.message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAction: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnClear: {
    borderColor: 'rgba(255, 51, 102, 0.3)',
  },
  btnActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  terminalBox: {
    flex: 1,
    backgroundColor: '#04060A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  terminalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0F1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  terminalTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentEmerald,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentEmerald,
  },
  terminalContent: {
    flex: 1,
    padding: 10,
  },
  terminalScroll: {
    paddingBottom: 20,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
    fontStyle: 'italic',
    padding: 10,
  },
  logLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  logTime: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 44,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  logMsg: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
