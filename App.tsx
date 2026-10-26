import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { ServersScreen } from './src/screens/ServersScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SupportScreen } from './src/screens/SupportScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'home' | 'plan' | 'servers' | 'journal' | 'history' | 'support' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [prevTab, setPrevTab] = useState<Tab>('home');

  const navigateTo = (tab: Tab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const isSubScreen = activeTab === 'history' || activeTab === 'support';

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />

      {/* En-tête de l'application */}
      <View style={styles.topHeader}>
        {isSubScreen ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveTab(prevTab || 'home')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonIcon}>‹</Text>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.brandContainer}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <Text style={styles.brandIcon}>⚡</Text>
            <Text style={styles.brandTitle}>
              KORA<Text style={styles.brandAccent}>.VPN</Text>
            </Text>
          </TouchableOpacity>
        )}

        {/* Boutons d'action rapide dans l'en-tête */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.headerActionBtn,
              activeTab === 'history' && styles.headerActionBtnActive,
            ]}
            onPress={() => navigateTo('history')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerActionIcon}>📜</Text>
            <Text
              style={[
                styles.headerActionLabel,
                activeTab === 'history' && styles.headerActionLabelActive,
              ]}
            >
              Historique
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.headerActionBtn,
              activeTab === 'support' && styles.headerActionBtnActive,
            ]}
            onPress={() => navigateTo('support')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerActionIcon}>🎧</Text>
            <Text
              style={[
                styles.headerActionLabel,
                activeTab === 'support' && styles.headerActionLabelActive,
              ]}
            >
              Support & Essai
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vue active */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToServers={() => setActiveTab('servers')}
            onNavigateToPlan={() => setActiveTab('plan')}
          />
        )}
        {activeTab === 'plan' && <PlanScreen />}
        {activeTab === 'servers' && (
          <ServersScreen onServerSelected={() => setActiveTab('home')} />
        )}
        {activeTab === 'journal' && <JournalScreen />}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'support' && <SupportScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Barre de navigation inférieure */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={styles.tabIcon}>🛡️</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Tunnel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'plan' && styles.tabItemActive]}
          onPress={() => setActiveTab('plan')}
        >
          <Text style={styles.tabIcon}>🎟️</Text>
          <Text style={[styles.tabLabel, activeTab === 'plan' && styles.tabLabelActive]}>
            Forfait
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'servers' && styles.tabItemActive]}
          onPress={() => setActiveTab('servers')}
        >
          <Text style={styles.tabIcon}>🌐</Text>
          <Text style={[styles.tabLabel, activeTab === 'servers' && styles.tabLabelActive]}>
            Serveurs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'journal' && styles.tabItemActive]}
          onPress={() => setActiveTab('journal')}
        >
          <Text style={styles.tabIcon}>💻</Text>
          <Text style={[styles.tabLabel, activeTab === 'journal' && styles.tabLabelActive]}>
            Journal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'settings' && styles.tabItemActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>
            Réglages
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandAccent: {
    color: colors.accentCyan,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  headerActionBtnActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: colors.accentCyan,
  },
  headerActionIcon: {
    fontSize: 12,
  },
  headerActionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  headerActionLabelActive: {
    color: colors.accentCyan,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  backButtonIcon: {
    fontSize: 20,
    color: colors.accentCyan,
    fontWeight: '800',
    marginTop: -2,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  vpsTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vpsTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingVertical: 8,
    paddingBottom: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.accentCyan,
  },
});
