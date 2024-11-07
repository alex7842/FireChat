importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  // Copy these exactly from your firebase config
  apiKey: "AIzaSyCCaofRnxuQW5sO9v5ROVbOWQokxX7fpDA",
  authDomain: "chatapp-81c34.firebaseapp.com",
  projectId: "chatapp-81c34",
  storageBucket: "chatapp-81c34.appspot.com",
  messagingSenderId: "496298935969",
  appId: "1:496298935969:web:d17d72db8d8af8e20f52e0"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  // Using the Notification API for toast-style notifications
 
  // Auto dismiss after 3 seconds like a toast
  
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
