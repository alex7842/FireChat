importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCCaofRnxuQW5sO9v5ROVbOWQokxX7fpDA",
  authDomain: "chatapp-81c34.firebaseapp.com",
  projectId: "chatapp-81c34",
  storageBucket: "chatapp-81c34.appspot.com",
  messagingSenderId: "496298935969",
  appId: "1:496298935969:web:d17d72db8d8af8e20f52e0"
});

const messaging = firebase.messaging();

// Add click handler for notifications
self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === 'https://fire-chat-cloud.vercel.app/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://fire-chat-cloud.vercel.app/');
      }
    })
  );
});

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/newslogo.png',
    data: payload.data,
    requireInteraction: true, // Makes the notification stay until user interacts with it
    click_action: '/' // Specifies the URL to open on click
  };

  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
