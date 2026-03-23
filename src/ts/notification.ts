export const NotificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  },

  async notify(title: string, body: string) {
    if (Notification.permission !== 'granted') return;

    // Service Worker経由で通知
    const registration = await navigator.serviceWorker.ready;

    registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'expiry-notification',
    });
  },
};
