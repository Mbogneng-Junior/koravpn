#!/usr/bin/env bash
# Sauvegarde des fichiers non versionnés du VPS Kora VPN vers la machine locale.
# Usage : bash backup_from_vps.sh [user@host] [port] [dossier_sortie]
set -euo pipefail

HOST="${1:-root@104.207.80.205}"
PORT="${2:-22022}"
OUT="${3:-$HOME/kora-backup}"
STAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE="$OUT/kora-vps-backup-$STAMP.tgz"

mkdir -p "$OUT"; chmod 700 "$OUT"
umask 077

echo "→ Sauvegarde de $HOST (port $PORT) vers $ARCHIVE"

# Construit la liste des fichiers qui existent réellement sur le VPS, puis les archive.
ssh -p "$PORT" -o StrictHostKeyChecking=accept-new "$HOST" '
  FILES=""
  for f in /root/dnstt.key /root/dnstt.pub /etc/ssh/sshd_config /etc/ssh/sshd_config.d \
           /etc/sysctl.d/99-kora-vpn.conf /etc/systemd/system/dnstt.service /root/.ssh/authorized_keys; do
    [ -e "$f" ] && FILES="$FILES $f"
  done
  for f in $(find / -xdev \( -path "*/server/config/config.json" -o -name ".client_profile.env" \) \
             -not -path "/proc/*" 2>/dev/null); do
    FILES="$FILES $f"
  done
  # Compte kora (ligne passwd + hash shadow) pour pouvoir le recréer
  getent passwd kora > /tmp/kora_passwd.txt 2>/dev/null || true
  grep "^kora:" /etc/shadow > /tmp/kora_shadow.txt 2>/dev/null || true
  FILES="$FILES /tmp/kora_passwd.txt /tmp/kora_shadow.txt"
  tar czf - $FILES 2>/dev/null
  rm -f /tmp/kora_passwd.txt /tmp/kora_shadow.txt
' > "$ARCHIVE"

chmod 600 "$ARCHIVE"
echo "→ Contenu de l'archive :"
tar tzf "$ARCHIVE"
echo "✅ Terminé : $ARCHIVE  (contient des clés privées, ne PAS mettre dans git)"
