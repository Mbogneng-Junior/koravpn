# ⚡ Kora VPN - Infrastructure Serveur Sing-box (Docker)

Cette partie contient la configuration serveur conteneurisée pour déployer le nœud VPN **Sing-box** en mode **VLESS Reality** sur n'importe quel VPS Linux (Spaceship, Contabo, Hetzner, etc.).

---

## 🏗️ Architecture

* **Moteur** : Sing-box officiel (`ghcr.io/sagernet/sing-box:latest`)
* **Protocole** : `VLESS` + `XTLS-RPRX-Vision` + `Reality` (Port 443)
* **Camouflage SNI** : `www.microsoft.com` (Trafic indiscernable d'une session HTTPS vers Microsoft)
* **Accélération Réseau** : Noyau Linux avec congestion TCP `BBR` + IP Forwarding activé

---

## 🚀 Déploiement en 1 commande sur un nouveau VPS

Sur n'importe quel VPS Ubuntu / Debian tout neuf :

```bash
git clone https://github.com/Mbogneng-Junior/koravpn.git
cd koravpn/server
bash scripts/deploy.sh
```

Le script s'occupe de tout :
1. Installe Docker et Docker Compose.
2. Active l'accélération BBR du noyau Linux.
3. Génère une paire de clés Reality cryptographiques uniques et un UUID.
4. Lance le conteneur Sing-box en mode `host`.
5. Affiche le lien universel `vless://` prêt à être importé dans l'application Kora VPN ou tout client compatible.
