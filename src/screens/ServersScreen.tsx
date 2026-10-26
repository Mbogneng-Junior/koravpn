import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { DEFAULT_SERVERS, VpnService } from '../services/vpnService';
import { VpnServer } from '../types/vpn';

interface Props {
  onServerSelected: (server: VpnServer) => void;
}

export const ServersScreen: React.FC<Props> = ({ onServerSelected }) => {
  const [selectedId, setSelectedId] = useState(VpnService.getSelectedServer().id);
  const [filterProtocol, setFilterProtocol] = useState<string>('all');

  const protocols = ['all', 'vless', 'wireguard', 'ssh_ws', 'dnstt'];

  const filteredServers = DEFAULT_SERVERS.filter((s) => {
    if (filterProtocol === 'all') return true;
    return s.protocol === filterProtocol;
  });

  const handleSelect = (server: VpnServer) => {
    setSelectedId(server.id);
    VpnService.setSelectedServer(server);
    onServerSelected(server);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emplacements & Nœuds</Text>
      <Text style={styles.subtitle}>
        Choisissez un relais optimisé pour votre connexion.
      </Text>

      {/* Filtres de protocole */}
      <View style={styles.filterRow}>
        {protocols.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.filterChip, filterProtocol === p && styles.filterChipActive]}
            onPress={() => setFilterProtocol(p)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterProtocol === p && styles.filterChipTextActive,
              ]}
            >
              {p === 'all' ? 'TOUS' : p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des serveurs */}
      <FlatList
        data={filteredServers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              style={[styles.serverCard, isSelected && styles.serverCardSelected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{item.flag}</Text>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.serverName}>{item.name}</Text>
                  <View style={styles.protocolBadge}>
                    <Text style={styles.protocolText}>{item.protocol.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.serverLocation}>
                  {item.city}, {item.country} • Charge : {item.loadPercent}%
                </Text>
              </View>

              <View style={styles.rightCol}>
                <View
                  style={[
                    styles.pingPill,
                    {
                      backgroundColor:
                        item.pingMs < 50
                          ? 'rgba(0, 255, 163, 0.12)'
                          : item.pingMs < 120
                          ? 'rgba(255, 184, 0, 0.12)'
                          : 'rgba(255, 51, 102, 0.12)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pingText,
                      {
                        color:
                          item.pingMs < 50
                            ? colors.accentEmerald
                            : item.pingMs < 120
                            ? colors.accentAmber
                            : colors.accentRed,
                      },
                    ]}
                  >
                    {item.pingMs} ms
                  </Text>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  filterChipActive: {
    borderColor: colors.accentCyan,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.accentCyan,
  },
  listContent: {
    paddingBottom: 30,
  },
  serverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 10,
  },
  serverCardSelected: {
    borderColor: colors.accentCyan,
    backgroundColor: colors.backgroundCardHover,
  },
  flag: {
    fontSize: 26,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serverName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  protocolBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  protocolText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  serverLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pingPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.accentCyan,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentCyan,
  },
});
