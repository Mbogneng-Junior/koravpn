# 📌 Kora VPN - État du Projet & Guide pour les Nouveaux Agents IA

> **Dernière mise à jour** : 27 Octobre 2026  
> **Dépôt Git Officiel** : `https://github.com/Mbogneng-Junior/koravpn.git` (Branche `main`)  
> **Auteur / Propriétaire** : Junior Mbogneng  
> **Objectif Global** : Développement d'un écosystème VPN complet (Application mobile multi-plateforme + Serveurs d'évasion réseau) permettant la navigation libre et sécurisée, y compris en cas de coupure ou sur réseau mobile avec solde épuisé (SIM Orange Cameroun 0 FCFA / 0 Mo).

---

## 1. 🔍 Historique & Analyse Reverse Engineering

Le projet découle de l'audit approfondi de l'application Android **SXB VPN 1.2.1** (`com.sxbvpn.mobile`).
Le rapport d'inspection complet est disponible dans :
`../reports/AUDIT_TECHNIQUE_SXB_VPN.md`

### Mécanismes découverts dans SXB VPN :
1. **Binding Matériel & Forfaits** :
   * Chaque appareil génère un `deviceId` unique persistant (Keystore AES-GCM).
   * Un système de tickets / jetons (`setAccessTicket`) valide la validité temporelle et le quota de données via l'API backend (`https://vpnsxb.afrihall.com/api`).
2. **Double Moteur Réseau Natif** :
   * `libbox.so` (34 Mo) : Moteur Go officiel de Sing-box pour VLESS, VMess, Trojan, WireGuard.
   * `libdnstt.so` (9 Mo) : Client **DNSTT** (DNS Tunneling via Noise Protocol) pour forcer le passage à travers le port DNS 53.
   * `SshRelayChannel` : Tunnel SSH transporté sur WebSocket ou sur SlowDNS (`sshTransport=slowdns`).

---

## 2. 🖥️ Infrastructure Serveur Active (En Production)

* **Fournisseur VPS** : Spaceship / Namecheap
* **Adresse IPv4 Publique** : `104.207.80.205`
* **Port d'administration SSH** : `22022`
* **Utilisateur d'administration** : `root` (authentification par clé SSH `ed25519` autorisée depuis la machine locale)
* **Système d'exploitation** : Ubuntu 24.04 LTS (Noyau Linux 6.8 avec congestion BBR activée)

### Services Réseau Actifs sur le VPS :

| Service | Port & Protocole | Type / Logiciel | Statut | Rôle |
| :--- | :--- | :--- | :--- | :--- |
| **Sing-box Reality** | `TCP 443` | Docker (`kora-singbox`) | **En cours (Up)** | Connexion haut-débit chiffrée camouflée en HTTPS |
| **DNSTT Server** | `UDP 53` | Binaire natif Systemd (`dnstt.service`) | **En cours (Actif)** | Bypass firewall 0 Mo via tunneling DNS |
| **Relais SSH Local** | `TCP 22022` | OpenSSH daemon | **En cours (Actif)** | Terminaison du tunnel DNSTT et proxy dynamique SOCKS5 |

### Identifiants DNSTT / SlowDNS :
* **Port d'écoute** : `53` (UDP)
* **Domaine Payload (Name Server)** : `t.koravpn.net`
* **Clé Publique (Public Key)** : `0afa82a2f5561f96b6d9b5c9e1a0ac31b6d6eef904f35579255069a113cf6c7a`
* **Clé Privée (Serveur)** : `/root/dnstt.key`
* **Relais Amont (Upstream)** : `127.0.0.1:22022`
* **Utilisateur VPN SSH** : `kora`
* **Mot de passe VPN SSH** : `KoraVpn2026!`

---

## 3. 🧪 Retours d'Expérience Réseau (Orange Cameroun)

Lors des tests sur carte SIM Orange Cameroun avec solde 0 FCFA / 0 Mo :
* **Sites autorisés en clair par l'opérateur** : `https://www.orange.cm/` et `https://www.facebook.com/`.
* **Pourquoi VLESS Reality direct a échoué** :
  * `www.orange.cm` ne supporte que TLS 1.2 (or Reality exige strictement TLS 1.3).
  * `www.facebook.com` supporte TLS 1.3, mais le Deep Packet Inspection (DPI) d'Orange valide la concordance SNI $\leftrightarrow$ IP de destination (l'IP du VPS Spaceship n'est pas dans la plage IP Meta, ce qui provoque une corruption/blocage du handshake TLS par le firewall).
* **Pourquoi DNSTT fonctionne** :
  * Le port UDP 53 (DNS) est laissé ouvert sans restriction de crédit afin de permettre la résolution des portails de recharge.
  * DNSTT encapsule les paquets TCP dans de véritables requêtes DNS chiffrées (protocole Noise).
  * **Test validé à 100%** : Un client `dnstt-client` local pointant sur `104.207.80.205:53` a établi un tunnel SOCKS5 et a chargé Google avec succès (`HTTP/2 200`).

---

## 4. 📱 Application Frontend (Kora VPN)

Située dans `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/Reverse_Engineering/kora-vpn` :
* **Framework** : React Native avec Expo SDK 52 (TypeScript strict).
* **Écrans réalisés (7 écrans complets)** :
  1. `HomeScreen` : Bouton néon interactif, ondes pulsées, état du chiffrement, jauges Up/Down.
  2. `PlanScreen` : Calcul du `deviceId` matériel, validation de Token (50 Go), affichage du quota.
  3. `ServersScreen` : Liste et filtrage multi-protocoles (VLESS, VMess, Trojan, Shadowsocks) avec latences.
  4. `JournalScreen` : Console de logs en temps réel défilante avec filtres de sévérité.
  5. `SettingsScreen` : Kill-Switch, Anti-QUIC, Reconnexion auto, configuration DNS.
  6. `HistoryScreen` : Historique des sessions et données cumulées.
  7. `SupportScreen` : FAQ, support Telegram/WhatsApp/Mail, activation pass découverte.

---

## 5. 🎯 Prochaines Étapes Opérationnelles

1. **Validation immédiate sur Mobile (Phase 1)** :
   * Tester la connexion avec un client SlowDNS standard (**HTTP Custom** ou **Dark Tunnel**) avec les identifiants ci-dessus pour confirmer le comportement de l'antenne 4G Orange locale.
2. **Intégration Native Kora VPN (Phase 2)** :
   * Embarquer `dnstt-client` sous forme de binaire natif Go (`libdnstt.so` ou exécutable via Gomobile) dans le projet Android de Kora VPN.
   * Lier le `VpnService` Android natif pour faire passer automatiquement tout le trafic du téléphone dans le tunnel local.
