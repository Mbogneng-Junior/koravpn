#!/usr/bin/env bash
# Restaure une sauvegarde Kora VPN sur un NOUVEAU VPS Ubuntu 24.04.
# Usage : bash restore_to_vps.sh archive.tgz user@nouvelle_ip [port_ssh_actuel]
# Le port SSH actuel du nouveau VPS est 22 par défaut ; sshd est ensuite basculé sur 22022.
set -euo pipefail

ARCHIVE="${1:?archive .tgz requise}"
HOST="${2:?user@ip requis}"
PORT="${3:-22}"
SSH=(ssh -p "$PORT" -o StrictHostKeyChecking=accept-new "$HOST")

echo "→ Envoi de l'archive"
scp -P "$PORT" "$ARCHIVE" "$HOST:/root/kora-backup.tgz"

"${SSH[@]}" 'bash -s' <<'REMOTE'
set -euo pipefail
cd /root && mkdir -p kora-restore && tar xzf kora-backup.tgz -C kora-restore
R=/root/kora-restore

# Clés DNSTT
install -m 400 "$R/root/dnstt.key" /root/dnstt.key
[ -f "$R/root/dnstt.pub" ] && install -m 644 "$R/root/dnstt.pub" /root/dnstt.pub

# Dépôt + config Sing-box
[ -d /root/koravpn ] || git clone https://github.com/Mbogneng-Junior/koravpn.git /root/koravpn
CFG=$(find "$R" -path "*server/config/config.json" | head -1)
mkdir -p /root/koravpn/server/config
[ -n "$CFG" ] && cp "$CFG" /root/koravpn/server/config/config.json
PROF=$(find "$R" -name ".client_profile.env" | head -1)
[ -n "$PROF" ] && cp "$PROF" /root/koravpn/server/.client_profile.env

# Compte kora
if ! id kora >/dev/null 2>&1; then
  useradd -m -s /bin/bash kora
  [ -s "$R/tmp/kora_shadow.txt" ] && usermod -p "$(cut -d: -f2 "$R/tmp/kora_shadow.txt")" kora
fi

# SSH : clés autorisées puis port 22022
mkdir -p /root/.ssh; chmod 700 /root/.ssh
[ -f "$R/root/.ssh/authorized_keys" ] && cat "$R/root/.ssh/authorized_keys" >> /root/.ssh/authorized_keys
sort -u /root/.ssh/authorized_keys -o /root/.ssh/authorized_keys; chmod 600 /root/.ssh/authorized_keys
grep -q "^Port 22022" /etc/ssh/sshd_config || echo "Port 22022" >> /etc/ssh/sshd_config
sshd -t && systemctl restart ssh

# sysctl + Docker + Sing-box
cp "$R/etc/sysctl.d/99-kora-vpn.conf" /etc/sysctl.d/ 2>/dev/null && sysctl --system >/dev/null || true
command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh
cd /root/koravpn/server && docker compose up -d

# DNSTT (install.sh garde la clé existante). Libère le port 53 si systemd-resolved l'occupe.
if ss -ulpn | grep -q ':53 .*systemd-resolve'; then
  mkdir -p /etc/systemd/resolved.conf.d
  printf '[Resolve]\nDNSStubListener=no\n' > /etc/systemd/resolved.conf.d/kora.conf
  systemctl restart systemd-resolved
fi
bash /root/koravpn/server/dnstt/install.sh
echo "✅ Restauration terminée. Pensez à mettre à jour le NS/A de t.koravpn.net vers la nouvelle IP."
REMOTE
