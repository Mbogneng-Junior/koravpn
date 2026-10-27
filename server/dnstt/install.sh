#!/usr/bin/env bash
# ==============================================================================
# Kora VPN - Déploiement Automatisé Serveur DNSTT (Port UDP 53)
# ==============================================================================
set -euo pipefail

echo "=========================================================="
echo "🚀 Installation du serveur DNSTT (DNS Tunneling) pour Kora VPN"
echo "=========================================================="

# 1. Compilation du binaire via Docker Golang
echo "[1/4] Compilation de dnstt-server..."
docker run --rm -v /root:/out golang:1.23-alpine sh -c "
  apk add --no-cache git &&
  git clone https://www.bamsoftware.com/git/dnstt.git &&
  cd dnstt/dnstt-server &&
  go build -ldflags=\"-s -w\" -o /out/dnstt-server
"
chmod +x /root/dnstt-server

# 2. Génération de la paire de clés cryptographiques si absente
if [ ! -f /root/dnstt.key ]; then
  echo "[2/4] Génération de la clé asymétrique..."
  /root/dnstt-server -gen-key -privkey-file /root/dnstt.key -pubkey-file /root/dnstt.pub
  chmod 400 /root/dnstt.key
else
  echo "[2/4] Clé existante détectée."
fi

# 3. Création du service systemd
echo "[3/4] Installation du service systemd..."
cp "$(dirname "$0")/dnstt.service" /etc/systemd/system/dnstt.service
systemctl daemon-reload
systemctl enable --now dnstt

# 4. Affichage des identifiants
PUBKEY=$(cat /root/dnstt.pub)
echo "=========================================================="
echo "✅ DNSTT est en cours d'exécution sur le port UDP 53 !"
echo "🔑 Clé Publique (Pubkey) : ${PUBKEY}"
echo "🌐 Domaine payload       : t.koravpn.net"
echo "=========================================================="
