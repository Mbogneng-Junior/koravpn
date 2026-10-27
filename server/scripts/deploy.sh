#!/usr/bin/env bash
set -e

# ==============================================================================
# KORA VPN - Script de déploiement automatique Sing-box (VLESS Reality + BBR)
# ==============================================================================

echo "=========================================================="
echo "⚡ DÉPLOIEMENT DU SERVEUR KORA VPN (SING-BOX DOCKER)"
echo "=========================================================="

# 1. Vérification des privilèges root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ce script doit être exécuté en tant que root."
  exit 1
fi

# 2. Détection de l'IP publique
SERVER_IP=$(curl -s -4 ifconfig.me || curl -s -4 api.ipify.org || hostname -I | awk '{print $1}')
echo "📍 IP Publique détectée : $SERVER_IP"

# 3. Optimisation du noyau Linux : Activation de BBR & IP Forwarding
echo "🚀 Optimisation TCP BBR & IP Forwarding..."
cat << 'EOF' > /etc/sysctl.d/99-kora-vpn.conf
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
EOF
sysctl --system > /dev/null 2>&1 || true

# 4. Installation de Docker si absent
if ! command -v docker &> /dev/null; then
  echo "📦 Installation de Docker et Docker Compose..."
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg lsb-release xxd jq
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "✅ Docker est déjà installé."
fi

# 5. Préparation des répertoires
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$BASE_DIR/config"
cd "$BASE_DIR"

# 6. Génération des clés de sécurité Reality
echo "🔑 Génération des clés cryptographiques VLESS Reality..."
UUID=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || od -x /dev/urandom | head -1 | awk '{OFS="-"; print $2$3,$4,$5,$6,$7$8$9}')
SHORT_ID=$(head -c 8 /dev/urandom | xxd -p)

# Téléchargement de l'image Sing-box pour générer la paire de clés
docker pull ghcr.io/sagernet/sing-box:latest > /dev/null

KEYS_OUTPUT=$(docker run --rm ghcr.io/sagernet/sing-box:latest generate reality-keypair)
PRIVATE_KEY=$(echo "$KEYS_OUTPUT" | grep -i "PrivateKey" | awk '{print $2}')
PUBLIC_KEY=$(echo "$KEYS_OUTPUT" | grep -i "PublicKey" | awk '{print $2}')

# Domaine de camouflage (SNI légitime avec TLS 1.3 - compatible Zero-Rating Orange)
SNI_DOMAIN="www.facebook.com"

echo "   UUID        : $UUID"
echo "   ShortId     : $SHORT_ID"
echo "   PublicKey   : $PUBLIC_KEY"
echo "   Camouflage  : $SNI_DOMAIN"

# 7. Écriture du fichier de configuration Sing-box (Reality 443 + WebSocket 80/8080)
cat << EOF > "$BASE_DIR/config/config.json"
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "vless",
      "tag": "vless-reality-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "uuid": "$UUID",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "$SNI_DOMAIN",
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "$SNI_DOMAIN",
            "server_port": 443
          },
          "private_key": "$PRIVATE_KEY",
          "short_id": [
            "$SHORT_ID"
          ]
        }
      }
    },
    {
      "type": "vless",
      "tag": "vless-ws-in",
      "listen": "::",
      "listen_port": 80,
      "users": [
        {
          "uuid": "$UUID"
        }
      ],
      "transport": {
        "type": "ws",
        "path": "/kora-ws"
      }
    },
    {
      "type": "vless",
      "tag": "vless-ws-8080-in",
      "listen": "::",
      "listen_port": 8080,
      "users": [
        {
          "uuid": "$UUID"
        }
      ],
      "transport": {
        "type": "ws",
        "path": "/kora-ws"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    },
    {
      "type": "block",
      "tag": "block"
    }
  ]
}
EOF

# 8. Démarrage du conteneur Sing-box
echo "🐳 Démarrage du conteneur Sing-box..."
docker compose down > /dev/null 2>&1 || true
docker compose up -d

# 9. Sauvegarde des identifiants dans .client_profile.env
cat << EOF > "$BASE_DIR/.client_profile.env"
SERVER_IP=$SERVER_IP
SERVER_PORT=443
UUID=$UUID
FLOW=xtls-rprx-vision
SNI=$SNI_DOMAIN
PUBLIC_KEY=$PUBLIC_KEY
SHORT_ID=$SHORT_ID
VLESS_URL=vless://$UUID@$SERVER_IP:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=$SNI_DOMAIN&fp=chrome&pbk=$PUBLIC_KEY&sid=$SHORT_ID&type=tcp#Kora-VPN
EOF

echo ""
echo "=========================================================="
echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "=========================================================="
echo "Voici le lien de connexion VLESS Reality généré :"
echo ""
echo "vless://$UUID@$SERVER_IP:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=$SNI_DOMAIN&fp=chrome&pbk=$PUBLIC_KEY&sid=$SHORT_ID&type=tcp#Kora-VPN"
echo ""
echo "Profil client sauvegardé dans : $BASE_DIR/.client_profile.env"
echo "=========================================================="
