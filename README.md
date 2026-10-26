# ⚡ Kora VPN (Frontend Clean-Room Expo / React Native)

Reconstruction indépendante (clean-room) de l'interface et de la logique métier de l'application VPN inspectée (**SXB VPN 1.2.1**), conçue pour se connecter à votre propre infrastructure VPS (Sing-box / VLESS Reality / VMess / Shadowsocks).

---

## 📱 Écrans et Fonctionnalités Implémentés

| Écran | Onglet / Accès | Fonctionnalités & Logique métier |
| :--- | :--- | :--- |
| **Tunnel (Accueil)** | Onglet `Tunnel` | • Bouton néon interactif avec animations d'ondes pulsées<br>• Indicateur de chiffrement (`CHIFFRÉ`, `NÉGOCIATION`, `NON PROTÉGÉ`)<br>• Carte de trafic en temps réel (vitesse Up/Down, Go consommés / restants, jauge dynamique)<br>• Sélecteur rapide de serveur avec ping en direct |
| **Mon Forfait** | Onglet `Forfait` | • **Étape 1 : Empreinte de l'appareil (`deviceId`)** calculée avec bouton de copie en 1 clic<br>• **Étape 2 : Activation de Token / Jeton d'accès** avec validation et mise à jour instantanée du quota (50 Go)<br>• Grille récapitulative du forfait actif (volume restant, session, expiration) |
| **Serveurs** | Onglet `Serveurs` | • Filtrage multi-protocoles : `TOUS`, `VLESS`, `VMESS`, `TROJAN`, `SHADOWSOCKS`<br>• Nœuds internationaux (France, Allemagne, USA, Singapour, Pays-Bas, etc.)<br>• Indicateur de latence coloré (< 50ms vert, < 100ms cyan, etc.)<br>• Sélection et bascule immédiate du serveur actif |
| **Journal (Console)** | Onglet `Journal` | • Console de streaming des logs en temps réel (format terminal style Unix)<br>• Défilement automatique, filtrage par sévérité (`INFO`, `SUCCESS`, `WARN`, `ERROR`)<br>• Bouton de copie complète des logs d'audit et bouton pour vider la console |
| **Paramètres** | Onglet `Réglages` | • Bascule Kill-Switch strict<br>• Reconnexion automatique (Wi-Fi $\leftrightarrow$ 4G/5G)<br>• Règle Anti-QUIC (blocage UDP 443 pour forcer HTTP/2 TCP)<br>• Secours DNS Tunnel (DNSTT port 53)<br>• **Champ d'URL VPS personnalisée** pour pointer vers votre propre backend |
| **Historique** | En-tête `📜 Historique` | • Liste des sessions de connexion précédentes avec durées et volumes échangés<br>• Compteurs cumulatifs de données transmises |
| **Support & Essai** | En-tête `🎧 Support & Essai` | • **Bannière d'activation d'essai gratuit 24h** (Pass Découverte de 50 Go)<br>• Accordéon interactif FAQ (Attribution de forfait, contournement pare-feu, VPS)<br>• Raccourcis de contact direct (Telegram, WhatsApp, Email) avec attachement automatique du `deviceId` |

---

## 🚀 Lancement & Prévisualisation

### 1. Sur Navigateur Web (Immédiat)
Dans le terminal où tourne Metro Bundler :
```bash
# Appuyez simplement sur la touche 'w'
w
```
Ou lancez la commande dédiée :
```bash
npm run web
```
L'application s'ouvrira directement dans votre navigateur web sur `http://localhost:8081`.

### 2. Sur Smartphone Android (Expo Go)
Scannez le QR Code affiché dans le terminal avec l'application **Expo Go** (assurez-vous d'avoir la version à jour disponible sur le Google Play Store).

### 3. Build Standalone Natif (APK)
Lorsque vous déploierez votre VPS et souhaiterez compiler l'APK Android autonome :
```bash
# Générer le projet natif Android
npx expo run:android
# ou via EAS Build
npx eas build -p android --profile preview
```

---

## 🔒 Intégration Backend & Sing-Box (Quand votre VPS sera prêt)

L'architecture est prête pour recevoir votre backend d'autorité. Les endpoints attendus sont :
* `GET /mobile/access-state?deviceId=...` : renvoie le quota restant et l'état du forfait.
* `POST /provision/activatePlan` : valide le jeton de connexion et crédite les gigas.
* `POST /mobile/vpn/traffic` : remonte la télémétrie des octets échangés.
