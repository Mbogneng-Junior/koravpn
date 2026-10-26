import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [antiQuic, setAntiQuic] = useState(true);
  const [dnsFallback, setDnsFallback] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState('https://votre-propre-vps.com/api');

  const handleSaveApi = () => {
    Alert.alert('Configuration enregistrée', `L'URL API personnalisée a été mise à jour : ${customApiUrl}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Paramètres Avancés</Text>
      <Text style={styles.subtitle}>
        Personnalisez la sécurité du tunnel et branchez votre propre backend.
      </Text>

      {/* Section Réseau & Sécurité */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SÉCURITÉ DU TUNNEL</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Kill Switch Strict</Text>
            <Text style={styles.settingDesc}>
              Coupe tout accès Internet si le tunnel VPN s'interrompt de manière inattendue.
            </Text>
          </View>
          <Switch
            value={killSwitch}
            onValueChange={setKillSwitch}
            trackColor={{ false: colors.surfaceBorder, true: colors.accentCyan }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reconnexion Automatique</Text>
            <Text style={styles.settingDesc}>
              Rétablit instantanément le tunnel lors d'une bascule Wi-Fi $\leftrightarrow$ 4G/5G.
            </Text>
          </View>
          <Switch
            value={autoReconnect}
            onValueChange={setAutoReconnect}
            trackColor={{ false: colors.surfaceBorder, true: colors.accentCyan }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Règle Anti-QUIC (Port UDP 443)</Text>
            <Text style={styles.settingDesc}>
              Force le fallback HTTP/2 TCP pour traverser les pare-feux stricts.
            </Text>
          </View>
          <Switch
            value={antiQuic}
            onValueChange={setAntiQuic}
            trackColor={{ false: colors.surfaceBorder, true: colors.accentCyan }}
            thumbColor="#FFF"
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Secours DNS Tunnel (DNSTT)</Text>
            <Text style={styles.settingDesc}>
              Tunnel chiffré via requêtes DNS (port 53) en cas de blocage total.
            </Text>
          </View>
          <Switch
            value={dnsFallback}
            onValueChange={setDnsFallback}
            trackColor={{ false: colors.surfaceBorder, true: colors.accentCyan }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {/* Section Backend & Routage Personnalisé (Pour votre futur VPS) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ROUTAGE & VPS PERSONNEL</Text>
        <Text style={styles.sectionHelp}>
          Configurez ici l'adresse de votre propre backend d'autorité quand votre VPS sera déployé :
        </Text>

        <TextInput
          style={styles.input}
          value={customApiUrl}
          onChangeText={setCustomApiUrl}
          placeholder="https://mon-vps.xyz/api"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveApi} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Appliquer l'URL de mon VPS</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  section: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentCyan,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionHelp: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  input: {
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
  saveBtn: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: colors.accentCyan,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentCyan,
  },
});
