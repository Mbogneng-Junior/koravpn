# ⚡ Kora VPN - Infrastructure Serveur Multi-Protocoles

Cette partie contient la configuration serveur pour déployer le nœud VPN **Kora VPN** sur VPS Linux (Spaceship, Contabo, Hetzner, etc.).

Elle combine deux moteurs complémentaires :
1. **Sing-box VLESS Reality (Port TCP 443)** : Débit maximal chiffré et ultra-rapide camouflé en trafic HTTPS Microsoft / Meta.
2. **DNSTT SlowDNS (Port UDP 53)** : Tunnel DNS identique au protocole de SXB VPN (`libdnstt.so`), permettant de contourner les pare-feux et portails captifs stricts (ex: SIM Orange Cameroun à 0 Mo / 0 FCFA).

---

## 🏗️ Architecture

* **Moteur 1 (Haut Débit)** : Sing-box officiel (`ghcr.io/sagernet/sing-box:latest`)
  * `VLESS` + `XTLS-RPRX-Vision` + `Reality` (Port 443)
  * Accélération BBR du noyau Linux
* **Moteur 2 (Bypass Port 53 / 0 Mo)** : DNSTT Server (`/root/dnstt-server`)
  * Port d'écoute : UDP 53
  * Relay amont : SSH local (Port 22022) ou Sing-box (Port 80/8080)
  * Chiffrement Noise Protocol asymétrique (Curve25519)

---

## 🚀 Déploiement

### Option 1 : Déploiement Sing-box Reality (Port 443)
```bash
git clone https://github.com/Mbogneng-Junior/koravpn.git
cd koravpn/server
bash scripts/deploy.sh
```

### Option 2 : Déploiement DNSTT Tunnel (Port UDP 53)
```bash
cd koravpn/server/dnstt
bash install.sh
```

---

## 📱 Connexion Mobile via SlowDNS / DNSTT (Orange 0 Mo)

Dans n'importe quelle application compatible DNSTT / SlowDNS (HTTP Custom, Dark Tunnel, SXB VPN, ou Kora VPN) :
* **Type de connexion** : SlowDNS / DNSTT
* **Serveur DNS / IP** : `104.207.80.205` (Port `53`)
* **Domaine Payload (Name Server)** : `t.koravpn.net`
* **Clé Publique (Public Key)** : `0afa82a2f5561f96b6d9b5c9e1a0ac31b6d6eef904f35579255069a113cf6c7a`
* **Compte SSH** :
  * Hôte : `127.0.0.1` (ou IP du VPS)
  * Port : `22022`
  * Utilisateur : `kora`
  * Mot de passe : `KoraVpn2026!`

