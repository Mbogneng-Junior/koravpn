import { DeviceBinding } from '../types/vpn';

// Simule la persistance locale en mémoire si AsyncStorage n'est pas encore installé
let cachedDeviceId: string | null = null;

export const DeviceService = {
  /**
   * Génère ou récupère l'identifiant matériel unique de l'appareil (deviceId).
   * Cet identifiant est celui copié par l'utilisateur pour demander son forfait.
   */
  getDeviceId(): string {
    if (cachedDeviceId) return cachedDeviceId;

    // Format similaire à l'empreinte SXB : SXB-XXXX-XXXX-XXXX
    const chars = '0123456789ABCDEF';
    const segment = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    cachedDeviceId = `KORA-${segment(4)}-${segment(4)}-${segment(4)}`;
    return cachedDeviceId;
  },

  /**
   * Récupère le statut de liaison de l'appareil
   */
  getDeviceBinding(): DeviceBinding {
    return {
      deviceId: this.getDeviceId(),
      deviceName: 'Pixel Android (Local)',
      enrolledAt: new Date().toISOString(),
      status: 'active',
    };
  },
};
