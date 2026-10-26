import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { VpnStatus } from '../types/vpn';

interface Props {
  status: VpnStatus;
  onPress: () => void;
}

export const ConnectButton: React.FC<Props> = ({ status, onPress }) => {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const getButtonColor = () => {
    if (isConnected) return colors.accentEmerald;
    if (isConnecting) return colors.accentAmber;
    return colors.accentCyan;
  };

  const getGlowColor = () => {
    if (isConnected) return colors.buttonGlowConnected;
    if (isConnecting) return colors.buttonGlowConnecting;
    return 'rgba(0, 240, 255, 0.2)';
  };

  return (
    <View style={styles.outerContainer}>
      {/* Halo lumineux extérieur */}
      <View style={[styles.haloRing, { borderColor: getButtonColor(), backgroundColor: getGlowColor() }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.buttonBody, { borderColor: getButtonColor() }]}
          onPress={onPress}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator size="large" color={colors.accentAmber} />
          ) : (
            <View style={styles.iconContainer}>
              <View style={[styles.powerIndicator, { backgroundColor: getButtonColor() }]} />
              <Text style={styles.powerIcon}>⚡</Text>
            </View>
          )}

          <Text style={[styles.statusLabel, { color: getButtonColor() }]}>
            {isConnected ? 'CONNECTÉ' : isConnecting ? 'NÉGOCIATION...' : 'DÉCONNECTÉ'}
          </Text>
          <Text style={styles.subLabel}>
            {isConnected ? 'Appuyez pour couper' : 'Appuyez pour sécuriser'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  haloRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBody: {
    width: 175,
    height: 175,
    borderRadius: 88,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  powerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  powerIcon: {
    fontSize: 34,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  subLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },
});
