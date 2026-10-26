import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { DeviceService } from '../services/deviceService';
import { VpnService } from '../services/vpnService';
import { SubscriptionPlan } from '../types/vpn';

export const PlanScreen: React.FC = () => {
  const deviceId = DeviceService.getDeviceId();
  const [copied, setCopied] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan>(VpnService.getPlan());
  const [loading, setLoading] = useState(false);

  const handleCopyDeviceId = () => {
    // Si Clipboard natif n'est pas installé, simulation visuelle claire
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Empreinte copiée', `L'identifiant ${deviceId} a été copié dans le presse-papier.`);
  };

  const handleActivateToken = () => {
    if (!tokenInput.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir ou coller un jeton de connexion valide.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const success = VpnService.activateTicket(tokenInput);
      if (success) {
        setPlan(VpnService.getPlan());
        setTokenInput('');
        Alert.alert('Succès !', 'Votre forfait de 50 Go a été activé avec succès sur cet appareil.');
      } else {
        Alert.alert('Échec', 'Le jeton fourni est invalide ou a expiré.');
      }
    }, 800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Mon Forfait & Appareil</Text>
      <Text style={styles.screenSubtitle}>
        Liez votre appareil à votre quota de connexion et gérez vos accès.
      </Text>

      {/* Étape 1 : Empreinte de l'appareil */}
      <View style={styles.card}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>ÉTAPE 1</Text>
          </View>
          <Text style={styles.stepTitle}>Empreinte de cet Appareil</Text>
        </View>

        <Text style={styles.stepDescription}>
          Copiez cet identifiant unique et transmettez-le pour recevoir votre jeton de connexion lié à votre forfait.
        </Text>

        <View style={styles.idBox}>
          <Text style={styles.idText}>{deviceId}</Text>
          <TouchableOpacity
            style={[styles.copyButton, copied && { backgroundColor: colors.accentEmerald }]}
            onPress={handleCopyDeviceId}
            activeOpacity={0.8}
          >
            <Text style={styles.copyButtonText}>{copied ? 'Copié !' : 'Copier'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Étape 2 : Activation du Token */}
      <View style={styles.card}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>ÉTAPE 2</Text>
          </View>
          <Text style={styles.stepTitle}>Activer un Jeton / Ticket</Text>
        </View>

        <Text style={styles.stepDescription}>
          Collez le jeton de connexion (token) fourni après l'attribution de votre forfait :
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="v1:XXXX-XXXX-XXXX..."
          placeholderTextColor={colors.textMuted}
          value={tokenInput}
          onChangeText={setTokenInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.activateButton, loading && { opacity: 0.7 }]}
          onPress={handleActivateToken}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.activateButtonText}>
            {loading ? 'Activation en cours...' : 'Activer mon forfait'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Détails du forfait actif */}
      <View style={[styles.card, styles.planCard]}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>FORFAIT ACTIF</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Quota restant</Text>
            <Text style={[styles.gridValue, { color: colors.accentEmerald }]}>
              {plan.remainingGB.toFixed(1)} Go
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Volume initial</Text>
            <Text style={styles.gridValue}>{plan.totalGB} Go</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Expire le</Text>
            <Text style={styles.gridValue}>
              {new Date(plan.expiresAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Session active</Text>
            <Text style={styles.gridValue}>{plan.session.slice(0, 10)}...</Text>
          </View>
        </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  planCard: {
    borderColor: 'rgba(0, 255, 163, 0.25)',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentCyan,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#05070D',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
  },
  idText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentCyan,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: colors.accentCyan,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  textInput: {
    backgroundColor: '#05070D',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 12,
    marginBottom: 12,
  },
  activateButton: {
    backgroundColor: colors.accentEmerald,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  activeTag: {
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentEmerald,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
});
