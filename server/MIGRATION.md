# Migration du VPS Kora VPN

Ce qui n'est pas dans git (clés, config générée, compte SSH) est exporté par `scripts/backup_from_vps.sh`
et réimporté par `scripts/restore_to_vps.sh`. Aucune clé ni mot de passe n'est stocké dans ce dépôt.

## 1. Sauvegarde (ancien VPS encore allumé)
    bash server/scripts/backup_from_vps.sh root@<ancienne_ip> 22022 ~/kora-backup
L'archive contient : `dnstt.key/pub`, `config.json` Sing-box, `.client_profile.env`, sshd_config,
authorized_keys, sysctl, service dnstt, hash du compte `kora`. Garder hors de git.

## 2. Restauration (nouveau VPS Ubuntu 24.04, accès root)
    bash server/scripts/restore_to_vps.sh ~/kora-backup/<archive>.tgz root@<nouvelle_ip> 22
Le script : restaure les clés, clone le dépôt, remet `config.json`, recrée `kora`, passe sshd sur 22022,
installe Docker, lance Sing-box puis DNSTT (la clé existante est conservée, donc la clé publique ne change pas).

## 3. À faire à la main
- DNS : mettre à jour l'enregistrement A du serveur de noms et le NS de `t.koravpn.net` vers la nouvelle IP.
- Remplacer l'ancienne IP dans `STATE_OF_PROJECT.md`, `server/README.md` et les profils clients.
- Changer le mot de passe SSH de `kora` si l'ancien a été exposé.
- Ouvrir les ports : TCP 22022, 443, 80, 8080 et UDP 53.

## 4. Vérification
    docker ps                       # kora-singbox Up
    systemctl status dnstt          # active
    ss -ulpn | grep :53             # dnstt-server
