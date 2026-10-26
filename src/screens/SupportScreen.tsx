import React, { useState } from 'react';
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
import { DeviceService } from '../services/deviceService';

export const SupportScreen: React.FC = () => {
  const [trialClaimed, setTrialClaimed] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleClaimFreeTrial = () => {
    if (trialClaimed) {
      Alert.alert('Information', 'Un essai gratuit a déjà été activé pour cet appareil.');
      return;
    }
    const success = VpnService.activateTicket('v1:TRIAL_PASS_24H_FREE');
    if (success) {
      setTrialClaimed(true);
      Alert.alert('🎉 Essai 24H Activé !', 'Votre appareil a reçu un forfait d’essai de 50 Go valable pendant 24 heures.');
    }
  };

  const handleContact = (platform: string) => {
    Alert.alert(
      `Contact ${platform}`,
      `Votre identifiant d'appareil (${DeviceService.getDeviceId()}) sera automatiquement attaché au message d'assistance.`
    );
  };

  const faqs = [
    {
      q: 'Comment fonctionne l’attribution de mon forfait ?',
      a: 'Votre administrateur reçoit l’empreinte de votre appareil (Device ID). Il génère un ticket chiffré correspondant à vos gigas que vous activez dans l’onglet « Mon Forfait ».',
    },
    {
      q: 'Que faire si le réseau bloque ma connexion ?',
      a: 'Basculez sur le protocole « SSH_WS » (Stealth) ou « DNSTT » (Tunnel DNS sur port 53) depuis l’écran des serveurs pour contourner les pare-feux stricts.',
    },
    {
      q: 'Puis-je utiliser mes propres serveurs VPS ?',
      a: 'Oui ! Rendez-vous dans Réglages > Routage & VPS Personnel et entrez l’URL de votre propre serveur Sing-box.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Support & Assistance</Text>
      <Text style={styles.subtitle}>Besoin d'aide ou d'un essai de test ? Retrouvez toutes les solutions.</Text>

      {/* Bannière Essai Gratuit 24h (Similaire à free-trial.tsx) */}
      <View style={styles.trialCard}>
        <View style={styles.trialHeader}>
          <Text style={styles.trialTag}>OFFRE DÉCOUVERTE</Text>
          <Text style={styles.trialBadge}>GRATUIT 24H</Text>
        </View>
        <Text style={styles.trialTitle}>Tester la vitesse du tunnel</Text>
        <Text style={styles.trialDesc}>
          Activez un laissez-passer gratuit de 24h sans engagement pour tester la vitesse de nos nœuds VLESS Reality.
        </Text>
        <TouchableOpacity
          style={[styles.trialBtn, trialClaimed && { backgroundColor: colors.accentEmerald }]}
          onPress={handleClaimFreeTrial}
          activeOpacity={0.8}
        >
          <Text style={styles.trialBtnText}>
            {trialClaimed ? '✓ Essai déjà activé' : '🚀 Activer mon Pass Découverte'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUESTIONS FRÉQUENTES (FAQ)</Text>
        {faqs.map((faq, index) => {
          const isOpen = expandedFaq === index;
          return (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => setExpandedFaq(isOpen ? null : index)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Text style={styles.faqArrow}>{isOpen ? '▲' : '▼'}</Text>
              </View>
              {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Canaux d'assistance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTACTER L'ADMINISTRATION</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => handleContact('Telegram')}>
            <Text style={styles.contactIcon}>✈️</Text>
            <Text style={styles.contactText}>Telegram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => handleContact('WhatsApp')}>
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => handleContact('Email')}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
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
  trialCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    marginBottom: 20,
  },
  trialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentCyan,
    letterSpacing: 1,
  },
  trialBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    color: colors.accentCyan,
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  trialDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 14,
  },
  trialBtn: {
    backgroundColor: colors.accentCyan,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  trialBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentCyan,
    letterSpacing: 1,
    marginBottom: 10,
  },
  faqCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  faqArrow: {
    fontSize: 10,
    color: colors.textMuted,
  },
  faqAnswer: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  contactIcon: {
    fontSize: 18,
  },
  contactText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
